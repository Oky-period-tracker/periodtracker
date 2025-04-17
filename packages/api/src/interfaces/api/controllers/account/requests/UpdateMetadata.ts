import { IsJSON, IsNotEmpty } from 'class-validator'
import { UserMetadata } from 'domain/oky/OkyUser'

export class UpdateMetadataRequest {
  @IsNotEmpty()
  @IsJSON()
  private readonly metadata: UserMetadata // Store as a JSON string

  public getMetadata(): UserMetadata {
    return this.metadata
  }
}
