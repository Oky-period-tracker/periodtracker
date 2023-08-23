import { Token } from 'typedi'
import { OkyUser } from './OkyUser'

export interface OkyUserRepository {
  nextIdentity(): Promise<string>
  byId(userId: string): Promise<OkyUser | undefined>
  byName(userName: string): Promise<OkyUser | undefined>
  save(user: OkyUser): Promise<OkyUser>
  delete(user: OkyUser): Promise<void>
}

export const OkyUserRepositoryToken = new Token<OkyUserRepository>()
