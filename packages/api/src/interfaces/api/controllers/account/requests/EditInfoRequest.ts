import { IsNotEmpty, MinLength, IsIn, IsDateString } from 'class-validator'

export class EditInfoRequest {
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Name is too short',
  })
  public readonly name: string

  @IsDateString()
  public readonly dateOfBirth: string

  @IsNotEmpty()
  @IsIn(['Male', 'Female', 'Other'])
  public readonly gender: 'Male' | 'Female' | 'Other'

  @IsNotEmpty()
  @IsIn(['Oo', 'Hindi', 'Other'])
  public readonly genderIdentity: 'Oo' | 'Hindi' | 'Other'

  @IsNotEmpty()
  public readonly isPwd: string

  public readonly accommodationRequirement?: string

  public readonly city?: string

  @IsNotEmpty()
  public readonly religion: string

  @IsNotEmpty()
  public readonly encyclopediaVersion: string

  @IsNotEmpty()
  public readonly location: string

  @IsNotEmpty()
  public readonly secretQuestion: string
}
