import moment from 'moment'

export const bulkUpdateRowReorder = (repository, data) => {
  return data.map(async (order) => {
    return await repository.update({ id: order.id }, { sortingKey: order.sortingKey })
  })
}

// common column is 'ageRestrictionLevel' i.e Article, HelpCenter
export const filterContentByAge = (originalBirth, repository) => {
  const age = calculateAge(originalBirth)

  return repository.filter((repo) => {
    if (!repo.isAgeRestricted) {
      return true
    }

    if (repo.isAgeRestricted) {
      let threshold = 0

      if (repo.ageRestrictionLevel === 10) {
        threshold = 13
        return age <= threshold
      }

      if (repo.ageRestrictionLevel === 14) {
        threshold = 16
        return age <= threshold && age <= repo.ageRestrictionLevel
      }

      return age >= 17
    }
  })
}

const calculateAge = (birthDate) => {
  const currentDate = moment()
  const birthDateObj = moment(birthDate, 'YYYY-MM-DD')

  const ageInYears = currentDate.diff(birthDateObj, 'years')
  return ageInYears
}
