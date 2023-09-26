CREATE TABLE "periodtracker"."video" (
    "id" uuid NOT NULL,
    "title" character varying NOT NULL,
    "youtubeId" character varying,
    "assetName" character varying,
    "live" boolean NOT NULL,
    "parent_category" character varying NOT NULL,
    "date_created" timestamp DEFAULT now() NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_periodtracker_video_id" PRIMARY KEY ("id")
) WITH (oids = false);

