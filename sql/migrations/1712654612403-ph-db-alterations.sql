ALTER TABLE oky_user
ADD city text DEFAULT NULL,
ADD isProfileUpdateSkipped text DEFAULT NULL;


ALTER TABLE article
ADD "isAgeRestricted" boolean DEFAULT false,
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0,
ADD "voiceOverUrl" text DEFAULT NULL,
ADD "voiceOverKey" text DEFAULT NULL,


ALTER TABLE category
ADD date_created timestamp DEFAULT now() NOT NULL;

ALTER TABLE did_you_know
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;


ALTER TABLE quiz
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;

ALTER TABLE subcategory
ADD date_created timestamp DEFAULT now() NOT NULL;

ALTER TABLE survey
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;

