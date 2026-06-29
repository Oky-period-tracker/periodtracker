-- Article
CREATE INDEX IF NOT EXISTS idx_article_lang ON article(lang);
CREATE INDEX IF NOT EXISTS idx_article_lang_live ON article(lang, live);
CREATE INDEX IF NOT EXISTS idx_article_category ON article(category);
CREATE INDEX IF NOT EXISTS idx_article_subcategory ON article(subcategory);
CREATE INDEX IF NOT EXISTS idx_article_sorting ON article(lang, "sortingKey");

-- Category
CREATE INDEX IF NOT EXISTS idx_category_lang ON category(lang);
CREATE INDEX IF NOT EXISTS idx_category_title ON category(title);
CREATE INDEX IF NOT EXISTS idx_category_sorting ON category(lang, "sortingKey");

-- Subcategory
CREATE INDEX IF NOT EXISTS idx_subcategory_lang ON subcategory(lang);
CREATE INDEX IF NOT EXISTS idx_subcategory_parent ON subcategory(parent_category);
CREATE INDEX IF NOT EXISTS idx_subcategory_sorting ON subcategory(lang, "sortingKey");

-- Quiz
CREATE INDEX IF NOT EXISTS idx_quiz_lang ON quiz(lang);
CREATE INDEX IF NOT EXISTS idx_quiz_lang_live ON quiz(lang, live);

-- DidYouKnow
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang ON did_you_know(lang);
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang_live ON did_you_know(lang, live);

-- Survey
CREATE INDEX IF NOT EXISTS idx_survey_lang ON survey(lang);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live ON survey(lang, live);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live_date ON survey(lang, live, date_created);

-- Question
CREATE INDEX IF NOT EXISTS idx_question_survey_id ON question("surveyId");

-- HelpCenter
CREATE INDEX IF NOT EXISTS idx_help_center_lang ON help_center(lang);
CREATE INDEX IF NOT EXISTS idx_help_center_lang_active ON help_center(lang, "isActive");
CREATE INDEX IF NOT EXISTS idx_help_center_sorting ON help_center(lang, "sortingKey");

-- HelpCenterAttribute
CREATE INDEX IF NOT EXISTS idx_help_center_attribute_lang ON help_center_attribute(lang);

-- Video
CREATE INDEX IF NOT EXISTS idx_video_lang ON video(lang);
CREATE INDEX IF NOT EXISTS idx_video_lang_live ON video(lang, live);
CREATE INDEX IF NOT EXISTS idx_video_sorting ON video(lang, "sortingKey");

-- Notification
CREATE INDEX IF NOT EXISTS idx_notification_lang_status ON notification(lang, status);

-- PermanentNotification
CREATE INDEX IF NOT EXISTS idx_permanent_notification_lang_live ON permanent_notification(lang, live);

-- About / T&C / Privacy
CREATE INDEX IF NOT EXISTS idx_about_lang ON about(lang);
CREATE INDEX IF NOT EXISTS idx_terms_and_conditions_lang ON terms_and_conditions(lang);
CREATE INDEX IF NOT EXISTS idx_privacy_policy_lang ON privacy_policy(lang);

-- AvatarMessages
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang ON avatar_messages(lang);
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang_live ON avatar_messages(lang, live);

-- Suggestion
CREATE INDEX IF NOT EXISTS idx_suggestion_lang ON suggestion(lang);

-- OkyUser
CREATE INDEX IF NOT EXISTS idx_oky_user_gender ON oky_user(gender);
CREATE INDEX IF NOT EXISTS idx_oky_user_location ON oky_user(location);
CREATE INDEX IF NOT EXISTS idx_oky_user_country ON oky_user(country);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics(type);
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON analytics(type, date_created);

-- AppEvent
CREATE INDEX IF NOT EXISTS idx_app_event_type ON app_event(type);

-- AnsweredSurveys / AnsweredQuizzes
-- NOTE: answered_surveys and answered_quizzes are VIEWs over app_event.payload,
-- not tables, so they cannot be indexed directly. Index the underlying app_event
-- table instead (partial expression indexes matching the view definitions).
CREATE INDEX IF NOT EXISTS idx_app_event_answered_survey_user_id
  ON app_event ((payload ->> 'user_id')) WHERE type = 'ANSWER_SURVEY';

CREATE INDEX IF NOT EXISTS idx_app_event_answered_quiz_id
  ON app_event ((payload ->> 'id')) WHERE type = 'ANSWER_QUIZ';
