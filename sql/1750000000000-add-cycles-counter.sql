-- Add cycles counter to oky_user table
-- This migration adds a cyclesNumber column and initializes it to 0 for all users

-- Add cyclesNumber column to oky_user table with default value of 0
ALTER TABLE oky_user ADD COLUMN IF NOT EXISTS "cyclesNumber" integer DEFAULT 0;

-- Update existing users to set cyclesNumber to 0 (for users where it might be NULL)
UPDATE oky_user 
SET "cyclesNumber" = 0 
WHERE "cyclesNumber" IS NULL;
