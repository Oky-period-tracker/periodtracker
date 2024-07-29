"use strict";
const env_1 = require("./src/env");
const ormconfig = {
    type: env_1.env.db.type,
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    username: env_1.env.db.username,
    password: env_1.env.db.password,
    database: env_1.env.db.database,
    synchronize: env_1.env.db.synchronize,
    schema: env_1.env.db.schema,
    logging: env_1.env.db.logging,
    entities: [__dirname + '/src/entity/**/*{.ts,.js}'],
    subscribers: [__dirname + '/src/subscriber/**/*{.ts,.js}'],
    migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
    cli: {
        entitiesDir: __dirname + '/src/entity',
        subscribersDir: __dirname + '/src/subscriber',
    },
};
module.exports = ormconfig;
//# sourceMappingURL=ormconfig.js.map