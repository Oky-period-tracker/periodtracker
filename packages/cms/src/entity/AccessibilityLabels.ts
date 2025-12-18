import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class AccessibilityLabels {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  key: string

  @Column()
  label: string

  @Column()
  live: boolean

  @Column()
  lang: string
}

