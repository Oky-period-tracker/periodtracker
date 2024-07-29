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
exports.CategoryController = void 0;
const typeorm_1 = require("typeorm");
const Category_1 = require("../entity/Category");
const Subcategory_1 = require("../entity/Subcategory");
const Article_1 = require("../entity/Article");
const uuid_1 = require("uuid");
const env_1 = require("../env");
const common_1 = require("../helpers/common");
class CategoryController {
    constructor() {
        this.categoryRepository = (0, typeorm_1.getRepository)(Category_1.Category);
        this.subcategoryRepository = (0, typeorm_1.getRepository)(Subcategory_1.Subcategory);
        this.articleRepository = (0, typeorm_1.getRepository)(Article_1.Article);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.categoryRepository.find();
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.categoryRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.query(`SELECT * FROM ${env_1.env.db.schema}.category WHERE title = $1 or primary_emoji = $2`, [request.body.title, request.body.primary_emoji]);
            if (category && category.length)
                return { duplicate: true, category: category[0], body: request.body };
            yield this.categoryRepository.save({
                id: (0, uuid_1.v4)(),
                title: request.body.title,
                primary_emoji: request.body.primary_emoji,
                primary_emoji_name: request.body.primary_emoji_name,
                lang: request.user.lang,
            });
            return request.body;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.query(`SELECT * FROM ${env_1.env.db.schema}.category WHERE title = $1 or primary_emoji = $2`, [request.body.title, request.body.primary_emoji]);
            if (category && category.length && category[0].id !== request.params.id)
                return { duplicate: true, category: category[0], body: request.body };
            const categoryToUpdate = yield this.categoryRepository.findOne(request.params.id);
            categoryToUpdate.title = request.body.title;
            categoryToUpdate.primary_emoji = request.body.primary_emoji;
            categoryToUpdate.primary_emoji_name = request.body.primary_emoji_name;
            categoryToUpdate.lang = request.user.lang;
            yield this.categoryRepository.save(categoryToUpdate);
            return categoryToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryToRemove = yield this.categoryRepository.findOne(request.params.id);
            const subcategoriesToRemove = yield this.subcategoryRepository.find({
                where: {
                    parent_category: categoryToRemove.id,
                },
            });
            const articlesToRemove = yield this.articleRepository.find({
                where: {
                    category: categoryToRemove.id,
                },
            });
            yield this.categoryRepository.remove(categoryToRemove);
            yield this.subcategoryRepository.remove(subcategoriesToRemove);
            yield this.articleRepository.remove(articlesToRemove);
            return categoryToRemove;
        });
    }
    reorderRows(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
                return yield (0, common_1.bulkUpdateRowReorder)(this.categoryRepository, request.body.rowReorderResult);
            }
            return yield this.categoryRepository.find({
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
exports.CategoryController = CategoryController;
//# sourceMappingURL=CategoryController.js.map