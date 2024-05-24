import { NextFunction, Request, Response } from 'express'
import { ArticleController } from './ArticleController'
import { QuizController } from './QuizController'
import { DidYouKnowController } from './DidYouKnowController'

import { HelpCenterController } from './HelpCenterController'
import { AvatarMessageController } from './AvatarMessageController'
import { AboutController } from './AboutController'
import { AboutBannerController } from './AboutBannerController'
import { TermsAndConditionsController } from './TermsAndConditionsController'
import { PrivacyPolicyController } from './PrivacyPolicyController'
import { VideoController } from './VideoController'
import {
  fromAvatarMessages,
  fromDidYouKnows,
  fromEncyclopedia,
  fromHelpCenters,
  fromQuizzes,
} from '@oky/core'

export class ContentController {
  private articleController = new ArticleController()
  private videoController = new VideoController()
  private aboutController = new AboutController()
  private aboutBannerController = new AboutBannerController()
  private avatarMessageController = new AvatarMessageController()
  private didYouKnowController = new DidYouKnowController()
  private helpCenterController = new HelpCenterController()
  private privacyPolicyController = new PrivacyPolicyController()
  private quizController = new QuizController()
  private termsAndConditionsController = new TermsAndConditionsController()

  async fetchAllContent(request: Request, response: Response, next: NextFunction) {
    const locale = request.params.lang

    const [
      encyclopediaResponse,
      videosResponse,
      about,
      aboutBannerResponse,
      avatarMessagesResponse,
      didYouKnowsResponse,
      helpCenterResponse,
      privacyPolicy,
      quizzesResponse,
      termsAndConditions,
    ] = await Promise.all([
      this.articleController.mobileArticlesByLanguage(request, response, next),
      this.videoController.allLive(request, response, next),
      this.aboutController.mobileAboutByLanguage(request, response, next) as Promise<string>,
      this.aboutBannerController.mobileAboutBannerByLanguageConditional(request, response, next),
      this.avatarMessageController.mobileAvatarMessagesByLanguage(request, response, next),
      this.didYouKnowController.mobileDidYouKnowByLanguage(request, response, next),
      this.helpCenterController.mobileHelpCenterByLanguage(request, response, next),
      this.privacyPolicyController.mobilePrivacyPolicyByLanguage(
        request,
        response,
        next,
      ) as Promise<string>,
      this.quizController.mobileQuizzesByLanguage(request, response, next),
      this.termsAndConditionsController.mobileTermsAndConditionsByLanguage(
        request,
        response,
        next,
      ) as Promise<string>,
    ])

    const { articles, categories, subCategories, videos } = fromEncyclopedia({
      encyclopediaResponse,
      videosResponse,
    })
    const { helpCenters } = fromHelpCenters(helpCenterResponse)
    const { quizzes } = fromQuizzes(quizzesResponse)
    const { didYouKnows } = fromDidYouKnows(didYouKnowsResponse)
    const { avatarMessages } = fromAvatarMessages(avatarMessagesResponse)

    const { aboutBanner, aboutBannerTimestamp } = aboutBannerResponse

    const content = {
      locale,
      categories,
      subCategories,
      articles,
      videos,
      quizzes,
      didYouKnows,
      helpCenters,
      avatarMessages,
      privacyPolicy: JSON.parse(privacyPolicy),
      termsAndConditions: JSON.parse(termsAndConditions),
      about: JSON.parse(about),
      aboutBanner,
      aboutBannerTimestamp,
    }

    return content
  }
}
