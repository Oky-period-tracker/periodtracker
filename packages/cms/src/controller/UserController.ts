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
    try {
      // Validation: Check required fields
      if (!request.body.username || !request.body.password || !request.body.type) {
        return response.status(400).json({
          error: true,
          message: 'Missing required fields: username, password, or type'
        })
      }

      // Check if username already exists
    const user = await this.userRepository.findOne({
      where: { username: request.body.username },
    })
    if (user) {
        return response.status(409).json({ 
          error: true,
          message: 'username is not unique' 
        })
      }

      // Validate creation permissions
      const creationAction = typeToAction(request.body.type)
    if (!accessControlList.can(request.user.type, creationAction)) {
        return response.status(403).json({ 
          error: true,
          message: 'No permission rights to do that' 
        })
      }

      // Hash password and save user
    await bcrypt.hash(request.body.password, saltRounds).then(async hash => {
      await this.userRepository.save({
        username: request.body.username,
        password: hash,
          lang: request.body.lang || 'en',
        date_created: moment.utc().toISOString(),
        type: request.body.type,
      })
    })
      
    return request.body
    } catch (error) {
      console.error('[UserController] Save failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      // Validation: Check if user ID is provided
      if (!request.params.id) {
        return response.status(400).json({
          error: true,
          message: 'User ID is required'
        })
      }

      // Check if user exists
    const userToUpdate = await this.userRepository.findOne(request.params.id)
      if (!userToUpdate) {
        return response.status(404).json({
          error: true,
          message: 'User not found'
        })
      }

      // Check for required fields
      if (!request.body.username || !request.body.password || !request.body.type) {
        return response.status(400).json({
          error: true,
          message: 'Missing required fields: username, password, or type'
        })
      }

      // Hash password and update user
    await bcrypt.hash(request.body.password, saltRounds).then(async hash => {
      userToUpdate.username = request.body.username
      userToUpdate.password = hash
        userToUpdate.lang = request.body.lang || userToUpdate.lang || 'en'
      userToUpdate.type = request.body.type
    })
      
    await this.userRepository.save(userToUpdate)
    return userToUpdate
    } catch (error) {
      console.error('[UserController] Update failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.params.id) {
        return response.status(400).json({
          error: true,
          message: 'User ID is required'
        })
      }

    const userToRemove = await this.userRepository.findOne(request.params.id)
      if (!userToRemove) {
        return response.status(404).json({
          error: true,
          message: 'User not found'
        })
      }

    await this.userRepository.remove(userToRemove)
    return userToRemove
    } catch (error) {
      console.error('[UserController] Remove failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
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
