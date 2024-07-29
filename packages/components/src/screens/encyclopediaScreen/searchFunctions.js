"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSearchResult = void 0;
exports.handleCategoriesFilter = handleCategoriesFilter;
const handleSearchResult = (searchStr, categories, subCategories, articles, locale) => {
    if (searchStr === '')
        return [];
    const lowerCaseSearchStr = searchStr.toLocaleLowerCase(locale);
    const searchResultCategories = categories.filter((category) => {
        const doesSubCategoryOrArticlesContainString = category.subCategories.some((subCatId) => {
            const relevantSubCategory = subCategories.find((item) => item.id === subCatId);
            const doesSubCategoryContainString = relevantSubCategory.name
                .toLocaleLowerCase(locale)
                .includes(lowerCaseSearchStr);
            const doesArticleContainString = relevantSubCategory.articles.some((articleId) => {
                const articleWithinSubCategory = articles.find((item) => (item === null || item === void 0 ? void 0 : item.id) && item.id === articleId);
                if (!articleWithinSubCategory) {
                    return false;
                }
                const doesArticleContentContainString = articleWithinSubCategory.content
                    .toLocaleLowerCase(locale)
                    .includes(lowerCaseSearchStr);
                const doesArticleTitleContainString = articleWithinSubCategory.title
                    .toLocaleLowerCase(locale)
                    .includes(lowerCaseSearchStr);
                return doesArticleTitleContainString || doesArticleContentContainString;
            });
            return doesSubCategoryContainString || doesArticleContainString;
        });
        const doesCategoryContainString = category.name
            .toLocaleLowerCase(locale)
            .includes(lowerCaseSearchStr);
        return doesCategoryContainString || doesSubCategoryOrArticlesContainString;
    });
    return searchResultCategories || [];
};
exports.handleSearchResult = handleSearchResult;
function handleCategoriesFilter(categories, mood, searchStr, subCategories, articles, locale) {
    return mood.length
        ? categories.filter((category) => {
            return mood.indexOf(category.tags.primary.emoji) !== -1;
        })
        : (0, exports.handleSearchResult)(searchStr, categories, subCategories, articles, locale);
}
//# sourceMappingURL=searchFunctions.js.map