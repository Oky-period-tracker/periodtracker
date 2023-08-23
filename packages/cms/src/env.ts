import dotenv from 'dotenv'

// load environment variables from .env file
dotenv.config()

function normalizePort(port: string): number {
  return parseInt(port, 10)
}

function toBool(value: string): boolean {
  return value === 'true'
}

// environment variables
export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    secret: process.env.PASSPORT_SECRET,
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
    port: normalizePort(process.env.CMS_PORT) || 5000,
  },
}
