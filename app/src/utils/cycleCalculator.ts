import moment from 'moment'
import { UserMetadata } from '../types'

export interface CycleCalculationResult {
  cyclesNumber: number
}

/**
 * Calculates the number of cycles based on verified period dates
 * A cycle is a group of consecutive period dates (allowing 2-day gaps)
 */
export function calculateCycles(metadata: UserMetadata | null | undefined): CycleCalculationResult {
  // If no metadata or period dates, return 0 cycles
  if (!metadata?.periodDates) {
    return { cyclesNumber: 0 }
  }

  // Filter and sort verified period dates
  const verifiedPeriodDates = metadata.periodDates
    .filter(periodDate => periodDate.userVerified === true)
    .map(periodDate => {
      try {
        return moment(periodDate.date, 'DD/MM/YYYY')
      } catch (error) {
        return null
      }
    })
    .filter(moment => moment !== null)
    .sort((a, b) => a!.diff(b!))

  // If no verified dates, return 0 cycles
  if (verifiedPeriodDates.length === 0) {
    return { cyclesNumber: 0 }
  }

  // Group consecutive dates (allowing 2-day gaps)
  const cycleGroups: moment.Moment[][] = []
  let currentGroup: moment.Moment[] = [verifiedPeriodDates[0]!]

  for (let i = 1; i < verifiedPeriodDates.length; i++) {
    const currentDate = verifiedPeriodDates[i]!
    const previousDate = verifiedPeriodDates[i - 1]!
    const daysDiff = currentDate.diff(previousDate, 'days')

    if (daysDiff <= 2) {
      // Same cycle (01-01 to 03-01 = 2 days = same cycle)
      currentGroup.push(currentDate)
    } else {
      // New cycle (01-01 to 04-01 = 3 days = new cycle)
      cycleGroups.push([...currentGroup])
      currentGroup = [currentDate]
    }
  }

  // Add the last group
  cycleGroups.push(currentGroup)

  return { cyclesNumber: cycleGroups.length }
}

/**
 * Checks if a date is already verified as a period day
 */
export function isDateVerified(
  date: string,
  metadata: UserMetadata | null | undefined
): boolean {
  if (!metadata?.periodDates) {
    return false
  }

  return metadata.periodDates.some(
    periodDate => periodDate.date === date && periodDate.userVerified === true
  )
}

/**
 * Checks if a date exists in the period dates list
 */
export function dateExistsInPeriodDates(
  date: string,
  metadata: UserMetadata | null | undefined
): boolean {
  if (!metadata?.periodDates) {
    return false
  }

  return metadata.periodDates.some(periodDate => periodDate.date === date)
}
