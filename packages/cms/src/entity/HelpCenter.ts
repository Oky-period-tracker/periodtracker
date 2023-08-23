import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class HelpCenter {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  caption: string

  @Column()
  contactOne: string

  @Column()
  contactTwo: string

  @Column()
  address: string

  @Column()
  website: string

  @Column()
  lang: string
}
