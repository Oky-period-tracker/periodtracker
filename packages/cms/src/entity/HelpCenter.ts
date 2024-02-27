import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class HelpCenter {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  // @TODO:PH column name change
  @Column()
  providerName: string

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

  // @TODO:PH column name change
  @Column()
  websites: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  province: string

  @Column()
  lang: string

  @Column()
  isAvailableNationwide: boolean

  @Column()
  primaryAttributeId: number

  @Column({ nullable: true })
  otherAttributes: string

  @Column({ default: false })
  isActive: boolean

  @Column({ generated: 'increment' })
  sortingKey: number
}
