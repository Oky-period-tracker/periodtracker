import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class PermanentNotification {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  message: string

  @Column()
  versions: string

  @Column()
  isPermanent: boolean

  @Column()
  live: boolean

  @Column()
  lang: string
}
