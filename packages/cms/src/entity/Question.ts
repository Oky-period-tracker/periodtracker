import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm'
import { Survey } from './Survey'
@Entity()
export class Question {
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

  @Column()
  option5: string
  @ManyToOne((type) => Survey, (survey) => survey.questions)
  survey: Survey

  @Column()
  response: string

  @Column()
  next_question: string

  @Column()
  sort_number: string

  @Column()
  surveyId: string

  @Column()
  is_multiple: boolean
}
