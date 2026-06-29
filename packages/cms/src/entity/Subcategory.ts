import { Entity, PrimaryColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_subcategory_lang', ['lang'])
@Index('idx_subcategory_parent', ['parent_category'])
@Index('idx_subcategory_sorting', ['lang', 'sortingKey'])
export class Subcategory {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  parent_category: string

  @Column()
  lang: string

  @Column({ generated: 'increment' })
  sortingKey: number
}
