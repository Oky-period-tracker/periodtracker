import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class AboutBanner {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  image: string

  @Column()
  timestamp: Date

  @Column()
  lang: string
}
