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
  console.log('[CycleCalculator] ========== calculateCycles CALLED ==========')
  console.log('[CycleCalculator] Input metadata:', metadata)
  
  // If no metadata or period dates, return 0 cycles
  if (!metadata?.periodDates) {
    console.log('[CycleCalculator] No metadata or periodDates, returning 0 cycles')
    return { cyclesNumber: 0 }
  }

  console.log('[CycleCalculator] Total periodDates:', metadata.periodDates.length)
  console.log('[CycleCalculator] All periodDates:', metadata.periodDates.map(pd => ({ 
    date: pd.date, 
    userVerified: pd.userVerified, 
    mlGenerated: pd.mlGenerated 
  })))

  // Filter and sort verified period dates
  const verifiedPeriodDates = metadata.periodDates
    .filter(periodDate => {
      const isVerified = periodDate.userVerified === true
      console.log('[CycleCalculator] Checking date:', periodDate.date, 'userVerified:', periodDate.userVerified, '→', isVerified ? 'INCLUDED' : 'EXCLUDED')
      return isVerified
    })
    .map(periodDate => {
      try {
        // Try DD/MM/YYYY format first (from DayModal)
        let parsed = moment(periodDate.date, 'DD/MM/YYYY', true)
        if (!parsed.isValid()) {
          // Try YYYY-MM-DD format (from MainScreen)
          parsed = moment(periodDate.date, 'YYYY-MM-DD', true)
        }
        if (!parsed.isValid()) {
          // Try ISO format
          parsed = moment(periodDate.date)
        }
        console.log('[CycleCalculator] Parsed date:', periodDate.date, '→', parsed.isValid() ? parsed.format('DD/MM/YYYY') : 'INVALID')
        return parsed.isValid() ? parsed : null
      } catch (error) {
        console.log('[CycleCalculator] Error parsing date:', periodDate.date, error)
        return null
      }
    })
    .filter(moment => moment !== null)
    .sort((a, b) => a!.diff(b!))

  console.log('[CycleCalculator] Verified period dates count:', verifiedPeriodDates.length)
  console.log('[CycleCalculator] Verified dates (formatted):', verifiedPeriodDates.map(d => d!.format('DD/MM/YYYY')))

  // If no verified dates, return 0 cycles
  if (verifiedPeriodDates.length === 0) {
    console.log('[CycleCalculator] No verified dates, returning 0 cycles')
    return { cyclesNumber: 0 }
  }

  // Group consecutive dates (allowing 2-day gaps)
  const cycleGroups: moment.Moment[][] = []
  let currentGroup: moment.Moment[] = [verifiedPeriodDates[0]!]
  console.log('[CycleCalculator] Starting cycle group 1 with date:', verifiedPeriodDates[0]!.format('DD/MM/YYYY'))

  for (let i = 1; i < verifiedPeriodDates.length; i++) {
    const currentDate = verifiedPeriodDates[i]!
    const previousDate = verifiedPeriodDates[i - 1]!
    const daysDiff = currentDate.diff(previousDate, 'days')
    console.log('[CycleCalculator] Date:', currentDate.format('DD/MM/YYYY'), '| Previous:', previousDate.format('DD/MM/YYYY'), '| Days diff:', daysDiff)

    if (daysDiff <= 2) {
      // Same cycle (01-01 to 03-01 = 2 days = same cycle)
      console.log('[CycleCalculator] → Same cycle (gap <= 2 days)')
      currentGroup.push(currentDate)
    } else {
      // New cycle (01-01 to 04-01 = 3 days = new cycle)
      console.log('[CycleCalculator] → New cycle (gap > 2 days), closing group with', currentGroup.length, 'dates')
      cycleGroups.push([...currentGroup])
      currentGroup = [currentDate]
      console.log('[CycleCalculator] Starting new cycle group', cycleGroups.length + 1, 'with date:', currentDate.format('DD/MM/YYYY'))
    }
  }

  // Add the last group
  console.log('[CycleCalculator] Closing final group with', currentGroup.length, 'dates')
  cycleGroups.push(currentGroup)

  // Debug logging
  console.log('[CycleCalculator] Final cycle groups:')
  cycleGroups.forEach((group, index) => {
    console.log(`[CycleCalculator]   Group ${index + 1} (${group.length} dates):`, group.map(d => d.format('DD/MM/YYYY')))
  })
  console.log('[CycleCalculator] Total cycles:', cycleGroups.length)
  console.log('[CycleCalculator] ========== calculateCycles COMPLETE ==========')

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
