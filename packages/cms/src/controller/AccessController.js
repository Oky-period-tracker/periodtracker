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
exports.AccessController = void 0;
const passport_1 = __importDefault(require("passport"));
class AccessController {
    login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return passport_1.default.authenticate('local', {
                failureRedirect: '/login',
                successRedirect: '/encyclopedia',
                failureFlash: 'Invalid username or password.',
            })(request, response, next);
        });
    }
    logout(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            request.logout((err) => {
                if (err) {
                    return next(err);
                }
                return;
            });
            response.redirect('/login');
        });
    }
}
exports.AccessController = AccessController;
//# sourceMappingURL=AccessController.js.map