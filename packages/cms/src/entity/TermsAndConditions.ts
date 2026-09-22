import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_terms_and_conditions_lang', ['lang'])
export class TermsAndConditions {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  json_dump: string

  @Column()
  timestamp: Date

  @Column()
  lang: string
}
