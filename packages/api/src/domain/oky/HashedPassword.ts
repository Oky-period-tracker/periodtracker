import { Column } from 'typeorm'
import bcrypt from 'bcrypt'

const saltRounds = 10
const minPasswordLength = 1

export class HashedPassword {
  @Column({ name: 'hash' })
  private hash: string

  private constructor(hash: string) {
    this.hash = hash
  }

  public static async fromPlainPassword(password: string): Promise<HashedPassword> {
    if (password.length < minPasswordLength) {
      throw new Error(`This password is too short`)
    }

    const hash = await bcrypt.hash(password, saltRounds)
    return new HashedPassword(hash)
  }

  public async verify(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hash)
  }
}
