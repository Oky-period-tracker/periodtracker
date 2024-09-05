import React from 'react'
import { generateRange } from '../../../../services/utils'
import { useTranslate } from '../../../../hooks/useTranslate'
import { WheelPickerOption } from '../../../../components/WheelPicker'
import moment, { Moment } from 'moment'
import { useFormatDate } from '../../../../hooks/useFormatDate'
import { useSelector } from '../../../../redux/useSelector'
import { currentUserSelector } from '../../../../redux/selectors'

export type JourneyStep =
  | 'first_period'
  | 'when_last_period'
  | 'number_days'
  | 'number_weeks_between'

export const journeySteps: JourneyStep[] = [
  'first_period',
  'when_last_period',
  'number_days',
  'number_weeks_between',
]

type JourneyState = {
  stepIndex: number
  // Answers
  isActive: boolean
  startDate: Moment
  periodLength: string | undefined // days
  cycleLength: string | undefined // weeks
  hasSkipped: boolean
}

type Action<T extends keyof JourneyState = keyof JourneyState> =
  | {
      type: T
      value: JourneyState[T]
    }
  | {
      type: 'continue'
    }
  | {
      type: 'skip'
    }

const twoWeeksAgo = moment.utc().startOf('day').clone().subtract(14, 'days')

const initialState: JourneyState = {
  stepIndex: 0,
  isActive: false,
  startDate: twoWeeksAgo,
  periodLength: '5',
  cycleLength: '3',
  hasSkipped: false,
}

const DAYS_MIN = 1
const DAYS_MAX = 10
const WEEKS_MIN = 1
const WEEKS_MAX = 6

const daysRange = generateRange(DAYS_MIN, DAYS_MAX)
const weeksRange = generateRange(WEEKS_MIN, WEEKS_MAX)

function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case 'continue':
      return {
        ...state,
        stepIndex: state.stepIndex + 1,
      }

    case 'skip':
      return {
        ...state,
        stepIndex: journeySteps.length, // Review step
        hasSkipped: true,
      }

    default:
      return {
        ...state,
        [action.type]: action.value,
      }
  }
}

export type JourneyContext = {
  state: JourneyState
  dispatch: React.Dispatch<Action>
  step: JourneyStep
  dayOptions: WheelPickerOption[]
  weekOptions: WheelPickerOption[]
  getAnswerForStep: (state: JourneyState, step: JourneyStep) => string
}

const defaultValue: JourneyContext = {
  state: initialState,
  dispatch: () => {},
  step: journeySteps[0],
  dayOptions: [],
  weekOptions: [],
  getAnswerForStep: () => '',
}

const JourneyContext = React.createContext<JourneyContext>(defaultValue)

export const JourneyProvider = ({ children }: React.PropsWithChildren) => {
  const currentUser = useSelector(currentUserSelector)

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const step = journeySteps[state.stepIndex]

  const { formatDayMonthYear } = useFormatDate()
  const translate = useTranslate()
  const days = translate('days')
  const weeks = translate('weeks')

  const dayOptions = daysRange.map((item) => ({
    label: `${item} ${days}`,
    value: `${item}`,
  }))

  const weekOptions = weeksRange.map((item) => ({
    label: `${item} ${weeks}`,
    value: `${item}`,
  }))

  const getAnswerForStep = (state: JourneyState, step: JourneyStep): string => {
    switch (step) {
      case 'first_period':
        return translate(state.isActive ? 'Yes' : 'No')

      case 'when_last_period':
        return state.isActive ? formatDayMonthYear(state.startDate) : '-'

      case 'number_days':
        return state.isActive && state.periodLength ? state.periodLength : '-'

      case 'number_weeks_between':
        return state.isActive && state.cycleLength ? state.cycleLength : '-'
    }
  }

  React.useEffect(() => {
    if (!currentUser) {
      return
    }

    const isMale = currentUser?.gender === 'Male'

    if (!isMale || state.hasSkipped) {
      return
    }

    const timeout = setTimeout(() => {
      dispatch({ type: 'skip' })
    }, 256) // Time for screen to render

    return () => {
      clearTimeout(timeout)
    }
  }, [currentUser])

  return (
    <JourneyContext.Provider
      value={{
        state,
        dispatch,
        step,
        dayOptions,
        weekOptions,
        getAnswerForStep,
      }}
    >
      {children}
    </JourneyContext.Provider>
  )
}

export const useJourney = () => {
  return React.useContext(JourneyContext)
}
