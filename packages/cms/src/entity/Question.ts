import { Entity, Column, PrimaryColumn, ManyToOne, Index } from 'typeorm'
import { Survey } from './Survey'
@Entity()
@Index('idx_question_survey_id', ['surveyId'])
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
