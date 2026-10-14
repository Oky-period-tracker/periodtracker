import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm'

@Entity()
@Index('idx_help_center_attribute_lang', ['lang'])
export class HelpCenterAttribute {
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
