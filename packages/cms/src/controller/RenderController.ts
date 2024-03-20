import moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import { getRepository, getManager, createQueryBuilder } from 'typeorm'
import { Article } from '../entity/Article'
import { Quiz } from '../entity/Quiz'
import { User } from '../entity/User'
import { Survey } from '../entity/Survey'
import { Category } from '../entity/Category'
import { DidYouKnow } from '../entity/DidYouKnow'
import { Suggestion } from '../entity/Suggestion'
import { Notification } from '../entity/Notification'
import { Subcategory } from '../entity/Subcategory'
import { accessControlList } from '../access/access-control'
import { analyticsQueries } from '../services/analytics'
import { HelpCenter } from '../entity/HelpCenter'
import { About } from '../entity/About'
import { AvatarMessages } from '../entity/AvatarMessages'
import { PermanentNotification } from '../entity/PermanentNotification'
import { provinces, countries } from '@oky/core'
import { TermsAndConditions } from '../entity/TermsAndConditions'
import { PrivacyPolicy } from '../entity/PrivacyPolicy'
import { AboutBanner } from '../entity/AboutBanner'
import { Question } from '../entity/Question'
import { env } from '../env'
import { Video } from '../entity/Video'
import { cmsLanguages, appReleaseDate } from '../i18n/options'

export class RenderController {
  private articleRepository = getRepository(Article)
  private videoRepository = getRepository(Video)
  private categoryRepository = getRepository(Category)
  private subcategoryRepository = getRepository(Subcategory)
  private quizRepository = getRepository(Quiz)
  private userRepository = getRepository(User)
  private didYouKnowRepository = getRepository(DidYouKnow)
  private helpCenterRepository = getRepository(HelpCenter)
  private aboutRepository = getRepository(About)
  private aboutBannerRepository = getRepository(AboutBanner)
  private termsAndConditionsRepository = getRepository(TermsAndConditions)
  private privacyPolicyRepository = getRepository(PrivacyPolicy)
  private suggestionRepository = getRepository(Suggestion)
  private notificationRepository = getRepository(Notification)
  private permanentNotificationRepository = getRepository(PermanentNotification)
  private avatarMessagesRepository = getRepository(AvatarMessages)

  // Apply global render options to all views here
  globalRenderOptions = {
    cmsLanguages,
  }

  async render(
    response: Response,
    view: string,
    options?: object,
    callback?: (err: Error, html: string) => void,
  ) {
    response.render(view, { ...this.globalRenderOptions, ...options }, callback)
  }

  async renderLogin(request: Request, response: Response, next: NextFunction) {
    this.render(response, 'Login')
  }

  async renderAnalytics(request: Request, response: Response, next: NextFunction) {
    const dateFrom = request.query.dateFrom || null
    const dateTo = request.query.dateTo || null
    const gender = request.query.gender || null
    const location = request.query.location || null

    const params = [gender, location, dateFrom, dateTo]

    const entityManager = await getManager()
    const usersGenders = await entityManager.query(analyticsQueries.usersGender, params)
    const usersLocations = await entityManager.query(analyticsQueries.usersLocations, params)
    const usersAgeGroups = await entityManager.query(analyticsQueries.usersAgeGroups, params)
    const preProcessedProvinceList = await entityManager.query(
      analyticsQueries.usersProvince,
      params,
    )
    const preProcessedCountryList = await entityManager.query(
      analyticsQueries.usersCountries,
      params,
    )
    const usersShares = await entityManager.query(analyticsQueries.usersShares)
    const directDownloads = await entityManager.query(analyticsQueries.directDownloads)

    // Active users
    const { count: totalUsers } = (await entityManager.query(analyticsQueries.countUsers))[0]

    const { count: totalActiveUsers } = (
      await entityManager.query(analyticsQueries.countActiveUsers, params)
    )[0]

    const countAvatars = await entityManager.query(analyticsQueries.countAvatars, [
      gender,
      location,
    ])

    const countThemes = await entityManager.query(analyticsQueries.countThemes, [gender, location])

    const countLocales = await entityManager.query(analyticsQueries.countLocales, [
      gender,
      location,
    ])

    const { count: totalScreenViews } = (
      await entityManager.query(analyticsQueries.countTotalForEvent, ['SCREEN_VIEWED'])
    )[0]

    const { count: totalCategoryViews } = (
      await entityManager.query(analyticsQueries.countTotalForEvent, ['CATEGORY_VIEWED'])
    )[0]

    const { count: totalSubCategoryViews } = (
      await entityManager.query(analyticsQueries.countTotalForEvent, ['SUBCATEGORY_VIEWED'])
    )[0]

    // Main screen
    const { count: totalMainScreenViews, unique_user_count: uniqueUserMainScreenViews } = (
      await entityManager.query(analyticsQueries.countScreenViews, [...params, 'MainScreen'])
    )[0]

    // Profile screen
    const { count: totalProfileScreenViews, unique_user_count: uniqueUserProfileScreenViews } = (
      await entityManager.query(analyticsQueries.countScreenViews, [...params, 'ProfileScreen'])
    )[0]

    // Encyclopedia screen
    const {
      count: totalEncyclopediaScreenViews,
      unique_user_count: uniqueUserEncyclopediaScreenViews,
    } = (
      await entityManager.query(analyticsQueries.countScreenViews, [...params, 'Encyclopedia'])
    )[0]

    const {
      count: nonLoggedInEncyclopediaViews,
      unique_device_count: uniqueDeviceNonLoggedInEncyclopediaViews,
    } = (
      await entityManager.query(analyticsQueries.countNonLoggedInScreenViews, [
        dateFrom,
        dateTo,
        'Encyclopedia',
      ])
    )[0]

    const categoryViews = await entityManager.query(analyticsQueries.countCategoryViews, params)
    const subCategoryViews = await entityManager.query(
      analyticsQueries.countSubCategoryViews,
      params,
    )

    // Calendar screen
    const { count: totalCalendarScreenViews, unique_user_count: uniqueUserCalendarScreenViews } = (
      await entityManager.query(analyticsQueries.countScreenViews, [...params, 'Calendar'])
    )[0]

    // Daily cards
    const { count: countDailyCardUsage, unique_user_count: countUniqueUserDailyCardUsage } = (
      await entityManager.query(analyticsQueries.countDailyCardUsage, params)
    )[0]

    // Prediction
    const predictionSettings = (
      await entityManager.query(analyticsQueries.countPredictionSettingsChanges, params)
    )[0]

    const calculatePercentage = (value: number, total: number) => {
      return Math.round((value / total) * 100)
    }

    interface Usage {
      feature: string
      definition: string
      uniqueUsers: number
      views: number
      loggedOutViews?: number | string
      activeUsersPercentage: number | string
      uniqueUsersPercentage: number | string
      viewsPercentage?: number | string
    }

    const screenUsage: Usage[] = [
      {
        feature: 'Main screen',
        definition: 'Screen viewed',
        uniqueUsers: uniqueUserMainScreenViews,
        views: totalMainScreenViews,
        loggedOutViews: '-', // Inaccessible to logged out users
        activeUsersPercentage: calculatePercentage(uniqueUserMainScreenViews, totalActiveUsers),
        uniqueUsersPercentage: calculatePercentage(uniqueUserMainScreenViews, totalUsers),
        viewsPercentage: calculatePercentage(totalMainScreenViews, totalScreenViews),
      },
      {
        feature: 'Profile screen',
        definition: 'Screen viewed',
        uniqueUsers: uniqueUserProfileScreenViews,
        views: totalProfileScreenViews,
        loggedOutViews: '-', // Inaccessible to logged out users
        activeUsersPercentage: calculatePercentage(uniqueUserProfileScreenViews, totalActiveUsers),
        uniqueUsersPercentage: calculatePercentage(uniqueUserProfileScreenViews, totalUsers),
        viewsPercentage: calculatePercentage(totalProfileScreenViews, totalScreenViews),
      },
      {
        feature: 'Encyclopedia screen',
        definition: 'Screen viewed',
        uniqueUsers: uniqueUserEncyclopediaScreenViews,
        views: totalEncyclopediaScreenViews,
        loggedOutViews: nonLoggedInEncyclopediaViews,
        activeUsersPercentage: calculatePercentage(
          uniqueUserEncyclopediaScreenViews,
          totalActiveUsers,
        ),
        uniqueUsersPercentage: calculatePercentage(uniqueUserEncyclopediaScreenViews, totalUsers),
        viewsPercentage: calculatePercentage(totalEncyclopediaScreenViews, totalScreenViews),
      },
      {
        feature: 'Calendar screen',
        definition: 'Screen viewed',
        uniqueUsers: uniqueUserCalendarScreenViews,
        views: totalCalendarScreenViews,
        loggedOutViews: '-', // Inaccessible to logged out users
        activeUsersPercentage: calculatePercentage(uniqueUserCalendarScreenViews, totalActiveUsers),
        uniqueUsersPercentage: calculatePercentage(uniqueUserCalendarScreenViews, totalUsers),
        viewsPercentage: calculatePercentage(totalCalendarScreenViews, totalScreenViews),
      },
    ]

    const categoryUsage: Usage[] = categoryViews.map((category) => {
      return {
        feature: category.category_name,
        definition: 'Category',
        uniqueUsers: category.unique_user_count,
        views: category.total_view_count,
        loggedOutViews: category.logged_out_view_count,
        activeUsersPercentage: calculatePercentage(category.unique_user_count, totalActiveUsers),
        uniqueUsersPercentage: calculatePercentage(category.unique_user_count, totalUsers),
        viewsPercentage: calculatePercentage(category.total_view_count, totalCategoryViews),
        lang: category.category_lang,
      }
    })

    const subCategoryUsage: Usage[] = subCategoryViews.map((subCategory) => {
      return {
        feature: subCategory.subcategory_name,
        definition: 'Subcategory',
        uniqueUsers: subCategory.unique_user_count,
        views: subCategory.total_view_count,
        loggedOutViews: subCategory.logged_out_view_count,
        activeUsersPercentage: calculatePercentage(subCategory.unique_user_count, totalActiveUsers),
        uniqueUsersPercentage: calculatePercentage(subCategory.unique_user_count, totalUsers),
        viewsPercentage: calculatePercentage(subCategory.total_view_count, totalSubCategoryViews),
        lang: subCategory.subcategory_lang,
      }
    })

    const encyclopediaUsage = [...categoryUsage, ...subCategoryUsage]

    const usage: Usage[] = [
      {
        feature: 'Daily card',
        definition:
          'Users who have used the daily card at least once. When they click any emoji on the card, it counts as a view. Clicking on multiple emojis and cards within 24 hours still only counts as one view.',
        uniqueUsers: countUniqueUserDailyCardUsage,
        views: countDailyCardUsage,
        activeUsersPercentage: calculatePercentage(countUniqueUserDailyCardUsage, totalActiveUsers),
        uniqueUsersPercentage: calculatePercentage(countUniqueUserDailyCardUsage, totalUsers),
      },
      {
        feature: 'Prediction setting',
        definition: 'Future prediction switched ON',
        uniqueUsers: predictionSettings.unique_user_switched_on,
        views: predictionSettings.switched_on,
        activeUsersPercentage: calculatePercentage(
          predictionSettings.unique_user_switched_on,
          totalActiveUsers,
        ),
        uniqueUsersPercentage: calculatePercentage(
          predictionSettings.unique_user_switched_on,
          totalUsers,
        ),
      },
      {
        feature: 'Prediction setting',
        definition: 'Future prediction switched OFF',
        uniqueUsers: predictionSettings.unique_user_switched_off,
        views: predictionSettings.switched_off,
        activeUsersPercentage: calculatePercentage(
          predictionSettings.unique_user_switched_off,
          totalActiveUsers,
        ),
        uniqueUsersPercentage: calculatePercentage(
          predictionSettings.unique_user_switched_off,
          totalUsers,
        ),
      },
    ]

    const usersCountries = preProcessedCountryList.reduce((acc, item) => {
      const country = countries[item.country] || {
        [request.user.lang]: `None`,
      }
      const countryName = country[request.user.lang]
      return { ...acc, [countryName]: item.value }
    }, {})

    const usersProvinces = preProcessedProvinceList.reduce((acc, item) => {
      const province = provinces.find((prov) => prov.uid.toString() === item.province) || {
        code: '00',
        uid: 0,
        [request.user.lang]: `Other`,
      }
      const provinceName = province[request.user.lang]
      const country = countries[item.country] || {
        [request.user.lang]: `None`,
      }
      const countryName = country[request.user.lang]
      return {
        ...acc,
        [countryName]: { ...acc[countryName], [provinceName]: item.value },
      }
    }, {})
    if ('application/json' === request.get('accept')) {
      return {
        appReleaseDate,
        query: request.query,
        usersLocations,
        usersGenders,
        usersAgeGroups,
        usersCountries,
        usersProvinces,
        usersShares,
        directDownloads,
        screenUsage,
        usage,
        encyclopediaUsage,
        countAvatars,
        countThemes,
        countLocales,
        dateFrom,
        dateTo,
      }
    }

    return this.render(response, 'AnalyticsDash', {
      appReleaseDate,
      query: request.query,
      usersLocations,
      usersGenders,
      usersAgeGroups,
      usersCountries,
      usersProvinces,
      usersShares,
      directDownloads,
      screenUsage,
      usage,
      encyclopediaUsage,
      countAvatars,
      countThemes,
      countLocales,
      dateFrom,
      dateTo,
    })
  }

  async renderQuiz(request: Request, response: Response, next: NextFunction) {
    const entityManager = await getManager()
    const quizzes = await this.quizRepository.find({
      where: { lang: request.user.lang },
      order: {
        topic: 'ASC',
      },
    })
    const answeredQuizzes = await entityManager.query(analyticsQueries.answeredQuizzesByID)
    this.render(response, 'Quiz', { quizzes, answeredQuizzes })
  }

  async renderHelpCenter(request: Request, response: Response, next: NextFunction) {
    const helpCenters = await this.helpCenterRepository.find({
      where: { lang: request.user.lang },
    })
    this.render(response, 'HelpCenter', { helpCenters })
  }

  async renderAbout(request: Request, response: Response, next: NextFunction) {
    const aboutVersions = await this.aboutRepository.find({
      where: { lang: request.user.lang },
    })
    const aboutBannerItem = await this.aboutBannerRepository.findOne({
      where: { lang: request.user.lang },
    })
    this.render(response, 'About', {
      aboutVersions,
      image: aboutBannerItem ? aboutBannerItem.image : null,
    })
  }

  async renderPrivacyPolicy(request: Request, response: Response, next: NextFunction) {
    const privacyPolicyVersions = await this.privacyPolicyRepository.find({
      where: { lang: request.user.lang },
    })
    this.render(response, 'PrivacyPolicy', { privacyPolicyVersions })
  }

  async renderTermsAndConditions(request: Request, response: Response, next: NextFunction) {
    const termsAndConditionsVersions = await this.termsAndConditionsRepository.find({
      where: { lang: request.user.lang },
    })
    this.render(response, 'TermsAndConditions', { termsAndConditionsVersions })
  }

  async renderSurvey(request: Request, response: Response, next: NextFunction) {
    const entityManager = await getManager()
    const answeredSurveys = await entityManager.query(analyticsQueries.answeredSurveysByID)
    const surveys = await createQueryBuilder('survey')
      .from(Survey, 'survey')
      .where({ lang: request.user.lang })
      .orderBy('survey.date_created')
      .leftJoinAndMapMany('survey.questions', Question, 'question', 'question.surveyId = survey.id')
      .addOrderBy('question.sort_number ', 'ASC')
      .select(['survey', 'question'])
      .getMany()
    this.render(response, 'Survey', {
      moment,
      surveys,
      answeredSurveys,
      query: {
        ...request.query,
        age: `${request.query.start_age}_${request.query.end_age}`,
      },
    })
  }

  async renderAnsweredSurvey(request: Request, response: Response, next: NextFunction) {
    const entityManager = await getManager()
    const answeredSurveys = await entityManager.query(analyticsQueries.filterSurvey, [
      request.query.gender || null,
      request.query.location || null,
      request.query.start_age || null,
      request.query.end_age || null,
    ])
    return {
      answeredSurveys: answeredSurveys.map((e: any) => {
        const countryOb = countries[e.country]
        const country = countryOb ? countryOb[request.user.lang] || countryOb.en : ''
        return { ...e, country }
      }),
    }
  }

  async renderDidYouKnow(request: Request, response: Response, next: NextFunction) {
    const didYouKnows = await this.didYouKnowRepository.find({
      where: { lang: request.user.lang },
      order: {
        title: 'ASC',
      },
    })
    this.render(response, 'DidYouKnow', { didYouKnows })
  }

  async renderEncyclopedia(request: Request, response: Response, next: NextFunction) {
    const articles = await this.articleRepository.query(
      `SELECT ar.id, ca.title as category_title, ca.id as category_id, sc.title as subcategory_title, sc.id as subcategory_id, ar.article_heading, ar.article_text, ar.live as live, ca.primary_emoji, ar.lang, ar.date_created 
      FROM ${env.db.schema}.article ar 
      INNER JOIN ${env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1`,
      [request.user.lang],
    )
    const categories = await this.categoryRepository.find({
      where: { lang: request.user.lang },
    })
    const subcategories = await this.subcategoryRepository.find({
      where: { lang: request.user.lang },
    })
    this.render(response, 'Encyclopedia', { articles, categories, subcategories })
  }

  async renderCatSubcatManagement(request: Request, response: Response, next: NextFunction) {
    const categories = await this.categoryRepository.find({
      where: { lang: request.user.lang },
    })
    const subcategories = await this.subcategoryRepository.query(
      `SELECT sc.id, sc.title, ca.title as parent_category, ca.id as parent_category_id
      FROM ${env.db.schema}.subcategory sc
      INNER JOIN ${env.db.schema}.category ca
      ON sc.parent_category = ca.id::varchar
      WHERE sc.lang = $1`,
      [request.user.lang],
    )
    this.render(response, 'CatSubcat', { categories, subcategories })
  }

  async renderVideoManagement(request: Request, response: Response, next: NextFunction) {
    const videos = await this.videoRepository.find({
      where: { lang: request.user.lang },
    })

    this.render(response, 'Videos', { videos })
  }

  async renderUserManagement(request: Request, response: Response, next: NextFunction) {
    const viewableItems = []
    if (request.user.type === 'contentManager') {
      response.status(400).send({ error: 'No permission rights to do that' })
    }
    if (accessControlList.can(request.user.type, 'createSuperAdmin')) {
      viewableItems.push({ type: 'superAdmin' })
      viewableItems.push({ type: 'admin' })
    }
    if (accessControlList.can(request.user.type, 'createContentManager')) {
      if (!accessControlList.can(request.user.type, 'createSuperAdmin')) {
        viewableItems.push({ type: 'contentManager', lang: request.user.lang })
      } else {
        viewableItems.push({ type: 'contentManager' })
      }
    }

    const users = await this.userRepository.find({
      select: ['id', 'username', 'type', 'lang', 'date_created'],
      where: viewableItems,
    })
    this.render(response, 'UserManagement', { users, moment })
  }

  async renderSuggestion(request: Request, response: Response, next: NextFunction) {
    const reasons = {
      request_access_to_source_code: 'Request access to source code',
      report_an_issue: 'Report an issue',
      suggestion: 'Suggestion',
      report_bug: 'Report a bug',
      request_for_more_information: 'Request for more information',
      need_help: 'Need help',
      problem_app: 'Problem with the app',
      request_topic: 'Request a Topic',
      Other: 'Other',
    }
    const where: any = { lang: request.user.lang }
    if (request.query.reason) {
      where.reason = request.query.reason
    }
    const orderKey: any = request.query.order_key || null
    const orderSequence = request.query.order_sequence || null
    const suggestions = await this.suggestionRepository.find({
      where,
      order: {
        [orderKey || 'id']: orderSequence || 'ASC',
      },
    })
    this.render(response, 'Suggestion', {
      suggestions,
      moment,
      reasons,
      reasonFilter: request.query.reason,
      orderKey,
      orderSequence,
    })
  }

  async renderNotification(request: Request, response: Response, next: NextFunction) {
    const notifications = await this.notificationRepository.find({
      where: {
        lang: request.user.lang,
      },
      order: {
        id: 'ASC',
      },
    })
    const permanentNotifications = await this.permanentNotificationRepository.find({
      where: {
        lang: request.user.lang,
      },
      order: {
        id: 'ASC',
      },
    })
    this.render(response, 'Notification', {
      notifications,
      permanentNotifications,
      moment,
    })
  }

  async renderAvatarMessages(request: Request, response: Response, next: NextFunction) {
    const avatarMessages = await this.avatarMessagesRepository.find({
      where: {
        lang: request.user.lang,
      },
      order: {
        id: 'ASC',
      },
    })

    this.render(response, 'AvatarMessages', { avatarMessages })
  }

  async renderDataManagement(request: Request, response: Response, next: NextFunction) {
    this.render(response, 'DataManagement')
  }
}
