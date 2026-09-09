import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
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
