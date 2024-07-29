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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const routing_controllers_1 = require("routing-controllers");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("interfaces/env");
const cors_1 = __importDefault(require("cors"));
const dirs = {
    controllers: [__dirname + '/controllers/**/*.{ts,js}'],
    middlewares: [__dirname + '/middlewares/*.{ts,js}'],
};
const corsOptions = {
    origin: [env_1.env.deleteAccountUrl],
};
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)(corsOptions));
        app.use(body_parser_1.default.json());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        (0, routing_controllers_1.useExpressServer)(app, {
            controllers: dirs.controllers,
            middlewares: dirs.middlewares,
            defaultErrorHandler: true,
            classTransformer: true,
            validation: true,
            currentUserChecker: (action) => __awaiter(this, void 0, void 0, function* () {
                if (action.request.authToken) {
                    return action.request.authToken.id;
                }
            }),
        });
        return app.listen(env_1.env.api.port);
    });
}
//# sourceMappingURL=bootstrap.js.map