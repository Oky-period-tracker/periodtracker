import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm'

@Entity()
export class Article {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  category: string

  @Column()
  subcategory: string

  @Column()
  article_heading: string

  @Column()
  article_text: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: string

  @Column()
  live: boolean

  @Column()
  lang: string

  @Column({ default: 0 })
  contentFilter: number

  @Column({ default: false, nullable: true })
  isAgeRestricted: boolean

  @Column({ default: 0 })
  ageRestrictionLevel: number

  @Column({ nullable: true })
  voiceOverKey: string

  @Column({ generated: 'increment' })
  sortingKey: number
}
