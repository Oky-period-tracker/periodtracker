-- Add avatar field to oky_user table
-- This field stores custom avatar configuration as JSON
-- For existing users, this field will be NULL

ALTER TABLE oky_user 
ADD COLUMN avatar JSON DEFAULT NULL;

-- Add comment to describe the avatar field structure
COMMENT ON COLUMN oky_user.avatar IS 'Custom avatar configuration with keys: body, hair, eyes, smile, clothing, devices (string, string array, or null), skinColor, hairColor, eyeColor (all string or null), customAvatarUnlocked (boolean, default false), name (string or null). Smile defaults to null until set by the client. Devices can be a single string (legacy) or an array of strings (new format supporting subcategories).';

-- Initialize customAvatarUnlocked to false for existing avatar JSON records
UPDATE oky_user
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
UPDATE oky_user
SET avatar = jsonb_build_object(
    'customAvatarUnlocked', false,
    'smile', NULL
)
WHERE avatar IS NULL;

-- Example of valid avatar JSON structure (legacy format with single device):
-- {
--   "body": "body-medium",
--   "hair": "01",
--   "eyes": "00",
--   "smile": "smile",
--   "clothing": "tshirt_blue",
--   "devices": "glasses",
--   "skinColor": "#FFDBAC",
--   "hairColor": "#000000",
--   "eyeColor": "#000000",
--   "customAvatarUnlocked": false,
--   "name": "Friend"
-- }
--
-- Example of valid avatar JSON structure (new format with multiple devices):
-- {
--   "body": "body-medium",
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
