import moment, { Moment } from 'moment'

export function asUTC(time: Moment): Moment {
  if (time.isValid() && !time.isUTC()) {
    return time.clone().utc()
  }

  return time
}

export function asLocal(time: Moment): Moment {
  if (time.isValid() && !time.isLocal()) {
    return time.clone().local()
  }

  return time
}

export function toShortISO(time: Moment) {
  return time.format('YYYYMMDD')
}

export function calculateAge(birthday: Moment) {
  const now = moment()

  const years = now.diff(birthday, 'years')
  birthday.add(years, 'years')

  let months = now.diff(birthday, 'months')
  birthday.add(months, 'months')

  if (now.date() < birthday.date()) {
    months -= 1
  }

  return {
    years,
    months,
  }
}

export function toAge(birthday: Moment) {
  const { years } = calculateAge(birthday)
  return years
}

export const isFutureDate = (date: Moment) => {
  return moment(date).isAfter(moment())
}
