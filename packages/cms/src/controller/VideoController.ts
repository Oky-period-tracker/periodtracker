import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { Video } from '../entity/Video'
import { bulkUpdateRowReorder } from '../helpers/common'
import { logger } from '../logger'

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
    try {
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
      logger.info('Video created', { id: itemToSave.id, title: itemToSave.title })
      return itemToSave
    } catch (error) {
      logger.error('VideoController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const videoWithSameTitle = await this.videoRepository.findOne({
        title: request.body.title,
      })
      if (videoWithSameTitle && request.params.id !== videoWithSameTitle.id) {
        return { video: videoWithSameTitle, isExist: true }
      }

      const videoToUpdate = await this.videoRepository.findOne(request.params.id)
      if (!videoToUpdate) {
        logger.warn('Video not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Video not found' })
        return
      }
      const booleanFromString = request.body.live === 'true'
      videoToUpdate.title = request.body.title
      videoToUpdate.youtubeId = request.body.youtubeId
      videoToUpdate.assetName = request.body.assetName
      videoToUpdate.live = booleanFromString
      videoToUpdate.lang = request.user.lang

      await this.videoRepository.save(videoToUpdate)
      logger.info('Video updated', { id: request.params.id })
      return videoToUpdate
    } catch (error) {
      logger.error('VideoController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const itemToRemove = await this.videoRepository.findOne(request.params.id)
      if (!itemToRemove) {
        logger.warn('Video not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Video not found' })
        return
      }
      await this.videoRepository.remove(itemToRemove)
      logger.info('Video removed', { id: request.params.id })
      return itemToRemove
    } catch (error) {
      logger.error('VideoController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async reorderRows(request: Request, response: Response, next: NextFunction) {
    try {
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
    } catch (error) {
      logger.error('VideoController.reorderRows failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
