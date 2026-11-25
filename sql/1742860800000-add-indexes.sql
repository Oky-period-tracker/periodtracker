-- Creates the indexes in the schema named by the psql variable "schema",
-- which should match DATABASE_SCHEMA. Without it, the default periodtracker is used:
--   psql -v ON_ERROR_STOP=1 -v schema=oky_en --single-transaction -f sql/1742860800000-add-indexes.sql
-- Uses psql meta-commands, so run it with psql. Safe to run again.
-- sql/initial-setup.sql creates the same indexes on a fresh database.

-- Default the variable to periodtracker. psql 10 (Compose, production) has no
-- :{?schema} test, but leaves an unset variable as the literal text ":schema".
\set schema :schema
SELECT CASE WHEN :'schema' = ':schema' THEN 'periodtracker' ELSE :'schema' END AS schema \gset

-- Article
CREATE INDEX IF NOT EXISTS idx_article_lang ON :"schema".article (lang);
CREATE INDEX IF NOT EXISTS idx_article_lang_live ON :"schema".article (lang, live);
CREATE INDEX IF NOT EXISTS idx_article_category ON :"schema".article (category);
CREATE INDEX IF NOT EXISTS idx_article_subcategory ON :"schema".article (subcategory);
CREATE INDEX IF NOT EXISTS idx_article_sorting ON :"schema".article (lang, "sortingKey");

-- Category
CREATE INDEX IF NOT EXISTS idx_category_lang ON :"schema".category (lang);
CREATE INDEX IF NOT EXISTS idx_category_title ON :"schema".category (title);
CREATE INDEX IF NOT EXISTS idx_category_sorting ON :"schema".category (lang, "sortingKey");

-- Subcategory
CREATE INDEX IF NOT EXISTS idx_subcategory_lang ON :"schema".subcategory (lang);
CREATE INDEX IF NOT EXISTS idx_subcategory_parent ON :"schema".subcategory (parent_category);
CREATE INDEX IF NOT EXISTS idx_subcategory_sorting ON :"schema".subcategory (lang, "sortingKey");

-- Quiz
CREATE INDEX IF NOT EXISTS idx_quiz_lang ON :"schema".quiz (lang);
CREATE INDEX IF NOT EXISTS idx_quiz_lang_live ON :"schema".quiz (lang, live);

-- DidYouKnow
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang ON :"schema".did_you_know (lang);
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang_live ON :"schema".did_you_know (lang, live);

-- Survey
CREATE INDEX IF NOT EXISTS idx_survey_lang ON :"schema".survey (lang);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live ON :"schema".survey (lang, live);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live_date ON :"schema".survey (lang, live, date_created);

-- Question
CREATE INDEX IF NOT EXISTS idx_question_survey_id ON :"schema".question ("surveyId");

-- HelpCenter
CREATE INDEX IF NOT EXISTS idx_help_center_lang ON :"schema".help_center (lang);
CREATE INDEX IF NOT EXISTS idx_help_center_lang_active ON :"schema".help_center (lang, "isActive");
CREATE INDEX IF NOT EXISTS idx_help_center_sorting ON :"schema".help_center (lang, "sortingKey");

-- HelpCenterAttribute
CREATE INDEX IF NOT EXISTS idx_help_center_attribute_lang ON :"schema".help_center_attribute (lang);

-- Video
CREATE INDEX IF NOT EXISTS idx_video_lang ON :"schema".video (lang);
CREATE INDEX IF NOT EXISTS idx_video_lang_live ON :"schema".video (lang, live);
CREATE INDEX IF NOT EXISTS idx_video_sorting ON :"schema".video (lang, "sortingKey");

-- Notification
CREATE INDEX IF NOT EXISTS idx_notification_lang_status ON :"schema".notification (lang, status);

-- PermanentNotification
CREATE INDEX IF NOT EXISTS idx_permanent_notification_lang_live ON :"schema".permanent_notification (lang, live);

-- About / T&C / Privacy
CREATE INDEX IF NOT EXISTS idx_about_lang ON :"schema".about (lang);
CREATE INDEX IF NOT EXISTS idx_terms_and_conditions_lang ON :"schema".terms_and_conditions (lang);
CREATE INDEX IF NOT EXISTS idx_privacy_policy_lang ON :"schema".privacy_policy (lang);

-- AvatarMessages
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang ON :"schema".avatar_messages (lang);
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang_live ON :"schema".avatar_messages (lang, live);

-- Suggestion
CREATE INDEX IF NOT EXISTS idx_suggestion_lang ON :"schema".suggestion (lang);

-- OkyUser
CREATE INDEX IF NOT EXISTS idx_oky_user_gender ON :"schema".oky_user (gender);
CREATE INDEX IF NOT EXISTS idx_oky_user_location ON :"schema".oky_user (location);
CREATE INDEX IF NOT EXISTS idx_oky_user_country ON :"schema".oky_user (country);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_type ON :"schema".analytics (type);
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON :"schema".analytics (type, date_created);

-- AppEvent
CREATE INDEX IF NOT EXISTS idx_app_event_type ON :"schema".app_event (type);

-- AnsweredSurveys / AnsweredQuizzes
-- NOTE: answered_surveys and answered_quizzes are VIEWs over app_event.payload,
-- not tables, so they cannot be indexed directly. Index the underlying app_event
-- table instead (partial expression indexes matching the view definitions).
CREATE INDEX IF NOT EXISTS idx_app_event_answered_survey_user_id
  ON :"schema".app_event ((payload ->> 'user_id')) WHERE type = 'ANSWER_SURVEY';

CREATE INDEX IF NOT EXISTS idx_app_event_answered_quiz_id
  ON :"schema".app_event ((payload ->> 'id')) WHERE type = 'ANSWER_QUIZ';
