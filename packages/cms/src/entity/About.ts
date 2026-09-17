import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_about_lang', ['lang'])
export class About {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  json_dump: string

  @Column()
  timestamp: Date

  @Column()
  lang: string
}
