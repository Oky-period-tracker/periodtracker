import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Quiz {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  topic: string

  @Column()
  question: string

  @Column()
  option1: string

  @Column()
  option2: string

  @Column()
  option3: string

  @Column()
  right_answer: string

  @Column()
  wrong_answer_response: string

  @Column()
  right_answer_response: string

  @Column({ default: false, nullable: true })
  isAgeRestricted: boolean

  @Column()
  live: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: string

  @Column()
  lang: string
}
