import {
  JsonController,
  Get,
  Post,
  Body,
  UnauthorizedError,
  NotFoundError,
  CurrentUser,
  Param,
} from 'routing-controllers'

import * as jwt from 'jsonwebtoken'
import { env } from 'interfaces/env'

import { OkyUserApplicationService } from 'application/oky/OkyUserApplicationService'
import { OkyUser } from 'domain/oky/OkyUser'

import { SignupRequest } from './requests/SignupRequest'
import { LoginRequest } from './requests/LoginRequest'
import { ReplaceStoreRequest } from './requests/ReplaceStoreRequest'
import { ResetPasswordRequest } from './requests/ResetPasswordRequest'
import { EditInfoRequest } from './requests/EditInfoRequest'
import { EditSecretAnswerRequest } from './requests/EditSecretAnswerRequest'
import { DeleteUserFromPasswordRequest } from './requests/DeleteUserFromPasswordRequest'
import { UpdateMetadataRequest } from './requests/UpdateMetadata'

@JsonController('/account')
export class AccountController {
  public constructor(private okyUserApplicationService: OkyUserApplicationService) {}

  @Get('/info/:userName')
  public async info(@Param('userName') userName: string) {
    const user = await this.okyUserApplicationService.userDescriptor(userName)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    return user
  }

  @Post('/signup')
  public async signup(
    @Body()
    {
      preferredId,
      name,
      dateOfBirth,
      gender,
      location,
      country,
      province,
      password,
      secretQuestion,
      secretAnswer,
      dateSignedUp,
      metadata,
    }: SignupRequest,
  ) {
    if (country === null || country === '00') {
      // this is to stop account creation on the old variant of the app. Worth removing if the old variant is completely removed.
      // At the time of writing the old variant of the app and the new english only version had the same endpoint for the backend
      return
    }
    const user = await this.okyUserApplicationService.signup({
      preferredId,
      name,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      location,
      country,
      province,
      plainPassword: password,
      secretQuestion,
      secretAnswer,
      dateSignedUp,
      dateAccountSaved: new Date().toISOString(),
      metadata,
    })

    return this.signTokenResponse(user)
  }

  @Post('/login')
  public async login(
    @Body()
    { name, password }: LoginRequest,
  ) {
    const authenticationDescriptor = await this.okyUserApplicationService.login({
      name: name.trim(),
      password: password.trim(),
    })

    return authenticationDescriptor.fold(
      (authError) => {
        console.log(authError)
        throw new UnauthorizedError(authError)
      },
      (user) => this.signTokenResponse(user),
    )
  }

  @Post('/delete')
  public async delete(@CurrentUser({ required: true }) userId: string) {
    await this.okyUserApplicationService.deleteUser({
      userId,
    })

    return {
      userId,
    }
  }

  @Post('/delete-from-password')
  public async deleteFromPassword(@Body() request: DeleteUserFromPasswordRequest) {
    const { name, password } = request
    await this.okyUserApplicationService.deleteUserFromPassword({
      userName: name,
      password,
    })

    return {
      name,
    }
  }

  @Post('/replace-store')
  public async replaceStore(
    @CurrentUser({ required: true }) userId: string,
    @Body() request: ReplaceStoreRequest,
  ) {
    const storeVersion = request.getStoreVersion()
    const appState = request.getAppStore()

    await this.okyUserApplicationService.replaceStore({
      userId,
      storeVersion,
      appState,
    })

    return { userId, storeVersion, appState }
  }

  @Post('/edit-info')
  public async editInfo(
    @CurrentUser({ required: true }) userId: string,
    @Body() request: EditInfoRequest,
  ) {
    const { name, gender, dateOfBirth, secretQuestion, location, metadata } = request
    // TODO:PH
    // let isProfileUpdateSkipped = false
    // if (!city) {
    //   isProfileUpdateSkipped = true
    // }
    await this.okyUserApplicationService.editInfo({
      userId,
      name,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      location,
      secretQuestion,
      metadata,
    })

    return { userId }
  }

  @Post('/edit-secret-answer')
  public async editSecretAnswer(
    @CurrentUser({ required: true }) userId: string,
    @Body() request: EditSecretAnswerRequest,
  ) {
    const { previousSecretAnswer, nextSecretAnswer } = request
    await this.okyUserApplicationService.editSecretAnswer({
      userId,
      previousSecretAnswer,
      nextSecretAnswer,
    })
    return { userId }
  }

  @Post('/reset-password')
  public async resetPassword(
    @Body()
    { name: userName, secretAnswer, password: newPassword }: ResetPasswordRequest,
  ) {
    await this.okyUserApplicationService.resetPassword({
      userName,
      secretAnswer,
      newPassword,
    })

    return {}
  }

  private signTokenResponse(user: OkyUser) {
    const userDescriptor = {
      id: user.getId(),
      dateOfBirth: user.getDateOfBirth(),
      gender: user.getGender(),
      location: user.getLocation(),
      country: user.getCountry(),
      province: user.getProvince(),
      secretQuestion: user.getMemorableQuestion(),
      secretAnswer: user.getHashedMemorableAnswer(),
      dateSignedUp: user.getDateSignedUp(),
      metadata: user.getMetadata(),
    }

    const appToken = jwt.sign(userDescriptor, env.app.secret, {
      audience: 'app',
    })

    return {
      appToken,
      user: userDescriptor,
      store: user.getStore(),
    }
  }

  @Post('/update-verified-dates')
  public async updateUserVerifiedPeriodDays(
    @CurrentUser({ required: true }) userId: string,
    @Body() request: UpdateMetadataRequest,
  ) {
    // console.log('request ===== ', request);

    const metadata = request.getMetadata()

    await this.okyUserApplicationService.updateUserVerifiedPeriodDays({
      userId,
      metadata,
    })

    return { userId, metadata }
  }
}
