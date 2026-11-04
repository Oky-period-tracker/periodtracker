// app/__tests__/src/screens/calendarText.test.ts
import { legendKeys, messageText } from '../../../src/screens/CalendarScreen/calendarText'

const en: Record<string, string> = {
  calendar_msg_none_title: 'Tell us when your period starts.',
  calendar_msg_none_body: 'Tap the day it started.',
  calendar_msg_paused_title: 'Your cycles are changing a lot right now. That’s normal.',
  calendar_msg_paused_body: 'I can’t tell you when your next period is coming yet. I’ll show it again when your cycles settle.',
  calendar_msg_shown_title: 'Your period will most likely start on {likely}, but it could start any time between {start} and {end}.',
  calendar_msg_shown_body: 'You could ovulate between {ovulationStart} and {ovulationEnd}. Oky can’t tell you when you are safe from pregnancy.',
}
const t = (k: string) => en[k] ?? k
const fmt = (iso: string) => iso.slice(5)

describe('messageText', () => {
  it('none', () => {
    expect(messageText({ kind: 'none' }, t, fmt)).toEqual({
      title: 'Tell us when your period starts.',
      body: 'Tap the day it started.',
    })
  })

  it('paused', () => {
    expect(messageText({ kind: 'paused' }, t, fmt).title).toMatch(/changing a lot/)
  })

  it('shown fills every placeholder', () => {
    const m = messageText(
      {
        kind: 'shown',
        likelyStart: '2026-10-31',
        rangeStart: '2026-10-28',
        rangeEnd: '2026-11-03',
        ovulationStart: '2026-10-14',
        ovulationEnd: '2026-10-21',
      },
      t,
      fmt,
    )
    expect(m.title).toBe(
      'Your period will most likely start on 10-31, but it could start any time between 10-28 and 11-03.',
    )
    expect(m.body).toMatch(/^You could ovulate between 10-14 and 10-21\./)
    expect(m.title + m.body).not.toMatch(/[{}]/)
  })
})

describe('legendKeys', () => {
  it('shows only what is on the calendar', () => {
    expect(legendKeys({ '2026-10-01': ['confirmed'] }, { kind: 'paused' })).toEqual([
      'calendar_legend_confirmed',
      'calendar_legend_today',
    ])
    expect(
      legendKeys({ '2026-10-02': ['possiblePeriod'] }, {
        kind: 'shown',
        likelyStart: '',
        rangeStart: '',
        rangeEnd: '',
        ovulationStart: '',
        ovulationEnd: '',
      }),
    ).toEqual([
      'calendar_legend_confirmed',
      'calendar_legend_possible_period',
      'calendar_legend_likely_start',
      'calendar_legend_ovulation',
      'calendar_legend_today',
    ])
  })
})
