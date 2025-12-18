import * as React from 'react'
import { View, TouchableOpacity, Image, FlatList, ImageSourcePropType, ScrollView } from 'react-native'
import { scaleHorizontal, scaleDimension } from '../../utils/responsive'
import { Screen } from '../../components/Screen'
import { Text } from '../../components/Text'
import { Button } from '../../components/Button'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useColor } from '../../hooks/useColor'
import { Modal } from '../../components/Modal'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useSelector } from '../../redux/useSelector'
import { appTokenSelector, currentUserSelector } from '../../redux/selectors'
import { httpClient } from '../../services/HttpClient'
import { useDispatch } from 'react-redux'
import { editUser, setAvatarWithValidation } from '../../redux/actions'
import { getSelectionAsset, getPreviewAsset, getCategoryIcon, BodySize } from '../../resources/assets/friendAssets'
import { AvatarPreview } from '../../components/AvatarPreview'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { responsiveConfig } from '../../config/UIConfig'
import { AvatarTutorialModal } from './components/AvatarTutorialModal'
import { CategoryTabs } from './components/CategoryTabs'
import { AvatarNamingModal } from './components/AvatarNamingModal'
import { FirstVisitTooltip } from './components/FirstVisitTooltip'
import { createCustomAvatarStyles } from './CustomAvatarScreen.styles'
import { assets } from '../../resources/assets'
import { globalStyles } from '../../config/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslate } from '../../hooks/useTranslate'
import { analytics } from '../../services/firebase'
import { useAccessibilityLabel } from '../../hooks/useAccessibilityLabel'
import { BodyOptions } from './components/BodyOptions'
import { HairOptions } from './components/HairOptions'
import { EyesOptions } from './components/EyesOptions'
import { ClothingOptions } from './components/ClothingOptions'
import { DeviceOptions } from './components/DeviceOptions'
import { EYE_COLORS, SKIN_COLORS, HAIR_COLORS } from './constants'
import type { Category } from './types'

interface AvatarSelection {
  bodyType: 'body-small' | 'body-medium' | 'body-large'
  skinColor?: string | undefined
  hairStyle: string | null
  hairColor?: string | undefined
  eyeShape: string | null
  eyeColor?: string | undefined
  smile?: string | undefined
  clothing: string | null
  devices: string[]
  name: string
}

const DEFAULT_AVATAR: AvatarSelection = {
  bodyType: 'body-small',
  skinColor: SKIN_COLORS[0],
  hairStyle: '01',
  hairColor: HAIR_COLORS[0],
  eyeShape: '00',
  eyeColor: EYE_COLORS[0],
  smile: 'smile',
  clothing: null,
  devices: [],
  name: 'Friend',
}

const replaceSkinColor = (element: any, skinColor: string): any => {
  if (!element) return element
  
  if (React.isValidElement(element)) {
    const props: any = element.props || {}
    const newProps: any = { ...props }
    
    const pathData = props.d || ''
    const isEyePupil = (() => {
      if (!pathData) return false
      if (!/^M(?:64|43)/.test(pathData)) return false
      
      const yMatch = pathData.match(/M\d+\.\d+\s+(\d+\.\d+)/)
      if (yMatch) {
        const y = parseFloat(yMatch[1])
        const isMiddleY = y >= 50 && y <= 60
        const isShortPath = pathData.length < 250
        return isMiddleY && isShortPath
      }
      return false
    })()
    
    if (isEyePupil) {
      newProps.fill = '#111111'
      newProps.stroke = '#111111'
      if (newProps.color) {
        delete newProps.color
      }
    } else {
      if (props.fill === '#F1B98C' || props.fill === 'rgb(241, 185, 140)') {
        newProps.fill = skinColor
      }
      if (props.stroke === '#F1B98C' || props.stroke === 'rgb(241, 185, 140)') {
        newProps.stroke = skinColor
      }
    }
    
    let children = props.children
    if (children) {
      if (Array.isArray(children)) {
        children = children.map((child: any) => replaceSkinColor(child, skinColor))
      } else {
        children = replaceSkinColor(children, skinColor)
      }
      newProps.children = children
    }
    
    return React.cloneElement(element, newProps)
  }
  
  if (Array.isArray(element)) {
    return element.map((item: any) => replaceSkinColor(item, skinColor))
  }
  
  return element
}

const CustomAvatarScreen: ScreenComponent<'CustomAvatar'> = ({ navigation }) => {
  const { backgroundColor, palette } = useColor()
  const currentUser = useSelector(currentUserSelector)
  const appToken = useSelector(appTokenSelector)
  const dispatch = useDispatch()
  const { UIConfig, width } = useResponsive()
  const insets = useSafeAreaInsets()
  const [tutorialModalVisible, setTutorialModalVisible] = React.useState(false)
  const [firstVisitTooltipVisible, setFirstVisitTooltipVisible] = React.useState(false)
  const avatarConfig = UIConfig.avatarCustomization
  const avatarSelectionConfig = UIConfig.avatarSelection
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  
  const styles = React.useMemo(() => createCustomAvatarStyles(avatarConfig, avatarSelectionConfig, width), [avatarConfig, avatarSelectionConfig, width])
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
    
    const parent = navigation.getParent()
    if (parent) {
      parent.setOptions({
        tabBarStyle: {
          position: 'absolute',
          display: 'none',
        },
      })
    }
  }, [navigation])
  
  const route = useRoute()
  const routeParams = route.params as { openNameModal?: boolean } | undefined
  
  const hasOpenedNameModalRef = React.useRef(false)
  
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent()
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            position: 'absolute',
            display: 'none',
          },
        })
      }
      
      hasOpenedNameModalRef.current = false
      
      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: undefined,
          })
        }
        hasOpenedNameModalRef.current = false
      }
    }, [navigation])
  )
  
  React.useEffect(() => {
    if (routeParams?.openNameModal && !hasOpenedNameModalRef.current) {
      setTimeout(() => {
        setNameModalVisible(true)
        setTempName(currentUser?.avatar?.name || 'Friend')
        hasOpenedNameModalRef.current = true
        navigation.setParams({ openNameModal: undefined })
      }, 100)
    }
  }, [routeParams?.openNameModal, currentUser?.avatar?.name, navigation])
  
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        hasOpenedNameModalRef.current = false
      }
    }, [])
  )
  React.useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasVisited = await AsyncStorage.getItem('customizer_has_visited')
        if (!hasVisited) {
          setFirstVisitTooltipVisible(true)
          await AsyncStorage.setItem('customizer_has_visited', 'true')
          
          analytics?.().logEvent('CUSTOM_AVATAR_UNLOCK', {
            userId: currentUser?.id || null,
          })
        }
      } catch (error) {
        // Silently handle error
      }
    }
    checkFirstVisit()
  }, [currentUser?.id])

  const handleCloseTooltip = () => {
    setFirstVisitTooltipVisible(false)
  }

  const handleExit = () => {
    const parent = navigation.getParent()
    if (parent) {
      parent.navigate('home')
    } else if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('home' as any)
    }
  }

  const [selectedCategory, setSelectedCategory] = React.useState<Category>('body')
  
  const [avatarSelection, setAvatarSelection] = React.useState<AvatarSelection>(() => {
    let hasCustomAvatarParts = false
    if (currentUser?.avatar) {
      const avatar = currentUser.avatar
      const hasBody = avatar.body !== null && avatar.body !== undefined
      const hasHair = avatar.hair !== null && avatar.hair !== undefined
      const hasEyes = avatar.eyes !== null && avatar.eyes !== undefined
      const hasSkinColor = avatar.skinColor !== null && avatar.skinColor !== undefined
      const hasHairColor = avatar.hairColor !== null && avatar.hairColor !== undefined
      const hasEyeColor = avatar.eyeColor !== null && avatar.eyeColor !== undefined
      const hasClothing = avatar.clothing !== null && avatar.clothing !== undefined
      const hasDevices = avatar.devices !== null && avatar.devices !== undefined
      hasCustomAvatarParts = hasBody || hasHair || hasEyes || hasSkinColor || hasHairColor || hasEyeColor || hasClothing || hasDevices
    }
    
    if (!hasCustomAvatarParts) {
      return {
        bodyType: 'body-medium',
        skinColor: undefined,
        hairStyle: null,
        hairColor: undefined,
        eyeShape: '00',
        eyeColor: EYE_COLORS[0],
        smile: 'smile',
        clothing: null,
        devices: [],
        name: currentUser?.avatar?.name || DEFAULT_AVATAR.name,
      }
    }
    
    if (currentUser?.avatar) {
      let bodyType: 'body-small' | 'body-medium' | 'body-large' = DEFAULT_AVATAR.bodyType
      if (currentUser.avatar.body) {
        if (currentUser.avatar.body === 'body1' || currentUser.avatar.body === 'body-small') {
          bodyType = 'body-small'
        } else if (currentUser.avatar.body === 'body2' || currentUser.avatar.body === 'body-medium') {
          bodyType = 'body-medium'
        } else if (currentUser.avatar.body === 'body3' || currentUser.avatar.body === 'body-large') {
          bodyType = 'body-large'
        }
      }
      
      const hasHairStyle = currentUser.avatar.hair !== null && currentUser.avatar.hair !== undefined
      const hasEyeShape = currentUser.avatar.eyes !== null && currentUser.avatar.eyes !== undefined
      const hasSkinColor = currentUser.avatar.skinColor !== null && currentUser.avatar.skinColor !== undefined
      const hasHairColor = currentUser.avatar.hairColor !== null && currentUser.avatar.hairColor !== undefined
      const hasEyeColor = currentUser.avatar.eyeColor !== null && currentUser.avatar.eyeColor !== undefined
      
      return {
        bodyType: bodyType || DEFAULT_AVATAR.bodyType,
        skinColor: hasSkinColor ? currentUser.avatar.skinColor! : undefined,
        hairStyle: hasHairStyle ? currentUser.avatar.hair! : null,
        hairColor: hasHairColor ? currentUser.avatar.hairColor! : undefined,
        eyeShape: hasEyeShape ? currentUser.avatar.eyes! : null,
        eyeColor: hasEyeColor ? currentUser.avatar.eyeColor! : undefined,
        smile: currentUser.avatar.smile || 'smile',
        clothing: currentUser.avatar.clothing || null,
        devices: (() => {
          const devices = currentUser.avatar.devices
          if (!devices) return []
          if (Array.isArray(devices)) return devices
          return [devices]
        })(),
        name: currentUser.avatar.name || DEFAULT_AVATAR.name,
      }
    }
    return DEFAULT_AVATAR
  })

  const [nameModalVisible, setNameModalVisible] = React.useState(false)
  const [tempName, setTempName] = React.useState(avatarSelection.name)

  // Get body size from bodyType
  const bodySize: BodySize = React.useMemo(() => {
    if (avatarSelection.bodyType === 'body-small') return 'small'
    if (avatarSelection.bodyType === 'body-large') return 'large'
    return 'medium'
  }, [avatarSelection.bodyType])


  const buildAvatarObject = React.useCallback((name?: string) => {
    const updatedAvatar: any = {
      customAvatarUnlocked: true,
    }
    
    if (avatarSelection.bodyType) {
      updatedAvatar.body = avatarSelection.bodyType
    }
    if (avatarSelection.hairStyle !== null && avatarSelection.hairStyle !== undefined) {
      updatedAvatar.hair = avatarSelection.hairStyle
    }
    if (avatarSelection.eyeShape !== null && avatarSelection.eyeShape !== undefined) {
      updatedAvatar.eyes = avatarSelection.eyeShape
    }
    updatedAvatar.smile = avatarSelection.smile || 'smile'
    if (avatarSelection.clothing !== null && avatarSelection.clothing !== undefined) {
      updatedAvatar.clothing = avatarSelection.clothing
    }
    if (avatarSelection.devices && avatarSelection.devices.length > 0) {
      updatedAvatar.devices = avatarSelection.devices
    }
    if (avatarSelection.skinColor !== undefined) {
      updatedAvatar.skinColor = avatarSelection.skinColor
    }
    if (avatarSelection.hairColor !== undefined) {
      updatedAvatar.hairColor = avatarSelection.hairColor
    }
    if (avatarSelection.eyeColor !== undefined) {
      updatedAvatar.eyeColor = avatarSelection.eyeColor
    }
    if (name && name.trim()) {
      updatedAvatar.name = name.trim()
    } else if (avatarSelection.name) {
      updatedAvatar.name = avatarSelection.name
    } else {
      updatedAvatar.name = 'Friend'
    }

    return updatedAvatar
  }, [avatarSelection])

  const saveAvatarToStore = React.useCallback((updatedAvatar: any) => {
    dispatch(editUser({
      avatar: updatedAvatar,
    }))

    const setAvatarAction = setAvatarWithValidation(
      'friend', 
      currentUser?.cyclesNumber || 0,
      currentUser?.avatar?.customAvatarUnlocked === true
    )
    if (setAvatarAction) {
      dispatch(setAvatarAction)
    }

    analytics?.().logEvent('CUSTOM_AVATAR_UPDATED', {
      userId: currentUser?.id || null,
      hasBody: !!updatedAvatar.body,
      hasHair: !!updatedAvatar.hair,
      hasEyes: !!updatedAvatar.eyes,
      hasSkinColor: !!updatedAvatar.skinColor,
      hasHairColor: !!updatedAvatar.hairColor,
      hasEyeColor: !!updatedAvatar.eyeColor,
      hasClothing: !!updatedAvatar.clothing,
      hasDevices: !!updatedAvatar.devices,
      hasName: !!updatedAvatar.name,
    })

    if (appToken && currentUser) {
      httpClient.updateAvatar({
        appToken,
        avatar: updatedAvatar,
      }).catch(() => {
        // Silently fail - local save already done, app works offline
      })
    }
  }, [dispatch, currentUser, appToken])

  const handleSave = () => {
    const updatedAvatar = buildAvatarObject()
    saveAvatarToStore(updatedAvatar)
    setNameModalVisible(true)
    setTempName(avatarSelection.name || 'Friend')
  }

  const handleConfirmSave = async () => {
    const updatedAvatar = buildAvatarObject(tempName)
    saveAvatarToStore(updatedAvatar)
    setNameModalVisible(false)
    const parent = navigation.getParent()
    if (parent) {
      parent.navigate('home')
    } else {
      navigation.navigate('home' as any)
    }
  }

  const renderAvatarPreview = () => {
    return (
      <View style={[styles.avatarContainer, { backgroundColor: '#fff' }]}>
        <AvatarPreview
          bodyType={avatarSelection.bodyType}
          skinColor={avatarSelection.skinColor}
          hairStyle={avatarSelection.hairStyle}
          hairColor={avatarSelection.hairColor}
          eyeShape={avatarSelection.eyeShape}
          eyeColor={avatarSelection.eyeColor}
          smile={avatarSelection.smile}
          clothing={avatarSelection.clothing}
          devices={avatarSelection.devices}
          width={avatarConfig.avatarPreviewSize.width}
          height={avatarConfig.avatarPreviewSize.height}
        />
      </View>
    )
  }

  // Render functions moved to separate components: BodyOptions, HairOptions, EyesOptions, ClothingOptions, DeviceOptions
  const renderOptions = () => {
    const commonProps = {
      avatarSelection,
      onSelectionChange: setAvatarSelection,
      avatarConfig,
      avatarSelectionConfig,
      styles,
    }

    switch (selectedCategory) {
      case 'body':
        return <BodyOptions {...commonProps} />
      case 'hair':
        return <HairOptions {...commonProps} />
      case 'eyes':
        return <EyesOptions {...commonProps} />
      case 'clothing':
        return <ClothingOptions {...commonProps} />
      case 'devices':
        return <DeviceOptions {...commonProps} />
      default:
        return null
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: '#E3F2FD' }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: avatarConfig.spacing.medium + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <View style={styles.titleBox}>
            <Text style={[styles.title, { color: '#000000' }]} enableTranslate={true}>
              customizer_title
            </Text>
            <Text style={[styles.subtitle, { color: '#000000' }]} enableTranslate={true}>
              customizer_subtitle
            </Text>
          </View>
        </View>

        <View style={[styles.whiteCard, { backgroundColor: '#fff' }]}>
          <FirstVisitTooltip
            visible={firstVisitTooltipVisible}
            onClose={handleCloseTooltip}
            styles={styles}
          />
          <TouchableOpacity
            style={styles.tutorialButton}
            onPress={() => setTutorialModalVisible(true)}
            accessibilityLabel={getAccessibilityLabel('tutorial_button')}
            accessibilityRole="button"
          >
            <FontAwesome name="info-circle" size={18} color="#2196F3" />
            <Text style={styles.tutorialButtonText} enableTranslate={true}>customizer_tutorial</Text>
          </TouchableOpacity>

          {renderAvatarPreview()}
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            styles={styles}
          />
          {renderOptions()}
        </View>

        <View style={styles.bottomButtonsContainer}>
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              onPress={handleExit}
              style={[styles.exitButton, styles.orangeButton]}
              accessibilityLabel={getAccessibilityLabel('customizer_exit')}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText} enableTranslate={true}>customizer_exit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButton, styles.orangeButton]}
              accessibilityLabel={getAccessibilityLabel('customizer_save_friend')}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText} enableTranslate={true}>customizer_save_friend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {}
      <AvatarTutorialModal
        visible={tutorialModalVisible}
        onClose={() => setTutorialModalVisible(false)}
      />

      <AvatarNamingModal
        visible={nameModalVisible}
        onClose={() => setNameModalVisible(false)}
        onConfirm={handleConfirmSave}
        onSkip={() => {
          setNameModalVisible(false)
          const parent = navigation.getParent()
          if (parent) {
            parent.navigate('home')
          } else {
            navigation.navigate('home' as any)
          }
        }}
        tempName={tempName}
        onNameChange={setTempName}
        avatarSelection={avatarSelection}
        avatarConfig={avatarConfig}
        styles={styles}
      />
    </View>
  )
}

export default CustomAvatarScreen
