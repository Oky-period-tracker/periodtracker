import { env } from '../env'

/* 
  Re: 
  TRIM(BOTH ' ' FROM column_name::text)::uuid
  This pattern is used because some uuid columns have white space on the end, causing type errors
  A better fix is to ensure that uuid columns never have white space, and to update prod databases, trimming all the existing ids with whitespace
*/

const schema = env.db.schema

const partials = {
  and_event_date: `
    AND (app_event.metadata->>'date')::timestamp 
      BETWEEN COALESCE($3, '1970-01-01'::timestamp) AND COALESCE($4, '9999-12-31'::timestamp)`,
  and_date_account_saved: `
  AND (
    ($3::timestamp IS NULL AND $4::timestamp IS NULL)
    OR (date_account_saved::timestamp BETWEEN COALESCE($3::timestamp, '1970-01-01'::timestamp) AND COALESCE($4::timestamp, '9999-12-31'::timestamp))
  )`,
}

export const analyticsQueries = {
  usersLocations: `
    SELECT 
      COUNT(CASE location WHEN 'Urban' then 1 else null end) as total_urban,
      COUNT(CASE location WHEN 'Rural' then 1 else null end) as total_rural
    FROM ${schema}.oky_user WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL) 
      ${partials.and_date_account_saved}
    ;`,
  usersGender: `
    SELECT 
      COUNT(CASE gender WHEN 'Female' then 1 else null end) as total_female, 
      COUNT(CASE gender WHEN 'Male' then 1 else null end) as total_male,
      COUNT(CASE gender WHEN 'Other' then 1 else null end) as total_other
    FROM ${schema}.oky_user 
    WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      ${partials.and_date_account_saved}
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
    FROM ${schema}.oky_user 
    WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      ${partials.and_date_account_saved}
    ;`,
  usersCountries: `
    SELECT
      country,
      COUNT(*) as value
    FROM ${schema}.oky_user 
      WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      ${partials.and_date_account_saved}
    GROUP BY country
  ;`,
  usersProvince: `
    SELECT
      country,
      province,
      COUNT(*) as value
    FROM ${schema}.oky_user 
    WHERE (gender = $1 OR $1 IS NULL) 
      AND (location= $2 OR $2 IS NULL)
      ${partials.and_date_account_saved}
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
    FROM ${schema}.answered_quizzes
    GROUP BY id
    ;`,
  answeredSurveysByID: `
    SELECT answered_surveys.id,answered_surveys.questions, answered_surveys.user_id
    FROM ${schema}.answered_surveys
    left outer join ${schema}.oky_user 
    ON TRIM(BOTH ' ' FROM oky_user.id::text)::uuid = TRIM(BOTH ' ' FROM answered_surveys.user_id::text)::uuid 
    WHERE
      (TRIM(BOTH ' ' FROM oky_user.id::text)::uuid = TRIM(BOTH ' ' FROM answered_surveys.user_id::text)::uuid AND answered_surveys.isSurveyAnswered = 'true')
    GROUP BY answered_surveys.id, answered_surveys.questions, answered_surveys.user_id
  ;`,
  usersShares: `
    SELECT
      DATE_TRUNC('day', created_at) AS date,
      COUNT(*) as value
    FROM ${schema}.app_event
    WHERE type = 'SHARE_APP'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  ;`,
  directDownloads: `
    SELECT
      DATE_TRUNC('day', date_created) AS date,
      COUNT(*) as value
    FROM ${schema}.analytics
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
    FROM ${schema}.answered_surveys
    full outer join ${schema}.oky_user 
      ON TRIM(BOTH ' ' FROM oky_user.id::text)::uuid = TRIM(BOTH ' ' FROM answered_surveys.user_id::text)::uuid 
    WHERE
      (TRIM(BOTH ' ' FROM oky_user.id::text)::uuid = TRIM(BOTH ' ' FROM answered_surveys.user_id::text)::uuid)
      AND (answered_surveys.isSurveyAnswered = 'true')
      AND (oky_user.gender = $1 OR $1 IS NULL) 
      AND (oky_user.location= $2 OR $2 IS NULL)
      AND ((DATE_PART('year', now()::date) - DATE_PART('year', oky_user.date_of_birth)) BETWEEN $3 AND $4 OR $3 IS NULL)
    GROUP BY answered_surveys.id, answered_surveys.user_id, answered_surveys.questions, oky_user.country, oky_user.location, oky_user.date_of_birth, oky_user.gender
  ;`,
  countUsers: `
  SELECT COUNT(id)
  FROM ${schema}.oky_user
  ;`,
  countActiveUsers: `
  SELECT COUNT(DISTINCT user_id)
  FROM ${schema}.app_event
  INNER JOIN ${schema}.oky_user ON TRIM(BOTH ' ' FROM app_event.user_id::text)::uuid = TRIM(BOTH ' ' FROM oky_user.id::text)::uuid
  WHERE app_event.type = 'SCREEN_VIEWED'
    AND app_event.payload->>'screenName' = 'MainScreen'
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
    ${partials.and_event_date}
  ;`,
  countTotalForEvent: `
  SELECT COUNT(*)
  FROM ${schema}.app_event
  WHERE app_event.type = $1
  ;`,
  countScreenViews: `
  SELECT COUNT(*) AS count, COUNT(DISTINCT user_id) AS unique_user_count
  FROM ${schema}.app_event
  INNER JOIN ${schema}.oky_user ON TRIM(BOTH ' ' FROM app_event.user_id::text)::uuid = TRIM(BOTH ' ' FROM oky_user.id::text)::uuid
  WHERE app_event.type = 'SCREEN_VIEWED'
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
    ${partials.and_event_date}
    AND app_event.payload->>'screenName' = $5
  ;`,
  countNonLoggedInScreenViews: `
  SELECT COUNT(*) AS count, COUNT(DISTINCT metadata->>'deviceId') AS unique_device_count
  FROM ${schema}.app_event
  WHERE type = 'SCREEN_VIEWED'
    AND user_id IS NULL
    AND (app_event.metadata->>'date')::timestamp BETWEEN COALESCE($1, '1970-01-01'::timestamp) AND COALESCE($2, '9999-12-31'::timestamp)
    AND payload->>'screenName' = $3
  ;`,
  countPredictionSettingsChanges: `
  SELECT 
    Count(*) AS total_changes, 
    Count(*) FILTER (WHERE (app_event.payload->>'isFuturePredictionActive')::boolean = true) AS switched_on, 
    Count(*) FILTER (WHERE (app_event.payload->>'isFuturePredictionActive')::boolean = false) AS switched_off,
    Count(DISTINCT app_event.user_id) AS total_unique_user_changes, 
    Count(DISTINCT app_event.user_id) FILTER (WHERE (app_event.payload->>'isFuturePredictionActive')::boolean = true) AS unique_user_switched_on, 
    Count(DISTINCT app_event.user_id) FILTER (WHERE (app_event.payload->>'isFuturePredictionActive')::boolean = false) AS unique_user_switched_off
  FROM ${schema}.app_event
  INNER JOIN ${schema}.oky_user ON TRIM(BOTH ' ' FROM app_event.user_id::text)::uuid = TRIM(BOTH ' ' FROM oky_user.id::text)::uuid
  WHERE type = 'USER_SET_FUTURE_PREDICTION_STATE_ACTIVE'
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
    ${partials.and_event_date}
  ;`,
  countCategoryViews: `
  SELECT
    c.id AS category_id,
    c.title AS category_name,
    COUNT(*) AS total_view_count,
    COUNT(DISTINCT app_event.user_id) AS unique_user_count,
    COUNT(*) FILTER (WHERE app_event.user_id IS NULL) AS logged_out_view_count,
    COUNT(DISTINCT app_event.metadata->>'deviceId') FILTER (WHERE app_event.metadata->>'deviceId' IS NOT NULL) AS unique_device_count
  FROM ${schema}.category c
  LEFT JOIN ${schema}.app_event
    ON app_event.type = 'CATEGORY_VIEWED' AND TRIM(BOTH ' ' FROM c.id::text)::uuid = TRIM(BOTH ' ' FROM app_event.payload->>'categoryId'::text)::uuid
  LEFT JOIN ${schema}.oky_user
    ON TRIM(BOTH ' ' FROM app_event.user_id::text)::uuid = TRIM(BOTH ' ' FROM oky_user.id::text)::uuid
  WHERE (oky_user.id IS NULL OR oky_user.gender = COALESCE($1, oky_user.gender))
    AND (oky_user.id IS NULL OR oky_user.location = COALESCE($2, oky_user.location))
    ${partials.and_event_date}
  GROUP BY c.id, c.title
  ;`,
  countSubCategoryViews: `
  SELECT
    s.id AS subcategory_id,
    s.title AS subcategory_name,
    COUNT(*) AS total_view_count,
    COUNT(DISTINCT app_event.user_id) AS unique_user_count,
    COUNT(*) FILTER (WHERE app_event.user_id IS NULL) AS logged_out_view_count,
    COUNT(DISTINCT app_event.metadata->>'deviceId') FILTER (WHERE app_event.metadata->>'deviceId' IS NOT NULL) AS unique_device_count
  FROM ${schema}.subcategory s
  LEFT JOIN ${schema}.app_event
    ON app_event.type = 'SUBCATEGORY_VIEWED' AND TRIM(BOTH ' ' FROM s.id::text)::uuid = TRIM(BOTH ' ' FROM app_event.payload->>'subCategoryId'::text)::uuid
    LEFT JOIN ${schema}.oky_user ON TRIM(BOTH ' ' FROM app_event.user_id::text)::uuid = TRIM(BOTH ' ' FROM oky_user.id::text)::uuid
    WHERE (oky_user.id IS NULL OR oky_user.gender = COALESCE($1, oky_user.gender))
    AND (oky_user.id IS NULL OR oky_user.location = COALESCE($2, oky_user.location))
    ${partials.and_event_date}
  GROUP BY s.id, s.title
  ;`,
  countDailyCardUsage: `
  SELECT COUNT(*) AS count, COUNT(DISTINCT user_id) AS unique_user_count
  FROM ${schema}.app_event
  INNER JOIN ${schema}.oky_user ON TRIM(BOTH ' ' FROM app_event.user_id::text)::uuid = TRIM(BOTH ' ' FROM oky_user.id::text)::uuid
  WHERE app_event.type = 'DAILY_CARD_USED'
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
    ${partials.and_event_date}
  ;`,
  countAvatars: `
  SELECT 
    store->'appState'->'app'->>'avatar' AS avatar,
    COUNT(*) AS user_count
  FROM 
    ${schema}.oky_user
  WHERE 
    store->'appState'->'app'->>'avatar' IS NOT NULL
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
  GROUP BY 
    store->'appState'->'app'->>'avatar'
  ;`,
  countThemes: `
  SELECT 
    store->'appState'->'app'->>'theme' AS theme,
    COUNT(*) AS user_count
  FROM ${schema}.oky_user
  WHERE 
    store->'appState'->'app'->>'theme' IS NOT NULL
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
  GROUP BY 
    store->'appState'->'app'->>'theme'
  ;`,
  countLocales: `
  SELECT 
    store->'appState'->'app'->>'locale' AS locale,
    COUNT(*) AS user_count
  FROM ${schema}.oky_user
  WHERE 
    store->'appState'->'app'->>'locale' IS NOT NULL
    AND oky_user.gender = COALESCE($1, oky_user.gender)
    AND oky_user.location = COALESCE($2, oky_user.location)
  GROUP BY 
    store->'appState'->'app'->>'locale'
  ;`,
}
