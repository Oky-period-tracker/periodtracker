
-- Replace encyclopediaVersion with contentSelection
ALTER TABLE oky_user
ADD COLUMN "contentSelection" INT DEFAULT 0;

-- Updating the new column based on encyclopediaVersion values
UPDATE oky_user
SET "contentSelection" = CASE
    WHEN "encyclopediaVersion" = 'Yes' THEN 1
    WHEN "encyclopediaVersion" = 'No' THEN 2
    ELSE 0
END;