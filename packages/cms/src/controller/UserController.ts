import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import bcrypt from 'bcrypt'
import { accessControlList } from '../access/access-control'
import { typeToAction } from '../access/role-definitions'
import moment from 'moment'
const saltRounds = 10

export class UserController {
  private userRepository = getRepository(User)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find({
      select: ['id', 'username', 'type', 'lang'],
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const creationAction = typeToAction(request.body.type)
    const user = await this.userRepository.findOne({
      where: { username: request.body.username },
    })
    if (user) {
      response.status(409).send({ error: 'username is not unique' })
      return
    }
    if (!accessControlList.can(request.user.type, creationAction)) {
      response.status(400).send({ error: 'No permission rights to do that' })
      return
    }
    await bcrypt.hash(request.body.password, saltRounds).then(async hash => {
      await this.userRepository.save({
        username: request.body.username,
        password: hash,
        lang: request.body.lang,
        date_created: moment.utc().toISOString(),
        type: request.body.type,
      })
    })
    return request.body
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const userToUpdate = await this.userRepository.findOne(request.params.id)
    await bcrypt.hash(request.body.password, saltRounds).then(async hash => {
      userToUpdate.username = request.body.username
      userToUpdate.password = hash
      userToUpdate.lang = request.body.lang
      userToUpdate.type = request.body.type
    })
    await this.userRepository.save(userToUpdate)
    return userToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const userToRemove = await this.userRepository.findOne(request.params.id)
    await this.userRepository.remove(userToRemove)
    return userToRemove
  }

  async changeLocation(request: Request, response: Response, next: NextFunction) {
    if (request.user.type !== 'superAdmin') {
      response.status(400).send({ error: 'No permission rights to do that' })
      return
    }
    const userToUpdate = await this.userRepository.findOne(request.user.id)
    userToUpdate.lang = request.body.lang
    await this.userRepository.save(userToUpdate)
    return '' // userToUpdate
  }
}
