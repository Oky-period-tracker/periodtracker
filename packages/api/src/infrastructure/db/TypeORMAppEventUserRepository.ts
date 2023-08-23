import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { AppEvent } from 'domain/oky/AppEvent'
import { AppEventRepository, AppEventRepositoryToken } from 'domain/oky/AppEventRepository'

@Service(AppEventRepositoryToken)
export class TypeORMOkyUserRepository implements AppEventRepository {
  @InjectRepository(AppEvent)
  private repository: Repository<AppEvent>

  public async appendEvents(appEvents: AppEvent[]) {
    if (appEvents.length === 0) {
      return
    }

    await this.repository
      .createQueryBuilder()
      .insert()
      .orIgnore()
      .into(AppEvent)
      .values(appEvents)
      .execute()
  }
}
