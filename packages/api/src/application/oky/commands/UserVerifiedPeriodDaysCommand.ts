import { OkyUserMetadata } from "domain/oky/OkyUser"

export interface UserVerifiedPeriodDaysCommand {
    userId: string
    metadata: OkyUserMetadata | null
  }
  