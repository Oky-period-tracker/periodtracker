import * as React from 'react'
import { View, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Text } from '../../../components/Text'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'

interface FirstVisitTooltipProps {
  visible: boolean
  onClose: () => void
  styles: any
}

export const FirstVisitTooltip: React.FC<FirstVisitTooltipProps> = ({
  visible,
  onClose,
  styles,
}) => {
  const getAccessibilityLabel = useAccessibilityLabel()

  if (!visible) return null

  return (
    <View style={styles.firstVisitTooltip}>
      <View style={styles.tooltipContent}>
        <Text style={styles.tooltipText} enableTranslate={true}>
          customizer_first_visit_tooltip
        </Text>
        <TouchableOpacity
          style={styles.tooltipCloseButton}
          onPress={onClose}
          accessibilityLabel={getAccessibilityLabel('close_tooltip_button')}
          accessibilityRole="button"
        >
          <FontAwesome name="close" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={[styles.tooltipTriangle, { borderTopColor: '#fff' }]} />
    </View>
  )
}

