import { v4 as uuidv4 } from 'uuid'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { OkyUser } from 'domain/oky/OkyUser'
import { OkyUserRepository, OkyUserRepositoryToken } from 'domain/oky/OkyUserRepository'
import { HashedName } from 'domain/oky/HashedName'

@Service(OkyUserRepositoryToken)
export class TypeORMOkyUserRepository implements OkyUserRepository {
  @InjectRepository(OkyUser)
  private repository: Repository<OkyUser>

  public async nextIdentity() {
    return uuidv4()
  }

  public async byId(id: string) {
    return this.repository.findOne(id)
  }

  public async byName(plainName: string) {
    const name = await HashedName.fromPlainName(plainName)
    const user = await this.repository.findOne({ where: { name } })
    return user
  }

  public async save(user: OkyUser) {
    return this.repository.save(user)
  }

  public async delete(user: OkyUser) {
    const id = user.getId()
    await this.repository.delete(id)
  }
}
