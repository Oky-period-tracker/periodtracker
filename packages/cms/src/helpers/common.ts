const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Postgres raises on a malformed uuid instead of matching nothing, so ids taken from
// a request are checked before they reach a uuid column
export const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID.test(value)

// Only rows in the editor's language are reordered; ids from another language match nothing
export const bulkUpdateRowReorder = async (repository, data, lang) => {
  return await Promise.all(
    data.map((order) =>
      repository.update({ id: order.id, lang }, { sortingKey: order.sortingKey }),
    ),
  )
}
