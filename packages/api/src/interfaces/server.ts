import 'reflect-metadata' // this shim is required

import { Container } from 'typedi'
import { useContainer as useRoutingContainer } from 'routing-controllers'
import { createConnection, useContainer as useORMContainer } from 'typeorm'
import fs from 'fs'

import { env } from './env'
import { dirs } from './dirs'

import { bootstrap } from './api/bootstrap'

function preloadServices(folders: string[]) {
  folders.forEach((folder) => {
    fs.readdirSync(folder).forEach((file) => {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        require(`${folder}/${file}`)
      }
    })
  })
}

export async function createServer() {
  // setup routing-controllers and typeorm to use typedi container
  useRoutingContainer(Container)
  useORMContainer(Container)

  await createConnection({
    type: env.db.type as any,
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    schema: env.db.schema,
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    entities: dirs.entities,
    migrations: dirs.migrations,
  })

  // pre-load services and make them available to typedi
  preloadServices(dirs.services)

  // start applications
  return bootstrap()
}
