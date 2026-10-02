import express from 'express'
import request from 'supertest'
import ejs from 'ejs'
import path from 'path'
import { env } from '../../src/env'
import { requireFeature } from '../../src/middleware/featureFlag'
import { withoutDisabledFeatures } from '../../src/helpers/features'

const views = path.join(__dirname, '../../src/views')
const setFeatures = (voiceOver: boolean, contentFilter: boolean) => {
  env.features.voiceOver = voiceOver
  env.features.contentFilter = contentFilter
}

describe('feature flags', () => {
  const initialFeatures = { ...env.features }
  afterEach(() => setFeatures(initialFeatures.voiceOver, initialFeatures.contentFilter))

  describe('environment', () => {
    const loadFeatures = (values: Record<string, string | undefined>) => {
      const previous = { ...process.env }
      for (const [key, value] of Object.entries(values)) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
      let features: typeof env.features
      jest.isolateModules(() => {
        features = require('../../src/env').env.features
      })
      process.env = previous
      return features
    }

    it('keeps both features disabled unless they are explicitly enabled', () => {
      expect(
        loadFeatures({ FEATURE_VOICE_OVER: undefined, FEATURE_CONTENT_FILTER: undefined }),
      ).toEqual({ voiceOver: false, contentFilter: false })
      expect(loadFeatures({ FEATURE_VOICE_OVER: '1', FEATURE_CONTENT_FILTER: 'yes' })).toEqual({
        voiceOver: false,
        contentFilter: false,
      })
    })

    it('enables each feature independently', () => {
      expect(
        loadFeatures({ FEATURE_VOICE_OVER: 'true', FEATURE_CONTENT_FILTER: 'false' }),
      ).toEqual({ voiceOver: true, contentFilter: false })
      expect(
        loadFeatures({ FEATURE_VOICE_OVER: 'false', FEATURE_CONTENT_FILTER: 'true' }),
      ).toEqual({ voiceOver: false, contentFilter: true })
    })
  })

  describe('endpoints', () => {
    const app = express()
    app.use('/api/voice-over', requireFeature('voiceOver'))
    app.use('/api/content-filter', requireFeature('contentFilter'))
    app.post('/api/voice-over/article/upload', (_req, res) => res.json({ reached: true }))
    app.post('/api/content-filter', (_req, res) => res.json({ reached: true }))

    it('answers 404 while the feature is disabled', async () => {
      setFeatures(false, false)
      await request(app).post('/api/voice-over/article/upload').expect(404)
      await request(app).post('/api/content-filter').expect(404)
    })

    it('reaches the endpoint once the feature is enabled', async () => {
      setFeatures(true, false)
      await request(app).post('/api/voice-over/article/upload').expect(200, { reached: true })
      await request(app).post('/api/content-filter').expect(404)

      setFeatures(false, true)
      await request(app).post('/api/voice-over/article/upload').expect(404)
      await request(app).post('/api/content-filter').expect(200, { reached: true })
    })
  })

  describe('mobile content', () => {
    const articles = [
      { id: 'a', voiceOverKey: 'a.mp3', contentFilter: 2, ageRestrictionLevel: 1 },
      { id: 'b', voiceOverKey: null, contentFilter: 0, ageRestrictionLevel: 0 },
    ]

    it('strips voice overs and content filters while they are disabled', () => {
      setFeatures(false, false)
      expect(withoutDisabledFeatures(articles)).toEqual([
        { id: 'a', voiceOverKey: null, contentFilter: 0, ageRestrictionLevel: 1 },
        { id: 'b', voiceOverKey: null, contentFilter: 0, ageRestrictionLevel: 0 },
      ])
      // Content without these fields is left as it is
      expect(withoutDisabledFeatures([{ id: 'c' }])).toEqual([{ id: 'c' }])
    })

    it('only strips the feature that is disabled', () => {
      setFeatures(true, false)
      expect(withoutDisabledFeatures(articles)[0]).toMatchObject({
        voiceOverKey: 'a.mp3',
        contentFilter: 0,
      })
      setFeatures(false, true)
      expect(withoutDisabledFeatures(articles)[0]).toMatchObject({
        voiceOverKey: null,
        contentFilter: 2,
      })
    })

    it('sends the stored values once both features are enabled', () => {
      setFeatures(true, true)
      expect(withoutDisabledFeatures(articles)).toEqual(articles)
    })
  })

  describe('views', () => {
    const render = (view: string, features: typeof env.features) =>
      ejs.renderFile(path.join(views, view), {
        features,
        __: (text: string) => text,
        categories: [],
        subcategories: [],
        contentFilterOptions: [{ value: 0, description: 'All' }],
        ageRestrictionOptions: [{ value: 0, description: 'All' }],
      })

    it('leaves the content filter out of the page while it is disabled', async () => {
      const features = { voiceOver: false, contentFilter: false }
      expect(await render('partials/Footer.ejs', features)).not.toContain('contentFilter')
      expect(await render('modals/ArticleModal.ejs', features)).not.toContain(
        'contentFilterDropdownForm',
      )
    })

    it('renders the content filter once it is enabled', async () => {
      const features = { voiceOver: false, contentFilter: true }
      expect(await render('partials/Footer.ejs', features)).toContain('/scripts/contentFilter.js')
      expect(await render('modals/ArticleModal.ejs', features)).toContain(
        'contentFilterDropdownForm',
      )
    })
  })
})
