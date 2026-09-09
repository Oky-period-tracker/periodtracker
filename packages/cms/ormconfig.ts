import { env } from './src/env'
import { ConnectionOptions } from 'typeorm'

const ormconfig: ConnectionOptions = {
  type: env.db.type as any,
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.db.synchronize,
  schema: env.db.schema,
  logging: env.db.logging,
  entities: [__dirname + '/src/entity/**/*{.ts,.js}'],
  subscribers: [__dirname + '/src/subscriber/**/*{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: __dirname + '/src/entity',
    subscribersDir: __dirname + '/src/subscriber',
  },
}

export = ormconfig
