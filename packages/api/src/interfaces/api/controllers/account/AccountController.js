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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const routing_controllers_1 = require("routing-controllers");
const jwt = __importStar(require("jsonwebtoken"));
const env_1 = require("interfaces/env");
const OkyUserApplicationService_1 = require("application/oky/OkyUserApplicationService");
const SignupRequest_1 = require("./requests/SignupRequest");
const LoginRequest_1 = require("./requests/LoginRequest");
const ReplaceStoreRequest_1 = require("./requests/ReplaceStoreRequest");
const ResetPasswordRequest_1 = require("./requests/ResetPasswordRequest");
const EditInfoRequest_1 = require("./requests/EditInfoRequest");
const EditSecretAnswerRequest_1 = require("./requests/EditSecretAnswerRequest");
const DeleteUserFromPasswordRequest_1 = require("./requests/DeleteUserFromPasswordRequest");
let AccountController = class AccountController {
    constructor(okyUserApplicationService) {
        this.okyUserApplicationService = okyUserApplicationService;
    }
    info(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.okyUserApplicationService.userDescriptor(userName);
            if (!user) {
                throw new routing_controllers_1.NotFoundError('User not found');
            }
            return user;
        });
    }
    signup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ preferredId, name, dateOfBirth, gender, location, country, province, password, secretQuestion, secretAnswer, dateSignedUp, }) {
            if (country === null || country === '00') {
                // this is to stop account creation on the old variant of the app. Worth removing if the old variant is completely removed.
                // At the time of writing the old variant of the app and the new english only version had the same endpoint for the backend
                return;
            }
            const user = yield this.okyUserApplicationService.signup({
                preferredId,
                name,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                location,
                country,
                province,
                plainPassword: password,
                secretQuestion,
                secretAnswer,
                dateSignedUp,
                dateAccountSaved: new Date().toISOString(),
            });
            return this.signTokenResponse(user);
        });
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, password }) {
            const authenticationDescriptor = yield this.okyUserApplicationService.login({
                name: name.trim(),
                password: password.trim(),
            });
            return authenticationDescriptor.fold((authError) => {
                console.log(authError);
                throw new routing_controllers_1.UnauthorizedError(authError);
            }, (user) => this.signTokenResponse(user));
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.okyUserApplicationService.deleteUser({
                userId,
            });
            return {
                userId,
            };
        });
    }
    deleteFromPassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, password } = request;
            yield this.okyUserApplicationService.deleteUserFromPassword({
                userName: name,
                password,
            });
            return {
                name,
            };
        });
    }
    replaceStore(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeVersion = request.getStoreVersion();
            const appState = request.getAppStore();
            yield this.okyUserApplicationService.replaceStore({
                userId,
                storeVersion,
                appState,
            });
            return { userId, storeVersion, appState };
        });
    }
    editInfo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, gender, dateOfBirth, location, secretQuestion } = request;
            yield this.okyUserApplicationService.editInfo({
                userId,
                name,
                gender,
                dateOfBirth: new Date(dateOfBirth),
                location,
                secretQuestion,
            });
            return { userId };
        });
    }
    editSecretAnswer(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { previousSecretAnswer, nextSecretAnswer } = request;
            yield this.okyUserApplicationService.editSecretAnswer({
                userId,
                previousSecretAnswer,
                nextSecretAnswer,
            });
            return { userId };
        });
    }
    resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name: userName, secretAnswer, password: newPassword }) {
            yield this.okyUserApplicationService.resetPassword({
                userName,
                secretAnswer,
                newPassword,
            });
            return {};
        });
    }
    signTokenResponse(user) {
        const userDescriptor = {
            id: user.getId(),
            dateOfBirth: user.getDateOfBirth(),
            gender: user.getGender(),
            location: user.getLocation(),
            country: user.getCountry(),
            province: user.getProvince(),
            secretQuestion: user.getMemorableQuestion(),
            secretAnswer: user.getHashedMemorableAnswer(),
            dateSignedUp: user.getDateSignedUp(),
        };
        const appToken = jwt.sign(userDescriptor, env_1.env.app.secret, {
            audience: 'app',
        });
        return {
            appToken,
            user: userDescriptor,
            store: user.getStore(),
        };
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, routing_controllers_1.Get)('/info/:userName'),
    __param(0, (0, routing_controllers_1.Param)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "info", null);
__decorate([
    (0, routing_controllers_1.Post)('/signup'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignupRequest_1.SignupRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "signup", null);
__decorate([
    (0, routing_controllers_1.Post)('/login'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginRequest_1.LoginRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "login", null);
__decorate([
    (0, routing_controllers_1.Post)('/delete'),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "delete", null);
__decorate([
    (0, routing_controllers_1.Post)('/delete-from-password'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeleteUserFromPasswordRequest_1.DeleteUserFromPasswordRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteFromPassword", null);
__decorate([
    (0, routing_controllers_1.Post)('/replace-store'),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReplaceStoreRequest_1.ReplaceStoreRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "replaceStore", null);
__decorate([
    (0, routing_controllers_1.Post)('/edit-info'),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, EditInfoRequest_1.EditInfoRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "editInfo", null);
__decorate([
    (0, routing_controllers_1.Post)('/edit-secret-answer'),
    __param(0, (0, routing_controllers_1.CurrentUser)({ required: true })),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, EditSecretAnswerRequest_1.EditSecretAnswerRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "editSecretAnswer", null);
__decorate([
    (0, routing_controllers_1.Post)('/reset-password'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordRequest_1.ResetPasswordRequest]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "resetPassword", null);
exports.AccountController = AccountController = __decorate([
    (0, routing_controllers_1.JsonController)('/account'),
    __metadata("design:paramtypes", [typeof (_a = typeof OkyUserApplicationService_1.OkyUserApplicationService !== "undefined" && OkyUserApplicationService_1.OkyUserApplicationService) === "function" ? _a : Object])
], AccountController);
//# sourceMappingURL=AccountController.js.map