import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { DidYouKnow } from '../entity/DidYouKnow'
import { Survey } from '../entity/Survey'
import { Article } from '../entity/Article'
import { Quiz } from '../entity/Quiz'

export class AgeRestrictionController {
  private didYouKnowRepository = getRepository(DidYouKnow)
  private articleRepository = getRepository(Article)
  private quizRepository = getRepository(Quiz)
  private surveyRepository = getRepository(Survey)

  async update(request: Request, response: Response, next: NextFunction) {
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

    level === '0' ? (item.isAgeRestricted = false) : (item.isAgeRestricted = true)

    const updated = {
      ...item,
      ageRestrictionLevel: level,
    }
    await repo.save(updated)
    return updated
  }
}
