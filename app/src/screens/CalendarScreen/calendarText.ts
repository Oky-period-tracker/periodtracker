// app/src/screens/CalendarScreen/calendarText.ts
import { DayKind, PredictionStatus } from '../../prediction/calendarMarks'

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '')

export function messageText(
  status: PredictionStatus,
  t: (key: string) => string,
  formatDate: (iso: string) => string,
) {
  if (status.kind !== 'shown') {
    return { title: t(`calendar_msg_${status.kind}_title`), body: t(`calendar_msg_${status.kind}_body`) }
  }
  return {
    title: fill(t('calendar_msg_shown_title'), {
      likely: formatDate(status.likelyStart),
      start: formatDate(status.rangeStart),
      end: formatDate(status.rangeEnd),
    }),
    body: fill(t('calendar_msg_shown_body'), {
      ovulationStart: formatDate(status.ovulationStart),
      ovulationEnd: formatDate(status.ovulationEnd),
    }),
  }
}

export function legendKeys(days: Record<string, DayKind[]>, status: PredictionStatus) {
  const hasPossible = Object.values(days).some((k) => k.includes('possiblePeriod'))
  const shown = status.kind === 'shown'
  return [
    'calendar_legend_confirmed',
    ...(hasPossible ? ['calendar_legend_possible_period'] : []),
    ...(shown ? ['calendar_legend_likely_start', 'calendar_legend_ovulation'] : []),
    'calendar_legend_today',
  ]
}
