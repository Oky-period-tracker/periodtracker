ALTER TABLE did_you_know
ADD COLUMN "contentFilter" integer DEFAULT 0,
ADD COLUMN "ageRestrictionLevel" integer DEFAULT 0;

ALTER TABLE quiz
ADD COLUMN "contentFilter" integer DEFAULT 0,
ADD COLUMN "ageRestrictionLevel" integer DEFAULT 0;
