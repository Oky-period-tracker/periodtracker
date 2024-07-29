"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeToAction = exports.userRoles = void 0;
exports.userRoles = {
    superAdmin: {
        can: ['createSuperAdmin', 'createAdmin', 'toggleLanguages'],
        inherits: ['admin'],
    },
    admin: {
        can: ['createContentManager'],
        inherits: ['contentManager'],
    },
    contentManager: {
        can: ['writeContent'],
    },
};
const typeToAction = value => {
    switch (value) {
        case 'superAdmin':
            return 'createSuperAdmin';
        case 'admin':
            return 'createAdmin';
        case 'contentManager':
            return 'createContentManager';
    }
};
exports.typeToAction = typeToAction;
//# sourceMappingURL=role-definitions.js.map