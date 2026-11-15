import { getRepository } from 'typeorm'
import { QuizController } from '../../src/controller/QuizController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Quiz', () => ({ Quiz: class {} }))
jest.mock('../../src/env', () => ({ env: { db: { schema: 'public' }, features: {} } }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('quiz list switches', () => {
  let stored: any
  let save: jest.Mock
  let update: jest.Mock
  let response: any
  let controller: QuizController
  const request = (body: any, id = 'quiz', lang = 'en'): any => ({
    body,
    params: { id },
    user: { lang },
  })

  beforeEach(() => {
    stored = {
      id: 'quiz',
      topic: 'Topic',
      question: 'Question',
      option1: 'A',
      option2: 'B',
      option3: 'C',
      right_answer: 'A',
      wrong_answer_response: 'Wrong',
      right_answer_response: 'Right',
      isAgeRestricted: false,
      live: false,
      lang: 'en',
    }
    save = jest.fn(async (quiz) => quiz)
    update = jest.fn(async () => ({ affected: 3 }))
    ;(getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn(async ({ id, lang }) =>
        id === stored.id && lang === stored.lang ? { ...stored } : undefined,
      ),
      save,
      update,
    })
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    controller = new QuizController()
  })

  describe.each([
    ['updateLive', 'live'],
    ['updateAgeRestricted', 'isAgeRestricted'],
  ])('%s', (action, field) => {
    const run = (body: any, id?: string, lang?: string) =>
      controller[action](request(body, id, lang), response, jest.fn())

    it.each([
      ['true', true],
      [true, true],
      ['false', false],
      [false, false],
    ])(`saves ${field}=%p as %p and returns the stored value`, async (value, expected) => {
      stored[field] = !expected
      const result = await run({ [field]: value })

      expect(save).toHaveBeenCalledWith({ ...stored, [field]: expected })
      expect(result).toEqual({ id: 'quiz', [field]: expected })
    })

    it('leaves the rest of the quiz untouched', async () => {
      await run({ [field]: 'true', topic: 'Changed', live: 'true', isAgeRestricted: 'true' })

      const { [field]: _saved, ...rest } = save.mock.calls[0][0]
      const { [field]: _stored, ...storedRest } = stored
      expect(rest).toEqual(storedRest)
    })

    it.each([undefined, '', 'on', '1'])(`rejects ${field}=%p without saving`, async (value) => {
      await run({ [field]: value })

      expect(response.status).toHaveBeenCalledWith(400)
      expect(save).not.toHaveBeenCalled()
    })

    it('answers 404 for an unknown quiz', async () => {
      await run({ [field]: 'true' }, 'missing')

      expect(response.status).toHaveBeenCalledWith(404)
      expect(save).not.toHaveBeenCalled()
    })

    it("answers 404 for a quiz in another editor's language", async () => {
      await run({ [field]: 'true' }, 'quiz', 'fr')

      expect(response.status).toHaveBeenCalledWith(404)
      expect(save).not.toHaveBeenCalled()
    })
  })

  describe('updateLiveAll', () => {
    it.each([
      ['true', true],
      [true, true],
      ['false', false],
      [false, false],
    ])('sets live=%p on every quiz of the language in one update', async (live, expected) => {
      const result = await controller.updateLiveAll(request({ live }), response, jest.fn())

      expect(update).toHaveBeenCalledTimes(1)
      expect(update).toHaveBeenCalledWith({ lang: 'en' }, { live: expected })
      expect(result).toEqual({ live: expected, updated: 3 })
    })

    it("only touches the editor's language", async () => {
      await controller.updateLiveAll(
        request({ live: 'true' }, undefined, 'fr'),
        response,
        jest.fn(),
      )

      expect(update).toHaveBeenCalledWith({ lang: 'fr' }, { live: true })
    })

    it.each([undefined, '', 'on', '1'])('rejects live=%p without updating', async (live) => {
      await controller.updateLiveAll(request({ live }), response, jest.fn())

      expect(response.status).toHaveBeenCalledWith(400)
      expect(update).not.toHaveBeenCalled()
    })
  })
})
