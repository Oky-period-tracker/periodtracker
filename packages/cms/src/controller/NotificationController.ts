import { getRepository } from 'typeorm'
import { Request, Response, NextFunction } from 'express'
import { Notification } from '../entity/Notification'
import { PermanentNotification } from '../entity/PermanentNotification'
import * as admin from 'firebase-admin'
import { env } from '../env'
import { logger } from '../logger'
import { withTimeout, DEFAULT_EXTERNAL_TIMEOUT } from '../helpers/timeout'
import { withRetry } from '../helpers/retry'

export class NotificationController {
  private notificationRepository = getRepository(Notification)
  private permanentNotificationRepository = getRepository(PermanentNotification)

  async mobileNotificationsByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.notificationRepository.findOne({
      where: {
        lang: request.params.lang,
        status: 'sent',
      },
    })
  }

  async mobilePermanentNotifications(request: Request, response: Response, next: NextFunction) {
    try {
      const entry = await this.permanentNotificationRepository.query(
        `SELECT * from ${env.db.schema}.permanent_notification WHERE versions LIKE '%%' || $1 || '%%' AND live = TRUE AND lang = $2`,
        [request.params.ver, request.params.lang],
      )

      if (entry && entry.length > 0) {
        return { message: entry[0].message, isPermanent: entry[0].isPermanent }
      }
      return { message: '', isPermanent: false }
    } catch (error) {
      logger.error('NotificationController.mobilePermanentNotifications failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async savePermanentAlert(request: Request, response: Response, next: NextFunction) {
    try {
      const permanentNotificationToAdd = request.body
      const booleanFromStringLive = request.body.live === 'true'
      const booleanFromStringIsPermanent = request.body.isPermanent === 'true'
      permanentNotificationToAdd.live = booleanFromStringLive
      permanentNotificationToAdd.isPermanent = booleanFromStringIsPermanent
      permanentNotificationToAdd.lang = request.user.lang
      await this.permanentNotificationRepository.save(permanentNotificationToAdd)
      logger.info('Permanent alert saved', { lang: request.user.lang })
      return permanentNotificationToAdd
    } catch (error) {
      logger.error('NotificationController.savePermanentAlert failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const notificationToAdd = request.body

      await this.firebaseSend({
        title: request.body.title,
        body: request.body.content,
        lang: request.user.lang,
      })
      notificationToAdd.date_sent = new Date().getTime()
      notificationToAdd.status = 'sent'
      notificationToAdd.lang = request.user.lang
      await this.notificationRepository.save(notificationToAdd)
      logger.info('Notification sent and saved', { title: request.body.title, lang: request.user.lang })
      return notificationToAdd
    } catch (error) {
      logger.error('NotificationController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async updatePermanentAlert(request: Request, response: Response, next: NextFunction) {
    try {
      const permanentNotificationToUpdate = await this.permanentNotificationRepository.findOne(
        request.params.id,
      )
      if (!permanentNotificationToUpdate) {
        logger.warn('Permanent alert not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Permanent alert not found' })
        return
      }
      const booleanFromStringLive = request.body.live === 'true'
      const booleanFromStringIsPermanent = request.body.isPermanent === 'true'

      permanentNotificationToUpdate.message = request.body.message
      permanentNotificationToUpdate.isPermanent = booleanFromStringIsPermanent
      permanentNotificationToUpdate.versions = request.body.versions
      permanentNotificationToUpdate.live = booleanFromStringLive
      permanentNotificationToUpdate.lang = request.user.lang
      await this.permanentNotificationRepository.save(permanentNotificationToUpdate)
      logger.info('Permanent alert updated', { id: request.params.id })
      return permanentNotificationToUpdate
    } catch (error) {
      logger.error('NotificationController.updatePermanentAlert failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const notificationToRemove = await this.notificationRepository.findOne(request.params.id)
      if (!notificationToRemove) {
        logger.warn('Notification not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Notification not found' })
        return
      }
      await this.notificationRepository.remove(notificationToRemove)
      logger.info('Notification removed', { id: request.params.id })
      return notificationToRemove
    } catch (error) {
      logger.error('NotificationController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async removePermanentAlert(request: Request, response: Response, next: NextFunction) {
    try {
      const itemToRemove = await this.permanentNotificationRepository.findOne(request.params.id)
      if (!itemToRemove) {
        logger.warn('Permanent alert not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Permanent alert not found' })
        return
      }
      await this.permanentNotificationRepository.remove(itemToRemove)
      logger.info('Permanent alert removed', { id: request.params.id })
      return itemToRemove
    } catch (error) {
      logger.error('NotificationController.removePermanentAlert failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  private async firebaseSend({ title, body, lang }) {
    const message = {
      notification: {
        title,
        body,
      },
      topic: `oky_${lang}_notifications`,
    }
    try {
      const response = await withRetry(
        () => withTimeout(
          admin.messaging().send(message),
          DEFAULT_EXTERNAL_TIMEOUT,
          'Firebase notification send',
        ),
        { maxRetries: 2, baseDelay: 1000, label: 'Firebase send' },
      )
      logger.info('Firebase notification sent', { messageId: response, topic: `oky_${lang}_notifications` })
    } catch (error) {
      logger.error('Firebase notification failed', { topic: `oky_${lang}_notifications`, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
