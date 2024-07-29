"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderController = void 0;
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
const Article_1 = require("../entity/Article");
const Quiz_1 = require("../entity/Quiz");
const User_1 = require("../entity/User");
const Survey_1 = require("../entity/Survey");
const Category_1 = require("../entity/Category");
const DidYouKnow_1 = require("../entity/DidYouKnow");
const Suggestion_1 = require("../entity/Suggestion");
const Notification_1 = require("../entity/Notification");
const Subcategory_1 = require("../entity/Subcategory");
const access_control_1 = require("../access/access-control");
const analytics_1 = require("../services/analytics");
const HelpCenter_1 = require("../entity/HelpCenter");
const About_1 = require("../entity/About");
const AvatarMessages_1 = require("../entity/AvatarMessages");
const PermanentNotification_1 = require("../entity/PermanentNotification");
const core_1 = require("@oky/core");
const TermsAndConditions_1 = require("../entity/TermsAndConditions");
const PrivacyPolicy_1 = require("../entity/PrivacyPolicy");
const AboutBanner_1 = require("../entity/AboutBanner");
const Question_1 = require("../entity/Question");
const env_1 = require("../env");
const Video_1 = require("../entity/Video");
const options_1 = require("../i18n/options");
class RenderController {
    constructor() {
        this.articleRepository = (0, typeorm_1.getRepository)(Article_1.Article);
        this.videoRepository = (0, typeorm_1.getRepository)(Video_1.Video);
        this.categoryRepository = (0, typeorm_1.getRepository)(Category_1.Category);
        this.subcategoryRepository = (0, typeorm_1.getRepository)(Subcategory_1.Subcategory);
        this.quizRepository = (0, typeorm_1.getRepository)(Quiz_1.Quiz);
        this.userRepository = (0, typeorm_1.getRepository)(User_1.User);
        this.didYouKnowRepository = (0, typeorm_1.getRepository)(DidYouKnow_1.DidYouKnow);
        this.helpCenterRepository = (0, typeorm_1.getRepository)(HelpCenter_1.HelpCenter);
        this.aboutRepository = (0, typeorm_1.getRepository)(About_1.About);
        this.aboutBannerRepository = (0, typeorm_1.getRepository)(AboutBanner_1.AboutBanner);
        this.termsAndConditionsRepository = (0, typeorm_1.getRepository)(TermsAndConditions_1.TermsAndConditions);
        this.privacyPolicyRepository = (0, typeorm_1.getRepository)(PrivacyPolicy_1.PrivacyPolicy);
        this.suggestionRepository = (0, typeorm_1.getRepository)(Suggestion_1.Suggestion);
        this.notificationRepository = (0, typeorm_1.getRepository)(Notification_1.Notification);
        this.permanentNotificationRepository = (0, typeorm_1.getRepository)(PermanentNotification_1.PermanentNotification);
        this.avatarMessagesRepository = (0, typeorm_1.getRepository)(AvatarMessages_1.AvatarMessages);
        // Apply global render options to all views here
        this.globalRenderOptions = {
            cmsLanguages: options_1.cmsLanguages,
        };
    }
    render(response, view, options, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            response.render(view, Object.assign(Object.assign({}, this.globalRenderOptions), options), callback);
        });
    }
    renderLogin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.render(response, 'Login');
        });
    }
    renderAnalytics(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateFrom = request.query.dateFrom || null;
            const dateTo = request.query.dateTo || null;
            const gender = request.query.gender || null;
            const location = request.query.location || null;
            const params = [gender, location, dateFrom, dateTo];
            const entityManager = yield (0, typeorm_1.getManager)();
            const usersGenders = yield entityManager.query(analytics_1.analyticsQueries.usersGender, params);
            const usersLocations = yield entityManager.query(analytics_1.analyticsQueries.usersLocations, params);
            const usersAgeGroups = yield entityManager.query(analytics_1.analyticsQueries.usersAgeGroups, params);
            const preProcessedProvinceList = yield entityManager.query(analytics_1.analyticsQueries.usersProvince, params);
            const preProcessedCountryList = yield entityManager.query(analytics_1.analyticsQueries.usersCountries, params);
            const usersShares = yield entityManager.query(analytics_1.analyticsQueries.usersShares);
            const directDownloads = yield entityManager.query(analytics_1.analyticsQueries.directDownloads);
            const usersCountries = preProcessedCountryList.reduce((acc, item) => {
                const country = core_1.countries[item.country] || {
                    [request.user.lang]: `None`,
                };
                const countryName = country[request.user.lang];
                return Object.assign(Object.assign({}, acc), { [countryName]: item.value });
            }, {});
            const usersProvinces = preProcessedProvinceList.reduce((acc, item) => {
                const province = core_1.provinces.find((prov) => prov.uid.toString() === item.province) || {
                    code: '00',
                    uid: 0,
                    [request.user.lang]: `Other`,
                };
                const provinceName = province[request.user.lang];
                const country = core_1.countries[item.country] || {
                    [request.user.lang]: `None`,
                };
                const countryName = country[request.user.lang];
                return Object.assign(Object.assign({}, acc), { [countryName]: Object.assign(Object.assign({}, acc[countryName]), { [provinceName]: item.value }) });
            }, {});
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
                };
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
            });
        });
    }
    renderQuiz(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = yield (0, typeorm_1.getManager)();
            const quizzes = yield this.quizRepository.find({
                where: { lang: request.user.lang },
                order: {
                    topic: 'ASC',
                },
            });
            const answeredQuizzes = yield entityManager.query(analytics_1.analyticsQueries.answeredQuizzesByID);
            this.render(response, 'Quiz', { quizzes, answeredQuizzes });
        });
    }
    renderHelpCenter(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const helpCenters = yield this.helpCenterRepository.find({
                where: { lang: request.user.lang },
            });
            this.render(response, 'HelpCenter', { helpCenters });
        });
    }
    renderAbout(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const aboutVersions = yield this.aboutRepository.find({
                where: { lang: request.user.lang },
            });
            const aboutBannerItem = yield this.aboutBannerRepository.findOne({
                where: { lang: request.user.lang },
            });
            this.render(response, 'About', {
                aboutVersions,
                image: aboutBannerItem ? aboutBannerItem.image : null,
            });
        });
    }
    renderPrivacyPolicy(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const privacyPolicyVersions = yield this.privacyPolicyRepository.find({
                where: { lang: request.user.lang },
            });
            this.render(response, 'PrivacyPolicy', { privacyPolicyVersions });
        });
    }
    renderTermsAndConditions(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const termsAndConditionsVersions = yield this.termsAndConditionsRepository.find({
                where: { lang: request.user.lang },
            });
            this.render(response, 'TermsAndConditions', { termsAndConditionsVersions });
        });
    }
    renderSurvey(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = yield (0, typeorm_1.getManager)();
            const answeredSurveys = yield entityManager.query(analytics_1.analyticsQueries.answeredSurveysByID);
            const surveys = yield (0, typeorm_1.createQueryBuilder)('survey')
                .from(Survey_1.Survey, 'survey')
                .where({ lang: request.user.lang })
                .orderBy('survey.date_created')
                .leftJoinAndMapMany('survey.questions', Question_1.Question, 'question', 'question.surveyId = survey.id')
                .addOrderBy('question.sort_number ', 'ASC')
                .select(['survey', 'question'])
                .getMany();
            this.render(response, 'Survey', {
                moment: moment_1.default,
                surveys,
                answeredSurveys,
                query: Object.assign(Object.assign({}, request.query), { age: `${request.query.start_age}_${request.query.end_age}` }),
            });
        });
    }
    renderAnsweredSurvey(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = yield (0, typeorm_1.getManager)();
            const answeredSurveys = yield entityManager.query(analytics_1.analyticsQueries.filterSurvey, [
                request.query.gender || null,
                request.query.location || null,
                request.query.start_age || null,
                request.query.end_age || null,
            ]);
            return {
                answeredSurveys: answeredSurveys.map((e) => {
                    const countryOb = core_1.countries[e.country];
                    const country = countryOb ? countryOb[request.user.lang] || countryOb.en : '';
                    return Object.assign(Object.assign({}, e), { country });
                }),
            };
        });
    }
    renderDidYouKnow(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const didYouKnows = yield this.didYouKnowRepository.find({
                where: { lang: request.user.lang },
                order: {
                    title: 'ASC',
                },
            });
            this.render(response, 'DidYouKnow', { didYouKnows });
        });
    }
    renderEncyclopedia(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const articles = yield this.articleRepository.query(`SELECT ar.id, ca.title as category_title, ca.id as category_id, sc.title as subcategory_title, sc.id as subcategory_id, ar.article_heading, ar.article_text, ar.live as live, ca.primary_emoji, ar.lang, ar.date_created, ar.*
      FROM ${env_1.env.db.schema}.article ar 
      INNER JOIN ${env_1.env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env_1.env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      ORDER BY ca."sortingKey" ASC, sc."sortingKey" ASC, ar."sortingKey" ASC
      `, [request.user.lang]);
            const categories = yield this.categoryRepository.find({
                where: { lang: request.user.lang },
            });
            const subcategories = yield this.subcategoryRepository.find({
                where: { lang: request.user.lang },
            });
            this.render(response, 'Encyclopedia', { articles, categories, subcategories });
        });
    }
    renderCategoriesManagement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.categoryRepository.find({
                where: { lang: request.user.lang },
                order: { sortingKey: 'ASC' },
            });
            this.render(response, 'Categories', { categories });
        });
    }
    renderCategoryManagement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.categoryRepository.find({
                where: { id: request.params.id },
            });
            const subcategories = yield this.subcategoryRepository.query(`SELECT sc.id, sc.title, ca.title as parent_category, ca.id as parent_category_id, sc."sortingKey"
      FROM ${env_1.env.db.schema}.subcategory sc
      INNER JOIN ${env_1.env.db.schema}.category ca
      ON sc.parent_category = ca.id::varchar
      WHERE sc.lang = $1
      AND sc.parent_category = $2
      ORDER BY sc."sortingKey" ASC
      `, [request.user.lang, request.params.id]);
            this.render(response, 'Category', { categories, subcategories });
        });
    }
    renderSubcategoryManagement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const subcategories = yield this.subcategoryRepository.find({
                where: { id: request.params.id },
            });
            const categories = yield this.categoryRepository.find({
                where: { id: subcategories[0].parent_category },
                order: { sortingKey: 'ASC' },
            });
            const articles = yield this.articleRepository.query(`SELECT ar.id, ca.title as category_title, ca.id as category_id, sc.title as subcategory_title, sc.id as subcategory_id, ar.article_heading, ar.article_text, ar.live as live, ca.primary_emoji, ar.lang, ar.date_created, ar.*
      FROM ${env_1.env.db.schema}.article ar 
      INNER JOIN ${env_1.env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env_1.env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      AND sc.id = $2
      ORDER BY ca."sortingKey" ASC, sc."sortingKey" ASC, ar."sortingKey" ASC
      `, [request.user.lang, request.params.id]);
            this.render(response, 'Subcategory', { categories, subcategories, articles });
        });
    }
    renderVideoManagement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield this.videoRepository.find({
                where: { lang: request.user.lang },
                order: { sortingKey: 'ASC' },
            });
            this.render(response, 'Videos', { videos });
        });
    }
    renderUserManagement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const viewableItems = [];
            if (request.user.type === 'contentManager') {
                response.status(400).send({ error: 'No permission rights to do that' });
            }
            if (access_control_1.accessControlList.can(request.user.type, 'createSuperAdmin')) {
                viewableItems.push({ type: 'superAdmin' });
                viewableItems.push({ type: 'admin' });
            }
            if (access_control_1.accessControlList.can(request.user.type, 'createContentManager')) {
                if (!access_control_1.accessControlList.can(request.user.type, 'createSuperAdmin')) {
                    viewableItems.push({ type: 'contentManager', lang: request.user.lang });
                }
                else {
                    viewableItems.push({ type: 'contentManager' });
                }
            }
            const users = yield this.userRepository.find({
                select: ['id', 'username', 'type', 'lang', 'date_created'],
                where: viewableItems,
            });
            this.render(response, 'UserManagement', { users, moment: moment_1.default });
        });
    }
    renderSuggestion(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
            };
            const where = { lang: request.user.lang };
            if (request.query.reason) {
                where.reason = request.query.reason;
            }
            const orderKey = request.query.order_key || null;
            const orderSequence = request.query.order_sequence || null;
            const suggestions = yield this.suggestionRepository.find({
                where,
                order: {
                    [orderKey || 'id']: orderSequence || 'ASC',
                },
            });
            this.render(response, 'Suggestion', {
                suggestions,
                moment: moment_1.default,
                reasons,
                reasonFilter: request.query.reason,
                orderKey,
                orderSequence,
            });
        });
    }
    renderNotification(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.notificationRepository.find({
                where: {
                    lang: request.user.lang,
                },
                order: {
                    id: 'ASC',
                },
            });
            const permanentNotifications = yield this.permanentNotificationRepository.find({
                where: {
                    lang: request.user.lang,
                },
                order: {
                    id: 'ASC',
                },
            });
            this.render(response, 'Notification', {
                notifications,
                permanentNotifications,
                moment: moment_1.default,
            });
        });
    }
    renderAvatarMessages(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarMessages = yield this.avatarMessagesRepository.find({
                where: {
                    lang: request.user.lang,
                },
                order: {
                    id: 'ASC',
                },
            });
            this.render(response, 'AvatarMessages', { avatarMessages });
        });
    }
    renderDataManagement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.render(response, 'DataManagement');
        });
    }
}
exports.RenderController = RenderController;
//# sourceMappingURL=RenderController.js.map