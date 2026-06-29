import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm'

@Entity()
@Index('idx_article_lang', ['lang'])
@Index('idx_article_lang_live', ['lang', 'live'])
@Index('idx_article_category', ['category'])
@Index('idx_article_subcategory', ['subcategory'])
@Index('idx_article_sorting', ['lang', 'sortingKey'])
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
