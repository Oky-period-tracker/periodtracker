import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_privacy_policy_lang', ['lang'])
export class PrivacyPolicy {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  json_dump: string

  @Column()
  timestamp: Date

  @Column()
  lang: string
}
