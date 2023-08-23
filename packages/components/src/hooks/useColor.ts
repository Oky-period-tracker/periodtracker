import { useTheme } from '../components/context/ThemeContext'

export function useColor(isOnPeriod, isOnFertile) {
  const { fertileColor, periodColor, nonPeriodColor, periodNotVerifiedColor } = useTheme()
  if (isOnPeriod) return periodColor
  if (isOnFertile) return fertileColor
  return nonPeriodColor
}
