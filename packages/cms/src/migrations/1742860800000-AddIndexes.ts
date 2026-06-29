import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexes1742860800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Article
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_article_lang ON article(lang)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_article_lang_live ON article(lang, live)`,
    )
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_article_category ON article(category)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_article_subcategory ON article(subcategory)`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_article_sorting ON article(lang, "sortingKey")`,
    )

    // Category
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_category_lang ON category(lang)`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_category_title ON category(title)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_category_sorting ON category(lang, "sortingKey")`,
    )

    // Subcategory
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_subcategory_lang ON subcategory(lang)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subcategory_parent ON subcategory(parent_category)`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subcategory_sorting ON subcategory(lang, "sortingKey")`,
    )

    // Quiz
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_quiz_lang ON quiz(lang)`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_quiz_lang_live ON quiz(lang, live)`)

    // DidYouKnow
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_did_you_know_lang ON did_you_know(lang)`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_did_you_know_lang_live ON did_you_know(lang, live)`,
    )

    // Survey
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_survey_lang ON survey(lang)`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_survey_lang_live ON survey(lang, live)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_survey_lang_live_date ON survey(lang, live, date_created)`,
    )

    // Question
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_question_survey_id ON question("surveyId")`,
    )

    // HelpCenter
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_help_center_lang ON help_center(lang)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_help_center_lang_active ON help_center(lang, "isActive")`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_help_center_sorting ON help_center(lang, "sortingKey")`,
    )

    // HelpCenterAttribute
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_help_center_attribute_lang ON help_center_attribute(lang)`,
    )

    // Video
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_video_lang ON video(lang)`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_video_lang_live ON video(lang, live)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_video_sorting ON video(lang, "sortingKey")`,
    )

    // Notification
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_notification_lang_status ON notification(lang, status)`,
    )

    // PermanentNotification
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_permanent_notification_lang_live ON permanent_notification(lang, live)`,
    )

    // About / T&C / Privacy
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_about_lang ON about(lang)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_terms_and_conditions_lang ON terms_and_conditions(lang)`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_privacy_policy_lang ON privacy_policy(lang)`,
    )

    // AvatarMessages
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang ON avatar_messages(lang)`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_avatar_messages_lang_live ON avatar_messages(lang, live)`,
    )

    // Suggestion
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_suggestion_lang ON suggestion(lang)`)

    // OkyUser
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_oky_user_gender ON oky_user(gender)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_oky_user_location ON oky_user(location)`,
    )
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_oky_user_country ON oky_user(country)`)
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_oky_user_lang ON oky_user(lang)`)

    // Analytics
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics(type)`)
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON analytics(type, date_created)`,
    )

    // AppEvent
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_app_event_type ON app_event(type)`)

    // AnsweredSurveys
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_answered_surveys_user_id ON answered_surveys(user_id)`,
    )

    // AnsweredQuizzes
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_answered_quizzes_id ON answered_quizzes(id)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_article_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_article_lang_live`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_article_category`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_article_subcategory`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_article_sorting`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_category_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_category_title`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_category_sorting`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_subcategory_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_subcategory_parent`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_subcategory_sorting`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_quiz_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_quiz_lang_live`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_did_you_know_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_did_you_know_lang_live`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_survey_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_survey_lang_live`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_survey_lang_live_date`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_question_survey_id`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_help_center_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_help_center_lang_active`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_help_center_sorting`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_help_center_attribute_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_video_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_video_lang_live`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_video_sorting`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_notification_lang_status`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_permanent_notification_lang_live`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_about_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_terms_and_conditions_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_privacy_policy_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_avatar_messages_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_avatar_messages_lang_live`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_suggestion_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_oky_user_gender`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_oky_user_location`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_oky_user_country`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_oky_user_lang`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_analytics_type`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_analytics_type_date`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_app_event_type`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_answered_surveys_user_id`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_answered_quizzes_id`)
  }
}
