import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

// Login resolves an account by username alone, so it has to identify one row
@Index('idx_user_username', ['username'], { unique: true })
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

  // Sessions stamped with an older version are rejected, see
  // Authentication.deserializeUser. Bump it to log the user out everywhere.
  @Column({ default: 0 })
  sessionVersion: number
}
