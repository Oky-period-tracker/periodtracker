import { RenderController } from './controller/RenderController'
import { AccessController } from './controller/AccessController'
import { ArticleController } from './controller/ArticleController'
import { QuizController } from './controller/QuizController'
import { UserController } from './controller/UserController'
import { DidYouKnowController } from './controller/DidYouKnowController'
import { SurveyController } from './controller/SurveyController'
import { SuggestionController } from './controller/SuggestionController'
import { NotificationController } from './controller/NotificationController'
import { CategoryController } from './controller/CategoryController'
import { SubcategoryController } from './controller/SubcategoryController'
import { HelpCenterController } from './controller/HelpCenterController'
import { AnalyticsController } from './controller/AnalyticsController'
import { AvatarMessageController } from './controller/AvatarMessageController'
import { AboutController } from './controller/AboutController'
import { AboutBannerController } from './controller/AboutBannerController'
import { TermsAndConditionsController } from './controller/TermsAndConditionsController'
import { PrivacyPolicyController } from './controller/PrivacyPolicyController'
import { DataController } from './controller/DataController'
import { VideoController } from './controller/VideoController'
import { HelpCenterAttributeController } from './controller/HelpCenterAttributeController'
import { ArticleVoiceOverController } from './controller/ArticleVoiceOverController'
import { AgeRestrictionController } from './controller/AgeRestrictionController'
import { ContentFilterController } from './controller/ContentFilterController'

export const Routes = [
  // ------------ Render ----------------
  {
    method: 'get',
    route: '/',
    controller: RenderController,
    action: 'renderLogin',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/login',
    controller: RenderController,
    action: 'renderLogin',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/encyclopedia',
    controller: RenderController,
    action: 'renderEncyclopedia',
  },
  {
    method: 'get',
    route: '/quiz-management',
    controller: RenderController,
    action: 'renderQuiz',
  },
  {
    method: 'get',
    route: '/didyouknow-management',
    controller: RenderController,
    action: 'renderDidYouKnow',
  },
  {
    method: 'get',
    route: '/user-management',
    controller: RenderController,
    action: 'renderUserManagement',
  },
  {
    method: 'get',
    route: '/categories-management',
    controller: RenderController,
    action: 'renderCategoriesManagement',
  },
  {
    method: 'get',
    route: '/categories-management/:id',
    controller: RenderController,
    action: 'renderCategoryManagement',
  },
  {
    method: 'get',
    route: '/subcategories-management/:id',
    controller: RenderController,
    action: 'renderSubcategoryManagement',
  },
  {
    method: 'get',
    route: '/video-management',
    controller: RenderController,
    action: 'renderVideoManagement',
  },
  {
    method: 'get',
    route: '/survey-management',
    controller: RenderController,
    action: 'renderSurvey',
  },
  {
    method: 'get',
    route: '/answered-surveys',
    controller: RenderController,
    action: 'renderAnsweredSurvey',
  },
  {
    method: 'get',
    route: '/suggestions-management',
    controller: RenderController,
    action: 'renderSuggestion',
  },
  {
    method: 'get',
    route: '/notifications-management',
    controller: RenderController,
    action: 'renderNotification',
  },
  {
    method: 'get',
    route: '/help-center-management',
    controller: RenderController,
    action: 'renderHelpCenter',
  },
  {
    method: 'get',
    route: '/about-management',
    controller: RenderController,
    action: 'renderAbout',
  },
  {
    method: 'get',
    route: '/terms-and-conditions-management',
    controller: RenderController,
    action: 'renderTermsAndConditions',
  },
  {
    method: 'get',
    route: '/privacy-policy-management',
    controller: RenderController,
    action: 'renderPrivacyPolicy',
  },
  {
    method: 'get',
    route: '/analytics-management',
    controller: RenderController,
    action: 'renderAnalytics',
  },
  {
    method: 'get',
    route: '/avatar-message-management',
    controller: RenderController,
    action: 'renderAvatarMessages',
  },
  // ------------ Access ----------------
  {
    method: 'get',
    route: '/logout',
    controller: AccessController,
    action: 'logout',
  },
  {
    method: 'post',
    route: '/login',
    controller: AccessController,
    action: 'login',
    isPublic: true,
  },
  {
    method: 'post',
    route: '/register',
    controller: AccessController,
    action: 'register',
  },
  // ------------ Analytics ----------------
  {
    method: 'post',
    route: '/analytics/events',
    controller: AnalyticsController,
    action: 'save',
  },
  // ------------ Articles Api ----------------
  {
    method: 'get',
    route: '/articles',
    controller: ArticleController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/articles/:id',
    controller: ArticleController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/articles',
    controller: ArticleController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/articles/:id',
    controller: ArticleController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/articles/:id',
    controller: ArticleController,
    action: 'remove',
  },
  {
    method: 'put',
    route: '/articles',
    controller: ArticleController,
    action: 'reorderRows',
  },
  // ------------ Age Restriction ----------------
  {
    method: 'post',
    route: '/api/age-restriction',
    controller: AgeRestrictionController,
    action: 'update',
  },
  // ------------ Content Filter ----------------
  {
    method: 'post',
    route: '/api/content-filter',
    controller: ContentFilterController,
    action: 'update',
  },
  // ------------ Voice Over ----------------
  {
    method: 'get',
    route: '/api/voice-over/article',
    controller: ArticleVoiceOverController,
    action: 'get',
  },
  {
    method: 'post',
    route: '/api/voice-over/article/remove',
    controller: ArticleVoiceOverController,
    action: 'remove',
  },
  // ------------ Videos Api ----------------
  {
    method: 'get',
    route: '/videos',
    controller: VideoController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/videos/:id',
    controller: VideoController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/videos',
    controller: VideoController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/videos/:id',
    controller: VideoController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/videos/:id',
    controller: VideoController,
    action: 'remove',
  },
  {
    method: 'put',
    route: '/videos',
    controller: VideoController,
    action: 'reorderRows',
  },
  // ------------ Categories Api ----------------
  {
    method: 'get',
    route: '/categories',
    controller: CategoryController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/categories/:id',
    controller: CategoryController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/categories',
    controller: CategoryController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/categories/:id',
    controller: CategoryController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/categories/:id',
    controller: CategoryController,
    action: 'remove',
  },
  {
    method: 'put',
    route: '/categories',
    controller: CategoryController,
    action: 'reorderRows',
  },
  // ------------ Subcategories Api ----------------
  {
    method: 'get',
    route: '/subcategories',
    controller: SubcategoryController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/subcategories/:id',
    controller: SubcategoryController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/subcategories',
    controller: SubcategoryController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/subcategories/:id',
    controller: SubcategoryController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/subcategories/:id',
    controller: SubcategoryController,
    action: 'remove',
  },
  {
    method: 'put',
    route: '/subcategories',
    controller: SubcategoryController,
    action: 'reorderRows',
  },
  // ------------ Quizzes Api ----------------
  {
    method: 'get',
    route: '/quiz',
    controller: QuizController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/quiz/:id',
    controller: QuizController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/quiz',
    controller: QuizController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/quiz/:id',
    controller: QuizController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/quiz/:id',
    controller: QuizController,
    action: 'remove',
  },
  // ------------ Users Api ----------------
  {
    method: 'get',
    route: '/user',
    controller: UserController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/user/:id',
    controller: UserController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/user',
    controller: UserController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/user/change-location/',
    controller: UserController,
    action: 'changeLocation',
  },
  {
    method: 'put',
    route: '/user/:id',
    controller: UserController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/user/:id',
    controller: UserController,
    action: 'remove',
  },
  // ------------ Avatar Messages ----------------
  {
    method: 'get',
    route: '/avatar-message',
    controller: AvatarMessageController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/avatar-message/:id',
    controller: AvatarMessageController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/avatar-message',
    controller: AvatarMessageController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/avatar-message/:id',
    controller: AvatarMessageController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/avatar-message/:id',
    controller: AvatarMessageController,
    action: 'remove',
  },
  // ------------ Did You Know Api ----------------
  {
    method: 'get',
    route: '/avatar-message',
    controller: DidYouKnowController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/didyouknow/:id',
    controller: DidYouKnowController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/didyouknow',
    controller: DidYouKnowController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/didyouknow/:id',
    controller: DidYouKnowController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/didyouknow/:id',
    controller: DidYouKnowController,
    action: 'remove',
  },
  // ------------ Help Center Api ----------------
  {
    method: 'get',
    route: '/help-center',
    controller: HelpCenterController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/help-center/:id',
    controller: HelpCenterController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/help-center',
    controller: HelpCenterController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/help-center/:id',
    controller: HelpCenterController,
    action: 'update',
  },
  {
    method: 'put',
    route: '/help-center',
    controller: HelpCenterController,
    action: 'bulkUpdate',
  },
  {
    method: 'delete',
    route: '/help-center/:id',
    controller: HelpCenterController,
    action: 'remove',
  },
  {
    method: 'get',
    route: '/help-center-attributes',
    controller: HelpCenterController,
    action: 'helpCenterAttributes',
  },

  // ------------ Privacy Policy Api ----------------
  {
    method: 'get',
    route: '/privacy-policy',
    controller: PrivacyPolicyController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/privacy-policy/:id',
    controller: PrivacyPolicyController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/privacy-policy',
    controller: PrivacyPolicyController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/privacy-policy/:id',
    controller: PrivacyPolicyController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/privacy-policy/:id',
    controller: PrivacyPolicyController,
    action: 'remove',
  },
  // ------------ Terms and Condition Api ----------------
  {
    method: 'get',
    route: '/terms-and-conditions',
    controller: TermsAndConditionsController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/terms-and-conditions/:id',
    controller: TermsAndConditionsController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/terms-and-conditions',
    controller: TermsAndConditionsController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/terms-and-conditions/:id',
    controller: TermsAndConditionsController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/terms-and-conditions/:id',
    controller: TermsAndConditionsController,
    action: 'remove',
  },
  // ------------ About Api ----------------
  {
    method: 'get',
    route: '/about',
    controller: AboutController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/about/:id',
    controller: AboutController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/about',
    controller: AboutController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/about/:id',
    controller: AboutController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/about/:id',
    controller: AboutController,
    action: 'remove',
  },
  // ------------ About Banner Api ----------------
  {
    method: 'post',
    route: '/about-banner-management',
    controller: AboutBannerController,
    action: 'saveOrUpdate',
  },
  {
    method: 'delete',
    route: '/about-banner-management/:id',
    controller: AboutBannerController,
    action: 'remove',
  },
  // ------------ Survey Api ----------------
  {
    method: 'get',
    route: '/survey',
    controller: SurveyController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/survey/:id',
    controller: SurveyController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/survey',
    controller: SurveyController,
    action: 'save',
  },
  {
    method: 'put',
    route: '/survey/:id',
    controller: SurveyController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/survey/:id',
    controller: SurveyController,
    action: 'remove',
  },
  // ------------ exposed Api ----------------
  {
    method: 'get',
    route: '/mobile/articles/:lang',
    controller: ArticleController,
    action: 'mobileArticlesByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/videos/:lang',
    controller: VideoController,
    action: 'allLive',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/avatar-messages/:lang',
    controller: AvatarMessageController,
    action: 'mobileAvatarMessagesByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/quizzes/:lang',
    controller: QuizController,
    action: 'mobileQuizzesByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/didyouknows/:lang',
    controller: DidYouKnowController,
    action: 'mobileDidYouKnowByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/surveys/:lang',
    controller: SurveyController,
    action: 'mobileSurveysByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/new-surveys/:lang',
    controller: SurveyController,
    action: 'newMobileSurveysByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/notification/:lang',
    controller: NotificationController,
    action: 'mobileNotificationsByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/help-center/:lang',
    controller: HelpCenterController,
    action: 'mobileHelpCenterByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/help-center-attribute/:lang',
    controller: HelpCenterAttributeController,
    action: 'mobileHelpCenterAttributes',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/privacy-policy/:lang',
    controller: PrivacyPolicyController,
    action: 'mobilePrivacyPolicyByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/terms-and-conditions/:lang',
    controller: TermsAndConditionsController,
    action: 'mobileTermsAndConditionsByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/about/:lang',
    controller: AboutController,
    action: 'mobileAboutByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/about-banner/:lang',
    controller: AboutBannerController,
    action: 'mobileAboutBannerByLanguage',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/about-banner-conditional/:lang',
    controller: AboutBannerController,
    action: 'mobileAboutBannerByLanguageConditional',
    isPublic: true,
  },

  // ------- suggestion Api -------
  {
    method: 'get',
    route: '/suggestions',
    controller: SuggestionController,
    action: 'all',
  },
  {
    method: 'post',
    route: '/toggle-suggestions-status',
    controller: SuggestionController,
    action: 'updateStatus',
  },
  {
    method: 'delete',
    route: '/suggestions/:id',
    controller: SuggestionController,
    action: 'remove',
  },
  {
    method: 'post',
    route: '/mobile/suggestions',
    controller: SuggestionController,
    action: 'save',
    isPublic: true,
  },
  {
    method: 'get',
    route: '/mobile/permanent-notification/:ver&:lang&:user',
    controller: NotificationController,
    action: 'mobilePermanentNotifications',
    isPublic: true,
  },
  // ------- Notification api -------
  {
    method: 'post',
    route: '/notification',
    controller: NotificationController,
    action: 'save',
  },
  {
    method: 'post',
    route: '/permanent-alert',
    controller: NotificationController,
    action: 'savePermanentAlert',
  },
  {
    method: 'put',
    route: '/permanent-alert/:id',
    controller: NotificationController,
    action: 'updatePermanentAlert',
  },
  {
    method: 'delete',
    route: '/permanent-alert/:id',
    controller: NotificationController,
    action: 'removePermanentAlert',
  },
  {
    method: 'delete',
    route: '/notification/:id',
    controller: NotificationController,
    action: 'remove',
  },
  // ------- Data api -------
  {
    method: 'get',
    route: '/data',
    controller: RenderController,
    action: 'renderDataManagement',
  },
  {
    method: 'get',
    route: '/data/generate-content-ts',
    controller: DataController,
    action: 'generateContentTs',
  },
  {
    method: 'get',
    route: '/data/generate-content-sheet',
    controller: DataController,
    action: 'generateContentSheet',
  },
  // {
  //   method: 'get',
  //   route: '/data/generate-app-translations-sheet',
  //   controller: DataController,
  //   action: 'generateAppTranslationsSheet',
  // },
  {
    method: 'get',
    route: '/data/generate-cms-translations-sheet',
    controller: DataController,
    action: 'generateCmsTranslationsSheet',
  },
  {
    method: 'get',
    route: '/data/generate-countries-sheet',
    controller: DataController,
    action: 'generateCountriesSheet',
  },
  {
    method: 'get',
    route: '/data/generate-provinces-sheet',
    controller: DataController,
    action: 'generateProvincesSheet',
  },
]
