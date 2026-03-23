import * as React from 'react'
import { View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { getSelectionAsset } from '../../../resources/assets/friendAssets'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'
import { CLOTHING_OPTIONS } from '../options'
import type { AvatarSelection } from '../types'
import type { UIConfig } from '../../../config/UIConfig'


interface ClothingOptionsProps {
  avatarSelection: AvatarSelection
  onSelectionChange: (selection: AvatarSelection) => void
  avatarConfig: UIConfig['avatarCustomization']
  avatarSelectionConfig: UIConfig['avatarSelection']
  styles: any
}

export const ClothingOptions: React.FC<ClothingOptionsProps> = ({
  avatarSelection,
  onSelectionChange,
  avatarConfig,
  avatarSelectionConfig,
  styles,
}) => {
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  
  const [clothingPage, setClothingPage] = React.useState(0)
  const clothingScrollRef = React.useRef<ScrollView>(null)
  const isScrollingProgrammatically = React.useRef(false)

  const itemsPerRow = 3
  const totalItems = CLOTHING_OPTIONS.length
  const totalPages = Math.ceil(totalItems / itemsPerRow)
  const maxPage = Math.max(0, totalPages - 1)

  const itemWidth = avatarConfig.optionImageSize?.width || 80
  const itemGap = avatarConfig.optionImageGap || 8
  const containerWidth = itemWidth * itemsPerRow + itemGap * (itemsPerRow - 1)
  const snapInterval = containerWidth + itemGap

  const handlePrevious = React.useCallback(() => {
    if (clothingPage > 0) {
      const newPage = clothingPage - 1
      const scrollTo = newPage * snapInterval
      isScrollingProgrammatically.current = true
      setClothingPage(newPage)
      clothingScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 300)
    }
  }, [clothingPage, snapInterval])

  const handleNext = React.useCallback(() => {
    if (clothingPage < maxPage) {
      const newPage = clothingPage + 1
      const scrollTo = newPage * snapInterval
      isScrollingProgrammatically.current = true
      setClothingPage(newPage)
      clothingScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 300)
    }
  }, [clothingPage, maxPage, snapInterval])

  const handleScrollEnd = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current) {
      isScrollingProgrammatically.current = false
      return
    }
    const offsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / snapInterval)
    const newPage = Math.max(0, Math.min(page, maxPage))
    if (newPage !== clothingPage) {
      setClothingPage(newPage)
    }
  }, [snapInterval, maxPage, clothingPage])

  const handleItemSelect = React.useCallback((item: string) => {
    const isSelected = avatarSelection.clothing === item
    onSelectionChange({
      ...avatarSelection,
      clothing: isSelected ? null : item
    })
  }, [avatarSelection, onSelectionChange])

  const isNextDisabled = clothingPage >= maxPage
  const itemHeight = avatarConfig.optionImageSize?.height || 100

  return (
    <View style={styles.optionsContainer}>
      <View style={styles.optionTitleRow}>
        <Text style={styles.optionTitle} enableTranslate={true}>customizer_clothes</Text>
        <View style={styles.arrowButtons}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={clothingPage === 0}
            style={[styles.arrowButton, clothingPage === 0 && styles.arrowButtonDisabled]}
            accessibilityLabel={getAccessibilityLabel('previous_page_button')}
            accessibilityRole="button"
          >
            <FontAwesome name="chevron-left" size={16} color={clothingPage === 0 ? '#ccc' : '#000000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={isNextDisabled}
            style={[styles.arrowButton, isNextDisabled && styles.arrowButtonDisabled]}
            accessibilityLabel={getAccessibilityLabel('next_page_button')}
            accessibilityRole="button"
          >
            <FontAwesome name="chevron-right" size={16} color={isNextDisabled ? '#ccc' : '#000000'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.bodyTypeContainer}>
          <View style={{ width: containerWidth, overflow: 'hidden', alignSelf: 'center' }}>
            <ScrollView
              ref={clothingScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={snapInterval}
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
                  gap: itemGap,
                }
              ]}
              onMomentumScrollEnd={handleScrollEnd}
            >
            {CLOTHING_OPTIONS.map((item) => {
              const clothingImage = getSelectionAsset('clothing', item)
              const isSelected = avatarSelection.clothing === item
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleItemSelect(item)}
                  style={[
                    {
                      width: itemWidth,
                      height: itemHeight,
                      borderRadius: avatarConfig.spacing.small,
                      borderWidth: avatarSelectionConfig.borderWidth || 2,
                      borderColor: 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    isSelected && { borderColor: '#4CAF50' },
                  ]}
                  accessibilityLabel={getAccessibilityLabel('select_option_button') + `: clothing ${translate(`customizer_clothing_${item}`)}, ${isSelected ? 'selected' : 'tap to select'}`}
                  accessibilityRole="button"
                >
                  {clothingImage && (
                    <Image
                      source={clothingImage as any}
                      style={{
                        width: itemWidth * 0.96,
                        height: itemHeight * 0.8,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              )
            })}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  )
}

