import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Article } from '../entity/Article'
import { storage } from 'firebase-admin'
import { logger } from '../logger'
import { withTimeout, DEFAULT_EXTERNAL_TIMEOUT } from '../helpers/timeout'
import { withRetry } from '../helpers/retry'
import { v4 as uuid } from 'uuid'

export class ArticleVoiceOverController {
  constructor() {
    this.upload = this.upload.bind(this)
  }

  private articleRepository = getRepository(Article)

  async get(request: Request, response: Response, next: NextFunction) {
    const id = request.query.id as string
    if (typeof id !== 'string') throw new Error('ID is not a string.')

    const article = await this.articleRepository.findOne({ id, lang: request.user.lang })
    if (typeof article === 'undefined') throw new Error('Target not found.')

    return article
  }

  async upload(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.body.id
      // @ts-ignore
      const file = request.file

      if (typeof id !== 'string') throw new Error('ID is not a string.')
      if (typeof file === 'undefined') throw new Error('No file uploaded.')

      const target = await this.articleRepository.findOne({ id, lang: request.user.lang })
      if (typeof target === 'undefined') throw new Error('Target not found.')

      const previousKey = target.voiceOverKey
      // A timed-out upload can still finish. Never overwrite the current audio.
      const Key = `${target.id.trim()}-${uuid()}-${file.originalname.replace(
        /[^a-z0-9.\-_]/gim,
        '',
      )}`.toLowerCase()

      const fileToUpload = storage().bucket().file(Key)

      const savePromise = new Promise<void>((resolve, reject) => {
        fileToUpload.save(file.buffer, { metadata: { contentType: file.mimetype } }, (err) =>
          err ? reject(err) : resolve(),
        )
      })

      try {
        await withTimeout(savePromise, DEFAULT_EXTERNAL_TIMEOUT, 'Voice-over upload')
      } catch (error) {
        // If the upload completes after the timeout, remove only its unused object.
        savePromise
          .then(() => fileToUpload.delete())
          .catch((cleanupError) => {
            logger.warn('Failed to clean up unused voice-over upload', {
              key: Key,
              message: cleanupError?.message,
            })
          })
        throw error
      }

      target.voiceOverKey = Key
      await this.articleRepository.save(target)
      if (previousKey) {
        try {
          await withTimeout(
            storage().bucket().file(previousKey).delete(),
            DEFAULT_EXTERNAL_TIMEOUT,
            'Old voice-over cleanup',
          )
        } catch (error) {
          logger.warn('Failed to delete old voice-over file', {
            key: previousKey,
            message: error?.message,
          })
        }
      }
      logger.info('Voice-over uploaded successfully', { articleId: id, key: Key })
      if (!response.headersSent) response.status(200).send(target)
    } catch (error) {
      logger.error('ArticleVoiceOverController.upload failed', {
        message: error?.message,
        stack: error?.stack,
      })
      if (response.headersSent) {
        next(error)
      } else {
        response.status(500).send({ error: 'Voice-over upload failed' })
      }
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.body.id
      if (typeof id !== 'string') throw new Error('ID is not a string.')

      const target = await this.articleRepository.findOne({ id, lang: request.user.lang })
      if (typeof target === 'undefined') throw new Error('Target not found.')

      const previousKey = target.voiceOverKey
      const newTarget = {
        ...target,
        voiceOverKey: null,
      }

      // Clear the reference before touching storage. If the save fails, the article still points to audio that exists.
      await this.articleRepository.save(newTarget)
      logger.info('Voice-over removed from article', { articleId: id })

      if (typeof previousKey === 'string' && previousKey.length > 0) {
        this.deleteUnusedFile(previousKey)
      }

      return newTarget
    } catch (error) {
      logger.error('ArticleVoiceOverController.remove failed', {
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  // Runs in the background: no article uses this object any more, so a failure only leaves an orphan to delete by hand.
  private deleteUnusedFile(key: string) {
    withRetry(
      () =>
        withTimeout(
          // A timed-out attempt can still finish, so a retry may find the object already gone.
          storage().bucket().file(key).delete({ ignoreNotFound: true }),
          DEFAULT_EXTERNAL_TIMEOUT,
          'Voice-over cleanup',
        ),
      { maxRetries: 2, label: 'Voice-over cleanup' },
    )
      .then(() => logger.info('Deleted voice-over file', { key }))
      .catch((error) => {
        logger.error('Failed to delete unused voice-over file', { key, message: error?.message })
      })
  }
}
