import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { Question } from './Question'
@Entity()
export class Survey {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  question: string

  @Column()
  option1: string

  @Column()
  option2: string

  @Column()
  option3: string

  @Column()
  option4: string
  @OneToMany((type) => Question, (question) => question.surveyId)
  questions: Question[]

  @Column()
  option5: string

  @Column()
  response: string

  @Column()
  live: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: string

  @Column()
  lang: string

  @Column()
  is_multiple: boolean

  @Column()
  isAgeRestricted: boolean
}
