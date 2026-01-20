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

  @Column({ default: false })
  provinceRestricted: boolean

  @Column({ type: 'text', nullable: true })
  allowedProvinces: string
}
