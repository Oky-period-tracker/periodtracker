import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { Video } from '../entity/Video'
import { bulkUpdateRowReorder } from '../helpers/common'
import { ProvinceFilterService } from '../helpers/ProvinceFilterService'
import { OkyUser } from '../entity/OkyUser'

export class VideoController {
  private videoRepository = getRepository(Video)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.videoRepository.find({ where: { lang: request.user.lang } })
  }
  async allLive(request: Request, response: Response, next: NextFunction) {
    // Get user province from query parameter or from user ID lookup
    let userProvince: string | null = null
    
    if (request.query.userId) {
      const okyUserRepository = getRepository(OkyUser)
      const user = await okyUserRepository.findOne(request.query.userId as string)
      userProvince = user?.province || null
    }

    // Build query with province filter
    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .where('video.lang = :lang', { lang: request.params.lang })
      .andWhere('video.live = :live', { live: true })
      .orderBy('video.sortingKey', 'ASC')

    // Apply province filter
    ProvinceFilterService.applyProvinceFilter(queryBuilder, userProvince, 'video')

    return queryBuilder.getMany()
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
    
    // Handle province restrictions
    itemToSave.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (itemToSave.provinceRestricted && request.body.allowedProvinces) {
      itemToSave.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      itemToSave.allowedProvinces = null
    }
    
    await this.videoRepository.save(itemToSave)
    return itemToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.params.id) {
        return response.status(400).json({
          error: true,
          message: 'Video ID is required'
        })
      }

      const videoToUpdate = await this.videoRepository.findOne(request.params.id)
      if (!videoToUpdate) {
        return response.status(404).json({
          error: true,
          message: 'Video not found'
        })
      }

      // Check for duplicate title
      if (request.body.title) {
    const videoWithSameTitle = await this.videoRepository.findOne({
      title: request.body.title,
    })
    if (videoWithSameTitle && request.params.id !== videoWithSameTitle.id) {
      return { video: videoWithSameTitle, isExist: true }
    }
      }

      const booleanFromString = request.body.live === 'true' || request.body.live === true
      videoToUpdate.title = request.body.title || videoToUpdate.title
      videoToUpdate.youtubeId = request.body.youtubeId || videoToUpdate.youtubeId
      videoToUpdate.assetName = request.body.assetName || videoToUpdate.assetName
    videoToUpdate.live = booleanFromString
    videoToUpdate.lang = request.user.lang

    // Handle province restrictions
    videoToUpdate.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (videoToUpdate.provinceRestricted && request.body.allowedProvinces) {
      videoToUpdate.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      videoToUpdate.allowedProvinces = null
    }

    await this.videoRepository.save(videoToUpdate)
    return videoToUpdate
    } catch (error) {
      console.error('[VideoController] Update failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
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
