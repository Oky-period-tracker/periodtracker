import { User as AppUser } from '../src/entity/User'

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    export interface User extends AppUser {}
  }
}
