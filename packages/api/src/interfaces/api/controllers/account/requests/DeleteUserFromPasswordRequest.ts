import { IsNotEmpty } from 'class-validator'

export class DeleteUserFromPasswordRequest {
  @IsNotEmpty()
  public readonly name: string

  @IsNotEmpty()
  public readonly password: string
}
