import { IsNotEmpty } from 'class-validator'
import { UserMetadata } from 'domain/oky/OkyUser'

export class UpdateMetadataRequest {
  @IsNotEmpty()
  public readonly metadata: UserMetadata
}
