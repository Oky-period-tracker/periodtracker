import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class OkyUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nameHash: string

  @Column()
  date_of_birth: string

  @Column()
  province: string

  @Column()
  gender: string

  @Column()
  location: string

  @Column()
  country: string

  @Column()
  lang: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created: string

  @Column()
  type: string
}
