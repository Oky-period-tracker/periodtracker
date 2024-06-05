CREATE SEQUENCE periodtracker.video_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE video
ADD "sortingKey" integer DEFAULT nextval('periodtracker.video_sorting_key') NOT NULL;