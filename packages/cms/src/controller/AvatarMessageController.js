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
exports.AvatarMessageController = void 0;
const typeorm_1 = require("typeorm");
const AvatarMessages_1 = require("../entity/AvatarMessages");
const uuid_1 = require("uuid");
class AvatarMessageController {
    constructor() {
        this.avatarMessageRepository = (0, typeorm_1.getRepository)(AvatarMessages_1.AvatarMessages);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.avatarMessageRepository.find({ where: { lang: request.user.lang } });
        });
    }
    // @TODO: may need to physically order things here for the api
    mobileAvatarMessagesByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.avatarMessageRepository.find({
                where: { lang: request.params.lang, live: true },
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.avatarMessageRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarMessageToSave = request.body;
            avatarMessageToSave.id = (0, uuid_1.v4)();
            avatarMessageToSave.lang = request.user.lang;
            yield this.avatarMessageRepository.save(avatarMessageToSave);
            return avatarMessageToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const booleanFromStringLive = request.body.live === 'true';
            const avatarMessageToUpdate = yield this.avatarMessageRepository.findOne(request.params.id);
            avatarMessageToUpdate.content = request.body.content;
            avatarMessageToUpdate.lang = request.user.lang;
            avatarMessageToUpdate.live = booleanFromStringLive;
            yield this.avatarMessageRepository.save(avatarMessageToUpdate);
            return avatarMessageToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const avatarMessageToRemove = yield this.avatarMessageRepository.findOne(request.params.id);
            yield this.avatarMessageRepository.remove(avatarMessageToRemove);
            return avatarMessageToRemove;
        });
    }
}
exports.AvatarMessageController = AvatarMessageController;
//# sourceMappingURL=AvatarMessageController.js.map