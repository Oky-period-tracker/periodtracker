export const bulkUpdateRowReorder = async (repository, data) => {
  return await Promise.all(
    data.map((order) => repository.update({ id: order.id }, { sortingKey: order.sortingKey })),
  )
}
