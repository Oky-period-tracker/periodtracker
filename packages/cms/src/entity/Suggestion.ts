import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Suggestion {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  dateRec: string

  @Column()
  organization: string

  @Column()
  platform: string

  @Column()
  reason: string

  @Column()
  email: string

  @Column()
  status: string

  @Column()
  content: string

  @Column()
  lang: string
}
