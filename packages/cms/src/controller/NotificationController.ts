import { getRepository } from 'typeorm'
import { Request, Response, NextFunction } from 'express'
import { Notification } from '../entity/Notification'
import { PermanentNotification } from '../entity/PermanentNotification'
import * as admin from 'firebase-admin'
import { env } from '../env'

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
    // LIKE checks if versions string contains the request param version
    const entry = await this.permanentNotificationRepository.query(
      `SELECT * from ${env.db.schema}.permanent_notification WHERE versions LIKE '%%' || $1 || '%%' AND live = TRUE AND lang = $2`,
      [request.params.ver, request.params.lang],
    )

    if (entry && entry.length > 0) {
      return { message: entry[0].message, isPermanent: entry[0].isPermanent }
    }
    return { message: '', isPermanent: false }
  }

  async savePermanentAlert(request: Request, response: Response, next: NextFunction) {
    const permanentNotificationToAdd = request.body
    const booleanFromStringLive = request.body.live === 'true'
    const booleanFromStringIsPermanent = request.body.isPermanent === 'true'
    permanentNotificationToAdd.live = booleanFromStringLive
    permanentNotificationToAdd.isPermanent = booleanFromStringIsPermanent
    permanentNotificationToAdd.lang = request.user.lang
    await this.permanentNotificationRepository.save(permanentNotificationToAdd)
    return permanentNotificationToAdd
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const notificationToAdd = request.body

    // Send to app here
    await this.firebaseSend({
      title: request.body.title,
      body: request.body.content,
      lang: request.user.lang,
    })
    notificationToAdd.date_sent = new Date().getTime()
    notificationToAdd.status = 'sent'
    notificationToAdd.lang = request.user.lang
    await this.notificationRepository.save(notificationToAdd)
    return notificationToAdd
  }

  async updatePermanentAlert(request: Request, response: Response, next: NextFunction) {
    const permanentNotificationToUpdate = await this.permanentNotificationRepository.findOne(
      request.params.id,
    )
    const booleanFromStringLive = request.body.live === 'true'
    const booleanFromStringIsPermanent = request.body.isPermanent === 'true'

    permanentNotificationToUpdate.message = request.body.message
    permanentNotificationToUpdate.isPermanent = booleanFromStringIsPermanent
    permanentNotificationToUpdate.versions = request.body.versions
    permanentNotificationToUpdate.live = booleanFromStringLive
    permanentNotificationToUpdate.lang = request.user.lang
    await this.permanentNotificationRepository.save(permanentNotificationToUpdate)
    return permanentNotificationToUpdate
  }
  async remove(request: Request, response: Response, next: NextFunction) {
    const notificationToRemove = await this.notificationRepository.findOne(request.params.id)
    await this.notificationRepository.remove(notificationToRemove)
    return notificationToRemove
  }

  async removePermanentAlert(request: Request, response: Response, next: NextFunction) {
    const itemToRemove = await this.permanentNotificationRepository.findOne(request.params.id)
    await this.permanentNotificationRepository.remove(itemToRemove)
    return itemToRemove
  }

  private async firebaseSend({ title, body, lang }) {
    const message = {
      notification: {
        title,
        body,
      },
      topic: `oky_${lang}_notifications`,
    }
    // Send a message to the device corresponding to the provided
    // registration token.
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response)
      })
      .catch((error) => {
        console.log('Error sending message:', error)
      })
  }
}
