"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const RenderController_1 = require("./controller/RenderController");
const AccessController_1 = require("./controller/AccessController");
const ArticleController_1 = require("./controller/ArticleController");
const QuizController_1 = require("./controller/QuizController");
const UserController_1 = require("./controller/UserController");
const DidYouKnowController_1 = require("./controller/DidYouKnowController");
const SurveyController_1 = require("./controller/SurveyController");
const SuggestionController_1 = require("./controller/SuggestionController");
const NotificationController_1 = require("./controller/NotificationController");
const CategoryController_1 = require("./controller/CategoryController");
const SubcategoryController_1 = require("./controller/SubcategoryController");
const HelpCenterController_1 = require("./controller/HelpCenterController");
const AnalyticsController_1 = require("./controller/AnalyticsController");
const AvatarMessageController_1 = require("./controller/AvatarMessageController");
const AboutController_1 = require("./controller/AboutController");
const AboutBannerController_1 = require("./controller/AboutBannerController");
const TermsAndConditionsController_1 = require("./controller/TermsAndConditionsController");
const PrivacyPolicyController_1 = require("./controller/PrivacyPolicyController");
const DataController_1 = require("./controller/DataController");
const VideoController_1 = require("./controller/VideoController");
exports.Routes = [
    // ------------ Render ----------------
    {
        method: 'get',
        route: '/',
        controller: RenderController_1.RenderController,
        action: 'renderLogin',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/login',
        controller: RenderController_1.RenderController,
        action: 'renderLogin',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/encyclopedia',
        controller: RenderController_1.RenderController,
        action: 'renderEncyclopedia',
    },
    {
        method: 'get',
        route: '/quiz-management',
        controller: RenderController_1.RenderController,
        action: 'renderQuiz',
    },
    {
        method: 'get',
        route: '/didyouknow-management',
        controller: RenderController_1.RenderController,
        action: 'renderDidYouKnow',
    },
    {
        method: 'get',
        route: '/user-management',
        controller: RenderController_1.RenderController,
        action: 'renderUserManagement',
    },
    {
        method: 'get',
        route: '/categories-management',
        controller: RenderController_1.RenderController,
        action: 'renderCategoriesManagement',
    },
    {
        method: 'get',
        route: '/categories-management/:id',
        controller: RenderController_1.RenderController,
        action: 'renderCategoryManagement',
    },
    {
        method: 'get',
        route: '/subcategories-management/:id',
        controller: RenderController_1.RenderController,
        action: 'renderSubcategoryManagement',
    },
    {
        method: 'get',
        route: '/video-management',
        controller: RenderController_1.RenderController,
        action: 'renderVideoManagement',
    },
    {
        method: 'get',
        route: '/survey-management',
        controller: RenderController_1.RenderController,
        action: 'renderSurvey',
    },
    {
        method: 'get',
        route: '/answered-surveys',
        controller: RenderController_1.RenderController,
        action: 'renderAnsweredSurvey',
    },
    {
        method: 'get',
        route: '/suggestions-management',
        controller: RenderController_1.RenderController,
        action: 'renderSuggestion',
    },
    {
        method: 'get',
        route: '/notifications-management',
        controller: RenderController_1.RenderController,
        action: 'renderNotification',
    },
    {
        method: 'get',
        route: '/help-center-management',
        controller: RenderController_1.RenderController,
        action: 'renderHelpCenter',
    },
    {
        method: 'get',
        route: '/about-management',
        controller: RenderController_1.RenderController,
        action: 'renderAbout',
    },
    {
        method: 'get',
        route: '/terms-and-conditions-management',
        controller: RenderController_1.RenderController,
        action: 'renderTermsAndConditions',
    },
    {
        method: 'get',
        route: '/privacy-policy-management',
        controller: RenderController_1.RenderController,
        action: 'renderPrivacyPolicy',
    },
    {
        method: 'get',
        route: '/analytics-management',
        controller: RenderController_1.RenderController,
        action: 'renderAnalytics',
    },
    {
        method: 'get',
        route: '/avatar-message-management',
        controller: RenderController_1.RenderController,
        action: 'renderAvatarMessages',
    },
    // ------------ Access ----------------
    {
        method: 'get',
        route: '/logout',
        controller: AccessController_1.AccessController,
        action: 'logout',
    },
    {
        method: 'post',
        route: '/login',
        controller: AccessController_1.AccessController,
        action: 'login',
        isPublic: true,
    },
    {
        method: 'post',
        route: '/register',
        controller: AccessController_1.AccessController,
        action: 'register',
    },
    // ------------ Analytics ----------------
    {
        method: 'post',
        route: '/analytics/events',
        controller: AnalyticsController_1.AnalyticsController,
        action: 'save',
    },
    // ------------ Articles Api ----------------
    {
        method: 'get',
        route: '/articles',
        controller: ArticleController_1.ArticleController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/articles/:id',
        controller: ArticleController_1.ArticleController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/articles',
        controller: ArticleController_1.ArticleController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/articles/:id',
        controller: ArticleController_1.ArticleController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/articles/:id',
        controller: ArticleController_1.ArticleController,
        action: 'remove',
    },
    {
        method: 'put',
        route: '/articles',
        controller: ArticleController_1.ArticleController,
        action: 'reorderRows',
    },
    // ------------ Videos Api ----------------
    {
        method: 'get',
        route: '/videos',
        controller: VideoController_1.VideoController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/videos/:id',
        controller: VideoController_1.VideoController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/videos',
        controller: VideoController_1.VideoController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/videos/:id',
        controller: VideoController_1.VideoController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/videos/:id',
        controller: VideoController_1.VideoController,
        action: 'remove',
    },
    {
        method: 'put',
        route: '/videos',
        controller: VideoController_1.VideoController,
        action: 'reorderRows',
    },
    // ------------ Categories Api ----------------
    {
        method: 'get',
        route: '/categories',
        controller: CategoryController_1.CategoryController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/categories/:id',
        controller: CategoryController_1.CategoryController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/categories',
        controller: CategoryController_1.CategoryController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/categories/:id',
        controller: CategoryController_1.CategoryController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/categories/:id',
        controller: CategoryController_1.CategoryController,
        action: 'remove',
    },
    {
        method: 'put',
        route: '/categories',
        controller: CategoryController_1.CategoryController,
        action: 'reorderRows',
    },
    // ------------ Subcategories Api ----------------
    {
        method: 'get',
        route: '/subcategories',
        controller: SubcategoryController_1.SubcategoryController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/subcategories/:id',
        controller: SubcategoryController_1.SubcategoryController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/subcategories',
        controller: SubcategoryController_1.SubcategoryController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/subcategories/:id',
        controller: SubcategoryController_1.SubcategoryController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/subcategories/:id',
        controller: SubcategoryController_1.SubcategoryController,
        action: 'remove',
    },
    {
        method: 'put',
        route: '/subcategories',
        controller: SubcategoryController_1.SubcategoryController,
        action: 'reorderRows',
    },
    // ------------ Quizzes Api ----------------
    {
        method: 'get',
        route: '/quiz',
        controller: QuizController_1.QuizController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/quiz/:id',
        controller: QuizController_1.QuizController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/quiz',
        controller: QuizController_1.QuizController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/quiz/:id',
        controller: QuizController_1.QuizController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/quiz/:id',
        controller: QuizController_1.QuizController,
        action: 'remove',
    },
    // ------------ Users Api ----------------
    {
        method: 'get',
        route: '/user',
        controller: UserController_1.UserController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/user/:id',
        controller: UserController_1.UserController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/user',
        controller: UserController_1.UserController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/user/change-location/',
        controller: UserController_1.UserController,
        action: 'changeLocation',
    },
    {
        method: 'put',
        route: '/user/:id',
        controller: UserController_1.UserController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/user/:id',
        controller: UserController_1.UserController,
        action: 'remove',
    },
    // ------------ Avatar Messages ----------------
    {
        method: 'get',
        route: '/avatar-message',
        controller: AvatarMessageController_1.AvatarMessageController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/avatar-message/:id',
        controller: AvatarMessageController_1.AvatarMessageController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/avatar-message',
        controller: AvatarMessageController_1.AvatarMessageController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/avatar-message/:id',
        controller: AvatarMessageController_1.AvatarMessageController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/avatar-message/:id',
        controller: AvatarMessageController_1.AvatarMessageController,
        action: 'remove',
    },
    // ------------ Did You Know Api ----------------
    {
        method: 'get',
        route: '/avatar-message',
        controller: DidYouKnowController_1.DidYouKnowController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/didyouknow/:id',
        controller: DidYouKnowController_1.DidYouKnowController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/didyouknow',
        controller: DidYouKnowController_1.DidYouKnowController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/didyouknow/:id',
        controller: DidYouKnowController_1.DidYouKnowController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/didyouknow/:id',
        controller: DidYouKnowController_1.DidYouKnowController,
        action: 'remove',
    },
    // ------------ Help Center Api ----------------
    {
        method: 'get',
        route: '/help-center',
        controller: HelpCenterController_1.HelpCenterController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/help-center/:id',
        controller: HelpCenterController_1.HelpCenterController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/help-center',
        controller: HelpCenterController_1.HelpCenterController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/help-center/:id',
        controller: HelpCenterController_1.HelpCenterController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/help-center/:id',
        controller: HelpCenterController_1.HelpCenterController,
        action: 'remove',
    },
    // ------------ Privacy Policy Api ----------------
    {
        method: 'get',
        route: '/privacy-policy',
        controller: PrivacyPolicyController_1.PrivacyPolicyController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/privacy-policy/:id',
        controller: PrivacyPolicyController_1.PrivacyPolicyController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/privacy-policy',
        controller: PrivacyPolicyController_1.PrivacyPolicyController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/privacy-policy/:id',
        controller: PrivacyPolicyController_1.PrivacyPolicyController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/privacy-policy/:id',
        controller: PrivacyPolicyController_1.PrivacyPolicyController,
        action: 'remove',
    },
    // ------------ Terms and Condition Api ----------------
    {
        method: 'get',
        route: '/terms-and-conditions',
        controller: TermsAndConditionsController_1.TermsAndConditionsController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/terms-and-conditions/:id',
        controller: TermsAndConditionsController_1.TermsAndConditionsController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/terms-and-conditions',
        controller: TermsAndConditionsController_1.TermsAndConditionsController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/terms-and-conditions/:id',
        controller: TermsAndConditionsController_1.TermsAndConditionsController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/terms-and-conditions/:id',
        controller: TermsAndConditionsController_1.TermsAndConditionsController,
        action: 'remove',
    },
    // ------------ About Api ----------------
    {
        method: 'get',
        route: '/about',
        controller: AboutController_1.AboutController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/about/:id',
        controller: AboutController_1.AboutController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/about',
        controller: AboutController_1.AboutController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/about/:id',
        controller: AboutController_1.AboutController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/about/:id',
        controller: AboutController_1.AboutController,
        action: 'remove',
    },
    // ------------ About Banner Api ----------------
    {
        method: 'post',
        route: '/about-banner-management',
        controller: AboutBannerController_1.AboutBannerController,
        action: 'saveOrUpdate',
    },
    {
        method: 'delete',
        route: '/about-banner-management/:id',
        controller: AboutBannerController_1.AboutBannerController,
        action: 'remove',
    },
    // ------------ Survey Api ----------------
    {
        method: 'get',
        route: '/survey',
        controller: SurveyController_1.SurveyController,
        action: 'all',
    },
    {
        method: 'get',
        route: '/survey/:id',
        controller: SurveyController_1.SurveyController,
        action: 'one',
    },
    {
        method: 'post',
        route: '/survey',
        controller: SurveyController_1.SurveyController,
        action: 'save',
    },
    {
        method: 'put',
        route: '/survey/:id',
        controller: SurveyController_1.SurveyController,
        action: 'update',
    },
    {
        method: 'delete',
        route: '/survey/:id',
        controller: SurveyController_1.SurveyController,
        action: 'remove',
    },
    // ------------ exposed Api ----------------
    {
        method: 'get',
        route: '/mobile/articles/:lang',
        controller: ArticleController_1.ArticleController,
        action: 'mobileArticlesByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/videos/:lang',
        controller: VideoController_1.VideoController,
        action: 'allLive',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/avatar-messages/:lang',
        controller: AvatarMessageController_1.AvatarMessageController,
        action: 'mobileAvatarMessagesByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/quizzes/:lang',
        controller: QuizController_1.QuizController,
        action: 'mobileQuizzesByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/didyouknows/:lang',
        controller: DidYouKnowController_1.DidYouKnowController,
        action: 'mobileDidYouKnowByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/surveys/:lang',
        controller: SurveyController_1.SurveyController,
        action: 'mobileSurveysByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/new-surveys/:lang',
        controller: SurveyController_1.SurveyController,
        action: 'newMobileSurveysByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/notification/:lang',
        controller: NotificationController_1.NotificationController,
        action: 'mobileNotificationsByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/help-center/:lang',
        controller: HelpCenterController_1.HelpCenterController,
        action: 'mobileHelpCenterByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/privacy-policy/:lang',
        controller: PrivacyPolicyController_1.PrivacyPolicyController,
        action: 'mobilePrivacyPolicyByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/terms-and-conditions/:lang',
        controller: TermsAndConditionsController_1.TermsAndConditionsController,
        action: 'mobileTermsAndConditionsByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/about/:lang',
        controller: AboutController_1.AboutController,
        action: 'mobileAboutByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/about-banner/:lang',
        controller: AboutBannerController_1.AboutBannerController,
        action: 'mobileAboutBannerByLanguage',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/about-banner-conditional/:lang',
        controller: AboutBannerController_1.AboutBannerController,
        action: 'mobileAboutBannerByLanguageConditional',
        isPublic: true,
    },
    // ------- suggestion Api -------
    {
        method: 'get',
        route: '/suggestions',
        controller: SuggestionController_1.SuggestionController,
        action: 'all',
    },
    {
        method: 'post',
        route: '/toggle-suggestions-status',
        controller: SuggestionController_1.SuggestionController,
        action: 'updateStatus',
    },
    {
        method: 'delete',
        route: '/suggestions/:id',
        controller: SuggestionController_1.SuggestionController,
        action: 'remove',
    },
    {
        method: 'post',
        route: '/mobile/suggestions',
        controller: SuggestionController_1.SuggestionController,
        action: 'save',
        isPublic: true,
    },
    {
        method: 'get',
        route: '/mobile/permanent-notification/:ver&:lang&:user',
        controller: NotificationController_1.NotificationController,
        action: 'mobilePermanentNotifications',
        isPublic: true,
    },
    // ------- Notification api -------
    {
        method: 'post',
        route: '/notification',
        controller: NotificationController_1.NotificationController,
        action: 'save',
    },
    {
        method: 'post',
        route: '/permanent-alert',
        controller: NotificationController_1.NotificationController,
        action: 'savePermanentAlert',
    },
    {
        method: 'put',
        route: '/permanent-alert/:id',
        controller: NotificationController_1.NotificationController,
        action: 'updatePermanentAlert',
    },
    {
        method: 'delete',
        route: '/permanent-alert/:id',
        controller: NotificationController_1.NotificationController,
        action: 'removePermanentAlert',
    },
    {
        method: 'delete',
        route: '/notification/:id',
        controller: NotificationController_1.NotificationController,
        action: 'remove',
    },
    // ------- Data api -------
    {
        method: 'get',
        route: '/data',
        controller: RenderController_1.RenderController,
        action: 'renderDataManagement',
    },
    {
        method: 'get',
        route: '/data/generate-content-ts',
        controller: DataController_1.DataController,
        action: 'generateContentTs',
    },
    {
        method: 'get',
        route: '/data/generate-content-sheet',
        controller: DataController_1.DataController,
        action: 'generateContentSheet',
    },
    {
        method: 'get',
        route: '/data/generate-app-translations-sheet',
        controller: DataController_1.DataController,
        action: 'generateAppTranslationsSheet',
    },
    {
        method: 'get',
        route: '/data/generate-cms-translations-sheet',
        controller: DataController_1.DataController,
        action: 'generateCmsTranslationsSheet',
    },
    {
        method: 'get',
        route: '/data/generate-countries-sheet',
        controller: DataController_1.DataController,
        action: 'generateCountriesSheet',
    },
    {
        method: 'get',
        route: '/data/generate-provinces-sheet',
        controller: DataController_1.DataController,
        action: 'generateProvincesSheet',
    },
];
//# sourceMappingURL=routes.js.map