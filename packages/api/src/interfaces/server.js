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
exports.createServer = createServer;
require("reflect-metadata"); // this shim is required
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
const typeorm_1 = require("typeorm");
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./env");
const dirs_1 = require("./dirs");
const bootstrap_1 = require("./api/bootstrap");
function preloadServices(folders) {
    folders.forEach(folder => {
        fs_1.default.readdirSync(folder).forEach(file => {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                require(`${folder}/${file}`);
            }
        });
    });
}
function createServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // setup routing-controllers and typeorm to use typedi container
        (0, routing_controllers_1.useContainer)(typedi_1.Container);
        (0, typeorm_1.useContainer)(typedi_1.Container);
        yield (0, typeorm_1.createConnection)({
            type: env_1.env.db.type,
            host: env_1.env.db.host,
            port: env_1.env.db.port,
            username: env_1.env.db.username,
            password: env_1.env.db.password,
            database: env_1.env.db.database,
            schema: env_1.env.db.schema,
            synchronize: env_1.env.db.synchronize,
            logging: env_1.env.db.logging,
            entities: dirs_1.dirs.entities,
            migrations: dirs_1.dirs.migrations,
        });
        // pre-load services and make them available to typedi
        preloadServices(dirs_1.dirs.services);
        // start applications
        return (0, bootstrap_1.bootstrap)();
    });
}
//# sourceMappingURL=server.js.map