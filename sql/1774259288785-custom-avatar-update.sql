-- Custom Avatar Update Migration
-- This migration adds support for custom avatars and cycle counting
-- It adds two columns to the oky_user table:
--   1. cyclesNumber: integer counter for tracking user cycles
--   2. avatar: JSON field for storing custom avatar configuration

-- ============================================
-- Add cyclesNumber column to oky_user table
-- ============================================
-- Add cyclesNumber column with default value of 0
ALTER TABLE "periodtracker"."oky_user" 
ADD COLUMN IF NOT EXISTS "cyclesNumber" integer DEFAULT 0;

-- Update existing users to set cyclesNumber to 0 (for users where it might be NULL)
UPDATE "periodtracker"."oky_user" 
SET "cyclesNumber" = 0 
WHERE "cyclesNumber" IS NULL;

-- ============================================
-- Add avatar JSON field to oky_user table
-- ============================================
-- Add avatar column for storing custom avatar configuration
ALTER TABLE "periodtracker"."oky_user" 
ADD COLUMN IF NOT EXISTS avatar JSON DEFAULT NULL;

-- Add comment to describe the avatar field structure
COMMENT ON COLUMN "periodtracker"."oky_user".avatar IS 'Custom avatar configuration with keys: body, hair, eyes, smile, clothing (all string or null), devices (string array or null), skinColor, hairColor, eyeColor (all string or null), customAvatarUnlocked (boolean, default false), name (string or null). Smile defaults to null until set by the client.';

-- Initialize customAvatarUnlocked to false for existing avatar JSON records
UPDATE "periodtracker"."oky_user"
SET avatar = jsonb_set(
    jsonb_set(
        COALESCE(avatar::jsonb, '{}'::jsonb),
        '{customAvatarUnlocked}',
        'false'::jsonb,
        true
    ),
    '{smile}',
    'null'::jsonb,
    true
)
WHERE avatar IS NOT NULL;

-- For users without avatar JSON, set default structure with customAvatarUnlocked = false
UPDATE "periodtracker"."oky_user"
SET avatar = jsonb_build_object(
    'customAvatarUnlocked', false,
    'smile', NULL
)
WHERE avatar IS NULL;

-- ============================================
-- Example Avatar JSON Structures
-- ============================================
-- Example with devices:
-- {
--   "body": "medium",
--   "hair": "01",
--   "eyes": "00",
--   "smile": "smile",
--   "clothing": "tshirt_blue",
--   "devices": ["glasses", "necklace1", "purse"],
--   "skinColor": "#FFDBAC",
--   "hairColor": "#000000",
--   "eyeColor": "#000000",
--   "customAvatarUnlocked": false,
--   "name": "Friend"
-- }
--
-- Example without devices:
-- {
--   "body": "medium",
--   "hair": "01",
--   "eyes": "00",
--   "smile": "smile",
--   "clothing": "tshirt_blue",
--   "devices": null,
--   "skinColor": "#FFDBAC",
--   "hairColor": "#000000",
--   "eyeColor": "#000000",
--   "customAvatarUnlocked": false,
--   "name": "Friend"
-- }
