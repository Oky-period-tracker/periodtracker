import * as React from 'react'
import { View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { getSelectionAsset } from '../../../resources/assets/friendAssets'
import { scaleHorizontal, scaleDimension } from '../../../utils/responsive'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'
import { EYE_COLORS, EYE_COLOR_NAMES, COLORS_PER_PAGE } from '../constants'
import { EYE_OPTIONS } from '../options'
import type { AvatarSelection } from '../types'
import type { UIConfig } from '../../../config/UIConfig'

interface EyesOptionsProps {
  avatarSelection: AvatarSelection
  onSelectionChange: (selection: AvatarSelection) => void
  avatarConfig: UIConfig['avatarCustomization']
  avatarSelectionConfig: UIConfig['avatarSelection']
  styles: any
}

export const EyesOptions: React.FC<EyesOptionsProps> = ({
  avatarSelection,
  onSelectionChange,
  avatarConfig,
  avatarSelectionConfig,
  styles,
}) => {
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  
  const [eyeColorPage, setEyeColorPage] = React.useState(0)
  const [eyePage, setEyePage] = React.useState(0)
  const eyeColorScrollRef = React.useRef<ScrollView>(null)
  const eyeShapeScrollRef = React.useRef<ScrollView>(null)
  const isScrollingProgrammatically = React.useRef({ eye: false, eyeShape: false })

  // Eye color handlers
  const handleEyeColorPrevious = React.useCallback(() => {
    if (eyeColorPage > 0) {
      const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
      const spacing = scaleHorizontal(10)
      const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
      const newPage = eyeColorPage - 1
      const scrollTo = newPage * containerWidth
      isScrollingProgrammatically.current.eye = true
      setEyeColorPage(newPage)
      eyeColorScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.eye = false
      }, 300)
    }
  }, [eyeColorPage, avatarConfig])

  const handleEyeColorNext = React.useCallback(() => {
    const maxPage = Math.ceil(EYE_COLORS.length / COLORS_PER_PAGE) - 1
    if (eyeColorPage < maxPage) {
      const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
      const spacing = scaleHorizontal(10)
      const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
      const newPage = eyeColorPage + 1
      const scrollTo = newPage * containerWidth
      isScrollingProgrammatically.current.eye = true
      setEyeColorPage(newPage)
      eyeColorScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.eye = false
      }, 300)
    }
  }, [eyeColorPage, avatarConfig])

  const handleEyeColorScroll = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current.eye) return
    const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
    const spacing = scaleHorizontal(10)
    const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
    const offsetX = event.nativeEvent.contentOffset.x
    const totalPages = Math.ceil(EYE_COLORS.length / COLORS_PER_PAGE)
    const page = Math.round(offsetX / containerWidth)
    const newPage = Math.max(0, Math.min(page, totalPages - 1))
    if (newPage !== eyeColorPage) {
      setEyeColorPage(newPage)
    }
  }, [avatarConfig, eyeColorPage])

  const handleEyeColorScrollEnd = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current.eye) {
      isScrollingProgrammatically.current.eye = false
      return
    }
    const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
    const spacing = scaleHorizontal(10)
    const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
    const offsetX = event.nativeEvent.contentOffset.x
    const totalPages = Math.ceil(EYE_COLORS.length / COLORS_PER_PAGE)
    const page = Math.round(offsetX / containerWidth)
    const newPage = Math.max(0, Math.min(page, totalPages - 1))
    setEyeColorPage(newPage)
  }, [avatarConfig])

  const handleEyeColorSelect = React.useCallback((color: string) => {
    onSelectionChange({ ...avatarSelection, eyeColor: color })
  }, [avatarSelection, onSelectionChange])

  const itemsPerRow = 3
  const totalEyeItems = EYE_OPTIONS.length
  const totalPages = Math.ceil(totalEyeItems / itemsPerRow)
  const maxEyeShapePage = Math.max(0, totalPages - 1)
  
  const eyeItemWidth = avatarConfig.optionImageSize.width
  const eyeItemGap = avatarConfig.optionImageGap || 8
  const eyeContainerWidth = eyeItemWidth * itemsPerRow + eyeItemGap * (itemsPerRow - 1)
  const eyeSnapInterval = eyeContainerWidth + eyeItemGap

  const handleEyeShapePrevious = React.useCallback(() => {
    if (eyePage > 0) {
      const newPage = eyePage - 1
      const scrollTo = newPage * eyeSnapInterval
      isScrollingProgrammatically.current.eyeShape = true
      setEyePage(newPage)
      eyeShapeScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.eyeShape = false
      }, 300)
    }
  }, [eyePage, eyeSnapInterval])

  const handleEyeShapeNext = React.useCallback(() => {
    if (eyePage < maxEyeShapePage) {
      const newPage = eyePage + 1
      const scrollTo = newPage * eyeSnapInterval
      isScrollingProgrammatically.current.eyeShape = true
      setEyePage(newPage)
      eyeShapeScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.eyeShape = false
      }, 300)
    }
  }, [eyePage, maxEyeShapePage, eyeSnapInterval])

  const handleEyeShapeScrollEnd = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current.eyeShape) {
      isScrollingProgrammatically.current.eyeShape = false
      return
    }
    const offsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / eyeSnapInterval)
    const newPage = Math.max(0, Math.min(page, maxEyeShapePage))
    if (newPage !== eyePage) {
      setEyePage(newPage)
    }
  }, [eyeSnapInterval, maxEyeShapePage, eyePage])

  const handleEyeShapeSelect = React.useCallback((item: string) => {
    onSelectionChange({ ...avatarSelection, eyeShape: item })
  }, [avatarSelection, onSelectionChange])

  const maxEyeColorPage = Math.ceil(EYE_COLORS.length / COLORS_PER_PAGE) - 1
  const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
  const spacing = scaleHorizontal(10)
  const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
  const totalItems = EYE_COLORS.length
  const actualContentWidth = (swatchSize * totalItems) + (spacing * (totalItems - 1))

  return (
    <View style={styles.optionsContainer}>
      <View style={styles.optionSection}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle} enableTranslate={true}>customizer_eye_color</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={handleEyeColorPrevious}
              disabled={eyeColorPage === 0}
              style={[styles.arrowButton, eyeColorPage === 0 && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('previous_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-left" size={16} color={eyeColorPage === 0 ? '#ccc' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEyeColorNext}
              disabled={eyeColorPage >= maxEyeColorPage}
              style={[styles.arrowButton, eyeColorPage >= maxEyeColorPage && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('next_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-right" size={16} color={eyeColorPage >= maxEyeColorPage ? '#ccc' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: containerWidth, alignSelf: 'center', overflow: 'hidden' }}>
          <ScrollView
            ref={eyeColorScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.colorSwatches,
              { paddingRight: 0, minWidth: actualContentWidth }
            ]}
            scrollEventThrottle={16}
            onScroll={handleEyeColorScroll}
            onMomentumScrollEnd={handleEyeColorScrollEnd}
          >
            {EYE_COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEyeColorSelect(color)}
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
                  avatarSelection.eyeColor === color && { borderColor: '#4CAF50' },
                ]}
                accessibilityLabel={getAccessibilityLabel('select_color_button') + `: eye color ${translate(EYE_COLOR_NAMES[color] || 'customizer_eye_color_unknown')}, ${avatarSelection.eyeColor === color ? 'selected' : 'tap to select'}`}
                accessibilityRole="button"
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={[styles.optionSection, styles.lastOptionSection]}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle} enableTranslate={true}>customizer_eye_shape</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={handleEyeShapePrevious}
              disabled={eyePage === 0}
              style={[styles.arrowButton, eyePage === 0 && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('previous_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-left" size={16} color={eyePage === 0 ? '#ccc' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEyeShapeNext}
              disabled={eyePage >= maxEyeShapePage}
              style={[styles.arrowButton, eyePage >= maxEyeShapePage && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('next_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-right" size={16} color={eyePage >= maxEyeShapePage ? '#ccc' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.bodyTypeContainer}>
            <View style={{ width: eyeContainerWidth, overflow: 'hidden', alignSelf: 'center' }}>
              <ScrollView
                ref={eyeShapeScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={eyeSnapInterval}
                snapToAlignment="start"
                decelerationRate="fast"
                pagingEnabled={false}
                contentContainerStyle={[
                  styles.paginatedOptions,
                  styles.lastOptionSection,
                  { 
                    flexWrap: 'nowrap', 
                    paddingRight: 0, 
                    paddingLeft: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    overflow: 'visible',
                    justifyContent: 'flex-start',
                    gap: eyeItemGap,
                  }
                ]}
                onMomentumScrollEnd={handleEyeShapeScrollEnd}
              >
            {EYE_OPTIONS.map((item) => {
              const eyeAsset = getSelectionAsset('eyes', item)
              const isSelected = avatarSelection.eyeShape === item
              const isSvgComponent = eyeAsset && typeof eyeAsset === 'function'
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleEyeShapeSelect(item)}
                  style={[
                    styles.eyeShapeOption,
                    isSelected && styles.eyeShapeOptionSelected,
                  ]}
                  accessibilityLabel={getAccessibilityLabel('select_option_button') + `: eye shape ${item}, ${isSelected ? 'selected' : 'tap to select'}`}
                  accessibilityRole="button"
                >
                  {eyeAsset && isSvgComponent ? (
                    React.createElement(eyeAsset as React.ComponentType<any>, {
                      width: avatarConfig.optionImageSize.width - 4,
                      height: avatarConfig.optionImageSize.width - 4,
                    })
                  ) : eyeAsset ? (
                    <Image
                      source={eyeAsset as any}
                      style={styles.eyeShapeImage}
                      resizeMode="contain"
                    />
                  ) : null}
                </TouchableOpacity>
              )
            })}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

