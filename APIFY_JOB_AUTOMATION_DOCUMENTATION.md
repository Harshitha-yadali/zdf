# Apify Job Automation System - Implementation Documentation

## Overview

The Apify Job Automation System enables PrimoBoost AI to automatically fetch and sync job listings from multiple platforms (LinkedIn, Indeed, Naukri, etc.) using Apify's web scraping infrastructure. This system runs completely in the background, requiring minimal admin intervention after initial setup.

## Key Features

### 1. Multi-Platform Support
- Configure unlimited job platforms (LinkedIn, Indeed, Naukri, Instahyre, Glassdoor, etc.)
- Each platform has its own Apify actor and search configuration
- Automatic deduplication prevents duplicate job listings

### 2. Automated Syncing
- Syncs every 8 hours (configurable per platform)
- Cron scheduler runs automatically
- Manual sync trigger available for admins

### 3. Admin Dashboard
- **Apify Config Tab**: Manage platform connections
- **Sync Logs Tab**: Monitor all sync operations
- Real-time statistics and insights

### 4. Smart Mapping
- Automatically converts Apify data to your `job_listings` format
- Handles salary parsing, location types, and experience levels
- Preserves original data in `apify_job_id` for reference

## Architecture

### Database Schema

#### `job_fetch_configs`
Stores configuration for each connected platform:
- Platform name (LinkedIn, Indeed, etc.)
- Apify API token (encrypted)
- Actor ID
- Search configuration (JSON)
- Sync frequency and last sync timestamp

#### `job_sync_logs`
Audit trail for all sync operations:
- Tracks fetched, created, updated, and skipped jobs
- Stores error messages for failed syncs
- Contains Apify metadata (run ID, dataset ID)

#### `job_listings` (Enhanced)
Added three new columns:
- `apify_job_id`: Unique identifier from Apify (used for deduplication)
- `source_platform`: Platform name (LinkedIn, Indeed, etc.)
- `last_synced_at`: Timestamp of last update from Apify

### Edge Functions

#### `apify-sync-jobs`
Main sync function that:
1. Accepts a config ID or syncs all active configs
2. Triggers Apify actor with search parameters
3. Waits for run completion (up to 5 minutes)
4. Fetches dataset results
5. Maps and inserts/updates job listings
6. Logs complete audit trail

**URL**: `{SUPABASE_URL}/functions/v1/apify-sync-jobs`

#### `apify-cron-scheduler`
Automatic scheduler that:
1. Checks all active configs
2. Determines which need syncing based on `sync_frequency_hours`
3. Triggers `apify-sync-jobs` for each due config
4. Should be called every hour via external cron service

**URL**: `{SUPABASE_URL}/functions/v1/apify-cron-scheduler`

### Service Layer

#### `apifyService.ts`
Client-side service for:
- CRUD operations on configurations
- Fetching sync logs and statistics
- Manual sync triggering
- Connection testing
- Search config generation

## Setup Instructions

### Step 1: Get Apify API Token

1. Go to [Apify Console](https://console.apify.com/)
2. Sign up or log in
3. Navigate to Settings → Integrations
4. Copy your API token

### Step 2: Find Actor IDs

Popular Apify actors:
- **LinkedIn**: `apify/linkedin-jobs-scraper`
- **Indeed**: `apify/indeed-scraper`
- **Naukri**: `curious_coder/naukri-scraper`
- **Instahyre**: `apify/instahyre-scraper`
- **Glassdoor**: `apify/glassdoor-scraper`

You can browse more actors at [Apify Store](https://apify.com/store).

### Step 3: Configure Platform Connection

1. Log in as admin
2. Navigate to Admin Dashboard → Apify Config
3. Click "Add Configuration"
4. Fill in the form:
   - **Platform Name**: Select from dropdown (LinkedIn, Indeed, etc.)
   - **API Token**: Paste your Apify API token
   - **Actor ID**: Auto-filled based on platform, or enter custom
   - **Sync Frequency**: Default 8 hours
   - **Search Config**: Auto-generated JSON, customize as needed
   - **Active**: Enable to start automatic syncing

5. Click "Test Connection" to verify
6. Save configuration

### Step 4: Set Up Cron Scheduler (External)

You need to set up an external cron service to call the scheduler edge function hourly.

#### Option 1: Using Cron-Job.org

1. Go to [cron-job.org](https://cron-job.org/)
2. Create a free account
3. Add new cron job:
   - **URL**: `{YOUR_SUPABASE_URL}/functions/v1/apify-cron-scheduler`
   - **Interval**: Every hour
   - **HTTP Method**: POST
   - **Headers**:
     - `Authorization: Bearer {SUPABASE_SERVICE_ROLE_KEY}`
     - `Content-Type: application/json`
4. Save and enable

#### Option 2: Using GitHub Actions

Create `.github/workflows/apify-sync.yml`:

```yaml
name: Apify Job Sync

on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Apify Sync
        run: |
          curl -X POST \
            ${{ secrets.SUPABASE_URL }}/functions/v1/apify-cron-scheduler \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json"
```

Add secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

#### Option 3: Using Netlify Scheduled Functions

If hosted on Netlify, create `netlify/functions/apify-sync.js`:

```javascript
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/functions/v1/apify-cron-scheduler`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

Schedule in `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-scheduled-functions"
  [plugins.inputs]
    [plugins.inputs.apify-sync]
      schedule = "0 * * * *"  # Every hour
```

## Admin Dashboard Usage

### Apify Config Tab

**Features**:
- View all platform configurations
- See sync status (Active/Inactive)
- View last sync timestamp
- Test connections
- Trigger manual syncs
- Edit or delete configurations

**Actions**:
- **Add Configuration**: Create new platform connection
- **Edit**: Modify search parameters or credentials
- **Toggle Active**: Enable/disable automatic syncing
- **Manual Sync**: Force immediate sync for testing
- **Delete**: Remove configuration (preserves existing jobs)

### Sync Logs Tab

**Features**:
- Real-time statistics dashboard
- Filter logs by status (success, failed, partial)
- View detailed sync information
- Monitor performance metrics

**Statistics**:
- Total syncs performed
- Success/failure counts
- Total jobs fetched and created
- Last sync timestamp

**Log Details**:
- Platform name
- Sync duration
- Jobs fetched, created, updated, skipped
- Error messages (if failed)
- Apify metadata (run ID, dataset ID)

## Search Configuration

The search config is a JSON object that varies by platform. Here are examples:

### LinkedIn
```json
{
  "keywords": ["software engineer", "developer"],
  "location": "India",
  "jobType": "Full-time",
  "experienceLevel": "Entry level",
  "maxResults": 50
}
```

### Indeed
```json
{
  "keywords": ["software developer"],
  "location": "Remote",
  "jobType": "Full-time",
  "maxResults": 50
}
```

### Naukri
```json
{
  "keywords": ["software engineer"],
  "location": "Bangalore",
  "experienceLevel": "0-3 years",
  "maxResults": 50
}
```

**Note**: Each actor may have different parameter names. Refer to the actor's documentation on Apify Store.

## Data Mapping

Apify data is automatically mapped to your `job_listings` schema:

| Apify Field | Database Field | Notes |
|-------------|---------------|-------|
| `id` | `apify_job_id` | Used for deduplication |
| `title` | `role_title` | Direct mapping |
| `company` | `company_name` | Direct mapping |
| `location` | `location_type`, `location_city` | Parsed for Remote/Hybrid/Onsite |
| `description` | `description`, `full_description` | Direct mapping |
| `salary` | `package_amount`, `package_type` | Parsed for numeric value |
| `experienceLevel` | `experience_required` | Direct mapping |
| `skills` | `skills` | Array of skills |
| `applyUrl` | `application_link` | Direct mapping |
| `postedDate` | `posted_date` | ISO 8601 format |

## Deduplication Logic

Jobs are deduplicated using `apify_job_id`:

1. **First Sync**: All jobs are inserted with unique `apify_job_id`
2. **Subsequent Syncs**:
   - If `apify_job_id` exists → Update existing job
   - If `apify_job_id` is new → Insert new job
   - If job no longer in dataset → Keep in database (manual cleanup)

This ensures:
- No duplicate jobs
- Existing jobs stay updated
- Job history is preserved

## Monitoring and Troubleshooting

### Check Sync Status

1. Go to Admin Dashboard → Sync Logs
2. Look for recent logs
3. Check status (success/failed)
4. View error messages if failed

### Common Issues

#### "Connection failed"
- **Cause**: Invalid API token or Actor ID
- **Solution**: Test connection in Apify Config, verify credentials

#### "Apify run timed out"
- **Cause**: Actor took longer than 5 minutes
- **Solution**: Reduce `maxResults` in search config

#### "No jobs fetched"
- **Cause**: Search config doesn't match any jobs
- **Solution**: Adjust keywords, location, or other parameters

#### "Failed to parse job data"
- **Cause**: Unexpected data format from Apify
- **Solution**: Check actor documentation, contact support

### Manual Sync Testing

1. Go to Apify Config tab
2. Find your configuration
3. Click the refresh icon (Manual Sync)
4. Go to Sync Logs tab
5. Watch real-time progress

## Security Considerations

### API Token Storage
- Tokens are stored in database
- Access restricted by RLS (admin-only)
- Service role key used for edge functions

### RLS Policies
- Only admins can view/edit configurations
- Only admins can view sync logs
- Service role can insert/update logs

### Data Privacy
- No user data is sent to Apify
- All job data is public information
- GDPR compliant (public job listings)

## Cost Considerations

### Apify Pricing
- Free tier: 5 actor runs/month
- Paid plans: Starting at $49/month
- Pay per compute unit consumed

### Optimization Tips
1. Reduce `maxResults` to fetch fewer jobs
2. Increase `sync_frequency_hours` to sync less often
3. Disable inactive platforms
4. Use specific search filters to target relevant jobs

## Future Enhancements

### Planned Features
1. **Email notifications** for sync failures
2. **Job expiration** based on posted date
3. **Custom field mapping** per actor
4. **Multi-region support** for distributed scraping
5. **Job quality scoring** based on data completeness
6. **Duplicate detection** across platforms (same company + role)

### API Endpoints (Coming Soon)
- Public API to fetch synced jobs
- Webhook support for real-time updates
- Bulk operations for admins

## Support

For issues or questions:
1. Check Sync Logs for error details
2. Review Apify actor documentation
3. Test connection in Apify Config
4. Check cron scheduler logs

## Changelog

### Version 1.0.0 (Initial Release)
- Database schema with RLS policies
- Two edge functions (sync + cron)
- Admin dashboard with config management
- Sync logs and statistics
- Automatic deduplication
- Support for 5+ major platforms

---

**Implementation Date**: December 28, 2025
**Developer**: PrimoBoost AI Team
**Status**: Production Ready ✅
