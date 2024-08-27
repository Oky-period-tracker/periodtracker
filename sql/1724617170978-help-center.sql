CREATE SEQUENCE periodtracker.help_center_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE help_center
ADD "region" text DEFAULT NULL,
ADD "subRegion" text DEFAULT NULL,
ADD "isAvailableNationwide" boolean DEFAULT true,
ADD "primaryAttributeId" integer DEFAULT NULL,
ADD "otherAttributes" text DEFAULT NULL,
ADD "isActive" boolean DEFAULT false,
ADD "sortingKey" integer DEFAULT nextval('periodtracker.help_center_sorting_key') NOT NULL;

CREATE SEQUENCE periodtracker.help_center_attribute_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

CREATE TABLE "periodtracker"."help_center_attribute" (
    "id" integer DEFAULT nextval('periodtracker.help_center_attribute_id_seq') NOT NULL,
    "name" character varying NOT NULL,
    "emoji" character varying NOT NULL,
    "isActive" boolean DEFAULT true,
    "lang" character varying NOT NULL,
    CONSTRAINT "help_center_attribute_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

