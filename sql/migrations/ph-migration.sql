-- PH ONLY

-- Migrate oky_user columns into metadata column
UPDATE oky_user
SET metadata = json_build_object(
    'genderIdentity', oky_user."genderIdentity",
    'accommodationRequirement', oky_user."accommodationRequirement",
    'religion', oky_user."religion",
    'city', oky_user."city",
    'contentSelection', CASE WHEN oky_user."encyclopediaVersion" = 'Yes' THEN 1 ELSE 0 END
)
WHERE metadata IS NULL OR metadata::text = '{}';

-- If successful, delete the columns:

-- WARNING, THIS WILL DELETE ALL DATA IN THESE COLUMNS
-- ALTER TABLE "User"
-- DROP COLUMN 'genderIdentity,
-- DROP COLUMN 'accommodationRequirement',
-- DROP COLUMN 'religion'
-- DROP COLUMN 'contentSelection';


-- TODO:PH Migrate UserHelpCenter table into oky_user.store ?
-- Data will be lost for users who use a new device with no redux data, but otherwise will retain the data from redux, and that will be saved into the db via appSaga