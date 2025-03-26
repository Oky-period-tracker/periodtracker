ALTER TABLE "periodtracker".article
ADD "isAgeRestricted" boolean DEFAULT NULL,
ADD "ageRestrictionLevel" integer DEFAULT 0 NOT NULL,
ADD "contentFilter" integer DEFAULT 0 NOT NULL;

ALTER TABLE "periodtracker".quiz
ADD "ageRestrictionLevel" integer DEFAULT 0 NOT NULL,
ADD "contentFilter" integer DEFAULT 0 NOT NULL;

ALTER TABLE "periodtracker".survey
ADD "ageRestrictionLevel" integer DEFAULT 0 NOT NULL,
ADD "contentFilter" integer DEFAULT 0 NOT NULL;

ALTER TABLE "periodtracker"."did_you_know"
ADD "ageRestrictionLevel" integer DEFAULT 0 NOT NULL,
ADD "contentFilter" integer DEFAULT 0 NOT NULL;