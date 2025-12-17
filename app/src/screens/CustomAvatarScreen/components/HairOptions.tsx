import * as React from 'react'
import { View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { getSelectionAsset } from '../../../resources/assets/friendAssets'
import { scaleHorizontal, scaleDimension } from '../../../utils/responsive'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'
import { useResponsive } from '../../../contexts/ResponsiveContext'
import { HAIR_COLORS, HAIR_COLOR_NAMES, COLORS_PER_PAGE } from '../constants'
import { HAIR_OPTIONS } from '../options'
import type { AvatarSelection } from '../types'
import type { UIConfig } from '../../../config/UIConfig'

interface HairOptionsProps {
  avatarSelection: AvatarSelection
  onSelectionChange: (selection: AvatarSelection) => void
  avatarConfig: UIConfig['avatarCustomization']
  avatarSelectionConfig: UIConfig['avatarSelection']
  styles: any
}

export const HairOptions: React.FC<HairOptionsProps> = ({
  avatarSelection,
  onSelectionChange,
  avatarConfig,
  avatarSelectionConfig,
  styles,
}) => {
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  const { width: screenWidth } = useResponsive()
  
  const [hairColorPage, setHairColorPage] = React.useState(0)
  const [hairPage, setHairPage] = React.useState(0)
  const hairColorScrollRef = React.useRef<ScrollView>(null)
  const hairStyleScrollRef = React.useRef<ScrollView>(null)
  const isScrollingProgrammatically = React.useRef({ hair: false, hairStyle: false })

  // Hair color handlers
  const handleHairColorPrevious = React.useCallback(() => {
    if (hairColorPage > 0) {
      const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
      const spacing = scaleHorizontal(10)
      const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
      const newPage = hairColorPage - 1
      const scrollTo = newPage * containerWidth
      isScrollingProgrammatically.current.hair = true
      setHairColorPage(newPage)
      hairColorScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.hair = false
      }, 300)
    }
  }, [hairColorPage, avatarConfig])

  const handleHairColorNext = React.useCallback(() => {
    const maxPage = Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE) - 1
    if (hairColorPage < maxPage) {
      const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
      const spacing = scaleHorizontal(10)
      const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
      const newPage = hairColorPage + 1
      const scrollTo = newPage * containerWidth
      isScrollingProgrammatically.current.hair = true
      setHairColorPage(newPage)
      hairColorScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.hair = false
      }, 300)
    }
  }, [hairColorPage, avatarConfig])

  const handleHairColorScroll = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current.hair) return
    const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
    const spacing = scaleHorizontal(10)
    const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
    const offsetX = event.nativeEvent.contentOffset.x
    const totalPages = Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE)
    const page = Math.round(offsetX / containerWidth)
    const newPage = Math.max(0, Math.min(page, totalPages - 1))
    if (newPage !== hairColorPage) {
      setHairColorPage(newPage)
    }
  }, [avatarConfig, hairColorPage])

  const handleHairColorScrollEnd = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current.hair) {
      isScrollingProgrammatically.current.hair = false
      return
    }
    const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
    const spacing = scaleHorizontal(10)
    const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
    const offsetX = event.nativeEvent.contentOffset.x
    const totalPages = Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE)
    const page = Math.round(offsetX / containerWidth)
    const newPage = Math.max(0, Math.min(page, totalPages - 1))
    setHairColorPage(newPage)
  }, [avatarConfig])

  const handleHairColorSelect = React.useCallback((color: string) => {
    onSelectionChange({ ...avatarSelection, hairColor: color })
  }, [avatarSelection, onSelectionChange])

  const itemsPerRow = 3
  const totalHairItems = HAIR_OPTIONS.length
  const totalPages = Math.ceil(totalHairItems / itemsPerRow)
  const maxHairStylePage = Math.max(0, totalPages - 1)
  
  const hairItemWidth = avatarConfig.optionImageSize.width
  const hairItemGap = avatarConfig.optionImageGap || 8
  const hairContainerWidth = hairItemWidth * itemsPerRow + hairItemGap * (itemsPerRow - 1)
  const hairSnapInterval = hairContainerWidth + hairItemGap

  const handleHairStylePrevious = React.useCallback(() => {
    if (hairPage > 0) {
      const newPage = hairPage - 1
      const scrollTo = newPage * hairSnapInterval
      isScrollingProgrammatically.current.hairStyle = true
      setHairPage(newPage)
      hairStyleScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.hairStyle = false
      }, 300)
    }
  }, [hairPage, hairSnapInterval])

  const handleHairStyleNext = React.useCallback(() => {
    if (hairPage < maxHairStylePage) {
      const newPage = hairPage + 1
      const scrollTo = newPage * hairSnapInterval
      isScrollingProgrammatically.current.hairStyle = true
      setHairPage(newPage)
      hairStyleScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current.hairStyle = false
      }, 300)
    }
  }, [hairPage, maxHairStylePage, hairSnapInterval])

  const handleHairStyleScrollEnd = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current.hairStyle) {
      isScrollingProgrammatically.current.hairStyle = false
      return
    }
    const offsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / hairSnapInterval)
    const newPage = Math.max(0, Math.min(page, maxHairStylePage))
    if (newPage !== hairPage) {
      setHairPage(newPage)
    }
  }, [hairSnapInterval, maxHairStylePage, hairPage])

  const handleHairStyleSelect = React.useCallback((item: string) => {
    const newSelection = { ...avatarSelection, hairStyle: item }
    if (item === '00') {
      newSelection.hairColor = undefined
    } else if (!newSelection.hairColor) {
      newSelection.hairColor = HAIR_COLORS[0]
    }
    onSelectionChange(newSelection)
  }, [avatarSelection, onSelectionChange])

  const maxHairColorPage = Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE) - 1
  const isHairStyleNextDisabled = hairPage >= maxHairStylePage
  const swatchSize = scaleDimension(avatarConfig.colorSwatchSize - 4)
  const spacing = scaleHorizontal(10)
  const containerWidth = (swatchSize * COLORS_PER_PAGE) + (spacing * (COLORS_PER_PAGE - 1))
  const totalItems = HAIR_COLORS.length
  const actualContentWidth = (swatchSize * totalItems) + (spacing * (totalItems - 1))

  return (
    <View style={styles.optionsContainer}>
      <View style={styles.optionSection}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle} enableTranslate={true}>customizer_hair_color</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={handleHairColorPrevious}
              disabled={hairColorPage === 0}
              style={[styles.arrowButton, hairColorPage === 0 && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('previous_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-left" size={16} color={hairColorPage === 0 ? '#ccc' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleHairColorNext}
              disabled={hairColorPage >= maxHairColorPage}
              style={[styles.arrowButton, hairColorPage >= maxHairColorPage && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('next_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-right" size={16} color={hairColorPage >= maxHairColorPage ? '#ccc' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: containerWidth, alignSelf: 'center', overflow: 'hidden' }}>
          <ScrollView
            ref={hairColorScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.colorSwatches,
              { paddingRight: 0, minWidth: actualContentWidth }
            ]}
            scrollEventThrottle={16}
            onScroll={handleHairColorScroll}
            onMomentumScrollEnd={handleHairColorScrollEnd}
          >
            {HAIR_COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleHairColorSelect(color)}
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
                  avatarSelection.hairColor === color && { borderColor: '#4CAF50' },
                ]}
                accessibilityLabel={getAccessibilityLabel('select_color_button') + `: hair color ${translate(HAIR_COLOR_NAMES[color] || 'customizer_hair_color_unknown')}, ${avatarSelection.hairColor === color ? 'selected' : 'tap to select'}`}
                accessibilityRole="button"
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={[styles.optionSection, styles.lastOptionSection]}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle} enableTranslate={true}>customizer_hairstyle</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={handleHairStylePrevious}
              disabled={hairPage === 0}
              style={[styles.arrowButton, hairPage === 0 && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('previous_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-left" size={16} color={hairPage === 0 ? '#ccc' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleHairStyleNext}
              disabled={isHairStyleNextDisabled}
              style={[styles.arrowButton, isHairStyleNextDisabled && styles.arrowButtonDisabled]}
              accessibilityLabel={getAccessibilityLabel('next_page_button')}
              accessibilityRole="button"
            >
              <FontAwesome name="chevron-right" size={16} color={isHairStyleNextDisabled ? '#ccc' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.bodyTypeContainer}>
            <View style={{ width: hairContainerWidth, overflow: 'hidden', alignSelf: 'center' }}>
              <ScrollView
                ref={hairStyleScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={hairSnapInterval}
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
                    gap: hairItemGap,
                  }
                ]}
                onMomentumScrollEnd={handleHairStyleScrollEnd}
              >
            {HAIR_OPTIONS.map((item) => {
              const hairAsset = getSelectionAsset('hair', item)
              const isSelected = avatarSelection.hairStyle === item
              const isSvgComponent = hairAsset && typeof hairAsset === 'function'
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleHairStyleSelect(item)}
                  style={[
                    styles.hairstyleOption,
                    isSelected && styles.hairstyleOptionSelected,
                  ]}
                  accessibilityLabel={getAccessibilityLabel('select_option_button') + `: hairstyle ${item}, ${isSelected ? 'selected' : 'tap to select'}`}
                  accessibilityRole="button"
                >
                  {hairAsset && isSvgComponent ? (
                    React.createElement(hairAsset as React.ComponentType<any>, {
                      width: avatarConfig.optionImageSize.width - 4,
                      height: avatarConfig.optionImageSize.height - 4,
                    })
                  ) : hairAsset ? (
                    <Image
                      source={hairAsset as any}
                      style={styles.hairstyleImage}
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

