import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { httpClient } from '../services/HttpClient'
import { editUser } from '../redux/actions'
import { appTokenSelector, currentUserSelector } from '../redux/selectors'
import { calculateCycles } from '../utils/cycleCalculator'
import { firebaseLogEvent } from '../services/firebase'
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
    if (!currentUser) return

    try {
      const metadataForCalculation: UserMetadata = {
        ...currentUser.metadata,
        periodDates: updatedPeriodDates
      }
      
      const cycleResult = calculateCycles(metadataForCalculation)

      if (cycleResult.cyclesNumber !== (currentUser.cyclesNumber || 0)) {
        // Update local Redux state first (works for both guest and logged-in users)
        dispatch(editUser({
          cyclesNumber: cycleResult.cyclesNumber,
        }))

        firebaseLogEvent('CYCLES_NUMBER_UPDATE', {
          userId: currentUser?.id || null,
          previousCyclesNumber: currentUser.cyclesNumber || 0,
          newCyclesNumber: cycleResult.cyclesNumber,
        })

        // Sync to server only if logged in (appToken exists)
        if (appToken) {
          try {
            await httpClient.updateCyclesNumber({
              appToken,
              cyclesNumber: cycleResult.cyclesNumber,
            })
          } catch (serverError) {
            console.error('Error syncing cycle count to server:', serverError)
          }
        }
      }
    } catch (error) {
      console.error('Error updating cycle count:', error)
    }
  }, [currentUser, appToken, dispatch])

  return { updateCycleCount }
}

