import { getRepository } from 'typeorm'
import { Request, Response, NextFunction } from 'express'
import { Notification } from '../entity/Notification'
import { PermanentNotification } from '../entity/PermanentNotification'
import * as admin from 'firebase-admin'
import { env } from '../env'
import { logger } from '../logger'
import { withTimeout, DEFAULT_EXTERNAL_TIMEOUT } from '../helpers/timeout'
import { withRetry } from '../helpers/retry'
import {
  NOTIFICATION_STATUS,
  describeDeliveryError,
  isDeliveryOutcomeUnknown,
  isRetriableFirebaseError,
} from '../helpers/notificationDelivery'

export class NotificationController {
  private notificationRepository = getRepository(Notification)
  private permanentNotificationRepository = getRepository(PermanentNotification)

  async mobileNotificationsByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.notificationRepository.findOne({
      where: {
        lang: request.params.lang,
        status: NOTIFICATION_STATUS.SENT,
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
      logger.error('NotificationController.mobilePermanentNotifications failed', {
        message: error?.message,
        stack: error?.stack,
      })
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
      logger.error('NotificationController.savePermanentAlert failed', {
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  /**
   * Broadcasts a notification and records what actually happened.
   *
   * The record is written *before* contacting Firebase so that a crash during
   * the send can never leave a delivered alert with no trace in the CMS — an
   * admin seeing nothing would simply send it again, notifying everyone twice.
   * The row starts as `unknown` and is only promoted to `sent` once Firebase
   * has confirmed it.
   */
  async save(request: Request, response: Response, next: NextFunction) {
    const lang = request.user.lang
    const title = typeof request.body.title === 'string' ? request.body.title.trim() : ''
    const content = typeof request.body.content === 'string' ? request.body.content.trim() : ''

    if (!title || !content) {
      if (!response.headersSent) {
        response.status(400).send({
          status: NOTIFICATION_STATUS.FAILED,
          error: 'A title and a message are required to send a notification.',
        })
      }
      return
    }

    let notification: Notification
    try {
      notification = await this.notificationRepository.save(
        this.notificationRepository.create({
          title,
          content,
          lang,
          date_sent: String(Date.now()),
          status: NOTIFICATION_STATUS.UNKNOWN,
        }),
      )
    } catch (error) {
      logger.error('NotificationController.save could not record the attempt', {
        title,
        lang,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }

    try {
      const messageId = await this.firebaseSend({ title, body: content, lang })

      notification.status = NOTIFICATION_STATUS.SENT
      await this.notificationRepository.save(notification)

      logger.info('Notification sent and saved', {
        id: notification.id,
        title,
        lang,
        messageId,
      })
      return { ...notification, messageId }
    } catch (error) {
      const outcomeUnknown = isDeliveryOutcomeUnknown(error)
      notification.status = outcomeUnknown
        ? NOTIFICATION_STATUS.UNKNOWN
        : NOTIFICATION_STATUS.FAILED

      // Best effort: a failed status write must not hide the delivery error.
      try {
        await this.notificationRepository.save(notification)
      } catch (writeError) {
        logger.error('NotificationController.save could not persist the failed status', {
          id: notification.id,
          message: writeError?.message,
          stack: writeError?.stack,
        })
      }

      logger.error('NotificationController.save failed to deliver the notification', {
        id: notification.id,
        title,
        lang,
        topic: this.topicFor(lang),
        status: notification.status,
        message: error?.message,
        stack: error?.stack,
      })

      // The requestTimeout middleware may already have answered with a 503.
      if (!response.headersSent) {
        response.status(502).send({
          status: notification.status,
          error: describeDeliveryError(error),
        })
      }
      return
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
      logger.error('NotificationController.updatePermanentAlert failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
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
      logger.error('NotificationController.remove failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
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
      logger.error('NotificationController.removePermanentAlert failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  private topicFor(lang: string) {
    return `oky_${lang}_notifications`
  }

  /**
   * Sends the message to the language topic and returns the Firebase message id.
   * Throws when Firebase rejects the message or never answers.
   */
  private async firebaseSend({ title, body, lang }): Promise<string> {
    const topic = this.topicFor(lang)
    const message = {
      notification: {
        title,
        body,
      },
      topic,
    }

    const messageId = await withRetry(
      () =>
        withTimeout(
          admin.messaging().send(message),
          DEFAULT_EXTERNAL_TIMEOUT,
          'Firebase notification send',
        ),
      {
        maxRetries: 2,
        baseDelay: 1000,
        label: 'Firebase send',
        // A timed-out send is not cancelled on Firebase's side, so blindly
        // retrying it can push the same alert to every user two or three
        // times. Only repeat errors Firebase reports as a clean rejection.
        shouldRetry: isRetriableFirebaseError,
      },
    )

    logger.info('Firebase notification sent', { messageId, topic })
    return messageId
  }
}
