# Province-Restricted Content Feature

## Overview

This feature allows content managers to restrict specific content (articles, quizzes, videos, etc.) to users from specific provinces within a country. Content can be configured to be visible to all users, or only to users from selected provinces.

### Key Features

- **Province-based filtering:** Content can be restricted to specific provinces within countries
- **Flexible content control:** Applies to all content types (articles, quizzes, videos, Did You Know, avatar messages, surveys)
- **CMS management:** Easy-to-use interface for setting province restrictions
- **Mobile API filtering:** Automatic filtering of content based on user's province
- **Graceful degradation:** Works seamlessly whether province columns exist in the database or not
- **Performance optimization:** Includes caching mechanisms to avoid redundant database queries

---

## Database Schema Changes

### SQL Migration Files

The following migration files add province restriction support:

#### 1. `sql/1740038351971-content-restriction.sql`

Adds basic content filtering columns to all content tables:

```sql
-- Adds contentFilter and ageRestrictionLevel to:
-- article, did_you_know, quiz, video, avatar_messages, survey
ALTER TABLE periodtracker.article ADD COLUMN "contentFilter" VARCHAR(50);
ALTER TABLE periodtracker.article ADD COLUMN "ageRestrictionLevel" VARCHAR(20);
-- ... (repeated for each content type)
```

#### 2. `sql/1740221234567-province-content-restriction.sql`

Adds province restriction columns and indexes:

```sql
-- Adds provinceRestricted and allowedProvinces to all content tables
ALTER TABLE periodtracker.article 
  ADD COLUMN "provinceRestricted" BOOLEAN DEFAULT FALSE;
ALTER TABLE periodtracker.article 
  ADD COLUMN "allowedProvinces" TEXT[];

COMMENT ON COLUMN periodtracker.article."provinceRestricted" 
  IS 'Whether content is restricted to specific provinces';
COMMENT ON COLUMN periodtracker.article."allowedProvinces" 
  IS 'Array of province codes allowed to view this content';

-- Creates indexes for performance
CREATE INDEX idx_article_province_restricted 
  ON periodtracker.article("provinceRestricted");
CREATE INDEX idx_article_allowed_provinces 
  ON periodtracker.article USING GIN("allowedProvinces");

-- ... (repeated for each content type)
```

### Affected Tables

- `article`
- `did_you_know`
- `quiz`
- `video`
- `avatar_messages`
- `survey`

---

## File Changes

### Backend (CMS & API)

#### 1. **Entity Definitions**

All content entities updated with province restriction columns:

**`packages/cms/src/entity/Article.ts`** (and similar for other entities):

```typescript
@Column({ nullable: true })
contentFilter: string;

@Column({ nullable: true })
ageRestrictionLevel: string;

@Column({ type: 'boolean', default: false, nullable: true })
provinceRestricted: boolean;

@Column({ type: 'text', array: true, nullable: true })
allowedProvinces: string[];
```

#### 2. **CMS Controllers**

Enhanced with robust error handling and validation:

**`packages/cms/src/controller/ArticleController.ts`**

Key changes:
- `save()` method: Validates and sanitizes `provinceRestricted` and `allowedProvinces`
- `update()` method: Handles province restriction updates with comprehensive error handling
- `mobileArticlesByLanguage()`: Filters articles by user's province with graceful degradation
- Column existence caching to avoid redundant queries
- Proper HTTP status codes (400, 404, 409, 500) with detailed error messages

```typescript
// Example: Province filtering in mobile API
let provinceFilter = '';
let queryParams: any[] = [lang];

if (provinceColumnsExist && userProvince) {
  provinceFilter = `
    AND (
      article."provinceRestricted" = false 
      OR article."provinceRestricted" IS NULL 
      OR $2 = ANY(article."allowedProvinces")
    )
  `;
  queryParams.push(userProvince);
}
```

**Similar updates to:**
- `packages/cms/src/controller/DidYouKnowController.ts`
- `packages/cms/src/controller/QuizController.ts`
- `packages/cms/src/controller/VideoController.ts`
- `packages/cms/src/controller/AvatarMessagesController.ts`
- `packages/cms/src/controller/SurveyController.ts`
- `packages/cms/src/controller/UserController.ts`

#### 3. **CMS Views (EJS Templates)**

**`packages/cms/src/views/modals/ArticleModal.ejs`**

Added province restriction UI:

```html
<div class="form-group">
  <label>Restrict to Provinces</label>
  <input type="checkbox" id="provinceRestricted" name="provinceRestricted">
  <label for="provinceRestricted">Restrict to specific provinces</label>
</div>

<div class="form-group" id="provinceSelectionGroup" style="display:none;">
  <label for="allowedProvinces">Select Allowed Provinces</label>
  <select id="allowedProvinces" name="allowedProvinces" multiple class="form-control">
    <optgroup label="Indonesia">
      <option value="ID-AC">Aceh</option>
      <option value="ID-BA">Bali</option>
      <!-- ... all provinces ... -->
    </optgroup>
    <optgroup label="Mongolia">
      <option value="MN-073">Arkhangai</option>
      <!-- ... all provinces ... -->
    </optgroup>
  </select>
</div>
```

**Similar updates to:**
- `packages/cms/src/views/modals/DidYouKnowModal.ejs`
- `packages/cms/src/views/modals/QuizModal.ejs`
- `packages/cms/src/views/modals/VideoModal.ejs`
- `packages/cms/src/views/modals/AvatarMessageModal.ejs`
- `packages/cms/src/views/modals/SurveyModal.ejs`

#### 4. **Frontend JavaScript**

**`packages/cms/src/public/scripts/encyclopediaViewScript.js`**

Key improvements:
- Province restriction toggle shows/hides province selector
- Data sanitization: Removes empty strings and `"null"` from arrays
- Complete field submission on all operations (create, update, toggle)
- Enhanced validation with fallbacks (`|| ''`)
- Proper handling of `provinceRestricted` as boolean
- Proper handling of `allowedProvinces` as array or null

```javascript
// Province restriction toggle
$('#provinceRestricted').on('change', function() {
  if ($(this).is(':checked')) {
    $('#provinceSelectionGroup').show();
  } else {
    $('#provinceSelectionGroup').hide();
    $('#allowedProvinces').val([]);
  }
});

// Sanitize data before sending
let allowedProvinces = $('#allowedProvinces').val() || [];
if (Array.isArray(allowedProvinces)) {
  allowedProvinces = allowedProvinces.filter(p => p && p !== "null" && p.trim() !== '');
}

const data = {
  // ... other fields ...
  provinceRestricted: $('#provinceRestricted').is(':checked'),
  allowedProvinces: allowedProvinces.length > 0 ? allowedProvinces : null
};
```

**Similar updates to:**
- `packages/cms/src/public/scripts/subcategoryViewScript.js`
- `packages/cms/src/public/scripts/didYouKnowViewScript.js`
- `packages/cms/src/public/scripts/quizViewScript.js`
- `packages/cms/src/public/scripts/videosViewScript.js`
- `packages/cms/src/public/scripts/avatarMessagesViewScript.js`
- `packages/cms/src/public/scripts/surveyViewScript.js`
- `packages/cms/src/public/scripts/userViewScript.js`

### Mobile App (API Integration)

#### **`packages/api/src/interfaces/api/controllers/account/AccountController.ts`**

The signup endpoint now accepts and stores user's province:

```typescript
@Post('/sign_up')
async signUp(@Body() body: SignUpRequest, @Req() request: Request) {
  const { name, password, dateOfBirth, gender, location, country, province } = body;
  
  const user = await this.userService.create({
    // ... other fields ...
    province: province || null
  });
  
  return user;
}
```

User province is then used by mobile API endpoints to filter content appropriately.

---

## Build Instructions

### Prerequisites

- Docker Desktop installed and running
- Node.js 20+ (handled by Docker)
- Yarn package manager
- PostgreSQL 10+ (handled by Docker)

### Fresh Setup

1. **Clone and install dependencies:**

```bash
cd /path/to/periodtracker
yarn
cd app
yarn
cd ..
```

2. **Copy configuration files:**

```bash
yarn copy-config
```

3. **Set up submodules:**

```bash
yarn modules
```

4. **Build Docker images:**

```bash
docker-compose build base
docker-compose build
```

5. **Start Docker containers:**

```bash
docker-compose up -d
```

6. **Initialize the database:**

```bash
# Create schema
docker-compose exec postgres psql -U periodtracker -d periodtracker -c "CREATE SCHEMA IF NOT EXISTS periodtracker;"

# Create tables
docker-compose exec -T postgres psql -U periodtracker -d periodtracker < sql/create-tables.sql

# Run migrations (including province restrictions)
for file in sql/*.sql; do
  if [[ "$file" != "sql/create-tables.sql" && "$file" != "sql/initial-setup.sql" ]]; then
    echo "Running $file..."
    docker-compose exec -T postgres psql -U periodtracker -d periodtracker < "$file"
  fi
done

# Create admin user
docker-compose exec -T postgres psql -U periodtracker -d periodtracker -c "INSERT INTO periodtracker.\"user\" (id, username, password, lang, date_created, type) VALUES (-1, 'admin', '\$2b\$10\$cslKchhKRBsWG.dCsspbb.mkY9.opLl1t1Oxs3j2E01/Zm3llW/Rm', 'en', NOW(), 'superAdmin') ON CONFLICT (id) DO NOTHING;"
```

7. **Restart containers:**

```bash
docker-compose restart cms api
```

8. **Verify services are running:**

```bash
docker-compose ps
```

Expected output:
- ✅ CMS: `http://localhost:5000`
- ✅ API: `http://localhost:3000`
- ✅ Adminer: `http://localhost:8080`
- ✅ Postgres: Port 5432

### Updating Existing Installation

If you already have a running installation:

1. **Stop containers:**

```bash
docker-compose down
```

2. **Pull latest changes:**

```bash
git pull origin main
```

3. **Rebuild images:**

```bash
docker-compose build
```

4. **Start containers:**

```bash
docker-compose up -d
```

5. **Run new migrations:**

```bash
# Only run the province restriction migrations if not already applied
docker-compose exec -T postgres psql -U periodtracker -d periodtracker < sql/1740038351971-content-restriction.sql
docker-compose exec -T postgres psql -U periodtracker -d periodtracker < sql/1740221234567-province-content-restriction.sql
```

6. **Restart services:**

```bash
docker-compose restart cms api
```

---

## Testing Guide

### CMS Testing

#### 1. Login to CMS

- Navigate to: `http://localhost:5000`
- Default credentials:
  - Username: `admin`
  - Password: `admin`
- **IMPORTANT:** Create a new admin user with a strong password and delete the default admin user

#### 2. Test Article Creation with Province Restrictions

**Test Case 1: Create Unrestricted Article**

1. Navigate to `Encyclopedia` or `Subcategory` view
2. Click `Insert New Article`
3. Fill in required fields:
   - Article Heading
   - Article Text
   - Category/Subcategory
4. Leave `Restrict to Provinces` unchecked
5. Check `Live` checkbox
6. Click `Confirm`
7. ✅ **Expected:** Article appears in list, visible to all users

**Test Case 2: Create Province-Restricted Article**

1. Click `Insert New Article`
2. Fill in required fields
3. Check `Restrict to Provinces`
4. Select provinces from dropdown (e.g., "Aceh", "Bali" for Indonesia)
5. Check `Live` checkbox
6. Click `Confirm`
7. ✅ **Expected:** Article appears with province restriction indicator
8. Verify in database:
   ```sql
   SELECT id, article_heading, "provinceRestricted", "allowedProvinces" 
   FROM periodtracker.article 
   WHERE id = [article_id];
   ```

**Test Case 3: Edit Province Restrictions**

1. Click pencil icon on existing article
2. Toggle `Restrict to Provinces` on
3. Select different provinces
4. Click `Confirm`
5. ✅ **Expected:** Article updates successfully
6. Toggle `Restrict to Provinces` off
7. Click `Confirm`
8. ✅ **Expected:** Article becomes unrestricted

**Test Case 4: Toggle Live Status**

1. Find an article with province restrictions
2. Toggle the `Live` checkbox
3. ✅ **Expected:** No crash, status updates smoothly
4. Verify all fields remain intact (province restrictions preserved)

#### 3. Test Other Content Types

Repeat the above tests for:
- **Did You Know:** `http://localhost:5000/did-you-know`
- **Quizzes:** `http://localhost:5000/quiz`
- **Videos:** `http://localhost:5000/videos`
- **Avatar Messages:** `http://localhost:5000/avatar-messages`
- **Surveys:** `http://localhost:5000/survey`

#### 4. Test User Management

1. Navigate to: `http://localhost:5000/user-management`
2. Click `Add User`
3. Test creating users with:
   - ✅ Valid credentials
   - ❌ Duplicate username (should show error)
   - ❌ Missing fields (should show validation error)
4. Test editing users
5. Test deleting users

### Mobile App Testing

#### 1. Setup Mobile App

```bash
cd app
npx expo start
```

For faster testing, set in `app/.env`:
```env
EXPO_PUBLIC_FAST_SIGN_UP=true
```

#### 2. Test User Registration with Province

**Test Case 1: Register User with Province**

1. Open app (iOS/Android emulator or ExpoGo)
2. Complete signup flow
3. Select Country: "Indonesia"
4. Select Province: "Aceh"
5. Complete registration
6. ✅ **Expected:** User created successfully

**Test Case 2: Verify Province Filtering**

1. As user from "Aceh":
   - Navigate to Encyclopedia
   - ✅ Should see unrestricted articles
   - ✅ Should see articles restricted to "Aceh"
   - ❌ Should NOT see articles restricted to other provinces only

2. Create another test user from "Bali":
   - Navigate to Encyclopedia
   - ✅ Should see unrestricted articles
   - ✅ Should see articles restricted to "Bali"
   - ❌ Should NOT see articles restricted to "Aceh" only

**Test Case 3: Verify in Database**

```bash
# Check user's province
docker-compose exec -T postgres psql -U periodtracker -d periodtracker -c "SELECT id, country, province FROM periodtracker.oky_user ORDER BY date_signed_up DESC LIMIT 5;"

# Check what articles they should see
docker-compose exec -T postgres psql -U periodtracker -d periodtracker -c "SELECT id, article_heading, \"provinceRestricted\", \"allowedProvinces\" FROM periodtracker.article WHERE live = true AND (\"provinceRestricted\" = false OR 'ID-AC' = ANY(\"allowedProvinces\"));"
```

#### 3. Test API Endpoints Directly

**Get Articles (with province filtering):**

```bash
# Create a test user and get their token
USER_TOKEN="your-jwt-token-here"
USER_PROVINCE="ID-AC"

# Test articles endpoint
curl -H "Authorization: Bearer $USER_TOKEN" \
     "http://localhost:3000/api/v1/content/articles?lang=en"

# Check response - should only include:
# - Articles where provinceRestricted = false
# - Articles where allowedProvinces includes user's province
```

#### 4. Test Offline Functionality

**Test Case: Offline Content Access**

1. Ensure app has loaded content while online
2. Enable Airplane Mode on device
3. Navigate through app content
4. ✅ **Expected:** Previously loaded content accessible
5. Province filtering still applies to cached content
6. Disable Airplane Mode
7. App syncs with server
8. New content appears (if any)

### Troubleshooting Tests

#### Test Database Connection

```bash
docker-compose exec postgres psql -U periodtracker -d periodtracker -c "SELECT COUNT(*) FROM periodtracker.article;"
```

#### Test CMS Accessibility

```bash
curl http://localhost:5000
# Should return HTML content
```

#### Test API Health

```bash
curl http://localhost:3000/api/health
# Should return API status
```

#### Check Logs

```bash
# CMS logs
docker-compose logs cms --tail=50

# API logs
docker-compose logs api --tail=50

# All logs
docker-compose logs -f
```

#### Verify Province Columns Exist

```bash
docker-compose exec -T postgres psql -U periodtracker -d periodtracker -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'periodtracker' AND table_name = 'article' AND column_name IN ('provinceRestricted', 'allowedProvinces');"
```

Expected output:
```
    column_name     | data_type
--------------------+-----------
 provinceRestricted | boolean
 allowedProvinces   | ARRAY
```

---

## Usage Guide for Content Managers

### Creating Province-Restricted Content

1. **Access the CMS:** `http://localhost:5000`

2. **Navigate to content type:**
   - Encyclopedia Articles: `Encyclopedia` or `Subcategory` view
   - Did You Know: `Did You Know` menu
   - Quizzes: `Quiz` menu
   - Videos: `Videos` menu
   - Avatar Messages: `Avatar Messages` menu
   - Surveys: `Survey` menu

3. **Create or Edit Content:**
   - Click `Insert New [Content Type]` or edit existing content

4. **Set Province Restrictions:**
   - Check `Restrict to Provinces` checkbox
   - Multi-select from available provinces
   - Available countries: Indonesia, Mongolia
   - Leave unchecked for content visible to all users

5. **Set Content Live:**
   - Check `Live` checkbox to publish
   - Uncheck to save as draft

6. **Save:**
   - Click `Confirm` to save changes

### Understanding Province Codes

**Indonesia (ID):**
- ID-AC: Aceh
- ID-BA: Bali
- ID-BT: Banten
- ID-BE: Bengkulu
- ID-JT: Central Java
- ID-KT: Central Kalimantan
- ID-ST: Central Sulawesi
- ID-JI: East Java
- ID-KI: East Kalimantan
- ID-NT: East Nusa Tenggara
- ID-GO: Gorontalo
- ID-JK: Jakarta
- ID-JA: Jambi
- ID-LA: Lampung
- ID-MA: Maluku
- ID-KU: North Kalimantan
- ID-MU: North Maluku
- ID-SA: North Sulawesi
- ID-SU: North Sumatra
- ID-PA: Papua
- ID-RI: Riau
- ID-KR: Riau Islands
- ID-SG: Southeast Sulawesi
- ID-SN: South Kalimantan
- ID-SR: South Sulawesi
- ID-SS: South Sumatra
- ID-YO: Special Region of Yogyakarta
- ID-JB: West Java
- ID-KB: West Kalimantan
- ID-NB: West Nusa Tenggara
- ID-PB: West Papua
- ID-SR: West Sulawesi
- ID-SB: West Sumatra

**Mongolia (MN):**
- MN-073: Arkhangai
- MN-069: Bayankhongor
- MN-071: Bayan-Ölgii
- MN-067: Bulgan
- MN-037: Darkhan-Uul
- MN-061: Dornod
- MN-063: Dornogovi
- MN-059: Dundgovi
- MN-057: Zavkhan
- MN-065: Govi-Altai
- MN-064: Govisümber
- MN-039: Khentii
- MN-043: Khovd
- MN-041: Khövsgöl
- MN-053: Ömnögovi
- MN-035: Orkhon
- MN-055: Övörkhangai
- MN-049: Selenge
- MN-051: Sükhbaatar
- MN-047: Töv
- MN-046: Uvs
- MN-1: Ulaanbaatar

### Best Practices

1. **Test before publishing:**
   - Create content as draft (Live = unchecked)
   - Verify province selections
   - Mark as Live when ready

2. **Review regularly:**
   - Audit province-restricted content quarterly
   - Ensure restrictions still make sense
   - Update as needed

3. **Use thoughtfully:**
   - Only restrict when necessary
   - Consider privacy and access implications
   - Document reasons for restrictions

---

## API Documentation

### Mobile API Endpoints

All content endpoints support province filtering:

#### Articles

```
GET /api/v1/content/articles?lang=en
Authorization: Bearer <token>
```

Response includes only:
- Articles where `provinceRestricted = false` OR `provinceRestricted IS NULL`
- Articles where user's province is in `allowedProvinces` array

#### Did You Know

```
GET /api/v1/content/did-you-know?lang=en
Authorization: Bearer <token>
```

#### Quizzes

```
GET /api/v1/content/quizzes?lang=en
Authorization: Bearer <token>
```

#### Videos

```
GET /api/v1/content/videos?lang=en
Authorization: Bearer <token>
```

#### Avatar Messages

```
GET /api/v1/content/avatar-messages?lang=en
Authorization: Bearer <token>
```

#### Surveys

```
GET /api/v1/content/surveys?lang=en
Authorization: Bearer <token>
```

### User Registration

```
POST /api/v1/account/sign_up
Content-Type: application/json

{
  "name": "username",
  "password": "password",
  "dateOfBirth": "2000-01-01",
  "gender": "Female",
  "location": "City Name",
  "country": "Indonesia",
  "province": "ID-AC"
}
```

---

## Performance Considerations

### Database Indexes

Indexes are automatically created for optimal performance:

```sql
-- Boolean index for quick filtering
CREATE INDEX idx_article_province_restricted 
  ON periodtracker.article("provinceRestricted");

-- GIN index for array membership queries
CREATE INDEX idx_article_allowed_provinces 
  ON periodtracker.article USING GIN("allowedProvinces");
```

### Column Existence Caching

The API caches whether province columns exist to avoid redundant database queries:

```typescript
// Cached once per application lifetime
const provinceColumnsExist = await checkIfColumnsExist();
```

This ensures graceful degradation if running against an older database schema.

### Query Optimization

Province filtering uses efficient SQL:

```sql
WHERE (
  article."provinceRestricted" = false 
  OR article."provinceRestricted" IS NULL 
  OR $userProvince = ANY(article."allowedProvinces")
)
```

This leverages the GIN index on `allowedProvinces` for fast array membership checks.

---

## Common Issues & Solutions

### Issue: CMS crashes when toggling Live status

**Cause:** Frontend not sending all required fields

**Solution:** Ensure all content management scripts send complete data:
```javascript
const data = {
  // ... all original fields ...
  contentFilter: $('#contentFilter').val() || '',
  ageRestrictionLevel: $('#ageRestrictionLevel').val() || '',
  provinceRestricted: $('#provinceRestricted').is(':checked'),
  allowedProvinces: $('#allowedProvinces').val() || null
};
```

### Issue: Articles not appearing in mobile app

**Cause:** Articles not marked as Live, or user's province not in allowed list

**Solution:**
1. Verify article is Live in CMS
2. Check province restrictions match user's province
3. Verify in database:
   ```sql
   SELECT id, article_heading, live, "provinceRestricted", "allowedProvinces" 
   FROM periodtracker.article 
   WHERE id = [article_id];
   ```

### Issue: Database relation does not exist

**Cause:** Database not initialized or migrations not run

**Solution:** Follow database initialization steps in Build Instructions section

### Issue: User creation fails in mobile app

**Cause:** API validation error or database constraint violation

**Solution:**
1. Check API logs: `docker-compose logs api`
2. Verify user doesn't already exist
3. Ensure all required fields are provided
4. Check database constraints

### Issue: Province dropdown not showing

**Cause:** JavaScript error or modal not loading properly

**Solution:**
1. Check browser console for errors
2. Verify modal EJS template includes province selection HTML
3. Ensure JavaScript event handlers are properly attached
4. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

---

## Security Considerations

### Admin Account

**CRITICAL:** The default admin account (`admin`/`admin`) is **NOT SECURE**.

After initial setup:
1. Login with default credentials
2. Create new admin user with strong password
3. Logout
4. Login as new admin
5. Delete default admin account

### Content Visibility

Province restrictions are **enforced server-side**:
- Mobile API filters content before sending to app
- Client-side code cannot bypass restrictions
- Database queries include province filtering

### Data Privacy

User's province is stored in database:
- Used for content filtering only
- Not shared with other users
- Included in user data exports (GDPR compliance)

---

## Future Enhancements

Potential improvements to consider:

1. **Dynamic Province Management:**
   - CMS interface to add/remove provinces
   - Support for additional countries
   - Province hierarchy (regions, districts)

2. **Analytics:**
   - Track content views by province
   - Identify popular content per region
   - A/B testing by province

3. **Bulk Operations:**
   - Apply province restrictions to multiple items
   - Copy restrictions from one item to many
   - Import/export restrictions via CSV

4. **Advanced Filtering:**
   - Combine province with age restrictions
   - Time-based restrictions (publish/unpublish by date)
   - User group restrictions beyond province

5. **CMS Improvements:**
   - Visual indicator of restricted content in lists
   - Filter view by province restrictions
   - Search by province

---

## Developer Notes

### Code Organization

**Backend Controllers:**
- Common pattern: `save()`, `update()`, `remove()`, mobile API methods
- Error handling: Try-catch blocks with HTTP status codes
- Validation: Check required fields, sanitize input
- Response format: Consistent JSON structure

**Frontend Scripts:**
- Pattern: Modal show/hide, AJAX requests, validation
- Event handlers: Click, change, submit
- Data transformation: Form data → JSON
- Error display: User-friendly messages

**Database:**
- Migration-based schema changes
- Backwards compatible (nullable columns)
- Indexed for performance
- Documented with SQL comments

### Testing Checklist

Before deploying to production:

- [ ] Database migrations run successfully
- [ ] All content types tested (create, edit, delete, toggle)
- [ ] Province restrictions work correctly
- [ ] Mobile API returns filtered content
- [ ] User registration includes province
- [ ] CMS user management works
- [ ] No errors in logs
- [ ] Performance acceptable (query times < 100ms)
- [ ] Security audit passed
- [ ] Documentation updated

### Deployment Notes

**Docker:**
- Use Node.js 20 base image (see `Dockerfile`)
- Ensure all environment variables set
- Run migrations before starting services
- Health check endpoints configured

**Database:**
- Backup before migrations
- Run migrations in transaction
- Verify column existence before queries
- Monitor query performance

**Monitoring:**
- Log all errors with context
- Track API response times
- Alert on high error rates
- Monitor database connection pool

---

## Support & Maintenance

### Logs Location

- **CMS logs:** `docker-compose logs cms`
- **API logs:** `docker-compose logs api`
- **Database logs:** `docker-compose logs postgres`

### Backup & Restore

**Backup database:**
```bash
docker-compose exec postgres pg_dump -U periodtracker periodtracker > backup.sql
```

**Restore database:**
```bash
docker-compose exec -T postgres psql -U periodtracker periodtracker < backup.sql
```

### Useful Commands

**Reset database (DESTROYS DATA):**
```bash
docker-compose exec postgres psql -U periodtracker -d periodtracker -c "DROP SCHEMA periodtracker CASCADE;"
# Then re-run initialization steps
```

**Check running services:**
```bash
docker-compose ps
```

**Rebuild specific service:**
```bash
docker-compose build cms
docker-compose up -d cms
```

**Access database directly:**
```bash
docker-compose exec postgres psql -U periodtracker -d periodtracker
```

---

## Version History

### v1.0.0 (2026-01-20)

**Initial Release:**
- Province restriction support for all content types
- CMS interface for managing restrictions
- Mobile API filtering by province
- Database migrations
- Comprehensive error handling
- Performance optimizations (caching, indexing)
- Full documentation

**Files Changed:**
- 7 Entity files (Article, DidYouKnow, Quiz, Video, AvatarMessages, Survey, User)
- 7 Controller files (matching entities)
- 7 Modal EJS templates (matching entities)
- 7 Frontend JavaScript files (matching entities)
- 1 Main view (Encyclopedia.ejs)
- 2 Migration SQL files
- 1 Dockerfile (Node.js version update)

---

## Contact & Contributions

For questions, issues, or contributions:

1. **Check existing documentation** in this file
2. **Review logs** for error details
3. **Test in development** before deploying to production
4. **Submit issues** with reproduction steps
5. **Contribute fixes** via pull requests

---

*Last Updated: January 20, 2026*
