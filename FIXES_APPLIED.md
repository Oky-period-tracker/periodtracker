# Fixes Applied for Avatar Unlock Error

## Date: February 10, 2026

## Summary

Fixed the 500 error that occurred when logging period days in the app. The error was caused by validation failures and database column name mismatches.

## Root Causes Identified

### 1. Database Column Name Mismatch
- **Problem**: Migration created column `"cyclesNumber"` (camelCase with quotes)  
- **Expected**: TypeORM entity expects `cycles_number` (snake_case)
- **Impact**: Database writes failed with 500 error

### 2. Incorrect Validation Decorator
- **Problem**: `UpdateMetadataRequest` used `@IsJSON()` decorator expecting a JSON string
- **Reality**: Frontend sends metadata as a plain JavaScript object
- **Impact**: class-validator rejected requests, causing 500 errors

### 3. UserMetadata Type Mismatch
- **Problem**: Backend defined `periodDates` as single object instead of array
- **Reality**: All code treats it as an array
- **Impact**: Type inconsistency between frontend and backend

## Changes Made

### Backend Files Modified

#### 1. `packages/api/src/interfaces/api/controllers/account/requests/UpdateMetadata.ts`
**Before:**
```typescript
@IsNotEmpty()
@IsJSON()
private readonly metadata: UserMetadata // Store as a JSON string
```

**After:**
```typescript
@IsNotEmpty()
public readonly metadata: UserMetadata
```

- Removed `@IsJSON()` decorator (validation now accepts objects)
- Made property public (removed getter method)
- Matches pattern used in `EditInfoRequest`

#### 2. `packages/api/src/domain/oky/OkyUser.ts`
**Before:**
```typescript
export interface UserMetadata {
  periodDates: {
    date: string
    mlGenerated: boolean
    userVerified: boolean
  }
  isProfileUpdateSkipped?: boolean
  accommodationRequirement?: string
}
```

**After:**
```typescript
export interface UserMetadata {
  periodDates?: {
    date: string
    mlGenerated: boolean
    userVerified: boolean | null
  }[]
  isProfileUpdateSkipped?: boolean
  accommodationRequirement?: string
  city?: string
}
```

- Changed `periodDates` from single object to optional array
- Added `| null` to `userVerified` type
- Added optional `city` property
- Made `periodDates` optional with `?`

#### 3. `packages/api/src/interfaces/api/controllers/account/AccountController.ts`
**Before:**
```typescript
const metadata = request.getMetadata()
```

**After:**
```typescript
const metadata = request.metadata
```

- Updated to use public property instead of getter method

### Frontend Files Modified

#### 4. `app/src/screens/MainScreen/index.tsx`
**Before:**
```typescript
const updateUserVerifiedDates = (changes: Partial<User>) => {
  httpClient.updateUserVerifiedDays({
    appToken,
    ...changes,
  })
}
```

**After:**
```typescript
const updateUserVerifiedDates = (changes: Partial<User>) => {
  return httpClient.updateUserVerifiedDays({
    appToken,
    ...changes,
  })
}
```

- Added `return` statement so `await` works properly
- Added error logging to catch block: `console.error('Error updating period dates:', error)`

#### 5. `app/src/screens/MainScreen/DayScrollContext.tsx`
**Before:**
```typescript
const userVerifiedEntry = currentUser.metadata.periodDates.find(...)
```

**After:**
```typescript
const userVerifiedEntry = currentUser.metadata.periodDates?.find(...)
```

- Added optional chaining for `periodDates` array

### SQL Migration Files

#### 6. `sql/custom-avatar-update.sql`
**Before:**
```sql
ADD COLUMN IF NOT EXISTS "cyclesNumber" integer DEFAULT 0;
```

**After:**
```sql
ADD COLUMN IF NOT EXISTS cycles_number integer DEFAULT 0;
```

- Changed column name from `"cyclesNumber"` to `cycles_number` (snake_case, no quotes)
- Matches TypeORM entity definition

#### 7. New File: `sql/fix-cycles-number-column.sql`
- Created migration script to rename existing `"cyclesNumber"` column to `cycles_number`
- Preserves existing data
- Handles case where column doesn't exist yet

#### 8. New File: `sql/MIGRATION_GUIDE.md`
- Comprehensive guide for applying database fixes
- Instructions for fresh installations vs existing databases
- Verification steps and rollback procedures

## Build Status

✅ **Backend Build**: Successful
```bash
cd packages/api && yarn build
# Exit code: 0
```

✅ **Linter**: No errors in modified backend files

## Testing Required

After applying the database migration, test the following:

1. **Log a Period Day**
   - Open the app
   - Navigate to the main screen or calendar
   - Click on a date
   - Select "Yes" to mark it as a period day
   - Verify no 500 errors appear in network tab
   - Verify date is saved successfully

2. **Cycles Number Increment**
   - Log enough period days to create a cycle
   - Verify `cyclesNumber` increments in the database
   - Check Redux state shows updated `cyclesNumber`

3. **Avatar Unlock Flow**
   - Log 3 separate periods (3 cycles)
   - After the 3rd cycle, verify friend unlock modal appears
   - Click "Create Friend" button
   - Verify navigation to custom avatar screen
   - Verify `customAvatarUnlocked` is set to `true`

4. **Lock Visual Updates**
   - Watch the 3 locks on the main screen
   - Verify Lock 1 unlocks after first cycle
   - Verify Lock 2 unlocks after second cycle
   - Verify Lock 3 unlocks after third cycle

## Database Migration Steps

### For Existing Databases:
```bash
# 1. Backup your database
pg_dump -U your_username -d your_database > backup_$(date +%Y%m%d).sql

# 2. Run the fix script
psql -U your_username -d your_database -f sql/fix-cycles-number-column.sql

# 3. Verify the column name
psql -U your_username -d your_database -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'oky_user' AND column_name IN ('cyclesNumber', 'cycles_number');"
```

### For Fresh Installations:
```bash
# Just run the corrected migration
psql -U your_username -d your_database -f sql/custom-avatar-update.sql
```

## Expected Behavior After Fix

✅ Users can log periods without errors  
✅ `cyclesNumber` increments correctly with each new cycle  
✅ Locks progressively unlock (1 → 2 → 3)  
✅ Friend unlock modal appears at 3 cycles  
✅ Avatar customization unlocks properly  
✅ No 500 errors in API calls  

## Files Modified (Summary)

**Backend:**
- `packages/api/src/interfaces/api/controllers/account/requests/UpdateMetadata.ts`
- `packages/api/src/domain/oky/OkyUser.ts`
- `packages/api/src/interfaces/api/controllers/account/AccountController.ts`

**Frontend:**
- `app/src/screens/MainScreen/index.tsx`
- `app/src/screens/MainScreen/DayScrollContext.tsx`

**SQL:**
- `sql/custom-avatar-update.sql` (corrected)
- `sql/fix-cycles-number-column.sql` (new)
- `sql/MIGRATION_GUIDE.md` (new)

## Notes

- The `cycleCalculator.ts` already had proper null safety checks for optional `periodDates`
- Some pre-existing TypeScript errors remain in test files, but these are unrelated to the fix
- The backend successfully compiles with these changes
