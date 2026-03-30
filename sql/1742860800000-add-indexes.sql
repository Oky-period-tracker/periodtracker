-- =====================================================================
-- Database Index Migration for CMS Query Optimization
-- Run this migration against the database to add missing indexes
-- =====================================================================

-- ======================== Article Indexes ============================
-- Used by: mobileArticlesByLanguage, all(), DataController queries
-- Covers: WHERE lang = $1 AND live = true ORDER BY sortingKey
CREATE INDEX IF NOT EXISTS idx_article_lang ON article(lang);
CREATE INDEX IF NOT EXISTS idx_article_lang_live ON article(lang, live);
CREATE INDEX IF NOT EXISTS idx_article_category ON article(category);
CREATE INDEX IF NOT EXISTS idx_article_subcategory ON article(subcategory);
CREATE INDEX IF NOT EXISTS idx_article_sorting ON article(lang, "sortingKey");

-- ======================== Category Indexes ===========================
-- Used by: all(), save() duplicate check, reorderRows
CREATE INDEX IF NOT EXISTS idx_category_lang ON category(lang);
CREATE INDEX IF NOT EXISTS idx_category_title ON category(title);
CREATE INDEX IF NOT EXISTS idx_category_sorting ON category(lang, "sortingKey");

-- ======================== Subcategory Indexes ========================
-- Used by: cascade delete (parent_category), reorderRows
CREATE INDEX IF NOT EXISTS idx_subcategory_lang ON subcategory(lang);
CREATE INDEX IF NOT EXISTS idx_subcategory_parent ON subcategory(parent_category);
CREATE INDEX IF NOT EXISTS idx_subcategory_sorting ON subcategory(lang, "sortingKey");

-- ======================== Quiz Indexes ================================
-- Used by: mobileQuizzesByLanguage, all(), DataController
CREATE INDEX IF NOT EXISTS idx_quiz_lang ON quiz(lang);
CREATE INDEX IF NOT EXISTS idx_quiz_lang_live ON quiz(lang, live);

-- ======================== DidYouKnow Indexes =========================
-- Used by: mobileDidYouKnowByLanguage, all(), DataController
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang ON did_you_know(lang);
CREATE INDEX IF NOT EXISTS idx_did_you_know_lang_live ON did_you_know(lang, live);

-- ======================== Survey Indexes ==============================
-- Used by: newMobileSurveysByLanguage (complex WHERE with lang, live, date range)
CREATE INDEX IF NOT EXISTS idx_survey_lang ON survey(lang);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live ON survey(lang, live);
CREATE INDEX IF NOT EXISTS idx_survey_lang_live_date ON survey(lang, live, date_created);

-- ======================== Question Indexes ============================
-- Used by: leftJoinAndMapMany on surveyId, cascade delete
CREATE INDEX IF NOT EXISTS idx_question_survey_id ON question("surveyId");

-- ======================== HelpCenter Indexes =========================
-- Used by: mobileHelpCenterByLanguage, all()
CREATE INDEX IF NOT EXISTS idx_help_center_lang ON help_center(lang);
CREATE INDEX IF NOT EXISTS idx_help_center_lang_active ON help_center(lang, "isActive");
CREATE INDEX IF NOT EXISTS idx_help_center_sorting ON help_center(lang, "sortingKey");

-- ======================== HelpCenterAttribute Indexes ================
CREATE INDEX IF NOT EXISTS idx_help_center_attribute_lang ON help_center_attribute(lang);

-- ======================== Video Indexes ===============================
-- Used by: all(), allLive()
CREATE INDEX IF NOT EXISTS idx_video_lang ON video(lang);
CREATE INDEX IF NOT EXISTS idx_video_lang_live ON video(lang, live);
CREATE INDEX IF NOT EXISTS idx_video_sorting ON video(lang, "sortingKey");

-- ======================== Notification Indexes ========================
-- Used by: mobileNotificationsByLanguage
CREATE INDEX IF NOT EXISTS idx_notification_lang_status ON notification(lang, status);

-- ======================== PermanentNotification Indexes ===============
-- Used by: mobilePermanentNotifications (WHERE live = TRUE AND lang = $2)
CREATE INDEX IF NOT EXISTS idx_permanent_notification_lang_live ON permanent_notification(lang, live);

-- ======================== About / T&C / Privacy Indexes ==============
-- Used by: mobileAboutByLanguage, etc. (find WHERE lang = $1)
CREATE INDEX IF NOT EXISTS idx_about_lang ON about(lang);
CREATE INDEX IF NOT EXISTS idx_terms_and_conditions_lang ON terms_and_conditions(lang);
CREATE INDEX IF NOT EXISTS idx_privacy_policy_lang ON privacy_policy(lang);

-- ======================== AvatarMessages Indexes =====================
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang ON avatar_messages(lang);
CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang_live ON avatar_messages(lang, live);

-- ======================== Suggestion Indexes =========================
CREATE INDEX IF NOT EXISTS idx_suggestion_lang ON suggestion(lang);

-- ======================== OkyUser Indexes ============================
-- Used by: analytics queries, survey age calculations
CREATE INDEX IF NOT EXISTS idx_oky_user_gender ON oky_user(gender);
CREATE INDEX IF NOT EXISTS idx_oky_user_location ON oky_user(location);
CREATE INDEX IF NOT EXISTS idx_oky_user_country ON oky_user(country);
CREATE INDEX IF NOT EXISTS idx_oky_user_lang ON oky_user(lang);

-- ======================== Analytics Indexes ===========================
-- Used by: directDownloads query
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics(type);
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON analytics(type, date_created);

-- ======================== AppEvent Indexes ============================
-- Used by: usersShares query
CREATE INDEX IF NOT EXISTS idx_app_event_type ON app_event(type);

-- ======================== AnsweredSurveys Indexes ====================
-- Used by: newMobileSurveysByLanguage (subquery WHERE user_id = $1)
CREATE INDEX IF NOT EXISTS idx_answered_surveys_user_id ON answered_surveys(user_id);

-- ======================== AnsweredQuizzes Indexes =====================
-- Used by: answeredQuizzesByID (GROUP BY id)
CREATE INDEX IF NOT EXISTS idx_answered_quizzes_id ON answered_quizzes(id);
