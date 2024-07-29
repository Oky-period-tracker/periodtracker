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
const authentication_1 = require("../../src/access/authentication");
const typeorm = __importStar(require("typeorm"));
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock('typeorm', () => {
    return {
        getRepository: jest.fn(),
        BaseEntity: class Mock {
        },
        ObjectType: () => null,
        Entity: () => null,
        InputType: () => null,
        Index: () => null,
        PrimaryGeneratedColumn: () => null,
        Column: () => null,
        CreateDateColumn: () => null,
        UpdateDateColumn: () => null,
        OneToMany: () => null,
        ManyToOne: () => null,
    };
});
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));
describe('Authentication', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should authenticate successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = { username: 'john', password: 'hashed_password' };
        typeorm.getRepository.mockReturnValue({
            findOne: jest.fn().mockResolvedValue(mockUser),
        });
        bcrypt_1.default.compare.mockResolvedValue(true);
        const done = jest.fn();
        yield authentication_1.Authentication.authenticate('john', 'password', done);
        expect(done).toHaveBeenCalledWith(null, mockUser);
    }));
    it('should fail authentication if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        ;
        typeorm.getRepository.mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null),
        });
        const done = jest.fn();
        yield authentication_1.Authentication.authenticate('john', 'password', done);
        expect(done).toHaveBeenCalledWith(null, false, { message: 'No user registered' });
    }));
    it('should fail authentication if password does not match', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = { username: 'john', password: 'hashed_password' };
        typeorm.getRepository.mockReturnValue({
            findOne: jest.fn().mockResolvedValue(mockUser),
        });
        bcrypt_1.default.compare.mockResolvedValue(false);
        const done = jest.fn();
        yield authentication_1.Authentication.authenticate('john', 'wrong_password', done);
        expect(done).toHaveBeenCalledWith(null, false, { message: 'No password match' });
    }));
});
//# sourceMappingURL=authentication.test.js.map