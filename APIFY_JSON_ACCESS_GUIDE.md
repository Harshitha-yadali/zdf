# Apify JSON Data Access Guide

## Overview
This guide explains the **3 different types of JSON data** you can access in the Apify system and how to view/edit each one.

---

## 1. Configuration JSON (Search Parameters)

### What is it?
The JSON that controls **what jobs Apify fetches** - includes keywords, location, experience level, job type, etc.

### Where to access:
1. Go to **Admin Panel** → **Apify Config** tab
2. Click the **Edit** (pencil) icon on any platform card
3. Find the **"Search Configuration (JSON)"** textarea

### What you can do:
- **View** current search parameters
- **Edit** JSON directly in the UI
- **Validate** JSON syntax automatically
- **Test** with "Test Connection" button
- **Save** and click "Run Now" to fetch jobs immediately

### Example JSON:
```json
{
  "keywords": ["React Developer", "Frontend Engineer"],
  "location": "Bangalore, India",
  "datePosted": "week",
  "experienceLevel": ["Entry level", "Mid-Senior level"],
  "jobType": ["Full-time"],
  "maxItems": 100
}
```

### When to edit:
- Change job search keywords
- Update location filters
- Modify experience requirements
- Adjust salary ranges
- Set job type preferences

---

## 2. Apify Response JSON (Raw Job Data)

### What is it?
The **raw JSON returned by Apify** after scraping job listings - this is the actual job data before any processing or database mapping.

### Where to access:
1. Go to **Admin Panel** → **Apify JSON** tab (NEW!)
2. Browse the list of successful syncs
3. Click **"View JSON"** on any sync to fetch raw data from Apify
4. Use **"Download JSON"** to save locally

### What the data contains:
- Complete job listings scraped from platforms
- Exact data structure from Apify actor
- Fields like: `title`, `company`, `location`, `description`, `salary`, `applyUrl`, etc.
- Unprocessed data (before mapping to database schema)

### Example data structure:
```json
[
  {
    "id": "job-12345",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "location": "Bangalore, Karnataka",
    "description": "We are looking for...",
    "salary": "15-25 LPA",
    "experienceLevel": "Mid-Senior level",
    "jobType": "Full-time",
    "skills": ["React", "TypeScript", "Node.js"],
    "postedDate": "2025-12-27",
    "applyUrl": "https://linkedin.com/jobs/view/..."
  }
]
```

### When to use:
- Debug why certain jobs aren't showing up
- Analyze what data Apify actually returns
- Understand platform-specific data structures
- Export data for external analysis
- Verify scraping accuracy

---

## 3. Database JSON (Stored Job Listings)

### What is it?
The **processed and stored job data** in your Supabase database after mapping from Apify's raw format.

### Where to access:
**Option A: SQL Query in Supabase Dashboard**
1. Go to Supabase Dashboard
2. SQL Editor
3. Run:
```sql
SELECT * FROM job_listings
WHERE source_api LIKE 'apify-%'
ORDER BY created_at DESC
LIMIT 100;
```

**Option B: API Query (from frontend)**
```typescript
const { data, error } = await supabase
  .from('job_listings')
  .select('*')
  .eq('source_api', 'apify-LinkedIn')
  .order('created_at', { ascending: false });

console.log(JSON.stringify(data, null, 2));
```

### What the data contains:
- Normalized job listings in your database schema
- Mapped fields: `role_title`, `company_name`, `location_city`, `package_amount`, etc.
- Additional fields: `is_active`, `created_at`, `apify_job_id`
- Data ready for display in your job listings page

### Example data structure:
```json
[
  {
    "id": "uuid-123",
    "apify_job_id": "LinkedIn-job-12345",
    "source_platform": "LinkedIn",
    "company_name": "Tech Corp",
    "role_title": "Senior React Developer",
    "package_amount": 2000000,
    "package_type": "CTC",
    "location_type": "Onsite",
    "location_city": "Bangalore, Karnataka",
    "experience_required": "Mid-Senior level",
    "description": "We are looking for...",
    "application_link": "https://linkedin.com/jobs/view/...",
    "skills": ["React", "TypeScript", "Node.js"],
    "is_active": true,
    "created_at": "2025-12-27T10:30:00Z"
  }
]
```

### When to use:
- View jobs as they appear to users
- Analyze which jobs were created vs updated
- Check database schema mapping
- Export for reports or analytics
- Verify data integrity

---

## Quick Access Summary

| JSON Type | Tab Location | What It Shows | Use Case |
|-----------|-------------|---------------|----------|
| **Configuration JSON** | Admin → Apify Config → Edit | Search parameters sent to Apify | Edit what jobs to fetch |
| **Apify Response JSON** | Admin → Apify JSON | Raw data from Apify scraper | Debug scraping results |
| **Database JSON** | Supabase Dashboard / API | Processed data in database | View final job listings |

---

## Step-by-Step Workflows

### Workflow 1: View Raw Apify Data from Last Sync

1. Go to **Admin Panel**
2. Click **"Apify JSON"** tab
3. Find the sync you want to inspect (sorted by newest first)
4. Click **"View JSON"** button
5. Modal opens showing raw JSON from Apify
6. Optionally click **"Download JSON"** to save locally

**What you'll see:**
- Array of job objects
- Each object = one job listing
- Exact fields returned by Apify actor
- Unmodified data before database mapping

---

### Workflow 2: Edit Search Configuration

1. Go to **Admin Panel**
2. Click **"Apify Config"** tab
3. Click **Edit** (pencil icon) on platform card
4. Scroll to **"Search Configuration (JSON)"** textarea
5. Edit the JSON (see examples in dropdown)
6. Click **"Update"** to save
7. Click **"Run Now"** to test immediately

**What you're editing:**
- Keywords to search
- Location filters
- Experience requirements
- Job types
- Max results

---

### Workflow 3: Compare Raw vs Processed Data

**Step 1: Get raw Apify data**
1. Admin → Apify JSON tab
2. View JSON for a recent sync
3. Note a job's `id` or `title`

**Step 2: Check processed database data**
1. Supabase Dashboard → SQL Editor
2. Query:
```sql
SELECT * FROM job_listings
WHERE role_title ILIKE '%React Developer%'
LIMIT 10;
```
3. Compare fields to understand mapping

**Why this is useful:**
- Verify data transformation is correct
- Debug missing fields
- Understand schema mapping
- Identify data quality issues

---

## Understanding Data Flow

```
┌─────────────────────┐
│ Configuration JSON  │ (What to fetch)
│ Admin → Apify Config│
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   Apify API Call    │
│  (Scrapes websites) │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Apify Response JSON │ (Raw scraped data)
│ Admin → Apify JSON  │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   Edge Function     │
│ (Maps & processes)  │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Database JSON      │ (Final stored data)
│ Supabase job_listings│
└─────────────────────┘
           │
           ↓
┌─────────────────────┐
│  User's Job Page    │
│ (Displayed to users)│
└─────────────────────┘
```

---

## Common JSON Access Scenarios

### Scenario 1: "Why aren't any jobs showing up?"

**Solution:**
1. Admin → Apify JSON → View last sync
2. Check if raw JSON is empty `[]`
3. If empty: Edit Configuration JSON to broaden search
4. If not empty: Check Supabase database for jobs

---

### Scenario 2: "I want to see exactly what LinkedIn returns"

**Solution:**
1. Admin → Apify Config → Run sync for LinkedIn
2. Wait 2-3 minutes for completion
3. Admin → Apify JSON → Click "View JSON" on latest LinkedIn sync
4. Inspect the raw job objects

---

### Scenario 3: "Download all jobs for analysis"

**Solution:**
1. Admin → Apify JSON → Find the sync
2. Click "View JSON"
3. Click "Download JSON" button
4. Opens as `apify-LinkedIn-[timestamp].json`
5. Use in Excel, Python, or any JSON tool

---

### Scenario 4: "Check if a specific job was fetched"

**Solution:**
1. Admin → Apify JSON → View recent sync
2. Search (Ctrl+F) for job title or company
3. If found in raw JSON but not in database, check Edge Function logs
4. If not in raw JSON, modify Configuration JSON keywords

---

## JSON Validation & Troubleshooting

### Invalid Configuration JSON

**Error:** "Invalid JSON in search configuration"

**Common causes:**
```json
// ❌ Wrong: Missing comma
{
  "keywords": ["Python"]
  "location": "India"
}

// ✅ Correct:
{
  "keywords": ["Python"],
  "location": "India"
}
```

**Solution:** Use [jsonlint.com](https://jsonlint.com) to validate

---

### Empty Apify Response JSON

**Error:** Raw JSON shows `[]` (empty array)

**Possible causes:**
1. Search parameters too restrictive
2. No matching jobs on platform
3. Apify actor rate limit
4. Invalid API token

**Solution:**
1. Broaden search keywords
2. Remove experience/salary filters
3. Check Apify Console for actor run status
4. Verify API token is active

---

## Advanced Features

### 1. Search within JSON Viewer

In the "Apify JSON" tab modal:
- Press `Ctrl+F` (or `Cmd+F` on Mac)
- Search for keywords, companies, or fields
- Quickly find specific jobs

### 2. Download Multiple Syncs

Download JSON from multiple platforms:
1. View JSON for Platform 1
2. Download → saves as `apify-LinkedIn-[time].json`
3. Close modal
4. View JSON for Platform 2
5. Download → saves as `apify-Indeed-[time].json`
6. Combine files locally for comparison

### 3. JSON Formatting

The viewer automatically formats JSON with:
- 2-space indentation
- Syntax highlighting (green text on dark background)
- Scrollable view for large datasets

---

## FAQ

### Q: Can I edit the Apify Response JSON?

**A:** No, this is read-only raw data from Apify. To change what data is fetched, edit the **Configuration JSON** instead.

---

### Q: How long is Apify Response JSON stored?

**A:** The raw JSON is stored in Apify's dataset for 7 days (default). Our system stores metadata (stats) indefinitely but not the full raw JSON. View/download within 7 days of sync.

---

### Q: What if "View JSON" fails?

**Possible causes:**
1. Dataset expired (>7 days old)
2. Invalid API token
3. Apify API rate limit

**Solution:**
- Try a more recent sync
- Verify API token in Apify Config
- Wait and retry if rate limited

---

### Q: Can I access JSON via API?

**A:** Yes! Configuration JSON:
```typescript
const { data } = await supabase
  .from('job_fetch_configs')
  .select('search_config')
  .eq('platform_name', 'LinkedIn')
  .single();

console.log(data.search_config); // JSON object
```

---

### Q: Difference between Apify JSON and Database JSON?

**Apify JSON:**
- Raw, unprocessed data
- Platform-specific field names
- May have extra/missing fields
- Exactly as Apify returns it

**Database JSON:**
- Normalized, processed data
- Standardized field names
- Mapped to your schema
- Ready for display

---

## Best Practices

### 1. Always Check Raw JSON First

When debugging, start with Apify Response JSON to see what was actually fetched before checking the database.

### 2. Keep Configuration JSON Simple

Start with minimal search parameters, test, then add filters incrementally.

### 3. Download JSON for Records

Download raw JSON for important syncs as a backup before the 7-day expiration.

### 4. Use Pretty Print

When copying JSON, use `JSON.stringify(data, null, 2)` for readable formatting.

### 5. Monitor Sync Stats

Check "jobs_fetched" vs "jobs_created" in sync logs to understand data flow efficiency.

---

## Summary

You now have **3 ways to access Apify JSON data**:

✅ **Configuration JSON**: Admin → Apify Config → Edit (controls search)
✅ **Apify Response JSON**: Admin → Apify JSON → View (raw results)
✅ **Database JSON**: Supabase Dashboard / API (final stored data)

Each serves a different purpose:
- **Config**: What to fetch
- **Response**: What was fetched
- **Database**: What was saved

Use the right one for your needs!

---

**Last Updated:** December 28, 2025
**Version:** 1.0
