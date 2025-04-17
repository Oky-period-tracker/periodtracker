import { UserMetadata } from 'domain/oky/OkyUser'

export interface UserVerifiedPeriodDaysCommand {
  userId: string
  metadata: UserMetadata
}
