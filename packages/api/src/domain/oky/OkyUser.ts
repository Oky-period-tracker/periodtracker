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
  metadata: UserMetadata
}

export interface UserMetadata {
  periodDates: {
    date: string
    mlGenerated: boolean
    userVerified: boolean
  }
  isProfileUpdateSkipped?: boolean
  accommodationRequirement?: string
  religion?: string
  contentSelection?: number
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

  @Column({ name: 'metadata', type: 'json', nullable: false, default: {} })
  private metadata: UserMetadata

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
        metadata,
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
      this.metadata = metadata
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
    metadata,
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
    metadata: UserMetadata
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
      metadata,
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

  public getMetadata() {
    return this.metadata
  }
}
