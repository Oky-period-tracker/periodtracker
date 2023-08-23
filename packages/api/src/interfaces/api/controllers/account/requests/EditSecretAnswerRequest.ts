import { IsNotEmpty, MinLength } from 'class-validator'
const minPasswordLength = 1

export class EditSecretAnswerRequest {
  @IsNotEmpty()
  @MinLength(minPasswordLength, {
    message: 'Secret answer is too short',
  })
  public readonly previousSecretAnswer: string

  @IsNotEmpty()
  @MinLength(minPasswordLength, {
    message: 'Secret answer is too short',
  })
  public readonly nextSecretAnswer: string
}
