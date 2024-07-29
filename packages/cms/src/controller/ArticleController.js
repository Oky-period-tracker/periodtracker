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
exports.ArticleController = void 0;
const typeorm_1 = require("typeorm");
const Article_1 = require("../entity/Article");
const uuid_1 = require("uuid");
const env_1 = require("../env");
const common_1 = require("../helpers/common");
class ArticleController {
    constructor() {
        this.articleRepository = (0, typeorm_1.getRepository)(Article_1.Article);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.articleRepository.find({
                where: {
                    lang: request.user.lang,
                },
                order: {
                    sortingKey: 'ASC',
                },
            });
        });
    }
    mobileArticlesByLanguage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.articleRepository.query(`SELECT ar.id, ca.title as category_title, 
      ca.id as cat_id, sc.title as subcategory_title, 
      sc.id as subcat_id, 
      ar.article_heading, 
      ar.article_text, 
      ca.primary_emoji,
      ca.primary_emoji_name,
      ar.lang 
      FROM ${env_1.env.db.schema}.article ar 
      INNER JOIN ${env_1.env.db.schema}.category ca 
      ON ar.category = ca.id::varchar
      INNER JOIN ${env_1.env.db.schema}.subcategory sc  
      ON ar.subcategory = sc.id::varchar
      WHERE ar.lang = $1
      AND ar.live = true
      ORDER BY ca."sortingKey" ASC, sc."sortingKey" ASC, ar."sortingKey" ASC
      `, [request.params.lang]);
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.articleRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articleRepository.findOne({
                article_heading: request.body.article_heading,
            });
            if (article) {
                return { article, isExist: true };
            }
            const articleToSave = request.body;
            articleToSave.lang = request.user.lang;
            articleToSave.id = (0, uuid_1.v4)();
            yield this.articleRepository.save(articleToSave);
            return articleToSave;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield this.articleRepository.findOne({
                article_heading: request.body.article_heading,
            });
            if (article && request.params.id !== article.id) {
                return { article, isExist: true };
            }
            const booleanFromString = request.body.live === 'true';
            const articleToUpdate = yield this.articleRepository.findOne(request.params.id);
            articleToUpdate.category = request.body.category;
            articleToUpdate.subcategory = request.body.subcategory;
            articleToUpdate.article_heading = request.body.article_heading;
            articleToUpdate.article_text = request.body.article_text;
            articleToUpdate.live = booleanFromString;
            articleToUpdate.lang = request.user.lang;
            yield this.articleRepository.save(articleToUpdate);
            return articleToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleToRemove = yield this.articleRepository.findOne(request.params.id);
            yield this.articleRepository.remove(articleToRemove);
            return articleToRemove;
        });
    }
    reorderRows(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
                return yield (0, common_1.bulkUpdateRowReorder)(this.articleRepository, request.body.rowReorderResult);
            }
            return yield this.articleRepository.find({
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
exports.ArticleController = ArticleController;
//# sourceMappingURL=ArticleController.js.map