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
exports.SubcategoryController = void 0;
const typeorm_1 = require("typeorm");
const Subcategory_1 = require("../entity/Subcategory");
const Article_1 = require("../entity/Article");
const uuid_1 = require("uuid");
const common_1 = require("../helpers/common");
class SubcategoryController {
    constructor() {
        this.subCategoryRepository = (0, typeorm_1.getRepository)(Subcategory_1.Subcategory);
        this.articleRepository = (0, typeorm_1.getRepository)(Article_1.Article);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.subCategoryRepository.find();
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.subCategoryRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const sub_category = yield this.subCategoryRepository.findOne({
                title: request.body.title,
                parent_category: request.body.parent_category,
            });
            if (sub_category)
                return { duplicate: true };
            yield this.subCategoryRepository.save({
                id: (0, uuid_1.v4)(),
                title: request.body.title,
                parent_category: request.body.parent_category,
                lang: request.user.lang,
            });
            return request.body;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const sub_category = yield this.subCategoryRepository.findOne({
                title: request.body.title,
                parent_category: request.body.parent_category,
            });
            if (sub_category && sub_category.id !== request.params.id)
                return { duplicate: true };
            const subCategoryToUpdate = yield this.subCategoryRepository.findOne(request.params.id);
            subCategoryToUpdate.title = request.body.title;
            subCategoryToUpdate.parent_category = request.body.parent_category;
            subCategoryToUpdate.lang = request.user.lang;
            yield this.subCategoryRepository.save(subCategoryToUpdate);
            return subCategoryToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategoryToRemove = yield this.subCategoryRepository.findOne(request.params.id);
            const articlesToRemove = yield this.articleRepository.find({
                where: {
                    subcategory: subCategoryToRemove.id,
                },
            });
            yield this.subCategoryRepository.remove(subCategoryToRemove);
            yield this.articleRepository.remove(articlesToRemove);
            return subCategoryToRemove;
        });
    }
    reorderRows(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
                return yield (0, common_1.bulkUpdateRowReorder)(this.subCategoryRepository, request.body.rowReorderResult);
            }
            return yield this.subCategoryRepository.find({
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
exports.SubcategoryController = SubcategoryController;
//# sourceMappingURL=SubcategoryController.js.map