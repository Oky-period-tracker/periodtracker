import { createConnection, Connection } from 'typeorm'
import { Survey } from '../../src/entity/Survey'
import { Question } from '../../src/entity/Question'
import { SurveyController } from '../../src/controller/SurveyController'

let mockConnection: Connection
jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  getManager: () => mockConnection.manager,
  getRepository: (entity: any) => mockConnection.getRepository(entity),
}))
jest.mock('../../src/logger', () => ({ logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } }))

// Run against an isolated PostgreSQL instance; every object belongs to a unique test schema.
const databaseTests = process.env.CMS_TEST_DATABASE_SOCKET ? describe : describe.skip
const schema = `survey_test_${process.pid}_${Date.now()}`
const question = { question: 'Original', option1: 'A', option2: 'B', option3: '', option4: '', option5: '', response: '', next_question: '{}', sort_number: '1', is_multiple: 'false' }
const response: any = { status: jest.fn().mockReturnThis(), send: jest.fn() }
const req = (body: any, id?: string): any => ({ body, params: { id }, user: { lang: 'en' } })

databaseTests('survey transactions with PostgreSQL', () => {
  let controller: SurveyController
  beforeAll(async () => {
    mockConnection = await createConnection({
      name: schema, type: 'postgres', host: process.env.CMS_TEST_DATABASE_SOCKET,
      port: Number(process.env.CMS_TEST_DATABASE_PORT), username: process.env.USER,
      database: 'postgres', schema, entities: [Survey, Question], synchronize: false, logging: false,
    })
    await mockConnection.query(`CREATE SCHEMA ${schema}`)
    await mockConnection.synchronize()
    controller = new SurveyController()
  })
  beforeEach(async () => {
    await mockConnection.query(`TRUNCATE ${schema}.question, ${schema}.survey CASCADE`)
    jest.clearAllMocks()
  })
  afterAll(async () => {
    if (mockConnection?.isConnected) {
      await mockConnection.query(`DROP SCHEMA ${schema} CASCADE`)
      await mockConnection.close()
    }
  })
  async function create() {
    return controller.save(req({ live: false, questions: [question, { ...question, sort_number: '2' }] }), response, jest.fn())
  }
  async function failParent(operation: 'UPDATE' | 'DELETE', action: () => Promise<any>) {
    await mockConnection.query(`CREATE FUNCTION ${schema}.reject_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'forced parent failure'; END; $$`)
    await mockConnection.query(`CREATE TRIGGER reject_write BEFORE ${operation} ON ${schema}.survey FOR EACH ROW EXECUTE PROCEDURE ${schema}.reject_write()`)
    try { await expect(action()).rejects.toThrow('forced parent failure') }
    finally {
      await mockConnection.query(`DROP TRIGGER reject_write ON ${schema}.survey`)
      await mockConnection.query(`DROP FUNCTION ${schema}.reject_write()`)
    }
  }

  it('rolls back the parent and earlier children when one question fails', async () => {
    await expect(controller.save(req({ live: false, questions: [question, { ...question, question: null }] }), response, jest.fn())).rejects.toThrow()
    expect(await mockConnection.getRepository(Survey).count()).toBe(0)
    expect(await mockConnection.getRepository(Question).count()).toBe(0)
  })
  it('commits a complete survey and its questions', async () => {
    const saved = await create()
    expect(await mockConnection.getRepository(Survey).findOne(saved!.id)).toBeDefined()
    expect(await mockConnection.getRepository(Question).count({ surveyId: saved!.id })).toBe(2)
  })
  it('rolls back question edits and deletions when updating the parent fails', async () => {
    const saved = await create()
    const children = await mockConnection.getRepository(Question).find({ surveyId: saved!.id })
    await failParent('UPDATE', () => controller.update(req({ questions: [{ ...children[0], question: 'Changed' }], deletedQuestion: [children[1].id], live: 'true' }, saved!.id), response, jest.fn()))
    expect((await mockConnection.getRepository(Question).findOne(children[0].id))!.question).toBe('Original')
    expect(await mockConnection.getRepository(Question).count()).toBe(2)
    expect((await mockConnection.getRepository(Survey).findOne(saved!.id))!.live).toBe(false)
  })
  it('restores children when deleting the parent fails', async () => {
    const saved = await create()
    await failParent('DELETE', () => controller.remove(req({}, saved!.id), response, jest.fn()))
    expect(await mockConnection.getRepository(Survey).count()).toBe(1)
    expect(await mockConnection.getRepository(Question).count()).toBe(2)
  })
  it('commits successful edits, child deletion and survey removal', async () => {
    const saved = await create()
    const children = await mockConnection.getRepository(Question).find({ surveyId: saved!.id })
    await controller.update(req({ questions: [{ ...children[0], question: 'Changed' }], deletedQuestion: [children[1].id], live: 'true' }, saved!.id), response, jest.fn())
    expect(await mockConnection.getRepository(Question).count()).toBe(1)
    expect((await mockConnection.getRepository(Question).findOne(children[0].id))!.question).toBe('Changed')
    await controller.remove(req({}, saved!.id), response, jest.fn())
    expect(await mockConnection.getRepository(Survey).count()).toBe(0)
    expect(await mockConnection.getRepository(Question).count()).toBe(0)
  })
  it('rejects a question from another survey and rolls back earlier edits', async () => {
    const first = await create(), second = await create()
    const mine = (await mockConnection.getRepository(Question).find({ surveyId: first!.id }))[0]
    const theirs = (await mockConnection.getRepository(Question).find({ surveyId: second!.id }))[0]
    await expect(controller.update(req({ questions: [{ ...mine, question: 'Changed' }, { ...theirs, question: 'Hijacked' }] }, first!.id), response, jest.fn())).rejects.toThrow('Question not found')
    expect((await mockConnection.getRepository(Question).findOne(mine.id))!.question).toBe('Original')
    expect((await mockConnection.getRepository(Question).findOne(theirs.id))!.question).toBe('Original')
  })
})
