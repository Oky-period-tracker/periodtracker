import { User as AppUser } from '../src/entity/User'

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    export interface User extends AppUser {}
  }
}

// req.session is typed by express-session, but filled by cookie-session
declare module 'express-session' {
  interface SessionData {
    passport: { user?: number }
    loginAt: number
  }
}
