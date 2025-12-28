# Job Updates System - Complete Documentation

## Overview

The Job Updates System enables admins to create, manage, and publish job market updates, news, and announcements. Users can view these updates on the Jobs page with featured updates displayed prominently. The system supports flexible JSON metadata for rich content.

## Key Features

### 1. **Admin Management Dashboard**
- Create/edit/delete job updates
- JSON metadata editor with validation
- Toggle active/draft status
- Mark updates as featured
- Category-based organization
- Real-time statistics

### 2. **Public Display**
- Featured updates carousel
- Latest updates feed
- Detailed modal view
- Category filtering
- Responsive design

### 3. **Flexible Metadata**
- JSON-based metadata storage
- Support for tags, stats, links, companies, locations
- Extensible structure for future needs

### 4. **Categories**
- Market Trend
- Hiring News
- Industry Update
- Platform Update
- Salary Insights
- Skill Demand

## Architecture

### Database Schema

#### `job_updates` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Update title |
| `description` | text | Short summary for preview |
| `content` | text | Full content/details |
| `category` | text | Update category |
| `source_platform` | text | Source platform (LinkedIn, Indeed, etc.) |
| `metadata` | jsonb | Flexible JSON data |
| `image_url` | text | Optional image URL |
| `external_link` | text | Link to original source |
| `is_featured` | boolean | Show prominently on homepage |
| `is_active` | boolean | Published (true) or draft (false) |
| `published_at` | timestamptz | Publication date/time |
| `created_by` | uuid | Admin user ID |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

**Indexes:**
- `idx_job_updates_active_published`: Fast queries for active updates by date
- `idx_job_updates_category`: Filter by category
- `idx_job_updates_featured`: Featured updates
- `idx_job_updates_source_platform`: Filter by source

### TypeScript Types

```typescript
export type JobUpdateCategory =
  | 'market_trend'
  | 'hiring_news'
  | 'industry_update'
  | 'platform_update'
  | 'salary_insights'
  | 'skill_demand';

export interface JobUpdateMetadata {
  tags?: string[];
  stats?: {
    [key: string]: number | string;
  };
  links?: {
    title: string;
    url: string;
  }[];
  companies?: string[];
  locations?: string[];
  [key: string]: any;
}

export interface JobUpdate {
  id: string;
  title: string;
  description: string;
  content: string;
  category: JobUpdateCategory;
  source_platform?: string;
  metadata: JobUpdateMetadata;
  image_url?: string;
  external_link?: string;
  is_featured: boolean;
  is_active: boolean;
  published_at: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
```

### Service Layer

**`jobUpdatesService.ts`** provides:

- CRUD operations
- Filtering and querying
- Metadata validation
- Category helpers
- Statistics

## Admin Dashboard Usage

### Access Admin Dashboard

1. Log in as admin
2. Navigate to **Admin Dashboard**
3. Click on **"Job Updates"** tab

### Create New Update

1. Click **"Add Update"** button
2. Fill in the form:

   **Basic Information:**
   - **Title**: Clear, descriptive title (e.g., "LinkedIn Reports 25% Increase in Tech Hiring")
   - **Description**: Brief summary (1-2 sentences for preview)
   - **Full Content**: Detailed information, news, analysis

   **Categorization:**
   - **Category**: Select from dropdown (Market Trend, Hiring News, etc.)
   - **Source Platform**: Optional (LinkedIn, Indeed, Naukri, etc.)

   **Metadata (JSON):**
   ```json
   {
     "tags": ["tech", "hiring", "trends"],
     "stats": {
       "Increase in Tech Jobs": "25%",
       "Top Hiring City": "Bangalore"
     },
     "links": [
       {
         "title": "Full Report",
         "url": "https://example.com/report"
       }
     ],
     "companies": ["Google", "Microsoft", "Amazon"],
     "locations": ["Bangalore", "Hyderabad", "Pune"]
   }
   ```

   **Media:**
   - **Image URL**: Optional featured image
   - **External Link**: Link to original source

   **Publishing:**
   - **Published Date/Time**: When to publish (can be future)
   - **Featured**: Show prominently on jobs page
   - **Active**: Publish immediately (uncheck for draft)

3. Click **"Create"**

### Edit Existing Update

1. Find the update in the list
2. Click the **Edit icon** (pencil)
3. Modify any fields
4. Click **"Update"**

### Delete Update

1. Find the update in the list
2. Click the **Delete icon** (trash)
3. Confirm deletion

### Toggle Status

**Toggle Active/Draft:**
- Click the **Eye/Eye-Off icon** to publish or unpublish

**Toggle Featured:**
- Click the **Star icon** to add/remove from featured

### Filter Updates

Use the category dropdown to filter:
- All Categories
- Market Trend
- Hiring News
- Industry Update
- Platform Update
- Salary Insights
- Skill Demand

## Metadata Structure Examples

### Market Trend Update

```json
{
  "tags": ["ai", "machine-learning", "growth"],
  "stats": {
    "Job Growth": "45%",
    "Average Salary": "₹12-18 LPA",
    "Top Skill": "Python"
  },
  "links": [
    {
      "title": "Industry Report 2024",
      "url": "https://example.com/report"
    }
  ]
}
```

### Hiring News Update

```json
{
  "tags": ["hiring", "opportunities", "campus"],
  "companies": ["TCS", "Infosys", "Wipro"],
  "locations": ["Pan India"],
  "stats": {
    "Total Openings": "50,000+",
    "Hiring Period": "Q1 2025"
  }
}
```

### Salary Insights Update

```json
{
  "tags": ["salary", "compensation", "analysis"],
  "stats": {
    "Fresher Average": "₹3-5 LPA",
    "Mid-Level Average": "₹8-12 LPA",
    "Senior Average": "₹15-25 LPA",
    "Top Paying Domain": "AI/ML"
  },
  "locations": ["Bangalore", "Pune", "Hyderabad"]
}
```

### Skill Demand Update

```json
{
  "tags": ["skills", "demand", "2025"],
  "stats": {
    "Most Demanded": "React.js",
    "Growth Rate": "60%",
    "Average Jobs": "2000+/month"
  },
  "links": [
    {
      "title": "Learn React.js",
      "url": "https://react.dev"
    }
  ]
}
```

## Public Display (User View)

### Jobs Page Integration

The **LatestJobUpdates** component displays above the job listings filter:

**Layout:**
1. **Featured Updates**: Large cards with images (top section)
2. **Latest Updates**: List of recent updates (below featured)

**User Actions:**
- Click any update to view details
- View full content in modal
- Access external links
- See all metadata (tags, stats, companies, etc.)

### Update Card Elements

**Preview Card Shows:**
- Category badge
- Featured badge (if featured)
- Title
- Description
- Image (if provided)
- Published date
- Tags (first 3)

**Details Modal Shows:**
- Full content
- All metadata
- Statistics table
- Related companies
- Related links
- Tags
- External source link

## Use Cases

### 1. Market Updates

**Example**: "Tech Hiring Surge in Q1 2025"

```json
{
  "title": "Tech Hiring Surge in Q1 2025",
  "description": "Technology sector witnesses 40% increase in hiring compared to last quarter.",
  "content": "The technology sector is experiencing unprecedented growth...",
  "category": "market_trend",
  "source_platform": "LinkedIn",
  "metadata": {
    "tags": ["tech", "hiring", "growth"],
    "stats": {
      "Job Increase": "40%",
      "Top City": "Bangalore",
      "Average CTC": "₹6-10 LPA"
    }
  },
  "is_featured": true,
  "is_active": true
}
```

### 2. Company Hiring Announcements

**Example**: "Google Announces 5000+ Openings in India"

```json
{
  "title": "Google Announces 5000+ Openings in India",
  "description": "Google to hire across multiple roles in engineering and product.",
  "content": "Google has announced a massive hiring drive...",
  "category": "hiring_news",
  "source_platform": "Naukri",
  "metadata": {
    "tags": ["google", "mass-hiring", "opportunities"],
    "companies": ["Google"],
    "locations": ["Bangalore", "Hyderabad", "Gurgaon"],
    "stats": {
      "Total Openings": "5000+",
      "Roles": "SDE, PM, Design",
      "Experience": "0-5 years"
    },
    "links": [
      {
        "title": "Apply Now",
        "url": "https://careers.google.com/india"
      }
    ]
  },
  "is_featured": true,
  "is_active": true
}
```

### 3. Salary Reports

**Example**: "2025 IT Salary Trends Report"

```json
{
  "title": "2025 IT Salary Trends Report",
  "description": "Comprehensive analysis of IT sector salaries across India.",
  "content": "According to the latest industry report...",
  "category": "salary_insights",
  "metadata": {
    "tags": ["salary", "compensation", "report"],
    "stats": {
      "Fresher (0-2 years)": "₹3-6 LPA",
      "Mid-Level (3-6 years)": "₹8-15 LPA",
      "Senior (7+ years)": "₹18-30 LPA",
      "Top Domain": "AI/ML - ₹20-40 LPA"
    },
    "locations": ["Bangalore", "Pune", "Hyderabad", "NCR"]
  },
  "image_url": "https://example.com/salary-chart.jpg",
  "is_featured": true,
  "is_active": true
}
```

### 4. Skill Demand Analysis

**Example**: "Top 10 In-Demand Skills for 2025"

```json
{
  "title": "Top 10 In-Demand Skills for 2025",
  "description": "Skills that will dominate job market in 2025 based on hiring trends.",
  "content": "Based on analysis of 1 million+ job postings...",
  "category": "skill_demand",
  "metadata": {
    "tags": ["skills", "demand", "learning"],
    "stats": {
      "1. Python": "45,000 jobs/month",
      "2. React.js": "38,000 jobs/month",
      "3. AWS": "35,000 jobs/month",
      "4. Node.js": "30,000 jobs/month",
      "5. Docker": "28,000 jobs/month"
    },
    "links": [
      {
        "title": "Learn Python",
        "url": "https://python.org"
      },
      {
        "title": "React Course",
        "url": "https://react.dev"
      }
    ]
  },
  "is_featured": true,
  "is_active": true
}
```

## Best Practices

### Content Guidelines

1. **Title**: Clear, concise, attention-grabbing
2. **Description**: 1-2 sentences, highlight key points
3. **Content**: Detailed, well-structured, informative
4. **Category**: Choose most relevant category
5. **Tags**: Use 3-5 relevant tags for searchability

### Metadata Best Practices

1. **Keep it clean**: Well-formatted JSON
2. **Use stats**: Numbers are engaging
3. **Add links**: Provide value to users
4. **Company names**: Mention specific companies when relevant
5. **Locations**: Include cities/regions for local relevance

### Publishing Strategy

1. **Featured**: Use sparingly (3-5 max at a time)
2. **Timing**: Publish at optimal times (morning hours)
3. **Frequency**: 2-3 updates per week
4. **Mix categories**: Variety keeps users engaged
5. **Quality over quantity**: Better to publish fewer high-quality updates

## Security & Permissions

### Row Level Security (RLS)

**Public Access:**
- Read active updates only
- No write access

**Admin Access:**
- Full CRUD operations
- View drafts
- Manage all updates

**Database Policies:**
- Only authenticated admins can create/edit/delete
- Public users can only view active updates
- Drafts are invisible to public

## Monitoring & Analytics

### Statistics Dashboard

Admin dashboard shows:
- Total updates created
- Active vs. draft count
- Featured updates count
- Updates by category

### User Engagement (Future)

Planned metrics:
- View counts per update
- Click-through rates on external links
- Most popular categories
- Time spent reading

## Integration with Apify

The Job Updates system can work with the Apify automation:

1. **Automatic Update Creation**: Apify can detect industry news and create draft updates
2. **Source Attribution**: Updates can reference Apify-fetched jobs
3. **Data Enrichment**: Use Apify data to populate stats in metadata

## Future Enhancements

### Planned Features

1. **Rich Text Editor**: WYSIWYG editor for content
2. **Image Upload**: Direct image upload instead of URLs
3. **Scheduled Publishing**: Auto-publish at specified time
4. **Email Notifications**: Notify users of featured updates
5. **User Comments**: Allow user feedback on updates
6. **Analytics Dashboard**: Track engagement metrics
7. **Social Sharing**: Share updates on social media
8. **RSS Feed**: Subscribe to updates feed
9. **Multi-language Support**: Translate updates
10. **Version History**: Track update changes

### API Endpoints (Planned)

```typescript
GET /api/job-updates
GET /api/job-updates/:id
GET /api/job-updates/featured
GET /api/job-updates/category/:category
POST /api/job-updates (admin only)
PUT /api/job-updates/:id (admin only)
DELETE /api/job-updates/:id (admin only)
```

## Troubleshooting

### Common Issues

**Update not showing on Jobs page:**
- Ensure `is_active` is `true`
- Check `published_at` is not in future
- Verify no database errors

**JSON validation error:**
- Check JSON syntax (commas, brackets)
- Ensure all links have `title` and `url`
- Use JSON validator tool

**Featured updates not appearing:**
- Check `is_featured` flag is `true`
- Ensure `is_active` is also `true`
- Maximum 5 featured updates display

**Images not loading:**
- Verify image URL is accessible
- Check URL starts with `https://`
- Ensure image format is supported (JPG, PNG, WebP)

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review and update featured updates
2. **Monthly**: Archive old updates (set `is_active` to false)
3. **Quarterly**: Review analytics and adjust strategy
4. **Yearly**: Clean up unused updates

### Contact

For issues or questions:
- Check database logs for errors
- Review admin dashboard statistics
- Test in draft mode before publishing

---

**Implementation Date**: December 28, 2025
**Developer**: PrimoBoost AI Team
**Status**: Production Ready ✅
