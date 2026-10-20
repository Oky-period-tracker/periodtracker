import { User as AppUser } from '../src/entity/User'

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    export interface User extends AppUser {}
  }

  // What the CMS keeps in the cookie-session session (req.session)
  namespace CookieSessionInterfaces {
    interface CookieSessionObject {
      passport?: { user?: number }
      loginAt?: number
    }
  }
}
