import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Article } from '../entity/Article'
import { storage } from 'firebase-admin'

export class ArticleVoiceOverController {
  constructor() {
    this.upload = this.upload.bind(this) // Explicitly bind this
  }

  private articleRepository = getRepository(Article)

  async get(request: Request, response: Response, next: NextFunction) {
    const id = request.query.id as string
    if (typeof id !== 'string') throw new Error('ID is not a string.')

    const article = await this.articleRepository.findOne(id)
    if (typeof article === 'undefined') throw new Error('Target not found.')

    return article
  }

  async upload(request: Request, response: Response, next: NextFunction) {
    const id = request.body.id
    // @TODO:PH
    // @ts-ignore
    const file = request.file

    if (typeof id !== 'string') throw new Error('ID is not a string.')
    if (typeof file === 'undefined') throw new Error('No file uploaded.')

    const target = await this.articleRepository.findOne(id)

    if (typeof target === 'undefined') throw new Error('Target not found.')

    // Delete existing file in Firebase Storage if exists
    if (target.voiceOverKey) {
      const existingFile = storage().bucket().file(target.voiceOverKey)
      try {
        await existingFile.delete()
      } catch (error) {
        console.error('Failed to delete existing file:', error)
      }
    }

    const Key = `${target.id.trim()}-${file.originalname.replace(
      /[^a-z0-9.-_]/gim,
      '',
    )}`.toLowerCase()

    const fileToUpload = storage().bucket().file(Key)

    fileToUpload.save(
      file.buffer,
      {
        metadata: {
          contentType: file.mimetype,
        },
      },
      (err) => {
        if (err) {
          response.status(500).send(err.toString())
        } else {
          // Update the article with the new voice over key
          target.voiceOverKey = Key
          this.articleRepository
            .save(target)
            .then(() => response.status(200).send(target))
            .catch((saveErr) => response.status(500).send(saveErr.toString()))
        }
      },
    )
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = request.body.id
    if (typeof id !== 'string') throw new Error('ID is not a string.')

    const target = await this.articleRepository.findOne(id)
    if (typeof target === 'undefined') throw new Error('Target not found.')

    if (typeof target.voiceOverKey === 'string' && target.voiceOverKey.length > 0) {
      const existingFile = storage().bucket().file(target.voiceOverKey)
      try {
        await existingFile.delete()
      } catch (error) {
        console.error('Failed to delete existing file:', error)
      }
    }

    const newTarget = {
      ...target,
      voiceOverKey: null,
    }

    await this.articleRepository.save(newTarget)

    return newTarget
  }
}
