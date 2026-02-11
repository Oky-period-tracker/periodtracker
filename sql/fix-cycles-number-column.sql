-- Fix cyclesNumber Column Name Migration
-- This migration fixes the column name mismatch between the database and TypeORM
-- It renames the incorrectly named "cyclesNumber" column to cycles_number
--
-- IMPORTANT: Only run this if you already have a "cyclesNumber" column from the old migration.
-- If you're setting up a fresh database, just run custom-avatar-update.sql instead.

-- ============================================
-- Check if old column exists and rename it
-- ============================================

-- Step 1: Check if the old camelCase column exists and rename it
-- This will preserve existing data
DO $$ 
BEGIN
    -- Check if the old "cyclesNumber" column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'periodtracker' 
        AND table_name = 'oky_user' 
        AND column_name = 'cyclesNumber'
    ) THEN
        -- Rename the old column to the correct snake_case name
        ALTER TABLE "periodtracker"."oky_user" 
        RENAME COLUMN "cyclesNumber" TO cycles_number;
        
        RAISE NOTICE 'Successfully renamed "cyclesNumber" column to cycles_number';
    ELSE
        RAISE NOTICE 'Column "cyclesNumber" does not exist, no action needed';
    END IF;
    
    -- Ensure the column exists with correct name (in case neither exists)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'periodtracker' 
        AND table_name = 'oky_user' 
        AND column_name = 'cycles_number'
    ) THEN
        -- Create the column if it doesn't exist
        ALTER TABLE "periodtracker"."oky_user" 
        ADD COLUMN cycles_number integer DEFAULT 0;
        
        RAISE NOTICE 'Created cycles_number column';
    END IF;
END $$;

-- Step 2: Ensure all existing users have a default value
UPDATE "periodtracker"."oky_user" 
SET cycles_number = 0 
WHERE cycles_number IS NULL;

-- ============================================
-- Verification Query (Optional)
-- ============================================
-- Run this to verify the column exists with the correct name:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_schema = 'periodtracker' 
-- AND table_name = 'oky_user' 
-- AND column_name IN ('cyclesNumber', 'cycles_number');
