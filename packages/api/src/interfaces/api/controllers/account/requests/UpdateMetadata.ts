import { IsJSON, IsNotEmpty } from 'class-validator'
import { OkyUserMetadata } from 'domain/oky/OkyUser'

export class UpdateMetadataRequest {
  @IsNotEmpty()
  @IsJSON()
  private readonly metadata: OkyUserMetadata // Store as a JSON string

  public getMetadata(): OkyUserMetadata {
    
    return this.metadata 
  }
}
