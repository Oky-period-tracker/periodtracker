import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  // Left out of every query unless one asks for it with addSelect, which only
  // login does, so the hash cannot reach a response or req.user by default
  @Column({ select: false })
  password: string

  @Column()
  lang: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created: string

  @Column()
  type: string
}
