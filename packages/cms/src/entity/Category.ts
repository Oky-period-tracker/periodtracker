import { Entity, PrimaryColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_category_lang', ['lang'])
@Index('idx_category_sorting', ['lang', 'sortingKey'])
export class Category {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  primary_emoji: string

  @Column()
  primary_emoji_name: string

  @Column()
  lang: string

  @Column({ generated: 'increment' })
  sortingKey: number
}
