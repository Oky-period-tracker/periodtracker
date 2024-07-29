"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessControlList = void 0;
const role_definitions_1 = require("./role-definitions");
class AccessControl {
    constructor(roles) {
        this.can = (role, operation) => {
            // Check if role exists
            if (!this.roles[role]) {
                return false;
            }
            const $role = this.roles[role];
            // Check if this role has access
            if ($role.can.indexOf(operation) !== -1) {
                return true;
            }
            // Check if there are any parents
            if (!$role.inherits || $role.inherits.length < 1) {
                return false;
            }
            // Check child roles until one returns true or all return false
            return $role.inherits.some(childRole => this.can(childRole, operation));
        };
        this.typeToRole = value => {
            switch (value) {
                case 'superAdmin':
                    return 'createAdmin';
                case 'admin':
                    return 'createContentManager';
            }
        };
        this.roles = roles;
    }
}
exports.accessControlList = new AccessControl(role_definitions_1.userRoles);
//# sourceMappingURL=access-control.js.map