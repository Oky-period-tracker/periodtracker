import express from 'express'
import request from 'supertest'
import ejs from 'ejs'
import path from 'path'
import { env } from '../../src/env'
import { requireFeature } from '../../src/middleware/featureFlag'
import { withoutDisabledFeatures } from '../../src/helpers/features'

type Features = typeof env.features
const views = path.join(__dirname, '../../src/views')
const allOff: Features = { voiceOver: false, contentFilter: false, ageRestrictionLevels: false }
const setFeatures = (features: Partial<Features>) => {
  Object.assign(env.features, allOff, features)
}

describe('feature flags', () => {
  const initialFeatures = { ...env.features }
  afterEach(() => setFeatures(initialFeatures))

  describe('environment', () => {
    const loadFeatures = (values: Record<string, string | undefined>) => {
      const previous = { ...process.env }
      for (const [key, value] of Object.entries(values)) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
      let features: Features
      jest.isolateModules(() => {
        features = require('../../src/env').env.features
      })
      process.env = previous
      return features
    }

    it('keeps every feature disabled unless it is explicitly enabled', () => {
      expect(
        loadFeatures({
          FEATURE_VOICE_OVER: undefined,
          FEATURE_CONTENT_FILTER: undefined,
          FEATURE_AGE_RESTRICTION_LEVELS: undefined,
        }),
      ).toEqual(allOff)
      expect(
        loadFeatures({
          FEATURE_VOICE_OVER: '1',
          FEATURE_CONTENT_FILTER: 'yes',
          FEATURE_AGE_RESTRICTION_LEVELS: 'TRUE',
        }),
      ).toEqual(allOff)
    })

    it('enables each feature independently', () => {
      expect(
        loadFeatures({
          FEATURE_VOICE_OVER: 'true',
          FEATURE_CONTENT_FILTER: 'false',
          FEATURE_AGE_RESTRICTION_LEVELS: 'false',
        }),
      ).toEqual({ ...allOff, voiceOver: true })
      expect(
        loadFeatures({
          FEATURE_VOICE_OVER: 'false',
          FEATURE_CONTENT_FILTER: 'true',
          FEATURE_AGE_RESTRICTION_LEVELS: 'false',
        }),
      ).toEqual({ ...allOff, contentFilter: true })
      expect(
        loadFeatures({
          FEATURE_VOICE_OVER: 'false',
          FEATURE_CONTENT_FILTER: 'false',
          FEATURE_AGE_RESTRICTION_LEVELS: 'true',
        }),
      ).toEqual({ ...allOff, ageRestrictionLevels: true })
    })
  })

  describe('endpoints', () => {
    const app = express()
    app.use('/api/voice-over', requireFeature('voiceOver'))
    app.use('/api/content-filter', requireFeature('contentFilter'))
    app.use('/api/age-restriction', requireFeature('ageRestrictionLevels'))
    app.post('/api/voice-over/article/upload', (_req, res) => res.json({ reached: true }))
    app.post('/api/content-filter', (_req, res) => res.json({ reached: true }))
    app.post('/api/age-restriction', (_req, res) => res.json({ reached: true }))

    it('answers 404 while the feature is disabled', async () => {
      setFeatures({})
      await request(app).post('/api/voice-over/article/upload').expect(404)
      await request(app).post('/api/content-filter').expect(404)
      await request(app).post('/api/age-restriction').expect(404)
    })

    it('reaches the endpoint once the feature is enabled', async () => {
      setFeatures({ voiceOver: true })
      await request(app).post('/api/voice-over/article/upload').expect(200, { reached: true })
      await request(app).post('/api/content-filter').expect(404)
      await request(app).post('/api/age-restriction').expect(404)

      setFeatures({ contentFilter: true })
      await request(app).post('/api/voice-over/article/upload').expect(404)
      await request(app).post('/api/content-filter').expect(200, { reached: true })
      await request(app).post('/api/age-restriction').expect(404)

      setFeatures({ ageRestrictionLevels: true })
      await request(app).post('/api/voice-over/article/upload').expect(404)
      await request(app).post('/api/content-filter').expect(404)
      await request(app).post('/api/age-restriction').expect(200, { reached: true })
    })
  })

  describe('mobile content', () => {
    const articles = [
      {
        id: 'a',
        voiceOverKey: 'a.mp3',
        contentFilter: 2,
        isAgeRestricted: true,
        ageRestrictionLevel: 15,
      },
      {
        id: 'b',
        voiceOverKey: null,
        contentFilter: 0,
        isAgeRestricted: false,
        ageRestrictionLevel: 0,
      },
    ]
    const quizzes = [
      { id: 'q', contentFilter: 1, isAgeRestricted: true, ageRestrictionLevel: 15 },
      { id: 'r', contentFilter: 0, isAgeRestricted: false, ageRestrictionLevel: 0 },
    ]

    it('strips the data of every disabled feature', () => {
      setFeatures({})
      expect(withoutDisabledFeatures(articles, { articles: true })).toEqual([
        {
          id: 'a',
          voiceOverKey: null,
          contentFilter: 0,
          isAgeRestricted: false,
          ageRestrictionLevel: 0,
        },
        {
          id: 'b',
          voiceOverKey: null,
          contentFilter: 0,
          isAgeRestricted: false,
          ageRestrictionLevel: 0,
        },
      ])
      // Content without these fields is left as it is
      expect(withoutDisabledFeatures([{ id: 'c' }])).toEqual([{ id: 'c' }])
    })

    it('keeps the age restricted toggle of quizzes, surveys and did you knows without levels', () => {
      setFeatures({})
      expect(withoutDisabledFeatures(quizzes)).toEqual([
        { id: 'q', contentFilter: 0, isAgeRestricted: true, ageRestrictionLevel: 0 },
        { id: 'r', contentFilter: 0, isAgeRestricted: false, ageRestrictionLevel: 0 },
      ])
    })

    it('only strips the feature that is disabled', () => {
      setFeatures({ voiceOver: true })
      expect(withoutDisabledFeatures(articles, { articles: true })[0]).toMatchObject({
        voiceOverKey: 'a.mp3',
        contentFilter: 0,
        isAgeRestricted: false,
        ageRestrictionLevel: 0,
      })
      setFeatures({ contentFilter: true })
      expect(withoutDisabledFeatures(articles, { articles: true })[0]).toMatchObject({
        voiceOverKey: null,
        contentFilter: 2,
        isAgeRestricted: false,
        ageRestrictionLevel: 0,
      })
      setFeatures({ ageRestrictionLevels: true })
      expect(withoutDisabledFeatures(articles, { articles: true })[0]).toMatchObject({
        voiceOverKey: null,
        contentFilter: 0,
        isAgeRestricted: true,
        ageRestrictionLevel: 15,
      })
    })

    it('sends the stored values once every feature is enabled', () => {
      setFeatures({ voiceOver: true, contentFilter: true, ageRestrictionLevels: true })
      expect(withoutDisabledFeatures(articles, { articles: true })).toEqual(articles)
      expect(withoutDisabledFeatures(quizzes)).toEqual(quizzes)
    })
  })

  describe('views', () => {
    const render = (view: string, features: Features, locals: object = {}) =>
      ejs.renderFile(path.join(views, view), {
        features,
        __: (text: string) => text,
        categories: [],
        subcategories: [],
        contentFilterOptions: [{ value: 0, description: 'All' }],
        ageRestrictionOptions: [
          { value: 0, description: 'All' },
          { value: 15, description: '15+' },
        ],
        ...locals,
      })

    it('leaves the content filter out of the page while it is disabled', async () => {
      const features = { ...allOff }
      expect(await render('partials/Footer.ejs', features)).not.toContain('contentFilter')
      expect(await render('modals/ArticleModal.ejs', features)).not.toContain(
        'contentFilterDropdownForm',
      )
    })

    it('renders the content filter once it is enabled', async () => {
      const features = { ...allOff, contentFilter: true }
      expect(await render('partials/Footer.ejs', features)).toContain('/scripts/contentFilter.js')
      expect(await render('modals/ArticleModal.ejs', features)).toContain(
        'contentFilterDropdownForm',
      )
    })

    it('leaves age restriction levels out of the encyclopedia while they are disabled', async () => {
      const features = { ...allOff }
      expect(await render('partials/Footer.ejs', features)).not.toContain('ageRestriction.js')
      const modal = await render('modals/ArticleModal.ejs', features)
      expect(modal).not.toContain('ageRestrictionLevelForm')
      expect(modal).not.toContain('Age Restriction')
    })

    const didYouKnowPage = (features: Features) =>
      render('DidYouKnow.ejs', features, {
        currentUser: { username: 'admin', type: 'superAdmin', lang: 'en' },
        cmsLanguages: [{ name: 'English', locale: 'en' }],
        didYouKnows: [
          {
            id: 'd',
            title: 'Topic',
            content: 'Content',
            isAgeRestricted: true,
            ageRestrictionLevel: 15,
            contentFilter: 0,
            live: true,
          },
        ],
      })

    it('shows a single age restricted toggle on did you knows while levels are disabled', async () => {
      const page = await didYouKnowPage({ ...allOff })
      expect(page).toContain('Age Restricted')
      expect(page).toContain('ageRestrictionCheckbox')
      expect(page).not.toContain('age-restriction-level-radio')
    })

    it('shows one column per level on did you knows once levels are enabled', async () => {
      const page = await didYouKnowPage({ ...allOff, ageRestrictionLevels: true })
      expect(page).not.toContain('ageRestrictionCheckbox')
      expect(page).toContain('age-restriction-level-radio')
      expect(page).toContain('15+')
    })

    it('renders age restriction levels in the encyclopedia once they are enabled', async () => {
      const features = { ...allOff, ageRestrictionLevels: true }
      expect(await render('partials/Footer.ejs', features)).toContain('/scripts/ageRestriction.js')
      const modal = await render('modals/ArticleModal.ejs', features)
      expect(modal).toContain('ageRestrictionLevelForm')
      expect(modal).toContain('15+')
    })
  })
})
