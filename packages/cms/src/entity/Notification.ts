import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  content: string

  @Column()
  date_sent: string

  @Column()
  status: string

  @Column()
  lang: string
}
