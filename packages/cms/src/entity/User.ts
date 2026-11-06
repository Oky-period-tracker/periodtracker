import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
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
