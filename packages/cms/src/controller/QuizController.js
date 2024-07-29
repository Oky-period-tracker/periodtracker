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
exports.QuizController = void 0;
const typeorm_1 = require("typeorm");
const Quiz_1 = require("../entity/Quiz");
const uuid_1 = require("uuid");
class QuizController {
    constructor() {
        this.quizRepository = (0, typeorm_1.getRepository)(Quiz_1.Quiz);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizRepository.find({
                where: { lang: request.user.lang, live: true },
                order: {
                    topic: 'ASC',
                },
            });
        });
    }
    mobileQuizzesByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizRepository.find({
                where: {
                    lang: request.params.lang,
                    live: true,
                },
                order: {
                    topic: 'ASC',
                },
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.quizRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizToSave = request.body;
            const booleanFromStringLive = request.body.live === 'true';
            const booleanFromStringAge = request.body.isAgeRestricted === 'true';
            quizToSave.lang = request.user.lang;
            quizToSave.live = booleanFromStringLive;
            quizToSave.isAgeRestricted = booleanFromStringAge;
            quizToSave.id = (0, uuid_1.v4)();
            yield this.quizRepository.save(quizToSave);
            return quizToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const booleanFromStringLive = request.body.live === 'true';
            const booleanFromStringAge = request.body.isAgeRestricted === 'true';
            const quizToUpdate = yield this.quizRepository.findOne(request.params.id);
            quizToUpdate.topic = request.body.topic;
            quizToUpdate.question = request.body.question;
            quizToUpdate.option1 = request.body.option1;
            quizToUpdate.option2 = request.body.option2;
            quizToUpdate.option3 = request.body.option3;
            quizToUpdate.right_answer = request.body.right_answer;
            quizToUpdate.wrong_answer_response = request.body.wrong_answer_response;
            quizToUpdate.right_answer_response = request.body.right_answer_response;
            quizToUpdate.live = booleanFromStringLive;
            quizToUpdate.isAgeRestricted = booleanFromStringAge;
            quizToUpdate.lang = request.user.lang;
            yield this.quizRepository.save(quizToUpdate);
            return quizToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizToRemove = yield this.quizRepository.findOne(request.params.id);
            yield this.quizRepository.remove(quizToRemove);
            return quizToRemove;
        });
    }
}
exports.QuizController = QuizController;
//# sourceMappingURL=QuizController.js.map