import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Subcategory {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  parent_category: string

  @Column()
  lang: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: string
}
