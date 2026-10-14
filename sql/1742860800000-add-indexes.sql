-- Targets the default DATABASE_SCHEMA=periodtracker explicitly.
-- For a custom schema, replace the periodtracker qualifiers before running.

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
