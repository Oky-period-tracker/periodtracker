import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { Video } from '../entity/Video'
import { bulkUpdateRowReorder } from '../helpers/common'

export class VideoController {
  private videoRepository = getRepository(Video)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.videoRepository.find({ where: { lang: request.user.lang } })
  }
  async allLive(request: Request, response: Response, next: NextFunction) {
    return this.videoRepository.find({
      where: { lang: request.params.lang, live: true },
      order: { sortingKey: 'ASC' },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.videoRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const videoWithSameTitle = await this.videoRepository.findOne({
      title: request.body.title,
    })
    if (videoWithSameTitle) {
      return { video: videoWithSameTitle, isExist: true }
    }
    const itemToSave = request.body
    itemToSave.lang = request.user.lang
    itemToSave.id = uuid()
    await this.videoRepository.save(itemToSave)
    return itemToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const videoWithSameTitle = await this.videoRepository.findOne({
      title: request.body.title,
    })
    if (videoWithSameTitle && request.params.id !== videoWithSameTitle.id) {
      return { video: videoWithSameTitle, isExist: true }
    }

    const videoToUpdate = await this.videoRepository.findOne(request.params.id)
    const booleanFromString = request.body.live === 'true'
    videoToUpdate.title = request.body.title
    videoToUpdate.youtubeId = request.body.youtubeId
    videoToUpdate.assetName = request.body.assetName
    videoToUpdate.live = booleanFromString
    videoToUpdate.lang = request.user.lang

    await this.videoRepository.save(videoToUpdate)
    return videoToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const itemToRemove = await this.videoRepository.findOne(request.params.id)
    await this.videoRepository.remove(itemToRemove)
    return itemToRemove
  }

  async reorderRows(request: Request, response: Response, next: NextFunction) {
    if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
      return await bulkUpdateRowReorder(this.videoRepository, request.body.rowReorderResult)
    }

    return await this.videoRepository.find({
      where: {
        lang: request.params.lang,
      },
      order: {
        sortingKey: 'ASC',
      },
    })
  }
}
