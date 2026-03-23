import crypto from 'crypto'
import { Column } from 'typeorm'
import bcrypt from 'bcrypt'

export class HashedName {
  @Column({ name: 'hash' })
  private hash: string

  private constructor(hash: string) {
    this.hash = hash
  }

  public getHashName() {
    return this.hash
  }

  public static async fromPlainName(name: string): Promise<HashedName> {
    if (name.length < 3) {
      throw new Error(`This name is too short`)
    }

    const hash = crypto.createHash('sha256').update(name).digest('hex')

    return new HashedName(hash)
  }

  public async verify(name: string): Promise<boolean> {
    return bcrypt.compare(name, this.hash)
  }
}
