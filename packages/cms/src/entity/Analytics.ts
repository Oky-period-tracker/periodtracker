import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  type: string

  @Column({ type: 'json' })
  payload: JSON

  @Column({ type: 'json' })
  metadata: JSON

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: string
}
