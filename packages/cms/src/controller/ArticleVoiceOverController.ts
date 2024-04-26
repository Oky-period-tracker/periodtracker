import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Article } from '../entity/Article'

import { env } from '../env'
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

//
export class ArticleVoiceOverController {
  private articleRepository = getRepository(Article)

  async get(request: Request, response: Response, next: NextFunction) {
    // Add access control settings
    if (!request.user) {
      throw new Error('Access denied')
    }

    const id = request.query.id as string
    if (typeof id !== 'string') throw new Error('ID is not a string.')

    const article = await this.articleRepository.findOne(id)
    if (typeof article === 'undefined') throw new Error('Target not found.')

    return article
  }

  getS3Client() {
    return new S3Client({
      region: env.aws.region,
      credentials: {
        accessKeyId: env.aws.acccessKey,
        secretAccessKey: env.aws.secretKey,
      },
    })
  }

  async removeFileFromS3(Key: string) {
    await this.getS3Client().send(
      new DeleteObjectCommand({
        Bucket: env.aws.s3Bucket,
        Key,
      }),
    )
  }

  async upload(request: Request, response: Response, next: NextFunction) {
    // Add access control settings
    if (!request.user) {
      throw new Error('Access denied')
    }

    console.log('*** upload A')

    const id = request.body.id
    // @TODO:PH
    // @ts-ignore
    const file = Array.isArray(request.files.file) ? request.files.file[0] : request.files.file

    if (typeof id !== 'string') throw new Error('ID is not a string.')
    if (typeof file === 'undefined') throw new Error('No file uploaded.')

    const target = await this.articleRepository.findOne(id)

    if (typeof target === 'undefined') throw new Error('Target not found.')

    if (typeof target.voiceOverKey === 'string' && target.voiceOverKey.length > 0) {
      await this.removeFileFromS3(target.voiceOverKey)
    }
    console.log('*** upload B')

    const Key = `${target.id.trim()}-${file.name.replace(/[^a-z0-9.-_]/gim, '')}`.toLowerCase()
    await this.getS3Client().send(
      new PutObjectCommand({
        Bucket: env.aws.s3Bucket,
        Key,
        Body: file.data,
      }),
    )

    const newTarget = {
      ...target,
      voiceOverKey: Key,
      voiceOverUrl: '/' + Key,
    }
    console.log('*** upload C')

    await this.articleRepository.save(newTarget)
    console.log('*** upload D')

    return newTarget
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    // Add access control settings
    if (!request.user) {
      throw new Error('Access denied')
    }

    const id = request.body.id
    if (typeof id !== 'string') throw new Error('ID is not a string.')

    const target = await this.articleRepository.findOne(id)
    if (typeof target === 'undefined') throw new Error('Target not found.')

    if (typeof target.voiceOverKey === 'string' && target.voiceOverKey.length > 0) {
      await this.removeFileFromS3(target.voiceOverKey)
    }

    const newTarget = {
      ...target,
      voiceOverKey: null,
      voiceOverUrl: null,
    }

    await this.articleRepository.save(newTarget)

    return newTarget
  }
}
