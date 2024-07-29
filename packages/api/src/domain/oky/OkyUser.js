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
var OkyUser_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OkyUser = void 0;
const typeorm_1 = require("typeorm");
const HashedPassword_1 = require("./HashedPassword");
const HashedName_1 = require("./HashedName");
const MemorableQuestion_1 = require("./MemorableQuestion");
const routing_controllers_1 = require("routing-controllers");
let OkyUser = OkyUser_1 = class OkyUser {
    constructor(props) {
        if (props !== undefined) {
            const { id, name, dateOfBirth, gender, location, country, province, password, memorable, dateSignedUp, } = props;
            this.id = id;
            this.name = name;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.location = location;
            this.country = country;
            this.province = province;
            this.password = password;
            this.memorable = memorable;
            this.store = null;
            this.dateSignedUp = dateSignedUp;
        }
    }
    static register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, dateOfBirth, gender, location, country, province, plainPassword, secretQuestion, secretAnswer, dateSignedUp, dateAccountSaved, }) {
            if (!id) {
                throw new Error(`The user id must be provided`);
            }
            if (!name) {
                throw new Error(`The user name must be provided`);
            }
            const password = yield HashedPassword_1.HashedPassword.fromPlainPassword(plainPassword);
            const hashedName = yield HashedName_1.HashedName.fromPlainName(name);
            const memorable = yield MemorableQuestion_1.MemorableQuestion.fromQuestion(secretQuestion, secretAnswer);
            return new OkyUser_1({
                id,
                name: hashedName,
                dateOfBirth,
                gender,
                location,
                country,
                province,
                password,
                memorable,
                dateSignedUp,
                dateAccountSaved,
            });
        });
    }
    replaceStore(storeVersion, appState = {}) {
        this.store = {
            storeVersion,
            appState,
        };
    }
    editInfo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, dateOfBirth, gender, location, secretQuestion, }) {
            if (!name) {
                throw new Error(`The user name must be provided`);
            }
            const hashedName = yield HashedName_1.HashedName.fromPlainName(name);
            this.name = hashedName;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.location = location;
            this.memorable = yield this.memorable.changeQuestion(secretQuestion);
        });
    }
    editSecretAnswer(previousSecretAnswer, nextSecretAnswer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.memorable.verify(previousSecretAnswer))) {
                throw new routing_controllers_1.BadRequestError(`wrong_previous_secret_answer`);
            }
            this.memorable = yield this.memorable.changeAnswer(nextSecretAnswer);
        });
    }
    resetPassword(secretAnswer, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.memorable.verify(secretAnswer))) {
                throw new Error(`Wrong secret answer for password`);
            }
            this.password = yield HashedPassword_1.HashedPassword.fromPlainPassword(plainPassword);
        });
    }
    verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.password.verify(password);
        });
    }
    deleteFromPassword(password, repository) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.password.verify(password))) {
                throw new Error(`Wrong password for deletion`);
            }
            return repository.delete(this);
        });
    }
    getId() {
        return this.id;
    }
    getDateOfBirth() {
        return this.dateOfBirth;
    }
    getGender() {
        return this.gender;
    }
    getLocation() {
        return this.location;
    }
    getCountry() {
        return this.country;
    }
    getProvince() {
        return this.province;
    }
    getMemorableQuestion() {
        return this.memorable.secretQuestion;
    }
    getHashedMemorableAnswer() {
        return this.memorable.secretAnswerHashed;
    }
    getStore() {
        return this.store;
    }
    getDateSignedUp() {
        return this.dateSignedUp;
    }
};
exports.OkyUser = OkyUser;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid', { name: 'id' }),
    __metadata("design:type", String)
], OkyUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => HashedName_1.HashedName),
    __metadata("design:type", HashedName_1.HashedName)
], OkyUser.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth' }),
    __metadata("design:type", Date)
], OkyUser.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gender' }),
    __metadata("design:type", String)
], OkyUser.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location' }),
    __metadata("design:type", String)
], OkyUser.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country', default: '00', nullable: true }),
    __metadata("design:type", String)
], OkyUser.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'province', default: '0', nullable: true }),
    __metadata("design:type", String)
], OkyUser.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => HashedPassword_1.HashedPassword),
    __metadata("design:type", HashedPassword_1.HashedPassword)
], OkyUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)((type) => MemorableQuestion_1.MemorableQuestion),
    __metadata("design:type", MemorableQuestion_1.MemorableQuestion)
], OkyUser.prototype, "memorable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], OkyUser.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_signed_up' }),
    __metadata("design:type", String)
], OkyUser.prototype, "dateSignedUp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_account_saved' }),
    __metadata("design:type", String)
], OkyUser.prototype, "dateAccountSaved", void 0);
exports.OkyUser = OkyUser = OkyUser_1 = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], OkyUser);
//# sourceMappingURL=OkyUser.js.map