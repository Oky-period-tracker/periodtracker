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
  gender?: 'Female' | 'Male' | 'Other'
  genderIdentity?: 'Oo' | 'Hindi' | 'Other'
  isPwd: string
  accommodationRequirement?: string
  religion: string
  encyclopediaVersion: string
  location: string
  country: string
  isProfileUpdateSkipped?: boolean
  city: string
  province: string
  password: HashedPassword
  memorable: MemorableQuestion
  dateSignedUp: string
  dateAccountSaved: string
}

@Entity()
export class OkyUser {
  @PrimaryColumn('uuid', { name: 'id' })
  private id: string

  @Column((type) => HashedName)
  private name: HashedName

  @Column({ name: 'date_of_birth' })
  private dateOfBirth: Date

  @Column({ name: 'gender', nullable: true })
  private gender: string

  @Column({ name: 'genderIdentity', nullable: true })
  private genderIdentity: string

  @Column({ name: 'isPwd' })
  private isPwd: string

  @Column({ name: 'accommodationRequirement', nullable: true })
  private accommodationRequirement?: string

  @Column({ name: 'religion' })
  private religion: string

  @Column({ name: 'encyclopediaVersion' })
  private encyclopediaVersion: string

  @Column({ name: 'location' })
  private location: string

  // @TODO:PH default kept in submodule?
  @Column({ name: 'country', default: 'PH', nullable: true })
  private country: string

  @Column({ name: 'city', default: '', nullable: true })
  private city: string

  @Column({ name: 'province', default: '', nullable: true })
  private province: string

  @Column((type) => HashedPassword)
  private password: HashedPassword

  @Column((type) => MemorableQuestion)
  private memorable: MemorableQuestion

  @Column({ name: 'isProfileUpdateSkipped', default: false, nullable: true })
  private isProfileUpdateSkipped: boolean

  @Column({ name: 'store', type: 'json', nullable: true })
  private store: null | {
    storeVersion: number
    appState: object
  }

  @Column({ name: 'date_signed_up' })
  private dateSignedUp: string

  @Column({ name: 'date_account_saved' })
  private dateAccountSaved: string

  private constructor(props?: OkyUserProps) {
    if (props !== undefined) {
      const {
        id,
        name,
        dateOfBirth,
        gender,
        genderIdentity,
        isPwd,
        accommodationRequirement,
        religion,
        encyclopediaVersion,
        location,
        country,
        city,
        province,
        password,
        isProfileUpdateSkipped,
        memorable,
        dateSignedUp,
      } = props

      this.id = id
      this.name = name
      this.country = country
      this.dateOfBirth = dateOfBirth
      this.gender = gender
      this.genderIdentity = genderIdentity
      this.isPwd = isPwd
      this.accommodationRequirement = accommodationRequirement
      this.religion = religion
      this.encyclopediaVersion = encyclopediaVersion
      this.location = location
      this.country = country
      this.city = city
      this.province = province
      this.password = password
      this.memorable = memorable
      this.store = null
      this.isProfileUpdateSkipped = isProfileUpdateSkipped
      this.dateSignedUp = dateSignedUp
    }
  }

  public static async register({
    id,
    name,
    dateOfBirth,
    gender,
    genderIdentity,
    isPwd,
    accommodationRequirement,
    religion,
    encyclopediaVersion,
    location,
    country,
    city,
    province,
    plainPassword,
    secretQuestion,
    secretAnswer,
    dateSignedUp,
    dateAccountSaved,
  }: {
    id: string
    name: string
    dateOfBirth: Date
    gender: 'Male' | 'Female' | 'Other'
    genderIdentity: 'Oo' | 'Hindi' | 'Other'
    isPwd: string
    accommodationRequirement?: string
    religion: string
    encyclopediaVersion: string
    location: string
    country: string
    city: string
    province: string
    plainPassword: string
    secretQuestion: string
    secretAnswer: string
    dateSignedUp: string
    dateAccountSaved: string
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
      genderIdentity,
      isPwd,
      accommodationRequirement,
      religion,
      encyclopediaVersion,
      location,
      country,
      city,
      province,
      password,
      memorable,
      dateSignedUp,
      dateAccountSaved,
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
    genderIdentity,
    isPwd,
    accommodationRequirement,
    religion,
    city,
    encyclopediaVersion,
    location,
    isProfileUpdateSkipped,
    secretQuestion,
  }: {
    name: string
    dateOfBirth: Date
    gender: 'Male' | 'Female' | 'Other'
    genderIdentity: 'Oo' | 'Hindi' | 'Other'
    isPwd: string
    accommodationRequirement?: string
    religion: string
    encyclopediaVersion: string
    location: string
    city: string
    secretQuestion: string
    isProfileUpdateSkipped?: boolean
  }) {
    if (!name) {
      throw new Error(`The user name must be provided`)
    }

    const hashedName = await HashedName.fromPlainName(name)
    this.name = hashedName
    this.dateOfBirth = dateOfBirth
    this.gender = gender
    this.genderIdentity = genderIdentity
    this.isPwd = isPwd
    this.city = city
    this.accommodationRequirement = accommodationRequirement
    this.religion = religion
    this.encyclopediaVersion = encyclopediaVersion
    this.location = location
    this.isProfileUpdateSkipped = isProfileUpdateSkipped
    this.memorable = await this.memorable.changeQuestion(secretQuestion)
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

  public getId() {
    return this.id
  }

  public getDateOfBirth() {
    return this.dateOfBirth
  }

  public getGender() {
    return this.gender
  }

  public getGenderIdentity() {
    return this.genderIdentity
  }

  public getIsPwd() {
    return this.isPwd
  }

  public getAccommodationRequirement() {
    return this.accommodationRequirement
  }

  public getReligion() {
    return this.religion
  }

  public getEncyclopediaVersion() {
    return this.encyclopediaVersion
  }

  public getLocation() {
    return this.location
  }

  public getCountry() {
    return this.country
  }

  public getCity() {
    return this.city
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

  public getIsProfileUpdateSkipped() {
    return this.isProfileUpdateSkipped
  }

  public getStore() {
    return this.store
  }

  public getDateSignedUp() {
    return this.dateSignedUp
  }
}
