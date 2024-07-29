"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = void 0;
const routing_controllers_1 = require("routing-controllers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("interfaces/env");
function extractTokenFromRequest(request) {
    const token = request.headers.authorization;
    if (!token) {
        return null;
    }
    if (token.startsWith('Bearer ')) {
        // remove Bearer from token
        return token.slice(7, token.length);
    }
    return token;
}
let AuthenticationMiddleware = class AuthenticationMiddleware {
    use(request, response, next) {
        const token = extractTokenFromRequest(request);
        if (!token) {
            // no token to decode
            return next(null);
        }
        jsonwebtoken_1.default.verify(token, env_1.env.app.secret, { audience: 'app' }, (err, decoded) => {
            if (err) {
                return next(err);
            }
            request.authToken = decoded;
            next(null);
        });
    }
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
exports.AuthenticationMiddleware = AuthenticationMiddleware = __decorate([
    (0, routing_controllers_1.Middleware)({ type: 'before' })
], AuthenticationMiddleware);
//# sourceMappingURL=AuthenticationMiddleware.js.map