import * as React from 'react'
import { View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { getSelectionAsset } from '../../../resources/assets/friendAssets'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'
import { DEVICE_OPTIONS } from '../options'
import { getDeviceSubcategory, DEVICE_SUBCATEGORIES } from '../constants'
import type { AvatarSelection } from '../types'
import type { UIConfig } from '../../../config/UIConfig'


interface DeviceOptionsProps {
  avatarSelection: AvatarSelection
  onSelectionChange: (selection: AvatarSelection) => void
  avatarConfig: UIConfig['avatarCustomization']
  avatarSelectionConfig: UIConfig['avatarSelection']
  styles: any
}

export const DeviceOptions: React.FC<DeviceOptionsProps> = ({
  avatarSelection,
  onSelectionChange,
  avatarConfig,
  avatarSelectionConfig,
  styles,
}) => {
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  
  const [devicePage, setDevicePage] = React.useState(0)
  const deviceScrollRef = React.useRef<ScrollView>(null)
  const isScrollingProgrammatically = React.useRef(false)

  const itemsPerRow = 3
  const totalItems = DEVICE_OPTIONS.length
  const totalPages = Math.ceil(totalItems / itemsPerRow)
  const maxPage = Math.max(0, totalPages - 1)

  const itemWidth = avatarConfig.optionImageSize?.width || 80
  const itemGap = avatarConfig.optionImageGap || 8
  const containerWidth = itemWidth * itemsPerRow + itemGap * (itemsPerRow - 1)
  const snapInterval = containerWidth + itemGap

  const handlePrevious = React.useCallback(() => {
    if (devicePage > 0) {
      const newPage = devicePage - 1
      const scrollTo = newPage * snapInterval
      isScrollingProgrammatically.current = true
      setDevicePage(newPage)
      deviceScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 300)
    }
  }, [devicePage, snapInterval])

  const handleNext = React.useCallback(() => {
    if (devicePage < maxPage) {
      const newPage = devicePage + 1
      const scrollTo = newPage * snapInterval
      isScrollingProgrammatically.current = true
      setDevicePage(newPage)
      deviceScrollRef.current?.scrollTo({ x: scrollTo, animated: true })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 300)
    }
  }, [devicePage, maxPage, snapInterval])

  const handleScrollEnd = React.useCallback((event: any) => {
    if (isScrollingProgrammatically.current) {
      isScrollingProgrammatically.current = false
      return
    }
    const offsetX = event.nativeEvent.contentOffset.x
    const page = Math.round(offsetX / snapInterval)
    const newPage = Math.max(0, Math.min(page, maxPage))
    if (newPage !== devicePage) {
      setDevicePage(newPage)
    }
  }, [snapInterval, maxPage, devicePage])

  const handleDeviceSelect = React.useCallback((item: string) => {
    const currentDevices = [...avatarSelection.devices]
    const subcategory = getDeviceSubcategory(item)
    const isSelected = currentDevices.includes(item)
    
    if (isSelected) {
      const newDevices = currentDevices.filter(d => d !== item)
      onSelectionChange({ ...avatarSelection, devices: newDevices })
    } else {
      let newDevices = [...currentDevices]
      
      if (subcategory && subcategory !== 'others') {
        const subcategoryItems = DEVICE_SUBCATEGORIES[subcategory] as readonly string[]
        newDevices = newDevices.filter(d => !subcategoryItems.includes(d))
      }
      
      newDevices.push(item)
      onSelectionChange({ ...avatarSelection, devices: newDevices })
    }
  }, [avatarSelection, onSelectionChange])

  const isNextDisabled = devicePage >= maxPage
  const itemHeight = avatarConfig.optionImageSize?.height || 100

  return (
    <View style={styles.optionsContainer}>
      <View style={styles.optionTitleRow}>
        <Text style={styles.optionTitle} enableTranslate={true}>customizer_personal_items</Text>
        <View style={styles.arrowButtons}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={devicePage === 0}
            style={[styles.arrowButton, devicePage === 0 && styles.arrowButtonDisabled]}
            accessibilityLabel={getAccessibilityLabel('previous_page_button')}
            accessibilityRole="button"
          >
            <FontAwesome name="chevron-left" size={16} color={devicePage === 0 ? '#ccc' : '#000000'} />
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
              ref={deviceScrollRef}
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
              {DEVICE_OPTIONS.map((item) => {
                const deviceImage = getSelectionAsset('devices', item)
                const isSelected = avatarSelection.devices.includes(item)
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => handleDeviceSelect(item)}
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
                    accessibilityLabel={getAccessibilityLabel('select_option_button') + `: personal item ${translate(`customizer_device_${item}`)}, ${isSelected ? 'selected' : 'tap to select'}`}
                    accessibilityRole="button"
                  >
                    {deviceImage && (
                      <Image
                        source={deviceImage as any}
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

