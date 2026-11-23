ALTER TABLE "periodtracker"."user"
ADD COLUMN IF NOT EXISTS "sessionVersion" integer NOT NULL DEFAULT 0;
