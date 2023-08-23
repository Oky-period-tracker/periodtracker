import { IsNotEmpty, MinLength } from 'class-validator'
const minPasswordLength = 1
export class ResetPasswordRequest {
  @IsNotEmpty()
  public readonly name: string

  @IsNotEmpty()
  public readonly secretAnswer: string

  @IsNotEmpty()
  @MinLength(minPasswordLength, {
    message: 'Password is too short',
  })
  public readonly password: string
}
