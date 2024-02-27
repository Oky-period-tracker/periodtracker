ALTER TABLE oky_user
ADD gender text DEFAULT NULL,
ADD genderIdentity text DEFAULT NULL,
ADD isPwd text DEFAULT NULL,
ADD accommodationRequirement text DEFAULT NULL,
ADD religion text DEFAULT NULL,
ADD encyclopediaVersion text DEFAULT NULL,
ADD country text DEFAULT NULL,
ADD city text DEFAULT NULL,
ADD province text DEFAULT NULL,
ADD isProfileUpdateSkipped text DEFAULT NULL;

---

CREATE SEQUENCE periodtracker.article_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE article
ADD "isAgeRestricted" boolean DEFAULT false,
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0,
ADD "voiceOverUrl" text DEFAULT NULL,
ADD "voiceOverKey" text DEFAULT NULL,
ADD "sortingKey" integer DEFAULT nextval('periodtracker.article_sorting_key') NOT NULL;

---

ALTER TABLE category
ADD date_created timestamp DEFAULT now() NOT NULL;

ALTER TABLE did_you_know
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;

---

CREATE SEQUENCE periodtracker.help_center_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE help_center
ADD "providerName" text DEFAULT NULL, -- TODO: ?
ADD "websites" text DEFAULT NULL, -- TODO: ?
ADD "province" text DEFAULT NULL,
ADD "city" text DEFAULT NULL,
ADD "isAvailableNationwide" boolean DEFAULT true,
ADD "primaryAttributeId" integer DEFAULT 0, -- TODO: ?
ADD "otherAttributes" text DEFAULT NULL,
ADD "isActive" boolean DEFAULT false,
ADD "sortingKey" integer DEFAULT nextval('periodtracker.help_center_sorting_key') NOT NULL;

---

CREATE SEQUENCE periodtracker.help_center_attributes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

CREATE TABLE "periodtracker"."help_center_attributes" (
    "id" integer DEFAULT nextval('periodtracker.help_center_attributes_id_seq') NOT NULL,
    "attributeName" character varying NOT NULL,
    "description" character varying NOT NULL,
    "isActive" boolean DEFAULT false,
    CONSTRAINT "PK_help_center_attributes" PRIMARY KEY ("id")
) WITH (oids = false);

---

ALTER TABLE question
ALTER COLUMN next_question DROP NOT NULL;

ALTER TABLE quiz
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;

ALTER TABLE subcategory
ADD date_created timestamp DEFAULT now() NOT NULL;

ALTER TABLE survey
ADD "ageRestrictionLevel" integer DEFAULT 0,
ADD "contentFilter" integer DEFAULT 0;

