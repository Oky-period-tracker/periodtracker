ALTER TABLE "periodtracker".article
ADD "isAgeRestricted" boolean DEFAULT NULL,
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;

ALTER TABLE "periodtracker".quiz
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;

ALTER TABLE "periodtracker".survey
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;

ALTER TABLE "periodtracker"."did_you_know"
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;