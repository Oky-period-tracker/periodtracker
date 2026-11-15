import { getRepository } from 'typeorm'
import { VideoController } from '../../src/controller/VideoController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Video', () => ({ Video: class Video {} }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('video save', () => {
  let save: jest.Mock
  let response: any
  let controller: VideoController
  const request = (body: any): any => ({
    body: { title: 'New video', youtubeId: 'abc', assetName: '', ...body },
    params: {},
    user: { lang: 'en' },
  })

  beforeEach(() => {
    save = jest.fn(async (video) => video)
    ;(getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn(async () => undefined),
      save,
    })
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    controller = new VideoController()
  })

  // jQuery sends the form's Live checkbox as the text "true" or "false"
  it.each([
    ['true', true],
    [true, true],
    ['false', false],
    [false, false],
    [undefined, false],
    ['on', false],
  ])('creates a video with live=%p as %p', async (live, expected) => {
    const result = await controller.save(request({ live }), response, jest.fn())

    expect(save).toHaveBeenCalledWith(expect.objectContaining({ live: expected, lang: 'en' }))
    expect(result).toMatchObject({ live: expected })
  })
})
