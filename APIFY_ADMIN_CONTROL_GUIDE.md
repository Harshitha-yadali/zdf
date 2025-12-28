# Apify Job Automation - Admin Control Guide

## Overview

PrimoBoost AI now has **full frontend control** for Apify job automation! Admins can configure platforms, edit JSON parameters, and trigger job syncs manually or automatically.

---

## 🎯 Key Features

### 1. **JSON Configuration Editor**
Edit job search parameters directly in the admin panel with a visual JSON editor.

### 2. **Manual "Run Now" Button**
Trigger job sync immediately without waiting for the 8-hour automatic schedule.

### 3. **Bulk "Sync All" Button**
Run all active platform syncs at once with one click.

### 4. **Real-time Status**
See which platforms are currently syncing with live status indicators.

### 5. **Flexible Scheduling**
Configure sync frequency from 1-168 hours per platform.

---

## 📋 Step-by-Step Guide

### Step 1: Access Apify Configuration

1. **Log in** as admin
2. Navigate to **Admin Dashboard**
3. Click on **"Apify Config"** tab

You'll see:
- Info banner explaining automatic vs manual sync
- Quick stats (Total Platforms, Active, Inactive, Syncing Now)
- Platform configuration cards
- "Sync All Active" button (green)
- "Add Configuration" button (blue)

---

### Step 2: Add New Platform Configuration

#### Click "Add Configuration" Button

**Form Fields:**

1. **Platform Name** (dropdown)
   - Select: LinkedIn, Indeed, Naukri, Instahyre, Glassdoor, or Other
   - Auto-fills Actor ID and default JSON config

2. **Apify API Token** (password field)
   - Get from: [Apify Console → Settings → API Tokens](https://console.apify.com/settings/integrations)
   - Keep it secure (hidden)

3. **Actor ID** (text field)
   - Auto-populated based on platform
   - Examples:
     - LinkedIn: `apify/linkedin-jobs-scraper`
     - Indeed: `apify/indeed-scraper`
     - Naukri: `bebity/naukri-scraper`

4. **Test Connection Button**
   - Click to verify API token and Actor ID work
   - Shows success/failure message

5. **Sync Frequency** (number field)
   - Default: 8 hours
   - Range: 1-168 hours (1 week max)
   - Controls automatic sync interval

6. **Search Configuration (JSON)** ⭐ **KEY FIELD**
   - Edit JSON to control what jobs are fetched
   - Auto-generated template based on platform
   - Click "View Example Configurations" for platform-specific examples

7. **Active Checkbox**
   - Check to enable automatic syncing
   - Uncheck to disable (draft mode)

#### Click "Create" to save

---

### Step 3: Edit JSON Search Configuration

The JSON editor controls **what jobs Apify fetches**. Here's how to customize:

#### LinkedIn JSON Example:

```json
{
  "keywords": ["React Developer", "Node.js Engineer", "Full Stack"],
  "location": "India",
  "datePosted": "week",
  "experienceLevel": ["Entry level", "Mid-Senior level", "Associate"],
  "jobType": ["Full-time", "Contract"],
  "maxItems": 100
}
```

**Parameters:**
- `keywords`: Array of job titles/skills to search
- `location`: City/Country (e.g., "Bangalore", "India", "Remote")
- `datePosted`: "day", "week", "month" (how recent)
- `experienceLevel`: Array of experience levels
- `jobType`: "Full-time", "Part-time", "Contract", "Internship"
- `maxItems`: Maximum jobs to fetch (default 100)

#### Indeed JSON Example:

```json
{
  "position": "Software Engineer",
  "location": "Bangalore, Karnataka",
  "maxItems": 100,
  "datePosted": "7",
  "jobType": "fulltime",
  "radius": "25"
}
```

**Parameters:**
- `position`: Job title keyword
- `location`: City, State format
- `maxItems`: Max results
- `datePosted`: Days ago (e.g., "7" = last 7 days)
- `jobType`: "fulltime", "parttime", "contract", "temporary", "internship"
- `radius`: Search radius in miles

#### Naukri JSON Example:

```json
{
  "keywords": "Python Developer",
  "location": "Mumbai",
  "experience": "0-3",
  "salary": "3-8",
  "industry": "IT Software",
  "maxItems": 50
}
```

**Parameters:**
- `keywords`: Job title/skill
- `location`: City name
- `experience`: "0-3", "3-6", "6-10", "10+" (years)
- `salary`: "3-8", "8-15", "15+" (Lakhs per annum)
- `industry`: Industry category
- `maxItems`: Max results

---

### Step 4: Manual Sync (Run Now)

There are **TWO ways** to trigger manual sync:

#### Option A: Individual Platform Sync

1. Find the platform card
2. Click the **"Run Now"** button (blue button with refresh icon)
3. Button changes to "Syncing..." with spinning icon
4. Alert shows: "✅ Sync started successfully! Check the Sync Logs tab for progress."
5. Wait for completion (usually 2-5 minutes)
6. Check **"Sync Logs"** tab for results

#### Option B: Sync All Platforms

1. Click **"Sync All Active"** button (green button at top)
2. Confirm: "Run sync for all X active platform(s)?"
3. All active platforms sync one by one
4. Real-time status shows which platform is syncing
5. Final alert: "✅ Sync Complete! Success: X, Failed: Y"

---

### Step 5: Understanding Automatic Sync

**How it works:**

1. **Active platforms** automatically sync based on their frequency
2. Default: Every **8 hours**
3. Runs in the background via Supabase Edge Function
4. Scheduled via database cron job

**When does auto-sync run?**
- First run: Immediately when you activate a platform
- Next run: After configured frequency (e.g., 8 hours later)
- Uses `last_sync_at` timestamp to determine next run

**Example Timeline:**
```
Platform Activated: 10:00 AM
First Auto Sync: 10:00 AM (immediate)
Second Auto Sync: 6:00 PM (8 hours later)
Third Auto Sync: 2:00 AM next day (8 hours later)
```

**Don't want to wait 8 hours?**
→ Click **"Run Now"** button for immediate sync!

---

### Step 6: View Sync Logs

1. Navigate to **Admin Dashboard → Sync Logs** tab
2. View all sync operations with:
   - Platform name
   - Trigger type (Automatic / Manual)
   - Status (Success / Failed)
   - Stats (Fetched, Created, Updated, Skipped)
   - Error details (if failed)
   - Timestamp

3. Filter by platform or search logs
4. Export logs for analysis

---

## 🎨 Visual Status Indicators

### Platform Card States:

**Active + Not Syncing:**
```
✅ Green badge: "Active"
Blue "Run Now" button enabled
```

**Active + Syncing:**
```
🔵 Blue pulsing badge: "Syncing..."
Blue "Syncing..." button (disabled)
Card has blue border and shadow
Spinning refresh icon
```

**Inactive:**
```
⚫ Gray badge: "Inactive"
"Run Now" button disabled
```

### Dashboard Stats:

- **Total Platforms**: Count of all configurations
- **Active**: Platforms enabled for auto-sync
- **Inactive**: Disabled platforms
- **Syncing Now**: Currently running syncs (real-time)

---

## 🔧 Common Scenarios

### Scenario 1: Add LinkedIn Job Scraping

**Goal:** Fetch React Developer jobs in Bangalore

**Steps:**
1. Click "Add Configuration"
2. Select Platform: "LinkedIn"
3. Enter your Apify API Token
4. Edit JSON:
```json
{
  "keywords": ["React Developer", "Frontend Developer"],
  "location": "Bangalore, India",
  "datePosted": "week",
  "experienceLevel": ["Entry level", "Mid-Senior level"],
  "jobType": ["Full-time"],
  "maxItems": 100
}
```
5. Check "Active"
6. Click "Create"
7. Click "Run Now" to test immediately
8. Check "Sync Logs" for results

---

### Scenario 2: Update Search Keywords

**Goal:** Change keywords from "Python" to "Django"

**Steps:**
1. Find the platform card (e.g., "Naukri")
2. Click **Edit icon** (pencil)
3. Modify JSON:
```json
{
  "keywords": "Django Developer",  // Changed!
  "location": "Pune",
  "experience": "2-5",
  "maxItems": 50
}
```
4. Click "Update"
5. Click "Run Now" to fetch with new keywords immediately

---

### Scenario 3: Pause Then Resume Sync

**Goal:** Temporarily stop syncing, then resume later

**Steps to Pause:**
1. Find the platform card
2. Click **Power Off icon** (toggle)
3. Badge changes to "Inactive"
4. Auto-sync stops

**Steps to Resume:**
1. Click **Power icon** again
2. Badge changes to "Active"
3. Auto-sync resumes on next schedule
4. Or click "Run Now" for immediate sync

---

### Scenario 4: Fetch Jobs from Multiple Locations

**Goal:** Get jobs from Bangalore, Hyderabad, and Pune

**Steps:**
1. Create **3 separate configurations** (one per location)

   **Config 1:**
   ```json
   {
     "keywords": ["Software Engineer"],
     "location": "Bangalore, India",
     "datePosted": "week"
   }
   ```

   **Config 2:**
   ```json
   {
     "keywords": ["Software Engineer"],
     "location": "Hyderabad, India",
     "datePosted": "week"
   }
   ```

   **Config 3:**
   ```json
   {
     "keywords": ["Software Engineer"],
     "location": "Pune, India",
     "datePosted": "week"
   }
   ```

2. Activate all three
3. Click **"Sync All Active"** to fetch from all locations at once

---

### Scenario 5: Test Without Waiting

**Goal:** Test if configuration works without waiting 8 hours

**Steps:**
1. Create new configuration
2. **Uncheck "Active"** (don't enable auto-sync yet)
3. Click "Create"
4. **Activate it** (click Power icon)
5. Immediately click **"Run Now"**
6. Check "Sync Logs" for results
7. If successful, leave it active for auto-sync

---

## ⚙️ Advanced JSON Configuration

### Multiple Keywords (OR logic)

```json
{
  "keywords": [
    "React Developer",
    "Vue Developer",
    "Angular Developer",
    "Frontend Engineer"
  ]
}
```
→ Fetches jobs matching ANY of these keywords

### Location Variations

```json
{
  "location": "Bangalore OR Bengaluru OR Karnataka"
}
```

### Experience Ranges

```json
{
  "experienceLevel": ["Internship", "Entry level", "Mid-Senior level"]
}
```

### Date Filters

```json
{
  "datePosted": "day"  // Last 24 hours
  "datePosted": "week" // Last 7 days
  "datePosted": "month" // Last 30 days
}
```

### Salary Filters (Naukri)

```json
{
  "salary": "5-10",  // 5-10 LPA
  "salary": "10-15", // 10-15 LPA
  "salary": "15+"    // 15+ LPA
}
```

---

## 🐛 Troubleshooting

### Issue: "Failed to trigger sync"

**Possible Causes:**
1. Invalid API Token
   - Solution: Verify token in Apify Console
2. Wrong Actor ID
   - Solution: Check Actor ID on Apify Store
3. Platform not active
   - Solution: Click Power icon to activate
4. Invalid JSON
   - Solution: Validate JSON syntax (check commas, brackets)

**How to Debug:**
1. Click "Test Connection" in form
2. Check "Sync Logs" for error details
3. Verify JSON is valid (use online validator)
4. Try with simpler JSON first

---

### Issue: "No jobs fetched"

**Possible Causes:**
1. Too restrictive search parameters
2. No matching jobs available
3. Invalid location format
4. Actor rate limit reached

**Solutions:**
1. Broaden keywords (less specific)
2. Remove experience/salary filters
3. Change location to broader area
4. Reduce `maxItems` if hitting limits
5. Check Apify Console for actor run logs

---

### Issue: Sync takes too long

**Normal Duration:**
- Small search (50 jobs): 1-2 minutes
- Medium search (100 jobs): 3-5 minutes
- Large search (200+ jobs): 5-10 minutes

**If stuck:**
1. Check "Sync Logs" for status
2. Apify actors have timeouts (usually 5-10 min)
3. Reduce `maxItems` for faster results
4. Contact if stuck >15 minutes

---

### Issue: JSON validation error

**Common Mistakes:**
```json
// ❌ Wrong: Missing comma
{
  "keywords": ["Python"]
  "location": "India"
}

// ✅ Correct: Add comma
{
  "keywords": ["Python"],
  "location": "India"
}
```

```json
// ❌ Wrong: Trailing comma
{
  "keywords": ["Python"],
  "location": "India",
}

// ✅ Correct: Remove last comma
{
  "keywords": ["Python"],
  "location": "India"
}
```

```json
// ❌ Wrong: Single quotes
{
  'keywords': ['Python']
}

// ✅ Correct: Double quotes
{
  "keywords": ["Python"]
}
```

**Use a JSON validator:**
- [jsonlint.com](https://jsonlint.com)
- Copy-paste your JSON to check syntax

---

## 📊 Best Practices

### 1. Start Small, Scale Up
- Begin with 1 platform and simple JSON
- Test with "Run Now" before enabling auto-sync
- Gradually add more platforms

### 2. Optimize Search Parameters
- Use 3-5 targeted keywords (not 20)
- Set realistic `maxItems` (100-200)
- Filter by recent dates ("week" or "day")

### 3. Monitor Sync Logs
- Check logs regularly for errors
- Look at "Created" vs "Skipped" stats
- Duplicates show as "Skipped" (good!)

### 4. Use Multiple Configs Strategically
- Separate by location (Bangalore, Pune, etc.)
- Separate by role type (Frontend, Backend, etc.)
- Don't create too many (5-10 is optimal)

### 5. Manage Auto-Sync Frequency
- High-demand roles: 4-6 hours
- Normal roles: 8-12 hours
- Niche roles: 24 hours
- Don't sync too frequently (API costs)

---

## 🎯 Quick Reference

| Action | Location | Button/Icon |
|--------|----------|-------------|
| Add Platform | Apify Config tab | Blue "Add Configuration" |
| Edit Platform | Platform card | Pencil icon |
| Delete Platform | Platform card | Trash icon |
| Manual Sync | Platform card | Blue "Run Now" button |
| Bulk Sync | Top of page | Green "Sync All Active" |
| Toggle Active | Platform card | Power/PowerOff icon |
| View Logs | Sync Logs tab | Table view |
| Test Connection | Add/Edit form | "Test Connection" link |

---

## 📞 Support

**Need Help?**
- Check "Sync Logs" tab for detailed error messages
- Verify JSON syntax with validator
- Test connection before saving
- Start with example configs provided in form

**Still Stuck?**
- Review Apify actor documentation
- Check Apify Console for run logs
- Reduce complexity of JSON

---

## 🚀 Summary

You now have **complete control** over Apify job automation:

✅ **Edit JSON** directly in frontend
✅ **Run sync manually** with "Run Now" button
✅ **Sync all platforms** with one click
✅ **Monitor real-time** syncing status
✅ **Schedule automatic** syncs (8 hours default)
✅ **View detailed logs** for every sync
✅ **Test configurations** before activating

**No need to wait 8 hours!** Click "Run Now" anytime you want fresh jobs!

---

**Last Updated:** December 28, 2025
**Version:** 2.0 (Enhanced Frontend Controls)
