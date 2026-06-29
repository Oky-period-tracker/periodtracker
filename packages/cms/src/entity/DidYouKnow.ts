import { Entity, PrimaryColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_did_you_know_lang', ['lang'])
@Index('idx_did_you_know_lang_live', ['lang', 'live'])
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
