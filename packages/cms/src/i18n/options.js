"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsLocales = exports.cmsLanguages = exports.cmsTranslations = void 0;
// tslint:disable:no-var-requires
exports.cmsTranslations = {
    en: require('./translations/en.json'),
    fr: require('./translations/fr.json'),
    pt: require('./translations/pt.json'),
    ru: require('./translations/ru.json'),
    es: require('./translations/es.json'),
    // id: require('./translations/id.json'),
    // mn: require('./translations/mn.json'),
};
exports.cmsLanguages = [
    {
        name: 'English',
        locale: 'en',
    },
    {
        name: 'Français',
        locale: 'fr',
    },
    {
        name: 'Português',
        locale: 'pt',
    },
    {
        name: 'Русский',
        locale: 'ru',
    },
    //  {
    //    name: 'Indonesian',
    //    locale: 'id',
    //  },
    //  {
    //    name: 'Монгол',
    //    locale: 'mn',
    //  },
    {
        name: 'Español',
        locale: 'es',
    },
];
exports.cmsLocales = exports.cmsLanguages.map((lang) => lang.locale);
//# sourceMappingURL=options.js.map