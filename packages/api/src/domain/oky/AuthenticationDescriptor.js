"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationDescriptor = void 0;
class AuthenticationDescriptor {
    constructor(user, error) {
        this.user = user;
        this.error = error;
    }
    static success(user) {
        return new AuthenticationDescriptor(user);
    }
    static fail(error) {
        if (!error) {
            throw new Error(`Provide an error message on authentication failure`);
        }
        return new AuthenticationDescriptor(null, error);
    }
    fold(onFailure, onSuccess) {
        if (this.error) {
            return onFailure && onFailure(this.error);
        }
        return onSuccess && onSuccess(this.user);
    }
}
exports.AuthenticationDescriptor = AuthenticationDescriptor;
//# sourceMappingURL=AuthenticationDescriptor.js.map