CREATE SEQUENCE periodtracker.help_center_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE help_center
ADD "location" text DEFAULT NULL,
ADD "place" text DEFAULT NULL,
ADD "isAvailableNationwide" boolean DEFAULT true,
ADD "primaryAttributeId" integer DEFAULT NULL,
ADD "otherAttributes" text DEFAULT NULL,
ADD "isActive" boolean DEFAULT false,
ADD "sortingKey" integer DEFAULT nextval('periodtracker.help_center_sorting_key') NOT NULL;

CREATE SEQUENCE periodtracker.help_center_attributes_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

CREATE TABLE "periodtracker"."help_center_attributes" (
    "id" integer DEFAULT nextval('periodtracker.help_center_attributes_id_seq') NOT NULL,
    "attributeName" character varying NOT NULL,
    "description" character varying NOT NULL,
    "isActive" boolean DEFAULT false,
    CONSTRAINT "PK_help_center_attributes" PRIMARY KEY ("id")
) WITH (oids = false);


