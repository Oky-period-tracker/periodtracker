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
exports.UserController = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const access_control_1 = require("../access/access-control");
const role_definitions_1 = require("../access/role-definitions");
const moment_1 = __importDefault(require("moment"));
const saltRounds = 10;
class UserController {
    constructor() {
        this.userRepository = (0, typeorm_1.getRepository)(User_1.User);
    }
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.find({
                select: ['id', 'username', 'type', 'lang'],
            });
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne(request.params.id);
        });
    }
    save(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const creationAction = (0, role_definitions_1.typeToAction)(request.body.type);
            const user = yield this.userRepository.findOne({
                where: { username: request.body.username },
            });
            if (user) {
                response.status(409).send({ error: 'username is not unique' });
                return;
            }
            if (!access_control_1.accessControlList.can(request.user.type, creationAction)) {
                response.status(400).send({ error: 'No permission rights to do that' });
                return;
            }
            yield bcrypt_1.default.hash(request.body.password, saltRounds).then((hash) => __awaiter(this, void 0, void 0, function* () {
                yield this.userRepository.save({
                    username: request.body.username,
                    password: hash,
                    lang: request.body.lang,
                    date_created: moment_1.default.utc().toISOString(),
                    type: request.body.type,
                });
            }));
            return request.body;
        });
    }
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToUpdate = yield this.userRepository.findOne(request.params.id);
            yield bcrypt_1.default.hash(request.body.password, saltRounds).then((hash) => __awaiter(this, void 0, void 0, function* () {
                userToUpdate.username = request.body.username;
                userToUpdate.password = hash;
                userToUpdate.lang = request.body.lang;
                userToUpdate.type = request.body.type;
            }));
            yield this.userRepository.save(userToUpdate);
            return userToUpdate;
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToRemove = yield this.userRepository.findOne(request.params.id);
            yield this.userRepository.remove(userToRemove);
            return userToRemove;
        });
    }
    changeLocation(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.user.type !== 'superAdmin') {
                response.status(400).send({ error: 'No permission rights to do that' });
                return;
            }
            const userToUpdate = yield this.userRepository.findOne(request.user.id);
            userToUpdate.lang = request.body.lang;
            yield this.userRepository.save(userToUpdate);
            return ''; // userToUpdate
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map