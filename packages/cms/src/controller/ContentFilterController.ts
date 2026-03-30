import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { DidYouKnow } from '../entity/DidYouKnow'
import { Survey } from '../entity/Survey'
import { Article } from '../entity/Article'
import { Quiz } from '../entity/Quiz'
import { logger } from '../logger'

export class ContentFilterController {
  private didYouKnowRepository = getRepository(DidYouKnow)
  private articleRepository = getRepository(Article)
  private quizRepository = getRepository(Quiz)
  private surveyRepository = getRepository(Survey)

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id, source, level } = request.body

      const repoMap = {
        'did-you-know': this.didYouKnowRepository,
        article: this.articleRepository,
        quiz: this.quizRepository,
        survey: this.surveyRepository,
      }

      if (!(source in repoMap)) {
        throw new Error(`Source "${source}" not found in repo map.`)
      }

      const repo = repoMap[source]

      const item = await repo.findOne(id)
      if (!item) {
        logger.warn('Item not found for content filter update', { id, source })
        response.status(404).send({ error: 'Item not found' })
        return
      }
      const updated = {
        ...item,
        contentFilter: level,
      }

      await repo.save(updated)
      logger.info('Content filter updated', { id, source, level })
      return updated
    } catch (error) {
      logger.error('ContentFilterController.update failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
