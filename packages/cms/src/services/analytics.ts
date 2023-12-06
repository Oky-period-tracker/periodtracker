import { env } from '../env'

export const analyticsQueries = {
  usersLocations: `
    SELECT 
      COUNT(CASE location WHEN 'Urban' then 1 else null end) as total_urban,
      COUNT(CASE location WHEN 'Rural' then 1 else null end) as total_rural
    FROM ${env.db.schema}.oky_user WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL) 
      AND (date_account_saved BETWEEN $3 AND $4)
    ;`,
  usersGender: `
    SELECT 
      COUNT(CASE gender WHEN 'Female' then 1 else null end) as total_female, 
      COUNT(CASE gender WHEN 'Male' then 1 else null end) as total_male,
      COUNT(CASE gender WHEN 'Other' then 1 else null end) as total_other
    FROM ${env.db.schema}.oky_user 
    WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      AND (date_account_saved BETWEEN $3 AND $4)
    ;`,
  usersAgeGroups: `
    SELECT SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) < 10 THEN 1 ELSE 0 END) AS under_10,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 10 AND 11 THEN 1 ELSE 0 END) AS between_10_11,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 12 AND 13 THEN 1 ELSE 0 END) AS between_12_13,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 14 AND 15 THEN 1 ELSE 0 END) AS between_14_15,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 16 AND 17 THEN 1 ELSE 0 END) AS between_16_17,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 18 AND 19 THEN 1 ELSE 0 END) AS between_18_19,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 20 AND 21 THEN 1 ELSE 0 END) AS between_20_21,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) > 22 THEN 1 ELSE 0 END) AS greater_than_22
    FROM ${env.db.schema}.oky_user 
    WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      AND (date_account_saved BETWEEN $3 AND $4)
    ;`,
  usersCountries: `
    SELECT
      country,
      COUNT(*) as value
    FROM ${env.db.schema}.oky_user 
      WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      AND (date_account_saved BETWEEN $3 AND $4)
    GROUP BY country
  ;`,
  usersProvince: `
    SELECT
      country,
      province,
      COUNT(*) as value
    FROM ${env.db.schema}.oky_user 
    WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      AND (date_account_saved BETWEEN $3 AND $4)
    GROUP BY province, country
  ;`,
  answeredQuizzesByID: `
    SELECT id,
      COUNT(*) as total_answers,
      COUNT(CASE isCorrect WHEN 'true' then 1 else null end) as total_correct, 
      COUNT(CASE isCorrect WHEN 'false' then 1 else null end) as total_incorrect,
      COUNT(CASE answerID WHEN '1' then 1 else null end) as total_option1,
      COUNT(CASE answerID WHEN '2' then 1 else null end) as total_option2,
      COUNT(CASE answerID WHEN '3' then 1 else null end) as total_option3
    FROM ${env.db.schema}.answered_quizzes
    GROUP BY id
    ;`,
  answeredSurveysByID: `
    SELECT answered_surveys.id,answered_surveys.questions, answered_surveys.user_id
    FROM ${env.db.schema}.answered_surveys
    left outer join ${env.db.schema}.oky_user 
    ON oky_user.id = answered_surveys.user_id::uuid 
    WHERE
      (oky_user.id = answered_surveys.user_id::uuid AND answered_surveys.isSurveyAnswered = 'true')
    GROUP BY answered_surveys.id, answered_surveys.questions, answered_surveys.user_id
  ;`,
  usersShares: `
    SELECT
      DATE_TRUNC('day', created_at) AS date,
      COUNT(*) as value
    FROM ${env.db.schema}.app_event
    WHERE type = 'SHARE_APP'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  ;`,
  directDownloads: `
    SELECT
      DATE_TRUNC('day', date_created) AS date,
      COUNT(*) as value
    FROM ${env.db.schema}.analytics
    WHERE type = 'DIRECT_DOWNLOAD'
    GROUP BY DATE_TRUNC('day', date_created)
    ORDER BY date
  ;`,
  filterSurvey: `
    SELECT answered_surveys.id,questions, location, date_of_birth, gender, country, answered_surveys.user_id,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) < 10 THEN 1 ELSE 0 END) AS under_10,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 10 AND 11 THEN 1 ELSE 0 END) AS between_10_11,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 12 AND 13 THEN 1 ELSE 0 END) AS between_12_13,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 14 AND 15 THEN 1 ELSE 0 END) AS between_14_15,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 16 AND 17 THEN 1 ELSE 0 END) AS between_16_17,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 18 AND 19 THEN 1 ELSE 0 END) AS between_18_19,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) BETWEEN 20 AND 21 THEN 1 ELSE 0 END) AS between_20_21,
      SUM(CASE WHEN (DATE_PART('year', now()::date) - DATE_PART('year', date_of_birth)) > 22 THEN 1 ELSE 0 END) AS greater_than_22,
      STRING_AGG(questions, ' ,')
    FROM ${env.db.schema}.answered_surveys
    full outer join ${env.db.schema}.oky_user 
      ON oky_user.id = answered_surveys.user_id::uuid 
    WHERE
      (oky_user.id = answered_surveys.user_id::uuid)
      AND (answered_surveys.isSurveyAnswered = 'true')
      AND (oky_user.gender = $1 OR $1 IS NULL) 
      AND (oky_user.location= $2 OR $2 IS NULL)
      AND ((DATE_PART('year', now()::date) - DATE_PART('year', oky_user.date_of_birth)) BETWEEN $3 AND $4 OR $3 IS NULL)
    GROUP BY answered_surveys.id, answered_surveys.user_id, answered_surveys.questions, oky_user.country, oky_user.location, oky_user.date_of_birth, oky_user.gender
  ;`,
  countTotalScreenViews: `
  SELECT COUNT(*)
  FROM app_event
  INNER JOIN oky_user ON app_event.user_id::uuid = oky_user.id
  WHERE app_event.type = 'SCREEN_VIEW'
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
    AND (app_event.metadata->>'date')::timestamp BETWEEN $3 AND $4
    AND app_event.payload->>'screenName' = $5
  ;`,
  countUniqueUserScreenViews: `
  SELECT COUNT(DISTINCT user_id)
  FROM app_event
  INNER JOIN oky_user ON app_event.user_id::uuid = oky_user.id
  WHERE type = 'SCREEN_VIEW'
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
    AND (metadata->>'date')::timestamp BETWEEN $3 AND $4
    AND payload->>'screenName' = $5
  ;`,
  countNonLoggedInEncyclopediaViews: `
  SELECT COUNT(*)
  FROM app_event
  WHERE type = 'SCREEN_VIEWED'
    AND user_id IS NULL
    AND payload->>'screenName' = 'Encyclopedia'
    AND (metadata->>'date')::timestamp BETWEEN $1 AND $2
  ;`,
  countUniqueDeviceNonLoggedInEncyclopediaViews: `
  SELECT COUNT(DISTINCT metadata->>'deviceId') 
  FROM app_event
  WHERE type = 'SCREEN_VIEWED'
    AND user_id IS NULL
    AND payload->>'screenName' = 'Encyclopedia'
    AND (metadata->>'date')::timestamp BETWEEN $1 AND $2
  ;`,
  countPredictionSettingsChanges: `
  SELECT 
    Count(*) AS total_changes, 
    Count(*) FILTER (WHERE (a.payload->>'isFuturePredictionActive')::boolean = true) AS switched_on, 
    Count(*) FILTER (WHERE (a.payload->>'isFuturePredictionActive')::boolean = false) AS switched_off,
    Count(DISTINCT a.user_id) AS total_unique_user_changes, 
    Count(DISTINCT a.user_id) FILTER (WHERE (a.payload->>'isFuturePredictionActive')::boolean = true) AS unique_user_switched_on, 
    Count(DISTINCT a.user_id) FILTER (WHERE (a.payload->>'isFuturePredictionActive')::boolean = false) AS unique_user_switched_off
  FROM app_event a
  INNER JOIN oky_user ON a.user_id::uuid = oky_user.id
  WHERE type = 'USER_SET_FUTURE_PREDICTION_STATE_ACTIVE'
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
    AND (metadata->>'date')::timestamp BETWEEN $3 AND $4
  ;`,
  // TODO:
  countCategoryViews: `
  SELECT 
    c.id AS category_id, 
    c.title AS category_name, 
    COUNT(DISTINCT a.user_id) AS unique_user_count,
    COUNT(*) FILTER (WHERE a.user_id IS NULL) AS anonymous_view_count,
    COUNT(DISTINCT a.metadata->>'deviceId') FILTER (WHERE a.metadata->>'deviceId' IS NOT NULL) AS unique_device_count
  FROM category c
  WHERE (metadata->>'date')::timestamp BETWEEN $1 AND $2
  LEFT JOIN 
    app_event a 
    ON a.type = 'CATEGORY_VIEWED' AND c.id = (a.payload->>'categoryId')::uuid
  GROUP BY 
    c.id, c.title
  ;`,
  countSubCategoryViews: `
  SELECT 
    s.id AS subcategory_id, 
    s.title AS subcategory_name, 
    COUNT(DISTINCT a.user_id) AS unique_user_count,
    COUNT(*) FILTER (WHERE a.user_id IS NULL) AS anonymous_view_count,
    COUNT(DISTINCT a.metadata->>'deviceId') FILTER (WHERE a.metadata->>'deviceId' IS NOT NULL) AS unique_device_count
  FROM 
    subcategory s
  WHERE (metadata->>'date')::timestamp BETWEEN $1 AND $2
  LEFT JOIN 
    app_event a 
    ON a.type = 'SUBCATEGORY_VIEWED' AND s.id = (a.payload->>'subCategoryId')::uuid
  GROUP BY 
    s.id, s.title
  ;`,
}
