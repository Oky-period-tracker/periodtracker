import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { AvatarMessages } from '../entity/AvatarMessages'
import { v4 as uuid } from 'uuid'
import { ProvinceFilterService } from '../helpers/ProvinceFilterService'
import { OkyUser } from '../entity/OkyUser'

export class AvatarMessageController {
  private avatarMessageRepository = getRepository(AvatarMessages)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.avatarMessageRepository.find({ where: { lang: request.user.lang } })
  }

  // @TODO: may need to physically order things here for the api
  async mobileAvatarMessagesByLanguage(request: Request, response: Response, next: NextFunction) {
    // Get user province from query parameter or from user ID lookup
    let userProvince: string | null = null
    
    if (request.query.userId) {
      const okyUserRepository = getRepository(OkyUser)
      const user = await okyUserRepository.findOne(request.query.userId as string)
      userProvince = user?.province || null
    }

    // Build query with province filter
    const queryBuilder = this.avatarMessageRepository
      .createQueryBuilder('avatar_messages')
      .where('avatar_messages.lang = :lang', { lang: request.params.lang })
      .andWhere('avatar_messages.live = :live', { live: true })

    // Apply province filter
    ProvinceFilterService.applyProvinceFilter(queryBuilder, userProvince, 'avatar_messages')

    return queryBuilder.getMany()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.avatarMessageRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const avatarMessageToSave = request.body
    avatarMessageToSave.id = uuid()
    avatarMessageToSave.lang = request.user.lang
    
    // Handle province restrictions
    avatarMessageToSave.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (avatarMessageToSave.provinceRestricted && request.body.allowedProvinces) {
      avatarMessageToSave.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      avatarMessageToSave.allowedProvinces = null
    }
    
    await this.avatarMessageRepository.save(avatarMessageToSave)
    return avatarMessageToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.params.id) {
        return response.status(400).json({
          error: true,
          message: 'Avatar Message ID is required'
        })
      }

    const avatarMessageToUpdate = await this.avatarMessageRepository.findOne(request.params.id)
      if (!avatarMessageToUpdate) {
        return response.status(404).json({
          error: true,
          message: 'Avatar Message not found'
        })
      }

      const booleanFromStringLive = request.body.live === 'true' || request.body.live === true

      avatarMessageToUpdate.content = request.body.content || avatarMessageToUpdate.content
    avatarMessageToUpdate.lang = request.user.lang
    avatarMessageToUpdate.live = booleanFromStringLive
    
    // Handle province restrictions
    avatarMessageToUpdate.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (avatarMessageToUpdate.provinceRestricted && request.body.allowedProvinces) {
      avatarMessageToUpdate.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      avatarMessageToUpdate.allowedProvinces = null
    }
    
    await this.avatarMessageRepository.save(avatarMessageToUpdate)
    return avatarMessageToUpdate
    } catch (error) {
      console.error('[AvatarMessageController] Update failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const avatarMessageToRemove = await this.avatarMessageRepository.findOne(request.params.id)
    await this.avatarMessageRepository.remove(avatarMessageToRemove)
    return avatarMessageToRemove
  }
}
