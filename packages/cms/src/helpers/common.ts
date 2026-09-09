export const bulkUpdateRowReorder = (repository, data) => {
  return data.map(async (order) => {
    return await repository.update({ id: order.id }, { sortingKey: order.sortingKey })
  })
}
