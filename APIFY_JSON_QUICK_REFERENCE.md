# Apify JSON - Quick Reference Card

## 3 Ways to Access Apify JSON Data

### 1. Configuration JSON (Search Parameters)
**Location:** Admin → Apify Config → Edit

**What:** Controls what jobs Apify fetches

**Actions:** View, Edit, Save, Test

**Example:**
```json
{
  "keywords": ["React Developer"],
  "location": "Bangalore",
  "experienceLevel": ["Entry level"],
  "maxItems": 100
}
```

---

### 2. Apify Response JSON (Raw Results) - NEW!
**Location:** Admin → Apify JSON → View JSON

**What:** Raw job data returned by Apify

**Actions:** View, Download, Search

**Features:**
- Browse successful syncs
- Fetch raw JSON from Apify
- Download as `.json` file
- Search within results
- See exact data structure

**Example:**
```json
[
  {
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "location": "Bangalore",
    "salary": "15-25 LPA",
    "applyUrl": "https://..."
  }
]
```

---

### 3. Database JSON (Stored Data)
**Location:** Supabase Dashboard → SQL Editor

**What:** Processed job data in database

**Query:**
```sql
SELECT * FROM job_listings
WHERE source_api LIKE 'apify-%'
LIMIT 100;
```

---

## Quick Access Steps

### View Raw Apify Data (NEW Feature!)

1. Open Admin Panel
2. Click **"Apify JSON"** tab (new tab added!)
3. Select a successful sync from the list
4. Click **"View JSON"** button
5. Modal opens with formatted JSON
6. Click **"Download JSON"** to save locally

---

## What Was Added

### New Component: `ApifyDataViewer`
Located at: `src/components/admin/ApifyDataViewer.tsx`

**Features:**
- Lists all successful syncs with metadata
- "View JSON" button to fetch raw Apify data
- "Download JSON" to save locally
- Search/filter by platform name
- Real-time refresh
- Stats display (fetched, created, updated, skipped)
- Formatted JSON viewer with dark theme
- Info panel explaining data structure

### New Admin Tab
- Added **"Apify JSON"** tab to Admin Panel
- Located between "Sync Logs" and "Job Updates"
- Provides visual interface to access raw Apify datasets

---

## When to Use Each

| Need | Use This |
|------|----------|
| Change what jobs to fetch | Configuration JSON (Apify Config tab) |
| See what Apify actually returned | Apify Response JSON (Apify JSON tab) - NEW! |
| Check jobs in database | Database JSON (Supabase) |
| Debug scraping issues | Apify Response JSON - NEW! |
| Export data for analysis | Apify Response JSON → Download - NEW! |

---

## Key Benefits

1. **Transparency**: See exactly what Apify returns
2. **Debugging**: Compare raw data vs database
3. **Export**: Download JSON for external analysis
4. **Validation**: Verify scraping accuracy
5. **Audit**: Track what was fetched over time

---

## Data Flow

```
Configuration JSON → Apify API → Response JSON → Database JSON
     (Edit)           (Scrape)     (View/Download)    (Query)
```

---

## Pro Tips

1. **Download within 7 days** - Apify datasets expire after 7 days
2. **Check raw first** - When debugging, always check Apify Response JSON before database
3. **Use Ctrl+F** - Search within JSON viewer for specific jobs
4. **Compare platforms** - Download JSON from multiple platforms to compare data structures
5. **Monitor stats** - Check "jobs_fetched" vs "jobs_created" to understand efficiency

---

## Files Modified

1. `/src/components/admin/ApifyDataViewer.tsx` - NEW component
2. `/src/pages/AdminPage.tsx` - Added new tab and integration
3. `/APIFY_JSON_ACCESS_GUIDE.md` - NEW comprehensive guide
4. `/APIFY_JSON_QUICK_REFERENCE.md` - NEW quick reference (this file)

---

## Summary

You can now:
✅ View raw Apify JSON responses in the admin panel
✅ Download JSON data for external analysis
✅ Search and filter syncs by platform
✅ See exact data structure before database mapping
✅ Debug scraping issues more effectively

**Access:** Admin Panel → Apify JSON tab

---

**Last Updated:** December 28, 2025
