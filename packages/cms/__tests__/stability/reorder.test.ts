import { bulkUpdateRowReorder } from '../../src/helpers/common'

describe('row reorder response', () => {
  it('waits for every update and returns results for the HTTP route wrapper', async () => {
    let finish: (value: any) => void
    const repository = { update: jest.fn()
      .mockResolvedValueOnce({ affected: 1 })
      .mockImplementationOnce(() => new Promise(resolve => { finish = resolve })) }
    const rows = [{ id: 'first', sortingKey: 2 }, { id: 'second', sortingKey: 1 }]
    let completed = false
    const result = bulkUpdateRowReorder(repository, rows).then(value => { completed = true; return value })
    await Promise.resolve()
    expect(completed).toBe(false)
    finish!({ affected: 1 })
    await expect(result).resolves.toEqual([{ affected: 1 }, { affected: 1 }])
    expect(repository.update).toHaveBeenNthCalledWith(1, { id: 'first' }, { sortingKey: 2 })
    expect(repository.update).toHaveBeenNthCalledWith(2, { id: 'second' }, { sortingKey: 1 })
  })

  it('propagates database failures instead of returning success', async () => {
    const repository = { update: jest.fn().mockRejectedValue(new Error('update failed')) }
    await expect(bulkUpdateRowReorder(repository, [{ id: 'first', sortingKey: 2 }])).rejects.toThrow('update failed')
  })
})
