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
exports.SuggestionController = void 0;
const typeorm_1 = require("typeorm");
const Suggestion_1 = require("../entity/Suggestion");
const uuid_1 = require("uuid");
class SuggestionController {
    constructor() {
        this.suggestionRepository = (0, typeorm_1.getRepository)(Suggestion_1.Suggestion);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.suggestionRepository.find({
                where: { lang: request.user.lang },
                order: {
                    id: 'ASC',
                },
            });
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const suggestionToSave = request.body;
            suggestionToSave.id = (0, uuid_1.v4)();
            yield this.suggestionRepository.save(suggestionToSave);
            return suggestionToSave;
        });
    }
    updateStatus(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const suggestionToUpdate = yield this.suggestionRepository.findOne(request.body.id);
            suggestionToUpdate.status = request.body.status === '1' ? 'open' : 'close';
            yield this.suggestionRepository.save(suggestionToUpdate);
            return suggestionToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyToRemove = yield this.suggestionRepository.findOne(request.params.id);
            yield this.suggestionRepository.remove(surveyToRemove);
            return surveyToRemove;
        });
    }
}
exports.SuggestionController = SuggestionController;
//# sourceMappingURL=SuggestionController.js.map