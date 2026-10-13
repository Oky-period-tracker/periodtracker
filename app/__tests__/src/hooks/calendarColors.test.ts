// app/__tests__/src/hooks/calendarColors.test.ts
import { calendarColors } from '../../../src/hooks/useColor'

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe.each(['light', 'dark'] as const)('%s calendar colours', (scheme) => {
  const c = calendarColors[scheme]
  it.each([
    ['confirmedText', 'confirmed'],
    ['ringText', 'ringCenter'],
    ['periodText', 'periodWash'],
    ['ovulationText', 'ovulationWash'],
    ['messageTitle', 'messageBackground'],
    ['messageBody', 'messageBackground'],
  ] as const)('%s on %s is readable', (fg, bg) => {
    expect(contrast(c[fg], c[bg])).toBeGreaterThanOrEqual(3)
  })
})

it('light mode matches the prototype', () => {
  expect(calendarColors.light).toMatchObject({
    confirmed: '#D9508A',
    periodWash: '#F9D2E3',
    periodText: '#B8336F',
    ovulationWash: '#CDEAF5',
    ovulationText: '#1D6A9A',
  })
})

it('dark ring centre is the dark calendar background, not white', () => {
  expect(calendarColors.dark.ringCenter).toBe('#1B1B1F')
})
