-- Targets the default DATABASE_SCHEMA=periodtracker explicitly.
-- For a custom schema, replace the periodtracker qualifiers before running.

-- CMS login looks an account up by username alone, so usernames must be unique.
-- This fails if duplicates already exist. List them with the query below, then
-- rename or delete the extra accounts in /user-management and run it again:
--   SELECT username, array_agg(id ORDER BY id) AS ids
--   FROM "periodtracker"."user" GROUP BY username HAVING COUNT(*) > 1;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username ON "periodtracker"."user" (username);
