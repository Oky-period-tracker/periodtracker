// app/__tests__/src/components/CalendarDay.test.tsx
import React from 'react'
import { StyleSheet } from 'react-native'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { CalendarDay } from '../../../src/components/CalendarDay'
import { calendarColors } from '../../../src/hooks/useColor'

const c = calendarColors.light
const date = { dateString: '2026-10-03', day: 3 }
const circle = () => StyleSheet.flatten(screen.getByTestId('calendar-day-circle').props.style)

describe('CalendarDay', () => {
  it('confirmed: solid pink, white number', () => {
    render(<CalendarDay date={date} marking={{ kinds: ['confirmed', 'ovulation'] }} />)
    expect(circle().backgroundColor).toBe(c.confirmed)
  })

  it('likelyStart: ring with background centre', () => {
    render(<CalendarDay date={date} marking={{ kinds: ['likelyStart'] }} />)
    expect(circle()).toMatchObject({ backgroundColor: c.ringCenter, borderColor: c.ring, borderWidth: 3 })
  })

  it('possiblePeriod: pink wash', () => {
    render(<CalendarDay date={date} marking={{ kinds: ['possiblePeriod'] }} />)
    expect(circle().backgroundColor).toBe(c.periodWash)
  })

  it('split: possible period + ovulation draws both washes', () => {
    render(<CalendarDay date={date} marking={{ kinds: ['possiblePeriod', 'ovulation'] }} />)
    expect(circle().backgroundColor).toBe(c.ovulationWash)
    expect(StyleSheet.flatten(screen.getByTestId('calendar-day-split').props.style).backgroundColor).toBe(
      c.periodWash,
    )
  })

  it('today shows a dot', () => {
    render(<CalendarDay date={date} marking={{ isToday: true }} />)
    expect(screen.getByTestId('calendar-day-today-dot')).toBeTruthy()
  })

  it('uses the given accessibility label and reports presses', () => {
    const onPress = jest.fn()
    render(<CalendarDay date={date} marking={{ label: '3 October, possible period day' }} onPress={onPress} />)
    fireEvent.press(screen.getByLabelText('3 October, possible period day'))
    expect(onPress).toHaveBeenCalledWith(date)
  })
})
