import { Service, Inject } from 'typedi'
import { getRepository } from 'typeorm'
import { UserHelpCenter } from 'domain/oky/UserHelpCenter'

@Service()
export class UserHelpCenterApplicationService {
  private repo = getRepository(UserHelpCenter)

  public async unsaveHelpCenter({ userId, id }: any) {
    await this.repo.delete({ helpCenterId: id, userId })

    return this.repo.find({ where: { userId } })
  }

  public async findAll({ userId }: any) {
    return await this.repo.find({ where: { userId } })
  }

  public async save({ helpCenterId, userId }: any) {
    const isExist = await this.repo.find({
      where: {
        userId,
        helpCenterId,
      },
    })

    if (isExist.length) {
      return isExist
    }

    return await this.repo.save({
      userId,
      helpCenterId,
      lang: '',
    })
  }
}
