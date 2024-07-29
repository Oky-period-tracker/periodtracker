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
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationDescriptor_1 = require("../../../src/domain/oky/AuthenticationDescriptor");
const AuthenticationService_1 = require("../../../src/domain/oky/AuthenticationService");
describe('AuthenticationService', () => {
    let authService;
    let mockOkyUserRepository;
    let mockUser;
    beforeEach(() => {
        mockOkyUserRepository = {
            byName: jest.fn(),
            nextIdentity: jest.fn(),
            byId: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };
        mockUser = {
            verifyPassword: jest.fn(),
        };
        authService = new AuthenticationService_1.AuthenticationService();
        authService.setRepository(mockOkyUserRepository);
    });
    it('should authenticate user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        mockOkyUserRepository.byName = jest.fn(mockOkyUserRepository.byName).mockResolvedValue(mockUser);
        mockUser.verifyPassword = jest.fn().mockResolvedValue(true);
        const result = yield authService.authenticateUser('john', '1234');
        expect(result).toEqual(AuthenticationDescriptor_1.AuthenticationDescriptor.success(mockUser));
    }));
    it('should fail if no user is found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockOkyUserRepository.byName = jest.fn().mockResolvedValue(undefined);
        mockOkyUserRepository.byName(mockUser);
        const result = yield authService.authenticateUser('john', '1234');
        expect(result).toEqual(AuthenticationDescriptor_1.AuthenticationDescriptor.fail('no_user_in_database'));
    }));
    it('should fail if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        mockOkyUserRepository.byName = jest.fn(mockOkyUserRepository.byName).mockResolvedValue(mockUser);
        mockUser.verifyPassword = jest.fn().mockResolvedValue(false);
        const result = yield authService.authenticateUser('john', '1234');
        expect(result).toEqual(AuthenticationDescriptor_1.AuthenticationDescriptor.fail('password_incorrect'));
    }));
});
//# sourceMappingURL=AuthenticationService.test.js.map