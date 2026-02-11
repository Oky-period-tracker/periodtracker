import { Entity, PrimaryColumn, Column } from 'typeorm'
import { HashedPassword } from './HashedPassword'
import { HashedName } from './HashedName'
import { MemorableQuestion } from './MemorableQuestion'
import { OkyUserRepository } from './OkyUserRepository'
import { BadRequestError } from 'routing-controllers'

interface OkyUserProps {
  id: string
  name: HashedName
  dateOfBirth: Date
  gender: 'Female' | 'Male' | 'Other'
  location: string
  country: string
  province: string
  password: HashedPassword
  memorable: MemorableQuestion
  dateSignedUp: string
  dateAccountSaved: string
  cyclesNumber: number
  metadata: UserMetadata
  avatar: AvatarConfig | null
}

export interface AvatarConfig {
  body: string | null
  hair: string | null
  eyes: string | null
  smile: string | null
  clothing: string | null
  devices: string | string[] | null // Supports both legacy string format and new array format
   skinColor?: string | null
   hairColor?: string | null
   eyeColor?: string | null
  customAvatarUnlocked: boolean
  name?: string
}

export interface UserMetadata {
  periodDates?: {
    date: string
    mlGenerated: boolean
    userVerified: boolean | null
  }[]
  isProfileUpdateSkipped?: boolean
  accommodationRequirement?: string
  city?: string
}

@Entity()
export class OkyUser {
  @PrimaryColumn('uuid', { name: 'id' })
  private id: string

  @Column((type) => HashedName)
  private name: HashedName

  @Column({ name: 'date_of_birth' })
  private dateOfBirth: Date

  @Column({ name: 'gender' })
  private gender: string

  @Column({ name: 'location' })
  private location: string

  @Column({ name: 'country', default: '00', nullable: true })
  private country: string

  @Column({ name: 'province', default: '0', nullable: true })
  private province: string

  @Column((type) => HashedPassword)
  private password: HashedPassword

  @Column((type) => MemorableQuestion)
  private memorable: MemorableQuestion

  @Column({ name: 'store', type: 'json', nullable: true })
  private store: null | {
    storeVersion: number
    appState: object
  }

  @Column({ name: 'date_signed_up' })
  private dateSignedUp: string

  @Column({ name: 'date_account_saved' })
  private dateAccountSaved: string

  @Column({ name: 'cycles_number', default: 0 })
  private cyclesNumber: number

  @Column({ name: 'metadata', type: 'json', nullable: false, default: {} })
  private metadata: UserMetadata

  @Column({ name: 'avatar', type: 'json', nullable: true, default: null })
  private avatar: AvatarConfig | null

  private constructor(props?: OkyUserProps) {
    if (props !== undefined) {
      const {
        id,
        name,
        dateOfBirth,
        gender,
        location,
        country,
        province,
        password,
        memorable,
        dateSignedUp,
        dateAccountSaved,
        cyclesNumber,
        metadata,
        avatar,
      } = props

      this.id = id
      this.name = name
      this.dateOfBirth = dateOfBirth
      this.gender = gender
      this.location = location
      this.country = country
      this.province = province
      this.password = password
      this.memorable = memorable
      this.store = null
      this.dateSignedUp = dateSignedUp
      this.dateAccountSaved = dateAccountSaved
      this.cyclesNumber = cyclesNumber
      this.metadata = metadata
      // Ensure customAvatarUnlocked is set to false if not provided
      if (avatar && typeof avatar.customAvatarUnlocked !== 'boolean') {
        this.avatar = { ...avatar, customAvatarUnlocked: false }
      } else {
        this.avatar = avatar
      }
    }
  }

  public static async register({
    id,
    name,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    plainPassword,
    secretQuestion,
    secretAnswer,
    dateSignedUp,
    dateAccountSaved,
    cyclesNumber,
    metadata,
    avatar = null,
  }: {
    id: string
    name: string
    dateOfBirth: Date
    gender: 'Male' | 'Female' | 'Other'
    location: string
    country: string
    province: string
    plainPassword: string
    secretQuestion: string
    secretAnswer: string
    dateSignedUp: string
    dateAccountSaved: string
    cyclesNumber: number
    metadata: UserMetadata
    avatar?: AvatarConfig | null
  }): Promise<OkyUser> {
    if (!id) {
      throw new Error(`The user id must be provided`)
    }

    if (!name) {
      throw new Error(`The user name must be provided`)
    }

    const password = await HashedPassword.fromPlainPassword(plainPassword)
    const hashedName = await HashedName.fromPlainName(name)
    const memorable = await MemorableQuestion.fromQuestion(secretQuestion, secretAnswer)

    return new OkyUser({
      id,
      name: hashedName,
      dateOfBirth,
      gender,
      location,
      country,
      province,
      password,
      memorable,
      dateSignedUp,
      dateAccountSaved,
      cyclesNumber,
      metadata,
      avatar,
    })
  }

  public replaceStore(storeVersion: number, appState: object = {}) {
    this.store = {
      storeVersion,
      appState,
    }
  }

  public async editInfo({
    name,
    dateOfBirth,
    gender,
    location,
    secretQuestion,
    metadata,
  }: {
    name: string
    dateOfBirth: Date
    gender: 'Male' | 'Female' | 'Other'
    location: string
    secretQuestion: string
    metadata: UserMetadata
  }) {
    if (!name) {
      throw new Error(`The user name must be provided`)
    }

    const hashedName = await HashedName.fromPlainName(name)
    this.name = hashedName
    this.dateOfBirth = dateOfBirth
    this.gender = gender
    this.location = location
    this.memorable = await this.memorable.changeQuestion(secretQuestion)
    this.metadata = metadata
  }

  public async editSecretAnswer(previousSecretAnswer: string, nextSecretAnswer: string) {
    if (!(await this.memorable.verify(previousSecretAnswer))) {
      throw new BadRequestError(`wrong_previous_secret_answer`)
    }
    this.memorable = await this.memorable.changeAnswer(nextSecretAnswer)
  }

  public async resetPassword(secretAnswer: string, plainPassword: string) {
    if (!(await this.memorable.verify(secretAnswer))) {
      throw new Error(`Wrong secret answer for password`)
    }
    this.password = await HashedPassword.fromPlainPassword(plainPassword)
  }

  public async verifyPassword(password: string) {
    return this.password.verify(password)
  }

  public async deleteFromPassword(password: string, repository: OkyUserRepository) {
    if (!(await this.password.verify(password))) {
      throw new Error(`Wrong password for deletion`)
    }
    return repository.delete(this)
  }

  public async updateUserVerifiedPeriodDays({ metadata }: { metadata: UserMetadata }) {
    this.metadata = metadata
  }

  public getId() {
    return this.id
  }

  public getDateOfBirth() {
    return this.dateOfBirth
  }

  public getGender() {
    return this.gender
  }

  public getLocation() {
    return this.location
  }
  public getCountry() {
    return this.country
  }

  public getProvince() {
    return this.province
  }

  public getMemorableQuestion() {
    return this.memorable.secretQuestion
  }

  public getHashedMemorableAnswer() {
    return this.memorable.secretAnswerHashed
  }

  public getStore() {
    return this.store
  }

  public getDateSignedUp() {
    return this.dateSignedUp
  }

  public getCyclesNumber() {
    return this.cyclesNumber
  }

  public updateCyclesNumber(cyclesNumber: number) {
    this.cyclesNumber = cyclesNumber
  }

  public getMetadata() {
    return this.metadata
  }

  public getAvatar() {
    return this.avatar
  }

  public updateAvatar(avatar: AvatarConfig | null) {
    if (avatar) {
      // Normalize devices: convert string to array for consistency, or keep array as-is
      let normalizedDevices: string | string[] | null = avatar.devices
      if (typeof avatar.devices === 'string' && avatar.devices.trim() !== '') {
        // Keep as string for backward compatibility, but also support arrays
        normalizedDevices = avatar.devices
      } else if (Array.isArray(avatar.devices)) {
        // Filter out empty strings and null values from array
        normalizedDevices = avatar.devices.filter((d): d is string => typeof d === 'string' && d.trim() !== '')
        // If array is empty after filtering, set to null
        if (normalizedDevices.length === 0) {
          normalizedDevices = null
        }
      } else if (avatar.devices === '' || avatar.devices === null || avatar.devices === undefined) {
        normalizedDevices = null
      }

      const normalizedAvatar: AvatarConfig = {
        ...avatar,
        devices: normalizedDevices,
        customAvatarUnlocked:
          typeof avatar.customAvatarUnlocked === 'boolean' ? avatar.customAvatarUnlocked : false,
        smile: avatar.smile ?? 'smile',
      }
      this.avatar = normalizedAvatar
      return
    }

    this.avatar = avatar
  }
}
