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
exports.Authentication = void 0;
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
class Authentication {
    static authenticate(username, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = (0, typeorm_1.getRepository)(User_1.User);
            const user = yield userRepository.findOne({ where: { username } });
            if (!user) {
                return done(null, false, { message: 'No user registered' });
            }
            const passwordsMatch = yield bcrypt_1.default.compare(password, user.password); // user.password is the hashed password
            if (!passwordsMatch) {
                return done(null, false, { message: 'No password match' });
            }
            return done(null, user);
        });
    }
    static serializeUser(user, done) {
        return __awaiter(this, void 0, void 0, function* () {
            done(null, user.id);
        });
    }
    static deserializeUser(id, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, typeorm_1.getRepository)(User_1.User).findOne(id);
            done(null, user);
        });
    }
    static isLoggedIn(request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        response.redirect('/login');
    }
}
exports.Authentication = Authentication;
//# sourceMappingURL=authentication.js.map