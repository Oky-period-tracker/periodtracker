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
    // port: 5001,
  },
  storage: {
    bucket: process.env.STORAGE_BUCKET,
    baseUrl: process.env.STORAGE_BASE_URL,
  },
  firebase: {
    // Service account JSON, base64 encoded. Used instead of the key file named
    // by GOOGLE_APPLICATION_CREDENTIALS when set, see docs/setup.md.
    serviceAccountBase64: process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
  },
  // Features that are not live yet. Off unless explicitly set to 'true',
  // see FEATURE_FLAGS.md.
  features: {
    voiceOver: toBool(process.env.FEATURE_VOICE_OVER),
    contentFilter: toBool(process.env.FEATURE_CONTENT_FILTER),
    // Age restriction levels (minimum age per item, encyclopedia included).
    // Off: a single age restricted toggle on quizzes, surveys and did you
    // knows, and no age restriction on encyclopedia articles.
    ageRestrictionLevels: toBool(process.env.FEATURE_AGE_RESTRICTION_LEVELS),
  },
  logging: {
    level: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
    filePath: process.env.LOG_FILE_PATH || '',
    slowQueryThreshold: parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000', 10),
    slowRequestThreshold: parseInt(process.env.SLOW_REQUEST_THRESHOLD || '3000', 10),
  },
}
