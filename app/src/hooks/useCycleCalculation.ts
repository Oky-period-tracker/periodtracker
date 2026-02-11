import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { httpClient } from '../services/HttpClient'
import { editUser } from '../redux/actions'
import { appTokenSelector, currentUserSelector } from '../redux/selectors'
import { calculateCycles } from '../utils/cycleCalculator'
import { analytics } from '../services/firebase'
import type { UserMetadata } from '../types'

interface PeriodDate {
  date: string
  mlGenerated: boolean
  userVerified: boolean | null
}

export const useCycleCalculation = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(currentUserSelector)
  const appToken = useSelector(appTokenSelector)

  const updateCycleCount = useCallback(async (updatedPeriodDates: PeriodDate[]) => {
    if (!currentUser || !appToken) return

    try {
      const metadataForCalculation: UserMetadata = {
        ...currentUser.metadata,
        periodDates: updatedPeriodDates
      }
      
      const cycleResult = calculateCycles(metadataForCalculation)

      if (cycleResult.cyclesNumber !== (currentUser.cyclesNumber || 0)) {
        await httpClient.updateCyclesNumber({
          appToken,
          cyclesNumber: cycleResult.cyclesNumber,
        })

        dispatch(editUser({
          cyclesNumber: cycleResult.cyclesNumber,
        }))

        analytics?.().logEvent('CYCLES_NUMBER_UPDATE', {
          userId: currentUser?.id || null,
          previousCyclesNumber: currentUser.cyclesNumber || 0,
          newCyclesNumber: cycleResult.cyclesNumber,
        })
      }
    } catch (error) {
      console.error('Error updating cycle count:', error)
    }
  }, [currentUser, appToken, dispatch])

  return { updateCycleCount }
}

