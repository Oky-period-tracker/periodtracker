ALTER TABLE "periodtracker".oky_user
ADD city text DEFAULT NULL,
ADD isProfileUpdateSkipped text DEFAULT NULL;


ALTER TABLE "periodtracker".article
ADD "isAgeRestricted" boolean DEFAULT false,
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0,
ADD "voiceOverUrl" text DEFAULT NULL,
ADD "voiceOverKey" text DEFAULT NULL,


ALTER TABLE "periodtracker".category
ADD date_created timestamp DEFAULT now() NOT NULL;

ALTER TABLE "periodtracker".did_you_know
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;


ALTER TABLE "periodtracker".quiz
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;

ALTER TABLE "periodtracker".subcategory
ADD date_created timestamp DEFAULT now() NOT NULL;

ALTER TABLE "periodtracker".survey
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;

