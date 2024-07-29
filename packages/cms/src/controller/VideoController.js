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
exports.VideoController = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const Video_1 = require("../entity/Video");
const common_1 = require("../helpers/common");
class VideoController {
    constructor() {
        this.videoRepository = (0, typeorm_1.getRepository)(Video_1.Video);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.videoRepository.find({ where: { lang: request.user.lang } });
        });
    }
    allLive(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.videoRepository.find({
                where: { lang: request.params.lang, live: true },
                order: { sortingKey: 'ASC' },
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.videoRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoWithSameTitle = yield this.videoRepository.findOne({
                title: request.body.title,
            });
            if (videoWithSameTitle) {
                return { video: videoWithSameTitle, isExist: true };
            }
            const itemToSave = request.body;
            itemToSave.lang = request.user.lang;
            itemToSave.id = (0, uuid_1.v4)();
            yield this.videoRepository.save(itemToSave);
            return itemToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoWithSameTitle = yield this.videoRepository.findOne({
                title: request.body.title,
            });
            if (videoWithSameTitle && request.params.id !== videoWithSameTitle.id) {
                return { video: videoWithSameTitle, isExist: true };
            }
            const videoToUpdate = yield this.videoRepository.findOne(request.params.id);
            const booleanFromString = request.body.live === 'true';
            videoToUpdate.title = request.body.title;
            videoToUpdate.youtubeId = request.body.youtubeId;
            videoToUpdate.assetName = request.body.assetName;
            videoToUpdate.live = booleanFromString;
            videoToUpdate.lang = request.user.lang;
            yield this.videoRepository.save(videoToUpdate);
            return videoToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemToRemove = yield this.videoRepository.findOne(request.params.id);
            yield this.videoRepository.remove(itemToRemove);
            return itemToRemove;
        });
    }
    reorderRows(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
                return yield (0, common_1.bulkUpdateRowReorder)(this.videoRepository, request.body.rowReorderResult);
            }
            return yield this.videoRepository.find({
                where: {
                    lang: request.params.lang,
                },
                order: {
                    sortingKey: 'ASC',
                },
            });
        });
    }
}
exports.VideoController = VideoController;
//# sourceMappingURL=VideoController.js.map