import { Entity, PrimaryColumn, Column } from 'typeorm'

export enum TranslationType {
  ACCESSIBILITY = 'accessibility', // For screen reader labels
  UI = 'ui', // For regular UI text
}

@Entity()
export class Translations {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  key: string

  @Column()
  label: string

  @Column({ default: 'ui' })
  type: string // 'accessibility' for screen reader labels, 'ui' for regular UI text

  @Column()
  live: boolean

  @Column()
  lang: string
}

