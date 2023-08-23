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

  @Column()
  live: boolean

  @Column()
  lang: string
}
