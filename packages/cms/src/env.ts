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
  defaultLocale: process.env.DEFAULT_LOCALE ?? 'en',
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
    // projection: toBool(process.env.DATABASE_PROJECTION), // @TODO:PH
    logging: toBool(process.env.DATABASE_LOGGING),
  },
  api: {
    port: normalizePort(process.env.CMS_PORT) || 5000,
  },
  aws: {
    acccessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3BaseUrl: process.env.AWS_S3_BASE_URL,
    s3Bucket: process.env.AWS_S3_BUCKET,
  },
}
