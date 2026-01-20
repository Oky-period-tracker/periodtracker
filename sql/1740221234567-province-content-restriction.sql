-- Migration: Add province-based content restriction support
-- This migration adds provinceRestricted and allowedProvinces fields to all content tables
-- to enable province-based content localization

-- Add province restriction fields to article table
ALTER TABLE "periodtracker"."article"
ADD COLUMN "provinceRestricted" boolean DEFAULT false NOT NULL,
ADD COLUMN "allowedProvinces" text DEFAULT NULL;

COMMENT ON COLUMN "periodtracker"."article"."provinceRestricted" IS 'Toggle for province-based restriction. If false, content is global and visible to all users.';
COMMENT ON COLUMN "periodtracker"."article"."allowedProvinces" IS 'Comma-separated list of province codes that can access this content. Only applies when provinceRestricted is true.';

-- Add province restriction fields to video table
ALTER TABLE "periodtracker"."video"
ADD COLUMN "provinceRestricted" boolean DEFAULT false NOT NULL,
ADD COLUMN "allowedProvinces" text DEFAULT NULL;

COMMENT ON COLUMN "periodtracker"."video"."provinceRestricted" IS 'Toggle for province-based restriction. If false, content is global and visible to all users.';
COMMENT ON COLUMN "periodtracker"."video"."allowedProvinces" IS 'Comma-separated list of province codes that can access this content. Only applies when provinceRestricted is true.';

-- Add province restriction fields to quiz table
ALTER TABLE "periodtracker"."quiz"
ADD COLUMN "provinceRestricted" boolean DEFAULT false NOT NULL,
ADD COLUMN "allowedProvinces" text DEFAULT NULL;

COMMENT ON COLUMN "periodtracker"."quiz"."provinceRestricted" IS 'Toggle for province-based restriction. If false, content is global and visible to all users.';
COMMENT ON COLUMN "periodtracker"."quiz"."allowedProvinces" IS 'Comma-separated list of province codes that can access this content. Only applies when provinceRestricted is true.';

-- Add province restriction fields to survey table
ALTER TABLE "periodtracker"."survey"
ADD COLUMN "provinceRestricted" boolean DEFAULT false NOT NULL,
ADD COLUMN "allowedProvinces" text DEFAULT NULL;

COMMENT ON COLUMN "periodtracker"."survey"."provinceRestricted" IS 'Toggle for province-based restriction. If false, content is global and visible to all users.';
COMMENT ON COLUMN "periodtracker"."survey"."allowedProvinces" IS 'Comma-separated list of province codes that can access this content. Only applies when provinceRestricted is true.';

-- Add province restriction fields to did_you_know table
ALTER TABLE "periodtracker"."did_you_know"
ADD COLUMN "provinceRestricted" boolean DEFAULT false NOT NULL,
ADD COLUMN "allowedProvinces" text DEFAULT NULL;

COMMENT ON COLUMN "periodtracker"."did_you_know"."provinceRestricted" IS 'Toggle for province-based restriction. If false, content is global and visible to all users.';
COMMENT ON COLUMN "periodtracker"."did_you_know"."allowedProvinces" IS 'Comma-separated list of province codes that can access this content. Only applies when provinceRestricted is true.';

-- Add province restriction fields to help_center table
ALTER TABLE "periodtracker"."help_center"
ADD COLUMN "provinceRestricted" boolean DEFAULT false NOT NULL,
ADD COLUMN "allowedProvinces" text DEFAULT NULL;

COMMENT ON COLUMN "periodtracker"."help_center"."provinceRestricted" IS 'Toggle for province-based restriction. If false, content is global and visible to all users.';
COMMENT ON COLUMN "periodtracker"."help_center"."allowedProvinces" IS 'Comma-separated list of province codes that can access this content. Only applies when provinceRestricted is true.';

-- Add province restriction fields to avatar_messages table
ALTER TABLE "periodtracker"."avatar_messages"
ADD COLUMN "provinceRestricted" boolean DEFAULT false NOT NULL,
ADD COLUMN "allowedProvinces" text DEFAULT NULL;

COMMENT ON COLUMN "periodtracker"."avatar_messages"."provinceRestricted" IS 'Toggle for province-based restriction. If false, content is global and visible to all users.';
COMMENT ON COLUMN "periodtracker"."avatar_messages"."allowedProvinces" IS 'Comma-separated list of province codes that can access this content. Only applies when provinceRestricted is true.';

-- Create an index for efficient province filtering queries
CREATE INDEX idx_article_province_restricted ON "periodtracker"."article" ("provinceRestricted", "lang");
CREATE INDEX idx_video_province_restricted ON "periodtracker"."video" ("provinceRestricted", "lang");
CREATE INDEX idx_quiz_province_restricted ON "periodtracker"."quiz" ("provinceRestricted", "lang");
CREATE INDEX idx_survey_province_restricted ON "periodtracker"."survey" ("provinceRestricted", "lang");
CREATE INDEX idx_did_you_know_province_restricted ON "periodtracker"."did_you_know" ("provinceRestricted", "lang");
CREATE INDEX idx_help_center_province_restricted ON "periodtracker"."help_center" ("provinceRestricted", "lang");
CREATE INDEX idx_avatar_messages_province_restricted ON "periodtracker"."avatar_messages" ("provinceRestricted", "lang");
