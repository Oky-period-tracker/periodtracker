import {
  IsNotEmpty,
  MinLength,
  IsIn,
  IsDateString,
  IsOptional,
  IsUUID,
  IsString,
  MaxLength,
} from 'class-validator'
import { UserMetadata, AvatarConfig } from 'domain/oky/OkyUser'
const minNameLength = 3
const minPasswordLength = 1
export class SignupRequest {
  // Validated as a UUID so a malformed preferredId is rejected with a clean 400 at the boundary
  // rather than blowing up as a 500 when it reaches the uuid primary-key column.
  @IsOptional()
  @IsUUID('4')
  public readonly preferredId?: string

  @IsNotEmpty()
  @MinLength(minNameLength, {
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

  @IsNotEmpty()
  public readonly country: string

  @IsNotEmpty()
  public readonly province: string

  @IsNotEmpty()
  @MinLength(minPasswordLength, {
    message: 'Password is too short',
  })
  public readonly password: string

  @IsNotEmpty()
  public readonly secretQuestion: string

  @IsNotEmpty()
  @MinLength(minPasswordLength, {
    message: 'Secret answer is too short',
  })
  public readonly secretAnswer: string

  public readonly dateSignedUp: string

  public readonly metadata?: UserMetadata

  public readonly avatar?: AvatarConfig | null

  @IsOptional()
  @IsString()
  @MaxLength(200)
  public readonly deviceId?: string
}
