import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { About } from '../entity/About'

export class AboutController {
  private aboutRepository = getRepository(About)

  async mobileAboutByLanguage(request: Request, response: Response, next: NextFunction) {
    const allAboutVersions = await this.aboutRepository.find({
      where: { lang: request.params.lang },
    })
    const latest = allAboutVersions[allAboutVersions.length - 1]
    return latest.json_dump
  }

  async all(request: Request, response: Response, next: NextFunction) {
    return this.aboutRepository.find({
      where: { lang: request.user.lang },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.aboutRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const aboutToSave = request.body
    aboutToSave.lang = request.user.lang
    await this.aboutRepository.save(aboutToSave)
    return aboutToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const aboutToUpdate = await this.aboutRepository.findOne(request.params.id)
    aboutToUpdate.json_dump = request.body.json_dump

    aboutToUpdate.lang = request.user.lang
    await this.aboutRepository.save(aboutToUpdate)
    return aboutToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const aboutToRemove = await this.aboutRepository.findOne(request.params.id)
    console.log(aboutToRemove)
    await this.aboutRepository.remove(aboutToRemove)
    return aboutToRemove
  }
}
