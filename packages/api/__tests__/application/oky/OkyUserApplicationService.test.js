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
const OkyUserApplicationService_1 = require("../../../src/application/oky/OkyUserApplicationService");
const AuthenticationService_1 = require("../../../src/domain/oky/AuthenticationService");
describe('OkyUserApplicationService', () => {
    let authenticationService;
    let okyUserRepository;
    let okyUserApplicationService;
    const mockOkyUser = {
        id: '123',
        name: 'aaa',
        resetPassword: jest.fn(),
        deleteFromPassword: jest.fn(),
        replaceStore: jest.fn(),
        editInfo: jest.fn(),
        editSecretAnswer: jest.fn(),
    };
    beforeEach(() => {
        okyUserRepository = {
            nextIdentity: jest.fn(),
            byId: jest.fn(),
            byName: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };
        authenticationService = new AuthenticationService_1.AuthenticationService();
        authenticationService.setRepository(okyUserRepository);
        authenticationService.authenticateUser = jest.fn();
        okyUserApplicationService = new OkyUserApplicationService_1.OkyUserApplicationService();
        okyUserApplicationService.setAuthenticationService(authenticationService);
        okyUserApplicationService.setRepository(okyUserRepository);
    });
    describe('userDescriptor', () => {
        it('should return null if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byName.mockResolvedValueOnce(null);
            const result = yield okyUserApplicationService.userDescriptor('nonexistent');
            expect(result).toBeNull();
        }));
        it('should return user descriptor if user is found', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                getId: jest.fn().mockReturnValue('id123'),
                getMemorableQuestion: jest.fn().mockReturnValue('What is your favorite color?'),
            };
            okyUserRepository.byName.mockResolvedValueOnce(mockUser);
            const result = yield okyUserApplicationService.userDescriptor('existingUser');
            expect(result).toEqual({
                id: 'id123',
                secretQuestion: 'What is your favorite color?',
            });
        }));
    });
    describe('signup', () => {
        it('should successfully signup a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.nextIdentity.mockResolvedValue('newId');
            okyUserRepository.byId.mockResolvedValue(null);
            okyUserRepository.byName.mockResolvedValue(null);
            okyUserRepository.save.mockResolvedValue('someValue');
            const command = {
                preferredId: '123',
                name: 'aaa',
                plainPassword: 'aaa',
                secretQuestion: 'favourite_actor',
                secretAnswer: 'a',
                gender: 'Female',
                location: 'Urban',
                country: 'AF',
                province: '0',
                dateOfBirth: new Date(),
                dateSignedUp: new Date().toISOString(),
                dateAccountSaved: new Date().toISOString(),
            };
            const result = yield okyUserApplicationService.signup(command);
            expect(result).toBe('someValue');
        }));
        it('should fail if the username is already taken', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byName.mockResolvedValue({
            // Simulate an existing user
            });
            const command = {
                preferredId: '123',
                name: 'aaa',
                plainPassword: 'aaa',
                secretQuestion: 'favourite_actor',
                secretAnswer: 'a',
                gender: 'Female',
                location: 'Urban',
                country: 'AF',
                province: '0',
                dateOfBirth: new Date(),
                dateSignedUp: new Date().toISOString(),
                dateAccountSaved: new Date().toISOString(),
            };
            yield expect(okyUserApplicationService.signup(command)).rejects.toThrow('User with this name already exists');
        }));
    });
    describe('login', () => {
        it('should successfully login a user', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            authenticationService.authenticateUser.mockResolvedValue('someValue');
            const result = yield okyUserApplicationService.login({
                name: 'aaa',
                password: 'aaa',
            });
            expect(result).toBe('someValue');
        }));
        it('should fail if the username is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byName.mockResolvedValue(null);
            const result = yield okyUserApplicationService.login({
                name: 'aaa',
                password: 'aaa',
            });
            expect(result).toBeUndefined();
        }));
    });
    describe('resetPassword', () => {
        it('should successfully reset password', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.nextIdentity.mockResolvedValue('newId');
            okyUserRepository.byId.mockResolvedValue(null);
            okyUserRepository.byName.mockResolvedValue(null);
            okyUserRepository.save.mockResolvedValue(mockOkyUser);
            const command = {
                preferredId: '123',
                name: 'aaa',
                plainPassword: 'aaa',
                secretQuestion: 'favourite_actor',
                secretAnswer: 'a',
                gender: 'Female',
                location: 'Urban',
                country: 'AF',
                province: '0',
                dateOfBirth: new Date(),
                dateSignedUp: new Date().toISOString(),
                dateAccountSaved: new Date().toISOString(),
            };
            const okyUser = yield okyUserApplicationService.signup(command);
            expect(okyUser).toBe(mockOkyUser);
            okyUserRepository.byName.mockResolvedValue(mockOkyUser);
            const result = yield okyUserApplicationService.resetPassword({
                userName: 'aaa',
                secretAnswer: 'a',
                newPassword: 'bbb',
            });
            expect(result).toBe(mockOkyUser);
            expect(mockOkyUser.resetPassword).toHaveBeenCalledWith('a', 'bbb');
        }));
        it('should fail if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(null);
            yield expect(okyUserApplicationService.resetPassword({
                userName: 'aaa',
                secretAnswer: 'a',
                newPassword: 'bbb',
            })).rejects.toThrow("User with this name doesn't exists");
        }));
    });
    describe('deleteUser', () => {
        it('should successfully delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(mockOkyUser);
            okyUserRepository.delete.mockResolvedValue(undefined);
            const result = yield okyUserApplicationService.deleteUser({ userId: 'someUserId' });
            expect(result).toBe(undefined);
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId');
            expect(okyUserRepository.delete).toHaveBeenCalledWith(mockOkyUser);
        }));
        it('should not fail if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(null);
            const result = yield okyUserApplicationService.deleteUser({ userId: 'someNonExistingUserId' });
            expect(result).toBeUndefined();
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someNonExistingUserId');
            expect(okyUserRepository.delete).not.toHaveBeenCalled();
        }));
    });
    describe('deleteUserFromPassword', () => {
        it('should successfully delete a user from password', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.nextIdentity.mockResolvedValue('newId');
            okyUserRepository.byId.mockResolvedValue(null);
            okyUserRepository.byName.mockResolvedValue(mockOkyUser);
            okyUserRepository.save.mockResolvedValue(mockOkyUser);
            okyUserRepository.byId.mockResolvedValue(mockOkyUser);
            okyUserRepository.delete.mockResolvedValue(undefined);
            const result = yield okyUserApplicationService.deleteUserFromPassword({
                userName: 'aaa',
                password: 'aaa',
            });
            expect(result).toBe(undefined);
            expect(okyUserRepository.byName).toHaveBeenCalledWith('aaa');
            expect(mockOkyUser.deleteFromPassword).toHaveBeenCalled();
        }));
        it('should not fail if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(null);
            const result = yield okyUserApplicationService.deleteUser({ userId: 'someNonExistingUserId' });
            expect(result).toBeUndefined();
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someNonExistingUserId');
            expect(okyUserRepository.delete).not.toHaveBeenCalled();
        }));
    });
    describe('replaceStore', () => {
        it('should successfully replace store', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(mockOkyUser);
            okyUserRepository.save.mockResolvedValue(mockOkyUser);
            const result = yield okyUserApplicationService.replaceStore({
                userId: 'someUserId',
                storeVersion: 1,
                appState: { some: 'appState' },
            });
            expect(result).toBe(mockOkyUser);
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId');
            expect(mockOkyUser.replaceStore).toHaveBeenCalledWith(1, { some: 'appState' });
        }));
        it('should throw an error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(null);
            try {
                yield okyUserApplicationService.replaceStore({
                    userId: 'someUserId',
                    storeVersion: 1,
                    appState: { some: 'appState' },
                });
                fail('should have thrown an error');
            }
            catch (e) {
                expect(e.message).toBe(`Cannot replace store for missing someUserId user`);
            }
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId');
        }));
    });
    describe('editInfo', () => {
        it('should successfully edit info', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(mockOkyUser);
            okyUserRepository.save.mockResolvedValue(mockOkyUser);
            const command = {
                userId: 'someUserId',
                name: 'bbb',
                dateOfBirth: new Date(),
                location: 'Urban',
                gender: 'Male',
                secretQuestion: 'favourite_actor',
            };
            const result = yield okyUserApplicationService.editInfo(command);
            expect(result).toBe(mockOkyUser);
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId');
            expect(mockOkyUser.editInfo).toHaveBeenCalledWith(Object.assign(Object.assign({}, command), { userId: undefined }));
        }));
        it('should throw an error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(null);
            try {
                const command = {
                    userId: 'someUserId',
                    name: 'bbb',
                    dateOfBirth: new Date(),
                    location: 'Urban',
                    gender: 'Male',
                    secretQuestion: 'favourite_actor',
                };
                yield okyUserApplicationService.editInfo(command);
                fail('should have thrown an error');
            }
            catch (e) {
                expect(e.message).toBe(`Cannot edit info for missing someUserId user`);
            }
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId');
        }));
    });
    describe('editSecretAnswer', () => {
        it('should successfully edit secret answer', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(mockOkyUser);
            okyUserRepository.save.mockResolvedValue(mockOkyUser);
            const command = {
                userId: 'someUserId',
                previousSecretAnswer: 'a',
                nextSecretAnswer: 'b',
            };
            const result = yield okyUserApplicationService.editSecretAnswer(command);
            expect(result).toBe(mockOkyUser);
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId');
            expect(mockOkyUser.editSecretAnswer).toHaveBeenCalledWith('a', 'b');
        }));
        it('should throw an error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            ;
            okyUserRepository.byId.mockResolvedValue(null);
            try {
                const command = {
                    userId: 'someUserId',
                    previousSecretAnswer: 'a',
                    nextSecretAnswer: 'b',
                };
                yield okyUserApplicationService.editSecretAnswer(command);
                fail('should have thrown an error');
            }
            catch (e) {
                expect(e.message).toBe(`Cannot edit info for missing someUserId user`);
            }
            expect(okyUserRepository.byId).toHaveBeenCalledWith('someUserId');
        }));
    });
});
//# sourceMappingURL=OkyUserApplicationService.test.js.map