CREATE SEQUENCE periodtracker.about_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483646 START 1 CACHE 1;

CREATE TABLE "periodtracker"."about" (
    "id" integer DEFAULT nextval('periodtracker.about_id_seq') NOT NULL,
    "json_dump" character varying NOT NULL,
    "timestamp" timestamp NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.about_banner_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483646 START 1 CACHE 1;

CREATE TABLE "periodtracker"."about_banner" (
    "id" integer DEFAULT nextval('periodtracker.about_banner_id_seq') NOT NULL,
    "image" character varying NOT NULL,
    "timestamp" timestamp NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "about_banner_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.analytics_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "periodtracker"."analytics" (
    "id" integer DEFAULT nextval('periodtracker.analytics_id_seq') NOT NULL,
    "type" character varying NOT NULL,
    "payload" json NOT NULL,
    "metadata" json NOT NULL,
    "date_created" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_cc3f23b88a99dbd75748995bc44" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.app_event_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "periodtracker"."app_event" (
    "id" integer DEFAULT nextval('periodtracker.app_event_id_seq') NOT NULL,
    "local_id" uuid NOT NULL,
    "type" character varying NOT NULL,
    "payload" json NOT NULL,
    "metadata" json NOT NULL,
    "user_id" character varying,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_2107093522d011af5866f5c7b8b" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_b5ad7953934db4391d65a852736" UNIQUE ("local_id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."article" (
    "id" uuid NOT NULL,
    "category" character varying NOT NULL,
    "subcategory" character varying NOT NULL,
    "article_heading" character varying NOT NULL,
    "article_text" character varying NOT NULL,
    "date_created" timestamp DEFAULT now() NOT NULL,
    "live" boolean NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_8a87b738cfed36d3df1ae29f6f8" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."avatar_messages" (
    "id" uuid NOT NULL,
    "content" character varying NOT NULL,
    "live" boolean NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_caa28febed46e7e9cc603ba6336" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."category" (
    "id" uuid NOT NULL,
    "title" character varying NOT NULL,
    "primary_emoji" character varying NOT NULL,
    "primary_emoji_name" character varying NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_6ff10a6bb5bac58bf412a00dc8e" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."did_you_know" (
    "id" uuid NOT NULL,
    "title" character varying NOT NULL,
    "content" character varying NOT NULL,
    "isAgeRestricted" boolean DEFAULT false,
    "live" boolean NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_32deb816574cba45fcf50f4b364" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.help_center_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

CREATE TABLE "periodtracker"."help_center" (
    "id" integer DEFAULT nextval('periodtracker.help_center_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "caption" character varying NOT NULL,
    "contactOne" character varying NOT NULL,
    "contactTwo" character varying NOT NULL,
    "address" character varying NOT NULL,
    "website" character varying NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_b75170bf3fa752ce352ee24695e" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.notification_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "periodtracker"."notification" (
    "id" integer DEFAULT nextval('periodtracker.notification_id_seq') NOT NULL,
    "title" character varying NOT NULL,
    "content" character varying NOT NULL,
    "date_sent" character varying NOT NULL,
    "status" character varying NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_f8813f8c52a4bfe5ac252994970" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."oky_user" (
    "id" uuid NOT NULL,
    "date_of_birth" timestamp NOT NULL,
    "gender" character varying NOT NULL,
    "location" character varying NOT NULL,
    "country" character varying DEFAULT '00',
    "province" character varying DEFAULT '0',
    "store" json,
    "nameHash" character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    "memorableQuestion" character varying NOT NULL,
    "memorableAnswer" character varying NOT NULL,
    CONSTRAINT "PK_d6e1a97b8ab1251cdfa1e96cfae" PRIMARY KEY ("id")
) WITH (oids = false);


CREATE SEQUENCE periodtracker.permanent_notification_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1;

CREATE TABLE "periodtracker"."permanent_notification" (
    "id" integer DEFAULT nextval('periodtracker.permanent_notification_id_seq') NOT NULL,
    "message" character varying NOT NULL,
    "isPermanent" boolean NOT NULL,
    "live" boolean NOT NULL,
    "lang" character varying NOT NULL,
    "versions" character varying NOT NULL,
    CONSTRAINT "PK_fec922ab39cf369a3dc40fd75cc" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.privacy_policy_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483646 START 1 CACHE 1;

CREATE TABLE "periodtracker"."privacy_policy" (
    "id" integer DEFAULT nextval('periodtracker.privacy_policy_id_seq') NOT NULL,
    "json_dump" character varying NOT NULL,
    "timestamp" timestamp NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "privacy_policy_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."question" (
    "id" uuid NOT NULL,
    "question" character varying NOT NULL,
    "option1" character varying NOT NULL,
    "option2" character varying NOT NULL,
    "option3" character varying NOT NULL,
    "option4" character varying NOT NULL,
    "option5" character varying NOT NULL,
    "response" character varying NOT NULL,
    "is_multiple" boolean DEFAULT true,
    "next_question" json NOT NULL,
    "sort_number" character varying NOT NULL,
    "surveyId" uuid NOT NULL
) WITH (oids = false);

CREATE TABLE "periodtracker"."quiz" (
    "id" uuid NOT NULL,
    "topic" character varying NOT NULL,
    "question" character varying NOT NULL,
    "option1" character varying NOT NULL,
    "option2" character varying NOT NULL,
    "option3" character varying NOT NULL,
    "right_answer" character varying NOT NULL,
    "wrong_answer_response" character varying NOT NULL,
    "right_answer_response" character varying NOT NULL,
    "isAgeRestricted" boolean DEFAULT false,
    "live" boolean NOT NULL,
    "date_created" timestamp DEFAULT now() NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_d431cff50cfee5d1bf2b4a78bd4" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."subcategory" (
    "id" uuid NOT NULL,
    "title" character varying NOT NULL,
    "parent_category" character varying NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_35c7f127f3a4e0e26e2f46746ff" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."suggestion" (
    "id" uuid NOT NULL,
    "name" character varying NOT NULL,
    "dateRec" character varying NOT NULL,
    "organization" character varying NOT NULL,
    "platform" character varying NOT NULL,
    "reason" character varying NOT NULL,
    "email" character varying NOT NULL,
    "status" character varying NOT NULL,
    "content" character varying NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_753936e5595250a6f94ef15273a" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE TABLE "periodtracker"."survey" (
    "id" uuid NOT NULL,
    "question" character varying NOT NULL,
    "option1" character varying NOT NULL,
    "option2" character varying NOT NULL,
    "option3" character varying NOT NULL,
    "option4" character varying NOT NULL,
    "option5" character varying NOT NULL,
    "response" character varying NOT NULL,
    "live" boolean NOT NULL,
    "date_created" timestamp DEFAULT now() NOT NULL,
    "lang" character varying NOT NULL,
    "isAgeRestricted" boolean DEFAULT false,
    "is_multiple" boolean DEFAULT true,
    CONSTRAINT "PK_6b410aa92ebd6c5e429c8c7555f" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.terms_and_conditions_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483646 START 1 CACHE 1;

CREATE TABLE "periodtracker"."terms_and_conditions" (
    "id" integer DEFAULT nextval('periodtracker.terms_and_conditions_id_seq') NOT NULL,
    "json_dump" character varying NOT NULL,
    "timestamp" timestamp NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "terms_and_conditions_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE SEQUENCE periodtracker.user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;

CREATE TABLE "periodtracker"."user" (
    "id" integer DEFAULT nextval('periodtracker.user_id_seq') NOT NULL,
    "username" character varying NOT NULL,
    "password" character varying NOT NULL,
    "lang" character varying NOT NULL,
    "date_created" character varying DEFAULT 'now()' NOT NULL,
    "type" character varying NOT NULL,
    CONSTRAINT "PK_6cb7c14d28b65103f54c5b538f1" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE VIEW "periodtracker"."answered_quizzes" AS SELECT (periodtracker.app_event.payload ->> 'id'::text) AS id,
    (periodtracker.app_event.payload ->> 'question'::text) AS question,
    (periodtracker.app_event.payload ->> 'isCorrect'::text) AS iscorrect,
    (periodtracker.app_event.payload ->> 'answerID'::text) AS answerid,
    (periodtracker.app_event.payload ->> 'answer'::text) AS answer,
    (periodtracker.app_event.payload ->> 'utcDateTime'::text) AS date
   FROM periodtracker.app_event
  WHERE ((periodtracker.app_event.type)::text = 'ANSWER_QUIZ'::text);

CREATE OR REPLACE VIEW "periodtracker"."answered_surveys" AS SELECT (periodtracker.app_event.payload ->> 'id'::text) AS id,
    (periodtracker.app_event.payload ->> 'questions'::text) AS question,
    (periodtracker.app_event.payload ->> 'answerID'::text) AS answerid,
    (periodtracker.app_event.payload ->> 'answer'::text) AS answer,
    (periodtracker.app_event.payload ->> 'utcDateTime'::text) AS date,
    (periodtracker.app_event.payload ->> 'isCompleted'::text) AS iscompleted,
    (periodtracker.app_event.payload ->> 'isSurveyAnswered'::text) AS issurveyanswered,
    (periodtracker.app_event.payload ->> 'user_id'::text) AS user_id, -- Changed from 'userID' to 'user_id'
    (periodtracker.app_event.payload ->> 'questions'::text) AS questions
FROM periodtracker.app_event
WHERE ((periodtracker.app_event.type)::text = 'ANSWER_SURVEY'::text);

--------------------------------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------------------------------


-- Default existing users NULL
ALTER TABLE oky_user
ADD date_signed_up timestamp DEFAULT NULL,
ADD date_account_saved timestamp DEFAULT NULL;

-- Change default for new users to now
ALTER TABLE oky_user ALTER COLUMN date_account_saved SET DEFAULT now();


--------------------------------------------------------------------------------------------------------

ALTER TABLE "periodtracker"."video"
DROP COLUMN "parent_category";

--------------------------------------------------------------------------------------------------------

CREATE SEQUENCE periodtracker.category_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE category
ADD "sortingKey" integer DEFAULT nextval('periodtracker.category_sorting_key') NOT NULL;


-- 

CREATE SEQUENCE periodtracker.subcategory_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE subcategory
ADD "sortingKey" integer DEFAULT nextval('periodtracker.subcategory_sorting_key') NOT NULL;

-- 

CREATE SEQUENCE periodtracker.article_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE article
ADD "sortingKey" integer DEFAULT nextval('periodtracker.article_sorting_key') NOT NULL;

--------------------------------------------------------------------------------------------------------

CREATE SEQUENCE periodtracker.video_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE video
ADD "sortingKey" integer DEFAULT nextval('periodtracker.video_sorting_key') NOT NULL;

---

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


---

ALTER TABLE "periodtracker".article
ADD "voiceOverKey" text DEFAULT NULL;

ALTER TABLE "periodtracker".article
ADD "isAgeRestricted" boolean DEFAULT NULL,
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;

ALTER TABLE oky_user
ADD COLUMN metadata json DEFAULT '{}';

ALTER TABLE "periodtracker".quiz
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;

ALTER TABLE "periodtracker".survey
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;

ALTER TABLE "periodtracker"."did_you_know"
ADD "ageRestrictionLevel" integer DEFAULT NULL,
ADD "contentFilter" integer DEFAULT NULL;

ALTER TABLE "periodtracker"."user"
ADD COLUMN IF NOT EXISTS "sessionVersion" integer NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username ON "periodtracker"."user" (username);

--------------------------------------------------------------------------------------------------------

-- Content indexes, same as sql/1742860800000-add-indexes.sql

-- Article
CREATE INDEX IF NOT EXISTS idx_article_lang ON periodtracker.article (lang);
CREATE INDEX IF NOT EXISTS idx_article_lang_live ON periodtracker.article (lang, live);
CREATE INDEX IF NOT EXISTS idx_article_category ON periodtracker.article (category);
CREATE INDEX IF NOT EXISTS idx_article_subcategory ON periodtracker.article (subcategory);
CREATE INDEX IF NOT EXISTS idx_article_sorting ON periodtracker.article (lang, "sortingKey");

-- Category
CREATE INDEX IF NOT EXISTS idx_category_lang ON periodtracker.category (lang);
CREATE INDEX IF NOT EXISTS idx_category_title ON periodtracker.category (title);
CREATE INDEX IF NOT EXISTS idx_category_sorting ON periodtracker.category (lang, "sortingKey");

-- Subcategory
CREATE INDEX IF NOT EXISTS idx_subcategory_lang ON periodtracker.subcategory (lang);
CREATE INDEX IF NOT EXISTS idx_subcategory_parent ON periodtracker.subcategory (parent_category);
CREATE INDEX IF NOT EXISTS idx_subcategory_sorting ON periodtracker.subcategory (lang, "sortingKey");

-- Quiz
CREATE INDEX IF NOT EXISTS idx_quiz_lang ON periodtracker.quiz (lang);
CREATE INDEX IF NOT EXISTS idx_quiz_lang_live ON periodtracker.quiz (lang, live);

-- DidYouKnow
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang ON periodtracker.did_you_know (lang);
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang_live ON periodtracker.did_you_know (lang, live);

-- Survey
CREATE INDEX IF NOT EXISTS idx_survey_lang ON periodtracker.survey (lang);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live ON periodtracker.survey (lang, live);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live_date ON periodtracker.survey (lang, live, date_created);

-- Question
CREATE INDEX IF NOT EXISTS idx_question_survey_id ON periodtracker.question ("surveyId");

-- HelpCenter
CREATE INDEX IF NOT EXISTS idx_help_center_lang ON periodtracker.help_center (lang);
CREATE INDEX IF NOT EXISTS idx_help_center_lang_active ON periodtracker.help_center (lang, "isActive");
CREATE INDEX IF NOT EXISTS idx_help_center_sorting ON periodtracker.help_center (lang, "sortingKey");

-- HelpCenterAttribute
CREATE INDEX IF NOT EXISTS idx_help_center_attribute_lang ON periodtracker.help_center_attribute (lang);

-- Video
CREATE INDEX IF NOT EXISTS idx_video_lang ON periodtracker.video (lang);
CREATE INDEX IF NOT EXISTS idx_video_lang_live ON periodtracker.video (lang, live);
CREATE INDEX IF NOT EXISTS idx_video_sorting ON periodtracker.video (lang, "sortingKey");

-- Notification
CREATE INDEX IF NOT EXISTS idx_notification_lang_status ON periodtracker.notification (lang, status);

-- PermanentNotification
CREATE INDEX IF NOT EXISTS idx_permanent_notification_lang_live ON periodtracker.permanent_notification (lang, live);

-- About / T&C / Privacy
CREATE INDEX IF NOT EXISTS idx_about_lang ON periodtracker.about (lang);
CREATE INDEX IF NOT EXISTS idx_terms_and_conditions_lang ON periodtracker.terms_and_conditions (lang);
CREATE INDEX IF NOT EXISTS idx_privacy_policy_lang ON periodtracker.privacy_policy (lang);

-- AvatarMessages
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang ON periodtracker.avatar_messages (lang);
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang_live ON periodtracker.avatar_messages (lang, live);

-- Suggestion
CREATE INDEX IF NOT EXISTS idx_suggestion_lang ON periodtracker.suggestion (lang);

-- OkyUser
CREATE INDEX IF NOT EXISTS idx_oky_user_gender ON periodtracker.oky_user (gender);
CREATE INDEX IF NOT EXISTS idx_oky_user_location ON periodtracker.oky_user (location);
CREATE INDEX IF NOT EXISTS idx_oky_user_country ON periodtracker.oky_user (country);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_type ON periodtracker.analytics (type);
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON periodtracker.analytics (type, date_created);

-- AppEvent
CREATE INDEX IF NOT EXISTS idx_app_event_type ON periodtracker.app_event (type);

-- AnsweredSurveys / AnsweredQuizzes
-- NOTE: answered_surveys and answered_quizzes are VIEWs over app_event.payload,
-- not tables, so they cannot be indexed directly. Index the underlying app_event
-- table instead (partial expression indexes matching the view definitions).
CREATE INDEX IF NOT EXISTS idx_app_event_answered_survey_user_id
  ON periodtracker.app_event ((payload ->> 'user_id')) WHERE type = 'ANSWER_SURVEY';

CREATE INDEX IF NOT EXISTS idx_app_event_answered_quiz_id
  ON periodtracker.app_event ((payload ->> 'id')) WHERE type = 'ANSWER_QUIZ';
