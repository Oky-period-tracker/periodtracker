import * as React from 'react'
import { View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { getSelectionAsset } from '../../../resources/assets/friendAssets'
import { scaleHorizontal, scaleDimension } from '../../../utils/responsive'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'
import { SKIN_COLORS, SKIN_COLOR_NAMES, COLORS_PER_PAGE } from '../constants'
import type { AvatarSelection } from '../types'
import type { UIConfig } from '../../../config/UIConfig'

interface BodyOptionsProps {
  avatarSelection: AvatarSelection
  onSelectionChange: (selection: AvatarSelection) => void
  avatarConfig: UIConfig['avatarCustomization']
  avatarSelectionConfig: UIConfig['avatarSelection']
  styles: any
}

export const BodyOptions: React.FC<BodyOptionsProps> = ({
  avatarSelection,
  onSelectionChange,
  avatarConfig,
  avatarSelectionConfig,
  styles,
}) => {
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  
  const [skinColorPage, setSkinColorPage] = React.useState(0)
  const skinColorScrollRef = React.useRef<ScrollView>(null)
  const isScrollingProgrammatically = React.useRef(false)

  const handleSkinColorPrevious = React.useCallback(() => {
    if (skinColorPage > 0) {
      const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
      const spacing = scaleHorizontal(10)
      const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
      const newPage = skinColorPage - 1
      const scrollTo = newPage * containerWidth
      isScrollingProgrammatically.current = true
      setSkinColorPage(newPage)
      skinColorScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 300)
    }
  }, [skinColorPage, avatarConfig])

  const handleSkinColorNext = React.useCallback(() => {
    const maxPage = Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE) - 1
    if (skinColorPage < maxPage) {
      const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
      const spacing = scaleHorizontal(10)
      const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
      const newPage = skinColorPage + 1
      const scrollTo = newPage * containerWidth
      isScrollingProgrammatically.current = true
      setSkinColorPage(newPage)
      skinColorScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 300)
    }
  }, [skinColorPage, avatarConfig])

  const handleSkinColorScroll = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current) return
    const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
    const spacing = scaleHorizontal(10)
    const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
    const offsetX = event.nativeEvent.contentOffset.x
    const totalPages = Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE)
    const page = Math.round(offsetX / containerWidth)
    const newPage = Math.max(0, Math.min(page, totalPages - 1))
    if (newPage !== skinColorPage) {
      setSkinColorPage(newPage)
    }
  }, [avatarConfig, skinColorPage])

  const handleSkinColorScrollEnd = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current) {
      isScrollingProgrammatically.current = false
      return
    }
    const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
    const spacing = scaleHorizontal(10)
    const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
    const offsetX = event.nativeEvent.contentOffset.x
    const totalPages = Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE)
    const page = Math.round(offsetX / containerWidth)
    const newPage = Math.max(0, Math.min(page, totalPages - 1))
    setSkinColorPage(newPage)
  }, [avatarConfig])

  const handleSkinColorSelect = React.useCallback((color: string) => {
    onSelectionChange({ ...avatarSelection, skinColor: color })
  }, [avatarSelection, onSelectionChange])

  const handleBodyTypeSelect = React.useCallback((bodyType: 'body-small' | 'body-medium' | 'body-large') => {
    onSelectionChange({ ...avatarSelection, bodyType })
  }, [avatarSelection, onSelectionChange])

  const maxSkinColorPage = Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE) - 1
  const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
  const spacing = scaleHorizontal(10)
  const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
  const totalItems = SKIN_COLORS.length
  const actualContentWidth = (swatchSize * totalItems) + (spacing * (totalItems - 1))

  return (
    <View style={styles.optionsContainer}>
      <View style={styles.optionSection}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle} enableTranslate={true}>customizer_skin</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={handleSkinColorPrevious}
              disabled={skinColorPage === 0}
              style={[styles.arrowButton, skinColorPage === 0 && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('previous_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-left" size={16} color={skinColorPage === 0 ? '#ccc' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSkinColorNext}
              disabled={skinColorPage >= maxSkinColorPage}
              style={[styles.arrowButton, skinColorPage >= maxSkinColorPage && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('next_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-right" size={16} color={skinColorPage >= maxSkinColorPage ? '#ccc' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: containerWidth, alignSelf: 'center', overflow: 'hidden' }}>
          <ScrollView
            ref={skinColorScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.colorSwatches,
              { paddingRight: 0, minWidth: actualContentWidth }
            ]}
            scrollEventThrottle={16}
            onScroll={handleSkinColorScroll}
            onMomentumScrollEnd={handleSkinColorScrollEnd}
          >
            {SKIN_COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSkinColorSelect(color)}
                style={[
                  {
                    backgroundColor: color,
                    width: swatchSize,
                    height: swatchSize,
                    borderRadius: swatchSize / 2,
                    marginRight: spacing,
                    borderWidth: avatarSelectionConfig.borderWidth || 2,
                    borderColor: 'transparent',
                  },
                  avatarSelection.skinColor === color && { borderColor: '#4CAF50' },
                ]}
                accessibilityLabel={getAccessibilityLabel('select_color_button') + `: skin color ${translate(SKIN_COLOR_NAMES[color] || 'customizer_skin_color_unknown')}, ${avatarSelection.skinColor === color ? 'selected' : 'tap to select'}`}
                accessibilityRole="button"
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={[styles.optionSection, styles.lastOptionSection]}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle} enableTranslate={true}>customizer_body</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.bodyTypeContainer}>
            {(['body-small', 'body-medium', 'body-large'] as const).map((bodyType) => {
              const bodyAsset = getSelectionAsset('body', bodyType)
              const isSelected = avatarSelection.bodyType === bodyType
              const isSvgComponent = bodyAsset && typeof bodyAsset === 'function'
              
              return (
                <TouchableOpacity
                  key={bodyType}
                  onPress={() => handleBodyTypeSelect(bodyType)}
                  style={[
                    styles.bodyTypeOption,
                    isSelected && styles.bodyTypeOptionSelected,
                  ]}
                  accessibilityLabel={getAccessibilityLabel('select_option_button') + `: body type ${bodyType}, ${isSelected ? 'selected' : 'tap to select'}`}
                  accessibilityRole="button"
                >
                  {bodyAsset ? (
                    isSvgComponent ? (
                      React.createElement(bodyAsset as React.ComponentType<any>, {
                        width: avatarConfig.bodyTypeSize.width - 4,
                        height: avatarConfig.bodyTypeSize.height - 4,
                      })
                    ) : (
                      <Image
                        source={bodyAsset as any}
                        style={styles.bodyTypeImage}
                        resizeMode="contain"
                      />
                    )
                  ) : null}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
    </View>
  )
}

