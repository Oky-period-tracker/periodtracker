import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class HelpCenterAttributes {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  emoji: string

  @Column()
  isActive: boolean

  @Column()
  lang: string
}
