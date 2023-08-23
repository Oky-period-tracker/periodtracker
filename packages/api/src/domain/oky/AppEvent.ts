import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm'

@Entity()
export class AppEvent {
  @PrimaryGeneratedColumn()
  id: number

  @Column('uuid', { name: 'local_id', unique: true })
  localId: string

  @Column({ name: 'type' })
  type: string

  @Column({ name: 'payload', type: 'json' })
  payload: any

  @Column({ name: 'metadata', type: 'json' })
  metadata: any

  @Column({ name: 'user_id', nullable: true })
  userId: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  public static fromData(
    userId: string | null,
    {
      localId,
      type,
      payload,
      metadata,
    }: {
      localId: string
      type: string
      payload: any
      metadata: any
    },
  ) {
    if (!localId) {
      throw new Error(`Event local id must not be empty`)
    }

    if (!type) {
      throw new Error(`Event type must not be empty`)
    }

    if (!payload || typeof payload !== 'object') {
      throw new Error(`Event payload must be an object`)
    }

    if (!metadata || typeof metadata !== 'object') {
      throw new Error(`Event metadata must be an object`)
    }

    const appEvent = new AppEvent()
    appEvent.localId = localId
    appEvent.type = type
    appEvent.payload = payload
    appEvent.metadata = metadata
    appEvent.userId = userId

    return appEvent
  }
}
