import { Inject } from 'typedi'
import { OkyUserRepositoryToken, OkyUserRepository } from './OkyUserRepository'
import { AuthenticationDescriptor } from './AuthenticationDescriptor'

export class AuthenticationService {
  private okyUserRepository: OkyUserRepository

  constructor(@Inject(OkyUserRepositoryToken) okyUserRepository: OkyUserRepository) {
    this.okyUserRepository = okyUserRepository
  }

  public async authenticateUser(name: string, password: string): Promise<AuthenticationDescriptor> {
    const user = await this.okyUserRepository.byName(name)
    if (user && (await user.verifyPassword(password))) {
      return AuthenticationDescriptor.success(user)
    }

    if (!user) {
      return AuthenticationDescriptor.fail(`no_user_in_database`)
    }
    if (!(await user.verifyPassword(password))) {
      return AuthenticationDescriptor.fail(`password_incorrect`)
    }
    return AuthenticationDescriptor.fail(`Name or password are wrong.`)
  }
}
