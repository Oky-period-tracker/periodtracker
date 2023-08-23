import { IsNotEmpty } from 'class-validator'

export class LoginRequest {
  @IsNotEmpty()
  public readonly name: string

  @IsNotEmpty()
  public readonly password: string
}
