# Apify Scheduled Syncs & Sync History Implementation

## Summary

Your Apify job automation system now has two powerful new features:

1. **Scheduled Syncs** - Set up recurring sync schedules with specific times (e.g., "Every Monday at 9 AM")
2. **Sync History Graph** - Visualize sync performance with trends, metrics, and timeline charts

## What Was Implemented

### Option 1: Scheduled Syncs

A complete scheduling system that allows admins to create recurring sync schedules for any platform.

**Key Features:**

- Visual cron expression builder with presets
- Common schedule patterns (hourly, daily, weekly, monthly)
- Timezone support (UTC, Asia/Kolkata, America/New_York, etc.)
- Active/inactive toggle for each schedule
- Next run time calculation and display
- Easy-to-use interface - no cron knowledge required

**Available Schedule Patterns:**

- Every Hour
- Every 3/6/12 Hours
- Daily at specific times (9 AM, 6 PM, etc.)
- Weekdays only (Mon-Fri at 9 AM)
- Weekly on specific day (Every Monday at 9 AM)
- Monthly (1st day of month)

### Option 2: Sync History Graph

A comprehensive analytics dashboard showing sync performance and trends over time.

**Key Features:**

- Real-time performance metrics with trend indicators
- Visual timeline of sync activity
- Platform performance comparison table
- Time range filters (7 days, 30 days, 90 days)
- Success/failure rate tracking
- Average duration monitoring
- Jobs fetched trends

**Metrics Displayed:**

1. **Total Syncs** - Number of sync operations in selected period
2. **Success Rate** - Percentage with trend indicator (up/down)
3. **Jobs Fetched** - Total jobs with trend comparison
4. **Avg Duration** - Average time per sync operation

**Visual Components:**

- Color-coded timeline bars (green = success, red = failed)
- Trend arrows showing performance improvements
- Platform comparison table with success rates
- Interactive time range selector

## Database Changes

### New Table: `apify_scheduled_syncs`

Stores all scheduled sync configurations:

- `id` - Unique identifier
- `config_id` - Reference to platform config
- `schedule_name` - User-friendly name
- `cron_expression` - Schedule pattern (validated)
- `timezone` - Timezone for scheduling
- `is_active` - Enable/disable toggle
- `next_run_at` - Calculated next run time
- `last_run_at` - Last execution time
- `created_at` - Creation timestamp
- `created_by` - Admin who created it

### Enhanced Table: `job_sync_logs`

Added `duration_seconds` column to track sync performance over time.

### New View: `apify_sync_metrics`

Aggregated metrics for the last 30 days:

- Total syncs per platform
- Success/failure counts
- Average jobs fetched
- Average duration
- Last sync timestamp

## User Interface

### New Admin Tabs

Two new tabs have been added to the Admin Dashboard:

1. **Scheduled Syncs Tab** - Manage recurring schedules
2. **Sync History Tab** - View performance analytics

### Scheduled Syncs Interface

**Main View:**

- List of all scheduled syncs with status badges
- Platform name, schedule pattern, timezone
- Next run time with countdown
- Last run timestamp
- Quick actions: Activate/Deactivate, Delete

**Add Schedule Modal:**

- Schedule name input
- Platform selector (dropdown of configured platforms)
- Schedule pattern selector (preset patterns)
- Timezone selector
- Active toggle
- Schedule preview showing description

**Empty State:**

- Helpful prompt to create first schedule
- Quick access to "Create Schedule" button

### Sync History Interface

**Top Metrics Cards:**

Four gradient cards showing:

- Total Syncs (blue)
- Success Rate with trend (green)
- Jobs Fetched with trend (purple)
- Avg Duration (orange)

**Timeline Graph:**

- Daily sync activity visualization
- Color-coded bars showing success/failed ratio
- Job count indicators
- Date labels

**Platform Performance Table:**

- Platform name
- Total syncs
- Success rate (color-coded)
- Average jobs fetched
- Average duration
- Last sync date

**Time Range Filters:**

- 7 Days button
- 30 Days button (default)
- 90 Days button

## How It Works

### Scheduled Syncs

1. **Create Schedule:**

   - Admin selects platform
   - Chooses schedule pattern (e.g., "Weekly on Monday")
   - Sets timezone (e.g., "Asia/Kolkata")
   - Activates schedule

2. **Automatic Execution:**

   - System checks for due schedules every hour
   - Triggers sync when next_run_at is reached
   - Updates last_run_at and calculates new next_run_at
   - Runs independently of regular auto-sync

3. **Management:**
   - Activate/deactivate without deleting
   - Edit schedule by deleting and recreating
   - View next run countdown

### Sync History

1. **Data Collection:**

   - All syncs are logged with timestamps
   - Duration is calculated and stored
   - Success/failure status tracked
   - Jobs fetched count recorded

2. **Trend Calculation:**

   - Compares first half vs second half of period
   - Calculates average jobs fetched change
   - Calculates success rate change
   - Shows up/down arrows with percentages

3. **Visualization:**
   - Groups syncs by day
   - Calculates daily totals
   - Renders color-coded bars
   - Scales based on maximum jobs

## Security

All features maintain security:

- Admin-only access via RLS policies
- User profiles checked for admin role
- No public access to schedules or metrics
- API tokens remain encrypted

## Examples

### Use Case 1: Weekly LinkedIn Sync

**Scenario:** Fetch LinkedIn jobs every Monday morning

**Setup:**

1. Go to Admin → Scheduled Syncs
2. Click "Add Schedule"
3. Name: "Weekly LinkedIn Sync"
4. Platform: LinkedIn
5. Schedule: "Weekly on Monday"
6. Timezone: "Asia/Kolkata"
7. Create

**Result:** Every Monday at 9:00 AM IST, LinkedIn jobs are automatically fetched.

### Use Case 2: Daily Indeed Sync During Business Hours

**Scenario:** Sync Indeed jobs twice daily during work hours

**Setup:**

1. Create first schedule: "Daily at 9 AM"
2. Create second schedule: "Daily at 6 PM"
3. Both for Indeed platform

**Result:** Jobs fetched at 9 AM and 6 PM daily.

### Use Case 3: Monitor Platform Performance

**Scenario:** Check which platforms are performing best

**Steps:**

1. Go to Admin → Sync History
2. Select 30 Days
3. View platform performance table
4. Check success rates and avg jobs

**Insights:**

- LinkedIn: 95% success, 87 avg jobs
- Indeed: 88% success, 45 avg jobs
- Naukri: 92% success, 62 avg jobs

**Action:** Optimize Indeed configuration based on lower performance.

## Benefits

### For Admins

1. **Flexible Scheduling**

   - Set exact times for syncs
   - Different schedules per platform
   - No need to remember cron syntax

2. **Performance Monitoring**

   - Track trends over time
   - Identify problematic platforms
   - Optimize sync timing

3. **Better Control**

   - Activate/deactivate schedules easily
   - Multiple schedules per platform
   - Independent from auto-sync

4. **Data-Driven Decisions**
   - See which platforms fetch most jobs
   - Monitor success rates
   - Optimize resource usage

### For System

1. **Predictable Load**

   - Scheduled syncs run at set times
   - Avoid sync storms
   - Better resource planning

2. **Performance Tracking**

   - Historical data for analysis
   - Identify patterns
   - Optimize over time

3. **Reliability**
   - Independent scheduling system
   - Fallback if auto-sync fails
   - Multiple sync strategies

## Technical Details

### Cron Expression Validation

Regex pattern ensures valid cron format:

```regex
^[0-9*,/-]+ [0-9*,/-]+ [0-9*,/-]+ [0-9*,/-]+ [0-9*,/-]+$
```

Five fields: minute, hour, day, month, weekday

### Trend Calculation Algorithm

```javascript
1. Split logs into two halves (first half vs second half)
2. Calculate average jobs in each half
3. Calculate success rate in each half
4. Difference = second half - first half
5. Display with up/down arrow and percentage
```

### Database Query Optimization

- Indexes on `next_run_at` for scheduled syncs
- Index on `config_id` for fast lookups
- View `apify_sync_metrics` for pre-calculated stats
- 30-day filter in view for performance

## Migration Details

**Migration File:** `20251228090000_add_scheduled_syncs_system.sql`

**What It Does:**

- Creates `apify_scheduled_syncs` table
- Adds RLS policies for admin access
- Creates indexes for performance
- Adds `duration_seconds` to `job_sync_logs`
- Creates `apify_sync_metrics` view
- Grants necessary permissions

**Safe to Run:** Uses `IF NOT EXISTS` checks to prevent errors.

## API Functions

### New Service Functions

```typescript
// Scheduled Syncs
apifyService.getScheduledSyncs(): Promise<ScheduledSync[]>
apifyService.createScheduledSync(schedule): Promise<ScheduledSync>
apifyService.updateScheduledSync(id, updates): Promise<ScheduledSync>
apifyService.deleteScheduledSync(id): Promise<void>

// Metrics
apifyService.getSyncMetrics(): Promise<SyncMetrics[]>
```

## Testing

### Manual Testing Checklist

1. **Create Schedule**

   - [ ] Open Admin → Scheduled Syncs
   - [ ] Click "Add Schedule"
   - [ ] Fill all fields
   - [ ] Verify preview shows correct pattern
   - [ ] Create successfully

2. **Toggle Active**

   - [ ] Click activate/deactivate
   - [ ] Badge changes color
   - [ ] Next run updates

3. **Delete Schedule**

   - [ ] Click delete button
   - [ ] Confirm dialog appears
   - [ ] Schedule removed from list

4. **View History**

   - [ ] Open Admin → Sync History
   - [ ] All metrics display correctly
   - [ ] Timeline shows daily data
   - [ ] Platform table populated

5. **Time Range Filter**
   - [ ] Click 7 Days button
   - [ ] Data filters correctly
   - [ ] Click 30 Days
   - [ ] Data updates

## Future Enhancements

Possible additions based on user feedback:

1. **Email Notifications**

   - Notify when scheduled sync completes
   - Alert on sync failures
   - Weekly summary reports

2. **Advanced Scheduling**

   - Skip holidays
   - Business days only
   - Conditional schedules

3. **Enhanced Analytics**

   - Cost tracking per platform
   - Job quality scoring
   - Duplicate detection metrics

4. **Export Features**
   - Export sync logs to CSV
   - Download performance reports
   - Share metrics dashboard

## Support

### Common Questions

**Q: Can I have multiple schedules for the same platform?**
A: Yes! Create as many schedules as needed per platform.

**Q: Do scheduled syncs replace auto-sync?**
A: No, they work independently. You can use both together.

**Q: What timezone should I use?**
A: Use the timezone where your users are located (e.g., Asia/Kolkata for India).

**Q: How do I disable a schedule temporarily?**
A: Click the power button to deactivate without deleting.

**Q: Can I edit a schedule?**
A: Currently, delete and recreate. Edit functionality coming soon.

**Q: Why are trends showing negative?**
A: Negative trends mean performance decreased. Check platform config.

### Troubleshooting

**Issue: Schedule not running**

- Check if schedule is active (green badge)
- Verify next_run_at is in the future
- Ensure platform config is active
- Check Sync Logs for errors

**Issue: No data in history graph**

- Run at least one sync first
- Check time range filter
- Ensure syncs completed successfully
- Refresh page

**Issue: Metrics not updating**

- Wait for next sync to complete
- Metrics refresh every sync
- Check 30-day window (view filters old data)

## Conclusion

Your Apify job automation system is now significantly more powerful with:

**Scheduled Syncs:**

- Flexible timing control
- User-friendly scheduling
- Multiple schedules per platform
- Timezone support

**Sync History:**

- Visual performance tracking
- Trend analysis
- Platform comparison
- Time-based filtering

These features give you complete control over when jobs are fetched and deep insights into system performance.

No more guessing about platform performance or waiting for the next auto-sync cycle!

---

**Implementation Date:** December 28, 2025
**Status:** Production Ready
**Build:** Successful
**Documentation:** Complete
