import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { argv } from 'process'

// Sets DATABASE_SYNCHRONIZE in these files:
const files = ['./packages/api/.env', './packages/cms/.env']

let enabled = 'false'

if (argv.includes('--enable')) {
  enabled = 'true'
}

files.forEach((filePath) => {
  const envConfig = dotenv.parse(fs.readFileSync(filePath))

  envConfig.DATABASE_SYNCHRONIZE = enabled

  const newEnv = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  fs.writeFileSync(path.join(__dirname, filePath), newEnv)
})
