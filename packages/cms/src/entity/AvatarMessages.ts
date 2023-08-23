import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class AvatarMessages {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  content: string

  @Column()
  live: boolean

  @Column()
  lang: string
}
