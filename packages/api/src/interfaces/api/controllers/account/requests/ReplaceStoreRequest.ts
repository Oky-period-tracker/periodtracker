import { IsNotEmpty, IsNumber, IsJSON } from 'class-validator'

export class ReplaceStoreRequest {
  @IsNotEmpty()
  @IsNumber()
  private readonly storeVersion: number

  @IsNotEmpty()
  @IsJSON()
  private readonly appState: string

  public getStoreVersion(): number {
    return this.storeVersion
  }

  public getAppStore(): object {
    return JSON.parse(this.appState)
  }
}
