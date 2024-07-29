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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyController = void 0;
const typeorm_1 = require("typeorm");
const date_fns_1 = require("date-fns");
const Survey_1 = require("../entity/Survey");
const Question_1 = require("../entity/Question");
const uuid_1 = require("uuid");
const env_1 = require("../env");
// TODO_ALEX: survey
const reformatSurveyData = (res) => {
    return res.map((sur) => (Object.assign(Object.assign({}, sur), { questions: sur.questions
            .sort((a, b) => a.sort_number - b.sort_number)
            .map((que) => {
            let options = [];
            Array(5)
                .fill(0)
                .map((_, i) => {
                if (que[`option${i + 1}`])
                    options = [...options, { [`option${i + 1}`]: que[`option${i + 1}`] }];
                delete que[`option${i + 1}`];
            });
            return Object.assign(Object.assign({}, que), { next_question: que.next_question, options });
        }) })));
};
class SurveyController {
    constructor() {
        this.surveyRepository = (0, typeorm_1.getRepository)(Survey_1.Survey);
        this.questionRepository = (0, typeorm_1.getRepository)(Question_1.Question);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, typeorm_1.createQueryBuilder)('survey')
                .from(Survey_1.Survey, 'survey')
                .where({ lang: request.params.lang })
                .leftJoinAndMapMany('survey.questions', Question_1.Question, 'question', 'question.surveyId = survey.id')
                .select(['survey', 'question'])
                .getMany();
        });
    }
    newMobileSurveysByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = (0, typeorm_1.getManager)();
            const completedSurveys = yield entityManager.query(`SELECT id FROM ${env_1.env.db.schema}.answered_surveys where user_id = $1 GROUP BY answered_surveys.id`, [request.query.user_id]);
            const ids = completedSurveys.length > 0
                ? completedSurveys.map((surveyAnswer) => surveyAnswer.id)
                : [(0, uuid_1.v4)()];
            return yield (0, typeorm_1.createQueryBuilder)('survey')
                .from(Survey_1.Survey, 'survey')
                .where(`survey.lang=:lang and survey.live=:live AND survey.date_created BETWEEN :start_date AND :end_date AND survey.id NOT IN (:...ids)
      AND (survey.isAgeRestricted=true AND DATE_PART('year', age(:end_date, oky_user.date_of_birth)) > 14 OR survey.isAgeRestricted=false)
      `, {
                lang: request.params.lang,
                live: true,
                start_date: (0, date_fns_1.subMonths)(new Date(), 1),
                end_date: new Date(),
                ids,
            })
                .leftJoin('oky_user', 'oky_user', 'oky_user.id = :id', { id: request.query.user_id })
                .leftJoinAndMapMany('survey.questions', Question_1.Question, 'question', 'question.surveyId = survey.id')
                .select(['survey', 'question'])
                .getMany()
                .then((res) => reformatSurveyData(res));
        });
    }
    mobileSurveysByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.surveyRepository.find({
                where: { lang: request.params.lang, live: true, question: (0, typeorm_1.Not)('') },
                order: { question: 'ASC' },
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.surveyRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyToSave = {
                question: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                option5: '',
                response: '',
                is_multiple: true,
                isAgeRestricted: false,
                live: false,
                lang: null,
                id: null,
            };
            surveyToSave.live = request.body.live;
            surveyToSave.lang = request.user.lang;
            surveyToSave.id = (0, uuid_1.v4)();
            const survay = yield this.surveyRepository.save(surveyToSave);
            request.body.questions.forEach((question) => __awaiter(this, void 0, void 0, function* () {
                yield this.questionRepository.save(Object.assign(Object.assign({}, question), { id: (0, uuid_1.v4)(), surveyId: survay.id, is_multiple: question.is_multiple === 'true' }));
            }));
            // console.log('after-create', survay, request.body)
            return surveyToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.body.questions && request.body.questions.length) {
                request.body.questions.forEach((question) => __awaiter(this, void 0, void 0, function* () {
                    if (!question.id || question.id === '') {
                        delete question.id;
                        yield this.questionRepository.save(Object.assign(Object.assign({}, question), { id: (0, uuid_1.v4)(), surveyId: request.params.id, is_multiple: question.is_multiple === 'true' }));
                    }
                    else {
                        const questionToUpdate = yield this.questionRepository.findOne(question.id);
                        delete question.id;
                        yield this.questionRepository.save(Object.assign(Object.assign(Object.assign({}, questionToUpdate), question), { is_multiple: question.is_multiple === 'true' }));
                    }
                }));
                if (request.body.deletedQuestion) {
                    request.body.deletedQuestion.map((id) => __awaiter(this, void 0, void 0, function* () {
                        const question = yield this.questionRepository.findOne(id);
                        yield this.questionRepository.remove(question);
                    }));
                }
            }
            const surveyToUpdate = yield this.surveyRepository.findOne(request.params.id);
            surveyToUpdate.lang = request.user.lang;
            if (request.body.live)
                surveyToUpdate.live = request.body.live === 'true';
            else
                surveyToUpdate.live = surveyToUpdate.live;
            if (request.body.isAgeRestricted)
                surveyToUpdate.isAgeRestricted = request.body.isAgeRestricted === 'true';
            yield this.surveyRepository.save(surveyToUpdate);
            return true;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield this.questionRepository.find({ where: { surveyId: request.params.id } });
            yield this.questionRepository.remove(questions);
            const surveyToRemove = yield this.surveyRepository.findOne(request.params.id);
            yield this.surveyRepository.remove(surveyToRemove);
            return surveyToRemove;
        });
    }
}
exports.SurveyController = SurveyController;
//# sourceMappingURL=SurveyController.js.map