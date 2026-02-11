import { renderHook, act } from '@testing-library/react-hooks'
import { useCycleCalculation } from '../../../src/hooks/useCycleCalculation'
import { httpClient } from '../../../src/services/HttpClient'
import { editUser } from '../../../src/redux/actions'
import { firebaseLogEvent } from '../../../src/services/firebase'
import { calculateCycles } from '../../../src/utils/cycleCalculator'

jest.mock('../../../src/services/HttpClient')
jest.mock('../../../src/redux/actions')
const mockLogEvent = jest.fn()
jest.mock('../../../src/services/firebase', () => ({
  firebaseLogEvent: (...args: any[]) => mockLogEvent(...args),
}))
jest.mock('../../../src/utils/cycleCalculator')

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn(),
}))

jest.mock('../../../src/redux/useSelector', () => ({
  useSelector: jest.fn(),
}))

jest.mock('../../../src/redux/selectors', () => ({
  currentUserSelector: jest.fn(),
  appTokenSelector: jest.fn(),
}))

import { useDispatch, useSelector } from 'react-redux'
import { currentUserSelector, appTokenSelector } from '../../../src/redux/selectors'

describe('useCycleCalculation', () => {
  const mockDispatch = jest.fn()
  const mockCurrentUser = {
    id: 'user123',
    cyclesNumber: 2,
    metadata: {
      periodDates: [
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
        { date: '02/01/2024', userVerified: true, mlGenerated: false },
      ],
    },
  }
  const mockAppToken = 'test-token'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useDispatch as jest.Mock).mockReturnValue(mockDispatch)
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentUserSelector) {
        return mockCurrentUser
      }
      if (selector === appTokenSelector) {
        return mockAppToken
      }
      return null
    })
    ;(calculateCycles as jest.Mock).mockReturnValue({ cyclesNumber: 3 })
    ;(httpClient.updateCyclesNumber as jest.Mock).mockResolvedValue({})
    mockLogEvent.mockClear()
  })

  it('returns updateCycleCount function', () => {
    const { result } = renderHook(() => useCycleCalculation())
    expect(result.current.updateCycleCount).toBeDefined()
    expect(typeof result.current.updateCycleCount).toBe('function')
  })

  it('does not update when currentUser is null', async () => {
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentUserSelector) {
        return null
      }
      if (selector === appTokenSelector) {
        return mockAppToken
      }
      return null
    })

    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount([
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ])
    })

    expect(calculateCycles).not.toHaveBeenCalled()
    expect(httpClient.updateCyclesNumber).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('calculates cycles correctly', async () => {
    const updatedPeriodDates = [
      { date: '01/01/2024', userVerified: true, mlGenerated: false },
      { date: '02/01/2024', userVerified: true, mlGenerated: false },
      { date: '03/01/2024', userVerified: true, mlGenerated: false },
    ]

    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount(updatedPeriodDates)
    })

    expect(calculateCycles).toHaveBeenCalledWith({
      ...mockCurrentUser.metadata,
      periodDates: updatedPeriodDates,
    })
  })

  it('updates cyclesNumber when it changes', async () => {
    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount([
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ])
    })

    expect(httpClient.updateCyclesNumber).toHaveBeenCalledWith({
      appToken: mockAppToken,
      cyclesNumber: 3,
    })

    expect(mockDispatch).toHaveBeenCalledWith(
      editUser({
        cyclesNumber: 3,
      })
    )
  })

  it('does not update when cyclesNumber is unchanged', async () => {
    ;(calculateCycles as jest.Mock).mockReturnValue({ cyclesNumber: 2 })

    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount([
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ])
    })

    expect(httpClient.updateCyclesNumber).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('logs analytics event when cyclesNumber updates', async () => {
    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount([
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ])
    })

    expect(mockLogEvent).toHaveBeenCalledWith('CYCLES_NUMBER_UPDATE', {
      userId: 'user123',
      previousCyclesNumber: 2,
      newCyclesNumber: 3,
    })
  })

  it('handles missing appToken gracefully', async () => {
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentUserSelector) {
        return mockCurrentUser
      }
      if (selector === appTokenSelector) {
        return null
      }
      return null
    })

    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount([
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ])
    })

    expect(httpClient.updateCyclesNumber).not.toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('handles errors gracefully', async () => {
    const error = new Error('API Error')
    ;(httpClient.updateCyclesNumber as jest.Mock).mockRejectedValue(error)

    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount([
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ])
    })

    // Should not throw, error is silently handled
    expect(httpClient.updateCyclesNumber).toHaveBeenCalled()
  })

  it('handles user with no cyclesNumber', async () => {
    const userWithoutCycles = {
      ...mockCurrentUser,
      cyclesNumber: undefined,
    }
    ;(useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === currentUserSelector) {
        return userWithoutCycles
      }
      if (selector === appTokenSelector) {
        return mockAppToken
      }
      return null
    })

    const { result } = renderHook(() => useCycleCalculation())

    await act(async () => {
      await result.current.updateCycleCount([
        { date: '01/01/2024', userVerified: true, mlGenerated: false },
      ])
    })

    expect(mockLogEvent).toHaveBeenCalledWith('CYCLES_NUMBER_UPDATE', {
      userId: 'user123',
      previousCyclesNumber: 0,
      newCyclesNumber: 3,
    })
  })
})

