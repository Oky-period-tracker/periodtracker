import { Service } from 'typedi'
import { In, getRepository, Not } from 'typeorm'
import { UserHelpCenter } from 'domain/oky/UserHelpCenter'

@Service()
export class UserHelpCenterApplicationService {
  private repo = getRepository(UserHelpCenter)

  public async unsaveHelpCenter({ userId, id }: any) {
    await this.repo.delete({ helpCenterId: id, userId })

    return this.repo.find({ where: { userId } })
  }

  public async find({ userId }: any) {
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

  public async bulkSave({ helpCenterIds, userId }: any) {
    const toDelete = await this.repo.find({
      where: {
        userId,
        helpCenterId: Not(In(helpCenterIds)),
      },
    })

    await this.repo.remove(toDelete)

    const userHelpCenters = await this.repo.find({
      where: {
        userId,
        helpCenterId: In(helpCenterIds),
      },
    })

    if (userHelpCenters.length) {
      const helpCenters = userHelpCenters.map((helpCenter) => {
        return {
          userId,
          helpCenterId: helpCenter.id,
          lang: '',
        }
      })

      return helpCenters
    }

    return userHelpCenters
  }
}
