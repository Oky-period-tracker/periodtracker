"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OkyUserApplicationService = void 0;
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
const AuthenticationService_1 = require("domain/oky/AuthenticationService");
const OkyUser_1 = require("domain/oky/OkyUser");
const OkyUserRepository_1 = require("domain/oky/OkyUserRepository");
let OkyUserApplicationService = class OkyUserApplicationService {
    userDescriptor(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.okyUserRepository.byName(userName);
            if (!user) {
                return null;
            }
            return {
                id: user.getId(),
                secretQuestion: user.getMemorableQuestion(),
            };
        });
    }
    signup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ preferredId, name, dateOfBirth, gender, location, country, province, plainPassword, secretQuestion, secretAnswer, dateSignedUp, dateAccountSaved, }) {
            const id = preferredId || (yield this.okyUserRepository.nextIdentity());
            if (yield this.okyUserRepository.byId(id)) {
                throw new routing_controllers_1.HttpError(400, `User with this id already exists`);
            }
            const existingUser = yield this.okyUserRepository.byName(name);
            if (existingUser) {
                throw new routing_controllers_1.HttpError(409, `User with this name already exists`);
            }
            const user = yield OkyUser_1.OkyUser.register({
                id,
                name,
                dateOfBirth,
                gender,
                location,
                country,
                province,
                plainPassword,
                secretQuestion,
                secretAnswer,
                dateSignedUp,
                dateAccountSaved,
            });
            return this.okyUserRepository.save(user);
        });
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, password }) {
            return this.authenticationService.authenticateUser(name, password);
        });
    }
    resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userName, secretAnswer, newPassword }) {
            const user = yield this.okyUserRepository.byName(userName);
            if (!user) {
                throw new Error(`User with this name doesn't exists`);
            }
            yield user.resetPassword(secretAnswer, newPassword);
            return this.okyUserRepository.save(user);
        });
    }
    deleteUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            const user = yield this.okyUserRepository.byId(userId);
            if (!user) {
                return;
            }
            return this.okyUserRepository.delete(user);
        });
    }
    deleteUserFromPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userName, password }) {
            const user = yield this.okyUserRepository.byName(userName);
            if (!user) {
                return;
            }
            return user.deleteFromPassword(password, this.okyUserRepository);
        });
    }
    replaceStore(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, storeVersion, appState }) {
            const user = yield this.okyUserRepository.byId(userId);
            if (!user) {
                throw new Error(`Cannot replace store for missing ${userId} user`);
            }
            user.replaceStore(storeVersion, appState);
            return this.okyUserRepository.save(user);
        });
    }
    editInfo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, name, dateOfBirth, location, gender, secretQuestion, }) {
            const user = yield this.okyUserRepository.byId(userId);
            if (!user) {
                throw new Error(`Cannot edit info for missing ${userId} user`);
            }
            yield user.editInfo({
                name,
                dateOfBirth,
                location,
                gender,
                secretQuestion,
            });
            return this.okyUserRepository.save(user);
        });
    }
    editSecretAnswer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, previousSecretAnswer, nextSecretAnswer, }) {
            const user = yield this.okyUserRepository.byId(userId);
            if (!user) {
                throw new Error(`Cannot edit info for missing ${userId} user`);
            }
            yield user.editSecretAnswer(previousSecretAnswer, nextSecretAnswer);
            return this.okyUserRepository.save(user);
        });
    }
    setRepository(repository) {
        this.okyUserRepository = repository;
    }
    setAuthenticationService(service) {
        this.authenticationService = service;
    }
};
exports.OkyUserApplicationService = OkyUserApplicationService;
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", typeof (_a = typeof AuthenticationService_1.AuthenticationService !== "undefined" && AuthenticationService_1.AuthenticationService) === "function" ? _a : Object)
], OkyUserApplicationService.prototype, "authenticationService", void 0);
__decorate([
    (0, typedi_1.Inject)(OkyUserRepository_1.OkyUserRepositoryToken),
    __metadata("design:type", typeof (_b = typeof OkyUserRepository_1.OkyUserRepository !== "undefined" && OkyUserRepository_1.OkyUserRepository) === "function" ? _b : Object)
], OkyUserApplicationService.prototype, "okyUserRepository", void 0);
exports.OkyUserApplicationService = OkyUserApplicationService = __decorate([
    (0, typedi_1.Service)()
], OkyUserApplicationService);
//# sourceMappingURL=OkyUserApplicationService.js.map