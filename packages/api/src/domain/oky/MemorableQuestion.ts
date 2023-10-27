import { Column } from 'typeorm'
import bcrypt from 'bcrypt'

const saltRounds = 10
const minSecretAnswerLength = 1

export class MemorableQuestion {
  @Column({ name: 'question' })
  public readonly secretQuestion: string

  @Column({ name: 'answer' })
  public readonly secretAnswerHashed: string

  private constructor(secretQuestion: string, secretAnswerHashed: string) {
    this.secretQuestion = secretQuestion
    this.secretAnswerHashed = secretAnswerHashed
  }

  public static async fromQuestion(
    secretQuestion: string,
    secretAnswer: string,
  ): Promise<MemorableQuestion> {
    if (secretAnswer.length < minSecretAnswerLength) {
      throw new Error(`This secret answer is too short`)
    }
    const secretAnswerHashed = await bcrypt.hash(secretAnswer, saltRounds)
    return new MemorableQuestion(secretQuestion, secretAnswerHashed)
  }

  public async changeAnswer(secretAnswer: string) {
    const secretAnswerHashed = await bcrypt.hash(secretAnswer, saltRounds)
    return new MemorableQuestion(this.secretQuestion, secretAnswerHashed)
  }

  public async changeQuestion(secretQuestion: string) {
    return new MemorableQuestion(secretQuestion, this.secretAnswerHashed)
  }

  public async verify(secretAnswer: string): Promise<boolean> {
    return bcrypt.compare(secretAnswer, this.secretAnswerHashed)
  }
}
