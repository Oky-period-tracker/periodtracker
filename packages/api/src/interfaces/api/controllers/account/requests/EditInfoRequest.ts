import { IsNotEmpty, MinLength, IsIn, IsDateString, IsOptional } from 'class-validator'
import { UserMetadata } from 'domain/oky/OkyUser'

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
  public readonly location: string

  @IsOptional()
  public readonly secretQuestion?: string

  public readonly metadata?: UserMetadata
}
