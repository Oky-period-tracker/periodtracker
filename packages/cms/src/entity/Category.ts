import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Category {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  primary_emoji: string

  @Column()
  primary_emoji_name: string

  @Column()
  lang: string
}
