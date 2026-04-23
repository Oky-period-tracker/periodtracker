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
import { provinces, countries, cmsLanguages } from '@oky/core'
import { TermsAndConditions } from '../entity/TermsAndConditions'
import { PrivacyPolicy } from '../entity/PrivacyPolicy'
import { AboutBanner } from '../entity/AboutBanner'
import { Question } from '../entity/Question'
import { env } from '../env'
import { Video } from '../entity/Video'
import { HelpCenterAttribute } from '../entity/HelpCenterAttribute'
import { contentFilterOptions, ageRestrictionOptions } from '../optional'
import { logger } from '../logger'
// import { getStorage } from 'firebase-admin/storage'

export class RenderController {
  private articleRepository = getRepository(Article)
  private videoRepository = getRepository(Video)
  private categoryRepository = getRepository(Category)
  private subcategoryRepository = getRepository(Subcategory)
  private quizRepository = getRepository(Quiz)
  private userRepository = getRepository(User)
  private didYouKnowRepository = getRepository(DidYouKnow)
  private helpCenterRepository = getRepository(HelpCenter)
  private helpCenterAttributeRepository = getRepository(HelpCenterAttribute)
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
    ageRestrictionOptions,
    contentFilterOptions,
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
    try {
    const dateFrom = request.query.dateFrom || null
    const dateTo = request.query.dateTo || null
    const gender = request.query.gender || null
    const location = request.query.location || null

    const params = [gender, location, dateFrom, dateTo]

    const entityManager = await getManager()
    const [
      usersGenders,
      usersLocations,
      usersAgeGroups,
      preProcessedProvinceList,
      preProcessedCountryList,
      usersShares,
      directDownloads,
    ] = await Promise.all([
      entityManager.query(analyticsQueries.usersGender, params),
      entityManager.query(analyticsQueries.usersLocations, params),
      entityManager.query(analyticsQueries.usersAgeGroups, params),
      entityManager.query(analyticsQueries.usersProvince, params),
      entityManager.query(analyticsQueries.usersCountries, params),
      entityManager.query(analyticsQueries.usersShares),
      entityManager.query(analyticsQueries.directDownloads),
    ])

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
        query: request.query,
        usersLocations,
        usersGenders,
        usersAgeGroups,
        usersCountries,
        usersProvinces,
        usersShares,
        directDownloads,
        dateFrom,
        dateTo,
      }
    }

    return this.render(response, 'AnalyticsDash', {
      query: request.query,
      usersLocations,
      usersGenders,
      usersAgeGroups,
      usersCountries,
      usersProvinces,
      usersShares,
      directDownloads,
      dateFrom,
      dateTo,
    })
    } catch (error) {
      logger.error('RenderController.renderAnalytics failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async renderQuiz(request: Request, response: Response, next: NextFunction) {
    try {
    const entityManager = await getManager()
    const [quizzes, answeredQuizzes] = await Promise.all([
      this.quizRepository.find({
        where: { lang: request.user.lang },
        order: { topic: 'ASC' },
      }),
      entityManager.query(analyticsQueries.answeredQuizzesByID),
    ])
    this.render(response, 'Quiz', { quizzes, answeredQuizzes })
    } catch (error) {
      logger.error('RenderController.renderQuiz failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderHelpCenter(request: Request, response: Response, next: NextFunction) {
    try {
    const [helpCenters, helpCenterAttributes] = await Promise.all([
      this.helpCenterRepository.find({
        where: { lang: request.user.lang },
      }),
      this.helpCenterAttributeRepository.find({
        where: { lang: request.user.lang },
      }),
    ])

    this.render(response, 'HelpCenter', {
      helpCenters,
      regions: countries,
      subRegions: provinces,
      attributes: helpCenterAttributes,
    })
    } catch (error) {
      logger.error('RenderController.renderHelpCenter failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderAbout(request: Request, response: Response, next: NextFunction) {
    try {
    const [aboutVersions, aboutBannerItem] = await Promise.all([
      this.aboutRepository.find({
        where: { lang: request.user.lang },
      }),
      this.aboutBannerRepository.findOne({
        where: { lang: request.user.lang },
      }),
    ])
    this.render(response, 'About', {
      aboutVersions,
      image: aboutBannerItem ? aboutBannerItem.image : null,
    })
    } catch (error) {
      logger.error('RenderController.renderAbout failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderPrivacyPolicy(request: Request, response: Response, next: NextFunction) {
    try {
    const privacyPolicyVersions = await this.privacyPolicyRepository.find({
      where: { lang: request.user.lang },
    })
    this.render(response, 'PrivacyPolicy', { privacyPolicyVersions })
    } catch (error) {
      logger.error('RenderController.renderPrivacyPolicy failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderTermsAndConditions(request: Request, response: Response, next: NextFunction) {
    try {
    const termsAndConditionsVersions = await this.termsAndConditionsRepository.find({
      where: { lang: request.user.lang },
    })
    this.render(response, 'TermsAndConditions', { termsAndConditionsVersions })
    } catch (error) {
      logger.error('RenderController.renderTermsAndConditions failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderSurvey(request: Request, response: Response, next: NextFunction) {
    try {
    const entityManager = await getManager()
    const [answeredSurveys, surveys] = await Promise.all([
      entityManager.query(analyticsQueries.answeredSurveysByID),
      createQueryBuilder('survey')
        .from(Survey, 'survey')
        .where({ lang: request.user.lang })
        .orderBy('survey.date_created')
        .leftJoinAndMapMany('survey.questions', Question, 'question', 'question.surveyId = survey.id')
        .addOrderBy('question.sort_number ', 'ASC')
        .select(['survey', 'question'])
        .getMany(),
    ])
    this.render(response, 'Survey', {
      moment,
      surveys,
      answeredSurveys,
      query: {
        ...request.query,
        age: `${request.query.start_age}_${request.query.end_age}`,
      },
    })
    } catch (error) {
      logger.error('RenderController.renderSurvey failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderAnsweredSurvey(request: Request, response: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      logger.error('RenderController.renderAnsweredSurvey failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderDidYouKnow(request: Request, response: Response, next: NextFunction) {
    try {
    const didYouKnows = await this.didYouKnowRepository.find({
      where: { lang: request.user.lang },
      order: {
        title: 'ASC',
      },
    })
    this.render(response, 'DidYouKnow', { didYouKnows })
    } catch (error) {
      logger.error('RenderController.renderDidYouKnow failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderEncyclopedia(request: Request, response: Response, next: NextFunction) {
    try {
    const [articles, categories, subcategories] = await Promise.all([
      this.articleRepository.query(
        `SELECT ar.id, ca.title as category_title, ca.id as category_id, sc.title as subcategory_title, sc.id as subcategory_id, ar.article_heading, ar.article_text, ar.live as live, ca.primary_emoji, ar.lang, ar.date_created, ar.*
      FROM ${env.db.schema}.article ar 
      INNER JOIN ${env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      ORDER BY ca."sortingKey" ASC, sc."sortingKey" ASC, ar."sortingKey" ASC
      `,
        [request.user.lang],
      ),
      this.categoryRepository.find({
        where: { lang: request.user.lang },
      }),
      this.subcategoryRepository.find({
        where: { lang: request.user.lang },
      }),
    ])
    this.render(response, 'Encyclopedia', {
      articles,
      categories,
      subcategories,
      contentFilterOptions,
      VOICE_OVER_BASE_URL: env.storage.baseUrl,
      ageRestrictionOptions,
    })
    } catch (error) {
      logger.error('RenderController.renderEncyclopedia failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderCategoriesManagement(request: Request, response: Response, next: NextFunction) {
    try {
    const categories = await this.categoryRepository.find({
      where: { lang: request.user.lang },
      order: { sortingKey: 'ASC' },
    })

    this.render(response, 'Categories', { categories })
    } catch (error) {
      logger.error('RenderController.renderCategoriesManagement failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderCategoryManagement(request: Request, response: Response, next: NextFunction) {
    try {
    const [categories, subcategories] = await Promise.all([
      this.categoryRepository.find({
        where: { id: request.params.id },
      }),
      this.subcategoryRepository.query(
        `SELECT sc.id, sc.title, ca.title as parent_category, ca.id as parent_category_id, sc."sortingKey"
      FROM ${env.db.schema}.subcategory sc
      INNER JOIN ${env.db.schema}.category ca
      ON sc.parent_category = ca.id::varchar
      WHERE sc.lang = $1
      AND sc.parent_category = $2
      ORDER BY sc."sortingKey" ASC
      `,
        [request.user.lang, request.params.id],
      ),
    ])

    this.render(response, 'Category', { categories, subcategories })
    } catch (error) {
      logger.error('RenderController.renderCategoryManagement failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderSubcategoryManagement(request: Request, response: Response, next: NextFunction) {
    try {
    const subcategories = await this.subcategoryRepository.find({
      where: { id: request.params.id },
    })

    if (!subcategories || subcategories.length === 0) {
      logger.warn('Subcategory not found', { id: request.params.id })
      response.status(404).send('Subcategory not found')
      return
    }

    const categories = await this.categoryRepository.find({
      where: { id: subcategories[0].parent_category },
      order: { sortingKey: 'ASC' },
    })

    const articles = await this.articleRepository.query(
      `SELECT ar.id, ca.title as category_title, ca.id as category_id, sc.title as subcategory_title, sc.id as subcategory_id, ar.article_heading, ar.article_text, ar.live as live, ca.primary_emoji, ar.lang, ar.date_created, ar.*
      FROM ${env.db.schema}.article ar 
      INNER JOIN ${env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      AND sc.id = $2
      ORDER BY ca."sortingKey" ASC, sc."sortingKey" ASC, ar."sortingKey" ASC
      `,
      [request.user.lang, request.params.id],
    )

    this.render(response, 'Subcategory', {
      categories,
      subcategories,
      articles,
      contentFilterOptions,
      VOICE_OVER_BASE_URL: env.storage.baseUrl,
      ageRestrictionOptions,
    })
    } catch (error) {
      logger.error('RenderController.renderSubcategoryManagement failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderVideoManagement(request: Request, response: Response, next: NextFunction) {
    try {
    const videos = await this.videoRepository.find({
      where: { lang: request.user.lang },
      order: { sortingKey: 'ASC' },
    })

    this.render(response, 'Videos', { videos })
    } catch (error) {
      logger.error('RenderController.renderVideoManagement failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderUserManagement(request: Request, response: Response, next: NextFunction) {
    try {
    const viewableItems = []
    if (request.user.type === 'contentManager') {
      response.status(400).send({ error: 'No permission rights to do that' })
      return
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
    } catch (error) {
      logger.error('RenderController.renderUserManagement failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderSuggestion(request: Request, response: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      logger.error('RenderController.renderSuggestion failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderNotification(request: Request, response: Response, next: NextFunction) {
    try {
    const [notifications, permanentNotifications] = await Promise.all([
      this.notificationRepository.find({
        where: { lang: request.user.lang },
        order: { id: 'ASC' },
      }),
      this.permanentNotificationRepository.find({
        where: { lang: request.user.lang },
        order: { id: 'ASC' },
      }),
    ])
    this.render(response, 'Notification', {
      notifications,
      permanentNotifications,
      moment,
    })
    } catch (error) {
      logger.error('RenderController.renderNotification failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderAvatarMessages(request: Request, response: Response, next: NextFunction) {
    try {
    const avatarMessages = await this.avatarMessagesRepository.find({
      where: {
        lang: request.user.lang,
      },
      order: {
        id: 'ASC',
      },
    })

    this.render(response, 'AvatarMessages', { avatarMessages })
    } catch (error) {
      logger.error('RenderController.renderAvatarMessages failed', { message: (error as Error)?.message, stack: (error as Error)?.stack })
      throw error
    }
  }

  async renderDataManagement(request: Request, response: Response, next: NextFunction) {
    this.render(response, 'DataManagement')
  }
}
