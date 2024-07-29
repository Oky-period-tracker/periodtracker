"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// load environment variables from .env file
dotenv_1.default.config();
function normalizePort(port) {
    return parseInt(port, 10);
}
function toBool(value) {
    return value === 'true';
}
// environment variables
exports.env = {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    deleteAccountUrl: process.env.DELETE_ACCOUNT_URL,
    app: {
        secret: process.env.APPLICATION_SECRET,
    },
    db: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: normalizePort(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        schema: process.env.DATABASE_SCHEMA,
        synchronize: toBool(process.env.DATABASE_SYNCHRONIZE),
        logging: toBool(process.env.DATABASE_LOGGING),
    },
    api: {
        port: normalizePort(process.env.API_PORT) || 3000,
        // port: 3001,
    },
};
//# sourceMappingURL=env.js.map