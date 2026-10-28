// Only rows in the editor's language are reordered; ids from another language match nothing
export const bulkUpdateRowReorder = async (repository, data, lang) => {
  return await Promise.all(
    data.map((order) =>
      repository.update({ id: order.id, lang }, { sortingKey: order.sortingKey }),
    ),
  )
}
