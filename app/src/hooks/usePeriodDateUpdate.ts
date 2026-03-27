import { useDispatch, useSelector } from 'react-redux'
import { appTokenSelector, currentUserSelector } from '../redux/selectors'
import { editUser } from '../redux/actions'
import { usePredictionEngineState } from '../contexts/PredictionProvider'
import { generatePeriodDates } from '../prediction/predictionLogic'
import { httpClient } from '../services/HttpClient'
import { User } from '../types'

/**
 * Hook for managing user period date entries.
 * Handles syncing user-verified and ML-predicted period dates
 * between Redux state and the backend API.
 */
export function usePeriodDateUpdate() {
  const currentUser = useSelector(currentUserSelector) as User
  const appToken = useSelector(appTokenSelector)
  const reduxDispatch = useDispatch()
  const predictionFullState = usePredictionEngineState()

  /**
   * Send request to API to user update metadata
   * @param changes Metadata update with new period days
   */
  const updateUserVerifiedDates = async (changes: Partial<User>) => {
    await httpClient.updateUserVerifiedDays({
      appToken,
      ...changes,
    })
  }

  /**
   * Dispatch user metadata changes to Redux store.
   * @param changes - Partial user object containing updated fields
   */
  const editUserReduxState = (changes: Partial<User>) => {
    reduxDispatch(editUser(changes))
  }

  /**
   * Handle the user's response from the day modal to mark or unmark a date as a period day.
   * Merges ML-predicted dates with existing entries, applies the user's selection,
   * and persists the result to both the API and Redux state.
   * @param isPeriodDay - Whether the user marked the date as a period day
   * @param periodDate - The date string (YYYY-MM-DD) being updated
   */
  const handleDayModalResponse = async (isPeriodDay: boolean, periodDate: string) => {
    // Generate latest ML-based predictions
    const predictedPeriodDates = generatePeriodDates(predictionFullState)

    // Get the existing periodDates from user metadata
    let updatedPeriodDates = currentUser.metadata?.periodDates
      ? [...currentUser.metadata.periodDates]
      : []

    // Step 1: Ensure all ML-generated dates are included
    const mlDatesToAdd = predictedPeriodDates
      .filter((entry) => !updatedPeriodDates.some((u) => u.date === entry.date))
      .map((entry) => ({
        ...entry,
        mlGenerated: false,
        userVerified: entry.userVerified || false,
      }))
    updatedPeriodDates = [...updatedPeriodDates, ...mlDatesToAdd]

    // Step 2: Check if the selected date is ML-predicted
    const isMlPredicted = predictedPeriodDates.some((entry) => entry.date === periodDate)

    // Step 3: Find if the selected date exists in the array
    const existingDateIndex = updatedPeriodDates.findIndex((entry) => entry.date === periodDate)

    if (isPeriodDay) {
      if (existingDateIndex !== -1) {
        const existingEntry = updatedPeriodDates[existingDateIndex]

        if (existingEntry.userVerified === true) {
          return
        } else {
          updatedPeriodDates[existingDateIndex] = {
            ...existingEntry,
            userVerified: true,
            mlGenerated: false,
          }
        }
      } else {
        updatedPeriodDates.push({
          date: periodDate,
          mlGenerated: isMlPredicted,
          userVerified: true,
        })
      }
    } else {
      if (existingDateIndex !== -1) {
        updatedPeriodDates.splice(existingDateIndex, 1)
      } else {
        return
      }
    }

    // Step 4: Sort by date for consistency
    updatedPeriodDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    try {
      await updateUserVerifiedDates({
        metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
      })

      editUserReduxState({
        metadata: { ...currentUser.metadata, periodDates: updatedPeriodDates },
      })
    } catch (error) {
      console.error('Error updating period dates:', error)
    }
  }

  /**
   * Initialize period dates from ML predictions if the user has none saved.
   * Seeds the user's metadata with generated predictions on first use.
   */
  const initPeriodDatesIfEmpty = () => {
    if (!currentUser?.metadata?.periodDates?.length) {
      const data = generatePeriodDates(predictionFullState)
      updateUserVerifiedDates({ metadata: { periodDates: data } })
      editUserReduxState({ metadata: { periodDates: data } })
    }
  }

  return { handleDayModalResponse, initPeriodDatesIfEmpty }
}
