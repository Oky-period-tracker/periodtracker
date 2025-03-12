import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class DidYouKnow {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  content: string

  @Column({ default: false, nullable: true })
  isAgeRestricted: boolean

  @Column({ default: 0 })
  ageRestrictionLevel: number

  @Column({ default: 0 })
  contentFilter: number

  @Column()
  live: boolean

  @Column()
  lang: string
}
