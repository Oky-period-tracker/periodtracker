"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./interfaces/server");
(0, server_1.createServer)()
    .then(() => console.log('Application is now running.'))
    .catch(error => console.error('Application is crashed', error));
//# sourceMappingURL=index.js.map