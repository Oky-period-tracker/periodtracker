"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const searchFunctions_1 = require("../../../src/screens/encyclopediaScreen/searchFunctions");
// @ts-ignore
const core_1 = require("@oky/core");
const content = core_1.liveContent[core_1.defaultLocale];
const articles = content.articles.allIds.map((id) => content.articles.byId[id]);
const categories = content.categories.allIds.map((id) => content.categories.byId[id]);
const subCategories = content.subCategories.allIds.map((id) => content.subCategories.byId[id]);
const existingCategory = categories[0];
const existingSubCategory = content.subCategories.byId[existingCategory.subCategories[0]];
const existingArticle = content.articles.byId[existingSubCategory.articles[0]];
describe('handleSearchResult', () => {
    const locale = core_1.defaultLocale;
    it('should return empty array if search string is empty', () => {
        expect((0, searchFunctions_1.handleSearchResult)('', categories, subCategories, articles, locale)).toEqual([]);
    });
    it('should return categories that match the search string', () => {
        const searchResult = (0, searchFunctions_1.handleSearchResult)(existingCategory.name, categories, subCategories, articles, locale);
        expect(searchResult).toEqual([existingCategory]);
    });
    it('should return categories whose subcategories match the search string', () => {
        const searchResult = (0, searchFunctions_1.handleSearchResult)(existingSubCategory.name, categories, subCategories, articles, locale);
        expect(searchResult).toContainEqual(existingCategory);
    });
    it('should return categories whose articles match the search string', () => {
        const searchResult = (0, searchFunctions_1.handleSearchResult)(existingArticle.title, categories, subCategories, articles, locale);
        expect(searchResult).toContainEqual(existingCategory);
    });
    it('should return an empty array if no matches are found', () => {
        const searchResult = (0, searchFunctions_1.handleSearchResult)('Nonexistent', categories, subCategories, articles, locale);
        expect(searchResult).toEqual([]);
    });
});
//# sourceMappingURL=searchFunctions.test.js.map