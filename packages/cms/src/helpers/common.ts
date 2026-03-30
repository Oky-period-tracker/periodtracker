export const bulkUpdateRowReorder = async (repository, data) => {
  await Promise.all(
    data.map((order) => repository.update({ id: order.id }, { sortingKey: order.sortingKey }))
  )
}
