import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_notification_lang', ['lang'])
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
