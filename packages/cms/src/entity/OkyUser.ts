import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity({ name: 'oky_user' })
export class OkyUser {
  @PrimaryColumn('uuid', { name: 'id' })
  id: string

  @Column({ nullable: true })
  nameHash: string

  @Column({ nullable: true })
  date_of_birth: string

  @Column({ nullable: true })
  province: string

  @Column({ nullable: true })
  gender: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  country: string

  @Column({ nullable: true, default: 'en' })
  lang: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created: string

  @Column({ nullable: true, default: 'user' })
  type: string
}
