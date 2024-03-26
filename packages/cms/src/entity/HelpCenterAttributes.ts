import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class HelpCenterAttributes {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  attributeName: string

  @Column()
  description: string

  @Column()
  isActive: boolean
}
