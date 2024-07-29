"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const routes_1 = require("./routes");
const passport_1 = __importDefault(require("passport"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const i18n_1 = __importDefault(require("i18n"));
const cors_1 = __importDefault(require("cors"));
const passport_local_1 = require("passport-local");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const authentication_1 = require("./access/authentication");
const admin = __importStar(require("firebase-admin"));
const env_1 = require("./env");
const ormconfig_1 = __importDefault(require("../ormconfig"));
const DataController_1 = require("./controller/DataController");
const multer_1 = __importDefault(require("multer"));
const options_1 = require("./i18n/options");
(0, typeorm_1.createConnection)(ormconfig_1.default)
    .then(() => {
    const app = (0, express_1.default)();
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
    }));
    app.use(express_1.default.static(__dirname + '/public'));
    i18n_1.default.configure({
        locales: options_1.cmsLocales,
        directory: __dirname + '/i18n/translations',
        defaultLocale: env_1.env.defaultLocale,
        cookie: 'i18n',
    });
    app.use(i18n_1.default.init);
    // ======================= Passport Configuration =============================
    app.use((0, cookie_parser_1.default)());
    app.use((0, cookie_session_1.default)({
        secret: env_1.env.app.secret,
        resave: false,
        saveUninitialized: false,
        cookie: { sameSite: 'strict' },
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use((0, connect_flash_1.default)());
    passport_1.default.use(new passport_local_1.Strategy(authentication_1.Authentication.authenticate));
    passport_1.default.serializeUser(authentication_1.Authentication.serializeUser);
    passport_1.default.deserializeUser(authentication_1.Authentication.deserializeUser);
    app.use((req, res, next) => {
        // @ts-ignore
        res.locals.globalErrors = req.flash('error');
        res.locals.currentUser = req.user;
        i18n_1.default.setLocale(req, req.user ? req.user.lang : env_1.env.defaultLocale);
        next();
    });
    // ======================= i18n Configuration =============================
    routes_1.Routes.forEach((route) => {
        if (route.isPublic) {
            return;
        }
        app.use(route.route, authentication_1.Authentication.isLoggedIn);
    });
    app.use('/mobile/suggestions', (0, cors_1.default)());
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
    // ============================ Upload  =======================================
    const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
    const dataController = new DataController_1.DataController();
    app.post('/data/upload-content-sheet', upload.single('spreadsheet'), dataController.uploadContentSheet);
    app.post('/data/upload-app-translations-sheet', upload.single('spreadsheet'), dataController.uploadAppTranslationsSheet);
    app.post('/data/upload-cms-translations-sheet', upload.single('spreadsheet'), dataController.uploadCmsTranslationsSheet);
    app.post('/data/upload-countries-sheet', upload.single('spreadsheet'), dataController.uploadCountriesSheet);
    app.post('/data/upload-provinces-sheet', upload.single('spreadsheet'), dataController.uploadProvincesSheet);
    // ============================ Routes  =======================================
    routes_1.Routes.forEach((route) => {
        ;
        app[route.method](route.route, (req, res, next) => {
            const result = new route.controller()[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then((_result) => _result !== null && _result !== undefined ? res.send(_result) : undefined);
            }
            else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
    app.listen(5000);
    console.log('Server started on port 5000');
})
    .catch((error) => console.log(error));
//# sourceMappingURL=index.js.map