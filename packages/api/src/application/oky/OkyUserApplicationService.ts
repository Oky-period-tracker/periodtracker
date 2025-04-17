import { Service, Inject } from 'typedi'
import { HttpError } from 'routing-controllers'

import { AuthenticationService } from 'domain/oky/AuthenticationService'
import { OkyUser } from 'domain/oky/OkyUser'
import { OkyUserRepositoryToken, OkyUserRepository } from 'domain/oky/OkyUserRepository'

import { SignupCommand } from './commands/SignupCommand'
import { LoginCommand } from './commands/LoginCommand'
import { ReplaceStoreCommand } from './commands/ReplaceStoreCommand'
import { DeleteUserCommand } from './commands/DeleteUserCommand'
import { ResetPasswordCommand } from './commands/ResetPasswordCommand'
import { EditInfoCommand } from './commands/EditInfoCommand'
import { EditSecretAnswerCommand } from './commands/EditSecretAnswerCommand'
import { DeleteUserFromPasswordCommand } from './commands/DeleteUserFromPasswordCommand'
import { UserVerifiedPeriodDaysCommand } from './commands/UserVerifiedPeriodDaysCommand'

@Service()
export class OkyUserApplicationService {
  @Inject()
  private authenticationService: AuthenticationService

  @Inject(OkyUserRepositoryToken)
  private okyUserRepository: OkyUserRepository

  public async userDescriptor(userName: string) {
    const user = await this.okyUserRepository.byName(userName)
    if (!user) {
      return null
    }

    return {
      id: user.getId(),
      secretQuestion: user.getMemorableQuestion(),
    }
  }

  public async signup({
    preferredId,
    name,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    plainPassword,
    secretQuestion,
    secretAnswer,
    dateSignedUp,
    dateAccountSaved,
    metadata,
  }: SignupCommand) {
    const id = preferredId || (await this.okyUserRepository.nextIdentity())
    if (await this.okyUserRepository.byId(id)) {
      throw new HttpError(400, `User with this id already exists`)
    }

    const existingUser = await this.okyUserRepository.byName(name)
    if (existingUser) {
      throw new HttpError(409, `User with this name already exists`)
    }

    const user = await OkyUser.register({
      id,
      name,
      dateOfBirth,
      gender,
      location,
      country,
      province,
      plainPassword,
      secretQuestion,
      secretAnswer,
      dateSignedUp,
      dateAccountSaved,
      metadata,
    })
    return this.okyUserRepository.save(user)
  }

  public async login({ name, password }: LoginCommand) {
    return this.authenticationService.authenticateUser(name, password)
  }

  public async resetPassword({ userName, secretAnswer, newPassword }: ResetPasswordCommand) {
    const user = await this.okyUserRepository.byName(userName)
    if (!user) {
      throw new Error(`User with this name doesn't exists`)
    }

    await user.resetPassword(secretAnswer, newPassword)
    return this.okyUserRepository.save(user)
  }

  public async deleteUser({ userId }: DeleteUserCommand) {
    const user = await this.okyUserRepository.byId(userId)
    if (!user) {
      return
    }

    return this.okyUserRepository.delete(user)
  }

  public async deleteUserFromPassword({ userName, password }: DeleteUserFromPasswordCommand) {
    const user = await this.okyUserRepository.byName(userName)
    if (!user) {
      return
    }

    return user.deleteFromPassword(password, this.okyUserRepository)
  }

  public async replaceStore({ userId, storeVersion, appState }: ReplaceStoreCommand) {
    const user = await this.okyUserRepository.byId(userId)
    if (!user) {
      throw new Error(`Cannot replace store for missing ${userId} user`)
    }

    user.replaceStore(storeVersion, appState)
    return this.okyUserRepository.save(user)
  }

  public async editInfo({
    userId,
    name,
    dateOfBirth,
    location,
    gender,
    secretQuestion,
    metadata,
  }: EditInfoCommand) {
    const user = await this.okyUserRepository.byId(userId)
    if (!user) {
      throw new Error(`Cannot edit info for missing ${userId} user`)
    }

    await user.editInfo({
      name,
      dateOfBirth,
      location,
      gender,
      secretQuestion,
      metadata,
    })

    return this.okyUserRepository.save(user)
  }

  public async editSecretAnswer({
    userId,
    previousSecretAnswer,
    nextSecretAnswer,
  }: EditSecretAnswerCommand) {
    const user = await this.okyUserRepository.byId(userId)
    if (!user) {
      throw new Error(`Cannot edit info for missing ${userId} user`)
    }
    await user.editSecretAnswer(previousSecretAnswer, nextSecretAnswer)
    return this.okyUserRepository.save(user)
  }

  public setRepository(repository: OkyUserRepository): void {
    this.okyUserRepository = repository
  }

  public setAuthenticationService(service: AuthenticationService): void {
    this.authenticationService = service
  }

  public async updateUserVerifiedPeriodDays({ userId, metadata }: UserVerifiedPeriodDaysCommand) {
    const user = await this.okyUserRepository.byId(userId)
    if (!user) {
      throw new Error(`Cannot edit info for missing ${userId} user`)
    }

    await user.updateUserVerifiedPeriodDays({
      metadata,
    })

    return this.okyUserRepository.save(user)
  }
}
