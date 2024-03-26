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