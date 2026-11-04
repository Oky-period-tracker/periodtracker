// app/src/prediction/calendarMarks.ts
// Pure calendar rules for the new grammar (direction paper v3.2 areas 4–5, brief §4.4, §4.5, §6.4).
// Dates are 'YYYY-MM-DD'; internally whole days since epoch (UTC), so DST never shifts a day.

export type DayKind = 'confirmed' | 'likelyStart' | 'possiblePeriod' | 'ovulation'

export interface CalendarConfig {
  capDays: number // max displayed half-width of the start range (4b)
  lutealDays: number // ovulation = start range minus this (5a)
  ovulationExtraDay: boolean // one extra ovulation day at the end (5a)
  maxGapDays: number // unmarked days allowed inside one period episode
  defaultPeriodLength: number // (2d)
  horizonDays: number // how far after today to draw
}

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  capDays: 3,
  lutealDays: 14,
  ovulationExtraDay: true,
  maxGapDays: 1,
  defaultPeriodLength: 5,
  horizonDays: 365,
}

export interface CycleRange {
  mean: number
  lower: number
  upper: number
}

export interface CalendarMarksInput {
  confirmedDays: string[]
  deniedDays: string[]
  averagePeriodLength: number | null
  cycle: CycleRange | null
  fallbackAnchor: string | null
  irregular?: boolean // brief §6.6: show the message instead of a range
  today: string
  config?: CalendarConfig
}

export type PredictionStatus =
  | { kind: 'none' }
  | { kind: 'paused' }
  | {
      kind: 'shown'
      likelyStart: string
      rangeStart: string
      rangeEnd: string
      ovulationStart: string
      ovulationEnd: string
    }

export interface CalendarMarks {
  days: Record<string, DayKind[]>
  status: PredictionStatus
}

const DAY_MS = 86_400_000

export const toDayIndex = (iso: string) =>
  Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) / DAY_MS

export const fromDayIndex = (n: number) => new Date(n * DAY_MS).toISOString().slice(0, 10)

export function groupEpisodes(days: number[], maxGapDays: number) {
  const episodes: Array<{ start: number; end: number }> = []
  for (const d of [...new Set(days)].sort((a, b) => a - b)) {
    const last = episodes[episodes.length - 1]
    if (last && d - last.end - 1 <= maxGapDays) last.end = d
    else episodes.push({ start: d, end: d })
  }
  return episodes
}

export function buildCalendarMarks(input: CalendarMarksInput): CalendarMarks {
  const config = input.config ?? DEFAULT_CALENDAR_CONFIG
  const confirmed = new Set(input.confirmedDays.map(toDayIndex))
  const denied = new Set(input.deniedDays.map(toDayIndex))
  const days: Record<string, DayKind[]> = {}

  const add = (d: number, kind: DayKind) => {
    if (kind !== 'confirmed' && (confirmed.has(d) || denied.has(d))) return
    const kinds = (days[fromDayIndex(d)] ??= [])
    if (!kinds.includes(kind)) kinds.push(kind)
  }

  confirmed.forEach((d) => add(d, 'confirmed'))

  const episodes = groupEpisodes([...confirmed], config.maxGapDays)
  const last = episodes[episodes.length - 1]
  if (last) {
    const length = input.averagePeriodLength ?? config.defaultPeriodLength
    for (let d = last.start; d <= Math.max(last.start + length - 1, last.end); d++) {
      add(d, 'possiblePeriod')
    }
  }

  const anchor = last
    ? last.start
    : input.fallbackAnchor
      ? toDayIndex(input.fallbackAnchor)
      : null
  if (input.irregular) return { days, status: { kind: 'paused' } }
  if (anchor === null || !input.cycle) return { days, status: { kind: 'none' } }

  // Round once, so a fractional mean never widens the window to 8 days.
  const mean = Math.round(input.cycle.mean)
  const lower = Math.round(input.cycle.lower)
  const upper = Math.round(input.cycle.upper)
  if (mean < 1) return { days, status: { kind: 'none' } }
  if (Math.max(mean - lower, upper - mean) > config.capDays) {
    return { days, status: { kind: 'paused' } }
  }

  const extra = config.ovulationExtraDay ? 1 : 0
  const todayIndex = toDayIndex(input.today)
  const horizonEnd = todayIndex + config.horizonDays
  // Skip cycles whose start range is already over, so a stale anchor never shows past dates.
  let first = anchor
  while (first + upper < todayIndex) first += mean
  for (let offset = first; offset + lower - config.lutealDays <= horizonEnd; offset += mean) {
    for (let d = offset + lower - config.lutealDays; d <= offset + upper - config.lutealDays + extra; d++) {
      add(d, 'ovulation')
    }
    for (let d = offset + lower; d <= offset + upper; d++) {
      add(d, d === offset + mean ? 'likelyStart' : 'possiblePeriod')
    }
  }

  return {
    days,
    status: {
      kind: 'shown',
      likelyStart: fromDayIndex(first + mean),
      rangeStart: fromDayIndex(first + lower),
      rangeEnd: fromDayIndex(first + upper),
      ovulationStart: fromDayIndex(first + lower - config.lutealDays),
      ovulationEnd: fromDayIndex(first + upper - config.lutealDays + extra),
    },
  }
}
