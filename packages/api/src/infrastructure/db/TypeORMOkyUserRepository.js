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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMOkyUserRepository = void 0;
const uuid_1 = require("uuid");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const OkyUser_1 = require("domain/oky/OkyUser");
const OkyUserRepository_1 = require("domain/oky/OkyUserRepository");
const HashedName_1 = require("domain/oky/HashedName");
let TypeORMOkyUserRepository = class TypeORMOkyUserRepository {
    nextIdentity() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, uuid_1.v4)();
        });
    }
    byId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne(id);
        });
    }
    byName(plainName) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = yield HashedName_1.HashedName.fromPlainName(plainName);
            const user = yield this.repository.findOne({ where: { name } });
            return user;
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.save(user);
        });
    }
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = user.getId();
            yield this.repository.delete(id);
        });
    }
};
exports.TypeORMOkyUserRepository = TypeORMOkyUserRepository;
__decorate([
    (0, typeorm_typedi_extensions_1.InjectRepository)(OkyUser_1.OkyUser),
    __metadata("design:type", typeorm_1.Repository)
], TypeORMOkyUserRepository.prototype, "repository", void 0);
exports.TypeORMOkyUserRepository = TypeORMOkyUserRepository = __decorate([
    (0, typedi_1.Service)(OkyUserRepository_1.OkyUserRepositoryToken)
], TypeORMOkyUserRepository);
//# sourceMappingURL=TypeORMOkyUserRepository.js.map