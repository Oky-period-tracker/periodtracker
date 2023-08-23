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
  const diffDuration = moment.duration(moment().diff(birthday))

  return {
    years: diffDuration.years(),
    months: diffDuration.months(),
  }
}

export function toAge(birthday: Moment) {
  const { years } = calculateAge(birthday)
  return years
}
