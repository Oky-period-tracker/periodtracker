# Database Migration Guide: Fix Cycles Number Column

## Problem

The custom avatar update migration initially created a column named `"cyclesNumber"` (camelCase with quotes), but TypeORM expects `cycles_number` (snake_case without quotes). This mismatch causes 500 errors when updating period dates and cycles.

## Solution

Choose the appropriate migration path based on your database state:

### Option 1: Fresh Database Setup (Recommended for New Installations)

If you're setting up a new database from scratch:

1. Simply run the corrected migration:
   ```bash
   psql -U your_username -d your_database -f sql/custom-avatar-update.sql
   ```

The `custom-avatar-update.sql` file has been corrected to create the `cycles_number` column with the proper name.

### Option 2: Fix Existing Database (For Databases with Old Column)

If you already have a database with the incorrectly named `"cyclesNumber"` column:

1. **Backup your database first** (important!):
   ```bash
   pg_dump -U your_username -d your_database > backup_$(date +%Y%m%d).sql
   ```

2. Run the fix migration script:
   ```bash
   psql -U your_username -d your_database -f sql/fix-cycles-number-column.sql
   ```

This script will:
- Check if the old `"cyclesNumber"` column exists
- Rename it to `cycles_number` (preserving all data)
- If neither column exists, create `cycles_number`
- Set default values for existing users

### Option 3: Manual Fix via SQL Client

If you prefer to run commands manually:

```sql
-- Connect to your database
\c your_database

-- Rename the column (preserves data)
ALTER TABLE "periodtracker"."oky_user" 
RENAME COLUMN "cyclesNumber" TO cycles_number;

-- Verify the change
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'periodtracker' 
AND table_name = 'oky_user' 
AND column_name = 'cycles_number';

-- Set default values for any NULL entries
UPDATE "periodtracker"."oky_user" 
SET cycles_number = 0 
WHERE cycles_number IS NULL;
```

## Verification

After running the migration, verify that:

1. The column exists with the correct name:
   ```sql
   SELECT column_name, data_type, column_default 
   FROM information_schema.columns 
   WHERE table_schema = 'periodtracker' 
   AND table_name = 'oky_user' 
   AND column_name IN ('cyclesNumber', 'cycles_number');
   ```

   Expected output: One row showing `cycles_number` (not `cyclesNumber`)

2. Test the app functionality:
   - Log a period in the app
   - Verify no 500 errors occur
   - Check that cycles increment correctly
   - After 3 periods, verify the friend unlock modal appears

## Environment Variables

Ensure your API has the correct database connection string in your environment:

```bash
# Example .env file
DATABASE_URL=postgresql://username:password@localhost:5432/periodtracker
```

## Rollback (If Needed)

If you need to rollback the changes:

```sql
-- Rename back to old name (NOT RECOMMENDED)
ALTER TABLE "periodtracker"."oky_user" 
RENAME COLUMN cycles_number TO "cyclesNumber";
```

**Note:** Rolling back is not recommended. Instead, ensure the TypeORM entity matches your database schema.

## Questions or Issues?

If you encounter any issues during migration:

1. Check PostgreSQL logs for detailed error messages
2. Verify database connection credentials
3. Ensure you have necessary permissions (ALTER TABLE privileges)
4. Check that the `periodtracker` schema exists

## Related Files

- `sql/custom-avatar-update.sql` - Corrected migration for fresh installations
- `sql/fix-cycles-number-column.sql` - Fix script for existing databases
- `packages/api/src/domain/oky/OkyUser.ts` - TypeORM entity definition
