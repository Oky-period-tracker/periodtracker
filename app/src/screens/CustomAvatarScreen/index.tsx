import * as React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ImageSourcePropType,
} from 'react-native'
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
import { editUser } from '../../redux/actions'
import { getSelectionAsset, getPreviewAsset, getCategoryIcon, BodySize } from '../../resources/assets/friendAssets'
import { AvatarPreview } from '../../components/AvatarPreview'
import { useFocusEffect } from '@react-navigation/native'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { responsiveConfig } from '../../config/UIConfig'
import { AvatarTutorialModal } from './components/AvatarTutorialModal'

// Color options
const SKIN_COLORS = [
  '#F2E0E5',
  '#FFCC85',
  '#EAD2C1',
  '#C67D3C',
  '#603A17',
  '#F1B98C',
  '#936154',
  '#EEC4A0',
  '#B67E60',
  '#F1EAE4',
  '#DCA87B',
  '#D3977B',
]

const HAIR_COLORS = [
  '#111111',
  '#6E411C',
  '#CC2B14',
  '#FFD578',
  '#67B221',
  '#D338B9',
  '#D16C0A',
  '#8966EC',
  '#853821',
  '#ED7600',
  '#498CFA',
]

const EYE_COLORS = [
  '#111111',
  '#945A1C',
  '#A88044',
  '#909249',
  '#6F979E',
  '#ABADB3',
]

// Category types
type Category = 'body' | 'hair' | 'eyes' | 'clothing' | 'devices'

interface AvatarSelection {
  bodyType: 'body-small' | 'body-medium' | 'body-large'
  skinColor: string
  hairStyle: string // 01-18
  hairColor: string
  eyeShape: string // 00-06
  eyeColor: string
  smile: string
  clothing: string | null
  devices: string | null
  name: string
}

const DEFAULT_AVATAR: AvatarSelection = {
  bodyType: 'body-medium',
  skinColor: SKIN_COLORS[0],
  hairStyle: '01',
  hairColor: HAIR_COLORS[0],
  eyeShape: '00',
  eyeColor: EYE_COLORS[0],
  smile: 'smile',
  clothing: null,
  devices: null,
  name: 'Friend',
}
// Helper function to recursively replace skin color in SVG children and protect eye pupils
const replaceSkinColor = (element: any, skinColor: string): any => {
  if (!element) return element
  
  if (React.isValidElement(element)) {
    const props = element.props || {}
    const newProps: any = { ...props }
    
    // Check if this is an eye pupil path - "2 black spots in the middle"
    // Eye pupils are small circular paths starting with M64 or M43, Y coordinate around 50-60
    const pathData = props.d || ''
    const isEyePupil = (() => {
      if (!pathData) return false
      // Must start with M64 or M43
      if (!/^M(?:64|43)/.test(pathData)) return false
      
      // Extract Y coordinate
      const yMatch = pathData.match(/M\d+\.\d+\s+(\d+\.\d+)/)
      if (yMatch) {
        const y = parseFloat(yMatch[1])
        // Eye pupils are in the middle Y range (50-60) and are small circles (short path)
        const isMiddleY = y >= 50 && y <= 60
        const isShortPath = pathData.length < 250
        return isMiddleY && isShortPath
      }
      return false
    })()
    
    // Protect eye pupils - ensure they stay #111111 (black) and override any color prop
    if (isEyePupil) {
      newProps.fill = '#111111'
      newProps.stroke = '#111111'
      // Explicitly remove color prop inheritance
      if (newProps.color) {
        delete newProps.color
      }
    } else {
      // Replace #F1B98C (default face color) with selected skin color
      if (props.fill === '#F1B98C' || props.fill === 'rgb(241, 185, 140)') {
        newProps.fill = skinColor
      }
      if (props.stroke === '#F1B98C' || props.stroke === 'rgb(241, 185, 140)') {
        newProps.stroke = skinColor
      }
    }
    
    // Recursively process children - handle both arrays and single children
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
  
  // If it's an array, process each element
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
  const { UIConfig } = useResponsive()
  const [tutorialModalVisible, setTutorialModalVisible] = React.useState(false)
  const avatarConfig = UIConfig.avatarCustomization
  
  // Generate responsive styles
  const styles = React.useMemo(() => createStyles(avatarConfig), [avatarConfig])
  
  // Hide header and bottom tabs when this screen is focused
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
      
      return () => {
        // Show bottom tabs when leaving this screen
        if (parent) {
          parent.setOptions({
            tabBarStyle: undefined,
          })
        }
      }
    }, [navigation])
  )

  const [selectedCategory, setSelectedCategory] = React.useState<Category>('body')
  
  // Pagination state for each category
  const [skinColorPage, setSkinColorPage] = React.useState(0)
  const [hairColorPage, setHairColorPage] = React.useState(0)
  const [eyeColorPage, setEyeColorPage] = React.useState(0)
  const [hairPage, setHairPage] = React.useState(0)
  const [eyePage, setEyePage] = React.useState(0)
  const [clothingPage, setClothingPage] = React.useState(0)
  const [devicePage, setDevicePage] = React.useState(0)
  
  // Reset pagination when category changes
  React.useEffect(() => {
    setSkinColorPage(0)
    setHairColorPage(0)
    setEyeColorPage(0)
    setHairPage(0)
    setEyePage(0)
    setClothingPage(0)
    setDevicePage(0)
  }, [selectedCategory])
  
  // Number of colors per page (one row) - from responsive config
  const COLORS_PER_PAGE = avatarConfig.colorsPerRow
  
  const [avatarSelection, setAvatarSelection] = React.useState<AvatarSelection>(() => {
    // Initialize from user's existing avatar if available
    if (currentUser?.avatar) {
      // Convert old body format (body1, body2, body3) to new format (body-small, body-medium, body-large)
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
      
      return {
        bodyType,
        skinColor: SKIN_COLORS[0],
        hairStyle: currentUser.avatar.hair || DEFAULT_AVATAR.hairStyle,
        hairColor: HAIR_COLORS[0],
        eyeShape: currentUser.avatar.eyes || DEFAULT_AVATAR.eyeShape,
        eyeColor: EYE_COLORS[0],
        smile: currentUser.avatar.smile || DEFAULT_AVATAR.smile,
        clothing: currentUser.avatar.clothing || null,
        devices: currentUser.avatar.devices || null,
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

  // Generate array of options
  const hairOptions = React.useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => String(i + 1).padStart(2, '0'))
  }, [])

  const eyeOptions = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => String(i).padStart(2, '0'))
  }, [])

  const clothingOptions = React.useMemo(() => [
    'dress1',
    'dress2',
    'dress3',
    'longdressbelt',
    'shortandshirt1',
    'shortandshirt2',
    'shortandshirt3',
    'skirtandshirt',
    'shirtandpants',
    'blazer1',
    'blazer2',
    'jumper',
    'cape',
    'hijab',
    'longuniform',
    'traditional1',
    'traditional2',
    'traditional3',
    'traditional4',
    'traditional5',
  ], [])

  const deviceOptions = React.useMemo(() => [
    'glasses',
    'readingglasses2',
    'darkglasses',
    'sunglass1',
    'sunglass2',
    'crown',
    'hat',
    'beanie',
    'beanie2',
    'buckethat',
    'cap',
    'sunhat',
    'headband',
    'flowers',
    'bandana',
    'headphones',
    'necklace1',
    'necklace2',
    'necklace3',
    'earings',
    'purse',
    'cane',
    'prostetic1',
    'prostetic2',
  ], [])

  const handleSave = () => {
    setNameModalVisible(true)
    setTempName(avatarSelection.name)
  }

  const handleConfirmSave = async () => {
    const updatedAvatar = {
      body: avatarSelection.bodyType, // Now stores 'body-small', 'body-medium', or 'body-large'
      hair: avatarSelection.hairStyle,
      eyes: avatarSelection.eyeShape,
      smile: avatarSelection.smile,
      clothing: avatarSelection.clothing,
      devices: avatarSelection.devices,
      customAvatarUnlocked: true,
      name: tempName.trim() || 'Friend',
      // Note: Colors are stored separately, you may want to add color fields
    }

    if (appToken && currentUser) {
      try {
        await httpClient.updateAvatar({
          appToken,
          avatar: updatedAvatar,
        })

        dispatch(editUser({
          avatar: updatedAvatar,
        }))

        setNameModalVisible(false)
        navigation.goBack()
      } catch (error) {
        console.error('Error saving avatar:', error)
      }
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

  const renderCategoryButtons = () => {
    const categories: { key: Category; label: string }[] = [
      { key: 'body', label: 'Body' },
      { key: 'hair', label: 'Hair' },
      { key: 'eyes', label: 'Eyes' },
      { key: 'clothing', label: 'Clothing' },
      { key: 'devices', label: 'Devices' },
    ]

    return (
      <View style={styles.categoryContainer}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key
          const categoryIcon = getCategoryIcon(category.key)
          return (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={[
                styles.categoryButton,
                isSelected && styles.categoryButtonSelected,
              ]}
            >
              <View
                style={[
                  styles.categoryIcon,
                  isSelected && styles.categoryIconSelected,
                  !isSelected && styles.categoryIconUnselected,
                ]}
              >
                {categoryIcon && (
                  <Image
                    source={categoryIcon}
                    style={[
                      styles.categoryIconImage,
                      isSelected && styles.categoryIconImageSelected,
                    ]}
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text style={[styles.categoryLabel, isSelected && { fontWeight: 'bold' }]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderBodyOptions = () => (
    <View style={styles.optionsContainer}>
      <View style={styles.optionSection}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Skin color</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={() => setSkinColorPage(Math.max(0, skinColorPage - 1))}
              disabled={skinColorPage === 0}
              style={[styles.arrowButton, skinColorPage === 0 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-left" size={16} color={skinColorPage === 0 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSkinColorPage(Math.min(Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE) - 1, skinColorPage + 1))}
              disabled={skinColorPage >= Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE) - 1}
              style={[styles.arrowButton, skinColorPage >= Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE) - 1 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-right" size={16} color={skinColorPage >= Math.ceil(SKIN_COLORS.length / COLORS_PER_PAGE) - 1 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.colorSwatches}>
          {SKIN_COLORS.slice(skinColorPage * COLORS_PER_PAGE, (skinColorPage + 1) * COLORS_PER_PAGE).map((color, index) => {
            const actualIndex = skinColorPage * COLORS_PER_PAGE + index
            return (
              <TouchableOpacity
                key={actualIndex}
                onPress={() => setAvatarSelection({ ...avatarSelection, skinColor: color })}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  avatarSelection.skinColor === color && styles.colorSwatchSelected,
                ]}
              />
            )
          })}
        </View>
      </View>

      <View style={[styles.optionSection, styles.lastOptionSection]}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Body type</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.bodyTypeContainer}>
            {(['body-small', 'body-medium', 'body-large'] as const).map((bodyType) => {
              const bodyAsset = getSelectionAsset('body', bodyType)
              const isSelected = avatarSelection.bodyType === bodyType
              const isSvgComponent = bodyAsset && typeof bodyAsset === 'function'
              
              // Debug: Log if SVG component is not found
              if (!bodyAsset) {
                console.warn(`Body asset not found for: ${bodyType}`, {
                  category: 'body',
                  item: bodyType,
                  assetType: typeof bodyAsset,
                })
              } else if (!isSvgComponent) {
                console.warn(`Body asset is not an SVG component for: ${bodyType}`, {
                  type: typeof bodyAsset,
                  asset: bodyAsset,
                })
              }
              
              return (
                <TouchableOpacity
                  key={bodyType}
                  onPress={() => setAvatarSelection({ ...avatarSelection, bodyType })}
                  style={[
                    styles.bodyTypeOption,
                    isSelected && styles.bodyTypeOptionSelected,
                  ]}
                >
                  {bodyAsset ? (
                    // Render SVG component without dynamic tint
                    isSvgComponent ? (
                      React.createElement(bodyAsset as React.ComponentType<any>, {
                        width: avatarConfig.bodyTypeSize.width - 4,
                        height: avatarConfig.bodyTypeSize.height - 4,
                      })
                    ) : (
                      // Image asset
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

  const renderHairOptions = () => (
    <View style={styles.optionsContainer}>
      <View style={styles.optionSection}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Hair color</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={() => setHairColorPage(Math.max(0, hairColorPage - 1))}
              disabled={hairColorPage === 0}
              style={[styles.arrowButton, hairColorPage === 0 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-left" size={16} color={hairColorPage === 0 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setHairColorPage(Math.min(Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE) - 1, hairColorPage + 1))}
              disabled={hairColorPage >= Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE) - 1}
              style={[styles.arrowButton, hairColorPage >= Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE) - 1 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-right" size={16} color={hairColorPage >= Math.ceil(HAIR_COLORS.length / COLORS_PER_PAGE) - 1 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.colorSwatches}>
          {HAIR_COLORS.slice(hairColorPage * COLORS_PER_PAGE, (hairColorPage + 1) * COLORS_PER_PAGE).map((color, index) => {
            const actualIndex = hairColorPage * COLORS_PER_PAGE + index
            return (
              <TouchableOpacity
                key={actualIndex}
                onPress={() => setAvatarSelection({ ...avatarSelection, hairColor: color })}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  avatarSelection.hairColor === color && styles.colorSwatchSelected,
                ]}
              />
            )
          })}
        </View>
      </View>

      <View style={[styles.optionSection, styles.lastOptionSection]}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Hairstyle</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={() => setHairPage(Math.max(0, hairPage - 1))}
              disabled={hairPage === 0}
              style={[styles.arrowButton, hairPage === 0 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-left" size={16} color={hairPage === 0 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setHairPage(Math.min(Math.ceil(hairOptions.length / 3) - 1, hairPage + 1))}
              disabled={hairPage >= Math.ceil(hairOptions.length / 3) - 1}
              style={[styles.arrowButton, hairPage >= Math.ceil(hairOptions.length / 3) - 1 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-right" size={16} color={hairPage >= Math.ceil(hairOptions.length / 3) - 1 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.paginatedOptions}>
          {hairOptions.slice(hairPage * 3, (hairPage + 1) * 3).map((item) => {
            const hairAsset = getSelectionAsset('hair', item)
            const isSelected = avatarSelection.hairStyle === item
            const isSvgComponent = hairAsset && typeof hairAsset === 'function'
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setAvatarSelection({ ...avatarSelection, hairStyle: item })}
                style={[
                  styles.hairstyleOption,
                  isSelected && styles.hairstyleOptionSelected,
                ]}
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
        </View>
      </View>
    </View>
  )

  const renderEyesOptions = () => (
    <View style={styles.optionsContainer}>
      <View style={styles.optionSection}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Eye color</Text>
        </View>
        <View style={styles.colorSwatches}>
          {EYE_COLORS.slice(eyeColorPage * COLORS_PER_PAGE, (eyeColorPage + 1) * COLORS_PER_PAGE).map((color, index) => {
            const actualIndex = eyeColorPage * COLORS_PER_PAGE + index
            return (
              <TouchableOpacity
                key={actualIndex}
                onPress={() => setAvatarSelection({ ...avatarSelection, eyeColor: color })}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  avatarSelection.eyeColor === color && styles.colorSwatchSelected,
                ]}
              />
            )
          })}
        </View>
      </View>

      <View style={[styles.optionSection, styles.lastOptionSection]}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Eye shape</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={() => setEyePage(Math.max(0, eyePage - 1))}
              disabled={eyePage === 0}
              style={[styles.arrowButton, eyePage === 0 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-left" size={16} color={eyePage === 0 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEyePage(Math.min(Math.ceil(eyeOptions.length / 3) - 1, eyePage + 1))}
              disabled={eyePage >= Math.ceil(eyeOptions.length / 3) - 1}
              style={[styles.arrowButton, eyePage >= Math.ceil(eyeOptions.length / 3) - 1 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-right" size={16} color={eyePage >= Math.ceil(eyeOptions.length / 3) - 1 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.paginatedOptions}>
          {eyeOptions.slice(eyePage * 3, (eyePage + 1) * 3).map((item) => {
            const eyeAsset = getSelectionAsset('eyes', item)
            const isSelected = avatarSelection.eyeShape === item
            const isSvgComponent = eyeAsset && typeof eyeAsset === 'function'
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setAvatarSelection({ ...avatarSelection, eyeShape: item })}
                style={[
                  styles.eyeShapeOption,
                  isSelected && styles.eyeShapeOptionSelected,
                ]}
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
        </View>
      </View>
    </View>
  )

  const renderClothingOptions = () => {
    const itemsPerPage = 6 // 2 rows of 3
    const currentPageItems = clothingOptions.slice(clothingPage * itemsPerPage, (clothingPage + 1) * itemsPerPage)
    const maxPage = Math.ceil(clothingOptions.length / itemsPerPage) - 1
    
    return (
      <View style={styles.optionsContainer}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Clothing</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={() => setClothingPage(Math.max(0, clothingPage - 1))}
              disabled={clothingPage === 0}
              style={[styles.arrowButton, clothingPage === 0 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-left" size={16} color={clothingPage === 0 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setClothingPage(Math.min(maxPage, clothingPage + 1))}
              disabled={clothingPage >= maxPage}
              style={[styles.arrowButton, clothingPage >= maxPage && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-right" size={16} color={clothingPage >= maxPage ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.gridContainer, styles.lastOptionSection]}>
          {currentPageItems.map((item) => {
            const clothingImage = getSelectionAsset('clothing', item)
            const isSelected = avatarSelection.clothing === item
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setAvatarSelection({ 
                  ...avatarSelection, 
                  clothing: isSelected ? null : item 
                })}
                style={[
                  styles.itemOption,
                  isSelected && styles.itemOptionSelected,
                ]}
              >
                {clothingImage && (
                  <Image
                    source={clothingImage}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderDeviceOptions = () => {
    const itemsPerPage = 6 // 2 rows of 3
    const currentPageItems = deviceOptions.slice(devicePage * itemsPerPage, (devicePage + 1) * itemsPerPage)
    const maxPage = Math.ceil(deviceOptions.length / itemsPerPage) - 1
    
    return (
      <View style={styles.optionsContainer}>
        <View style={styles.optionTitleRow}>
          <Text style={styles.optionTitle}>Devices</Text>
          <View style={styles.arrowButtons}>
            <TouchableOpacity
              onPress={() => setDevicePage(Math.max(0, devicePage - 1))}
              disabled={devicePage === 0}
              style={[styles.arrowButton, devicePage === 0 && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-left" size={16} color={devicePage === 0 ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDevicePage(Math.min(maxPage, devicePage + 1))}
              disabled={devicePage >= maxPage}
              style={[styles.arrowButton, devicePage >= maxPage && styles.arrowButtonDisabled]}
            >
              <FontAwesome name="chevron-right" size={16} color={devicePage >= maxPage ? '#ccc' : '#2196F3'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.gridContainer, styles.lastOptionSection]}>
          {currentPageItems.map((item) => {
            const deviceImage = getSelectionAsset('devices', item)
            const isSelected = avatarSelection.devices === item
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setAvatarSelection({ 
                  ...avatarSelection, 
                  devices: isSelected ? null : item 
                })}
                style={[
                  styles.itemOption,
                  isSelected && styles.itemOptionSelected,
                ]}
              >
                {deviceImage && (
                  <Image
                    source={deviceImage}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderOptions = () => {
    switch (selectedCategory) {
      case 'body':
        return renderBodyOptions()
      case 'hair':
        return renderHairOptions()
      case 'eyes':
        return renderEyesOptions()
      case 'clothing':
        return renderClothingOptions()
      case 'devices':
        return renderDeviceOptions()
      default:
        return null
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: '#E3F2FD' }]}>
      <View style={styles.header}>
        <Text style={styles.title} enableTranslate={false}>Your friend</Text>
        <Text style={styles.subtitle} enableTranslate={false}>Build your own Oky friend.</Text>
      </View>

      <View style={[styles.whiteCard, { backgroundColor: '#fff' }]}>
        <TouchableOpacity
          style={styles.tutorialButton}
          onPress={() => setTutorialModalVisible(true)}
        >
          <FontAwesome name="info-circle" size={18} color="#2196F3" />
          <Text style={styles.tutorialButtonText}>Tutorial</Text>
        </TouchableOpacity>

        {renderAvatarPreview()}
        {renderCategoryButtons()}
        <View style={styles.optionsWrapper}>
          {renderOptions()}
        </View>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <View style={styles.bottomButtonsShadow} />
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.exitButton, styles.orangeButton]}
          >
            <Text style={styles.buttonText} enableTranslate={false}>Exit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, styles.orangeButton]}
          >
            <Text style={styles.buttonText} enableTranslate={false}>Save you friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tutorial Modal */}
      <AvatarTutorialModal
        visible={tutorialModalVisible}
        onClose={() => setTutorialModalVisible(false)}
      />

      {/* Name Modal */}
      <Modal
        visible={nameModalVisible}
        toggleVisible={() => setNameModalVisible(false)}
        style={styles.nameModal}
      >
        <Text style={styles.modalTitle}>You're all set! Give your friend a name!</Text>
        
        {renderAvatarPreview()}
        
        <View style={styles.nameInputContainer}>
          <TextInput
            style={styles.nameInput}
            placeholder="Type your friend's name"
            placeholderTextColor="#999"
            value={tempName}
            onChangeText={(text) => setTempName(text.substring(0, 8))}
            maxLength={8}
          />
          <Text style={styles.characterCount}>{tempName.length}/08 characters</Text>
          <Text style={styles.hintText}>Remember you can change this later.</Text>
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={() => setNameModalVisible(false)}
            style={[styles.modalButton, styles.orangeButton]}
          >
            <Text style={styles.buttonText} enableTranslate={false}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirmSave}
            style={[styles.modalButton, styles.modalButtonPrimary, styles.orangeButton]}
          >
            <Text style={styles.buttonText} enableTranslate={false}>Save and continue</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default CustomAvatarScreen

// Create responsive styles based on config
const createStyles = (config: typeof responsiveConfig.s.avatarCustomization) => StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexShrink: 0,
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  whiteCard: {
    flex: 0.95,
    borderRadius: 16,
    paddingTop: config.spacing.medium,
    paddingHorizontal: config.paddingHorizontal,
    paddingBottom: 0,
    marginHorizontal: config.paddingHorizontal,
    marginBottom: 0,
    minHeight: 0,
    overflow: 'hidden',
    flexShrink: 1,
    alignSelf: 'stretch',
  },
  tutorialButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    zIndex: 10,
    gap: 6,
  },
  tutorialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  avatarContainer: {
    width: '100%',
    height: config.avatarPreviewSize.height + 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: config.spacing.medium + 8,
    borderRadius: 12,
  },
  avatarPreview: {
    width: 150,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyColorBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  avatarPartImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: config.spacing.large,
    paddingHorizontal: 0,
  },
  categoryButton: {
    alignItems: 'center',
    flex: 1,
  },
  categoryButtonSelected: {
    // Selected styling handled by icon
  },
  categoryIcon: {
    width: config.categoryIconSize,
    height: config.categoryIconSize,
    borderRadius: config.categoryIconSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: config.spacing.small,
  },
  categoryIconSelected: {
    backgroundColor: '#2196F3',
  },
  categoryIconUnselected: {
    backgroundColor: '#E3F2FD',
  },
  categoryIconImage: {
    width: config.categoryIconSize / 2,
    height: config.categoryIconSize / 2,
  },
  categoryIconImageSelected: {
    tintColor: '#fff',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#424242',
  },
  optionsWrapper: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  optionsContainer: {
    paddingTop: config.spacing.medium,
    paddingBottom: 0,
    overflow: 'visible',
  },
  optionSection: {
    marginBottom: config.spacing.medium,
  },
  lastOptionSection: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  optionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: config.spacing.medium,
    paddingHorizontal: 0,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 0,
  },
  arrowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: {
    opacity: 0.5,
  },
  paginatedOptions: {
    flexDirection: 'row',
    gap: config.optionImageGap,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: config.colorSwatchGap,
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    overflow: 'visible',
  },
  colorSwatch: {
    width: config.colorSwatchSize,
    height: config.colorSwatchSize,
    borderRadius: config.colorSwatchSize / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#4CAF50',
  },
  bodyTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: config.bodyTypeGap,
    paddingBottom: 0,
    marginBottom: 0,
    width: '100%',
    justifyContent: 'center',
  },
  bodyTypeOption: {
    width: config.bodyTypeSize.width,
    height: config.bodyTypeSize.height,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyTypeOptionSelected: {
    borderColor: '#4CAF50',
  },
  bodyTypeImageContainer: {
    width: 60,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  bodyTypeImageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  bodyTypeImage: {
    width: config.bodyTypeSize.width - 4,
    height: config.bodyTypeSize.height - 4,
    position: 'relative',
    zIndex: 1,
  },
  hairstyleOption: {
    width: config.optionImageSize.width,
    height: config.optionImageSize.height,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hairstyleOptionSelected: {
    borderColor: '#4CAF50',
  },
  hairstyleImage: {
    width: config.optionImageSize.width - 4,
    height: config.optionImageSize.height - 4,
  },
  eyeShapeOption: {
    width: config.optionImageSize.width,
    height: config.optionImageSize.width,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeShapeOptionSelected: {
    borderColor: '#4CAF50',
  },
  eyeShapeImage: {
    width: config.optionImageSize.width - 4,
    height: config.optionImageSize.width - 4,
  },
  itemOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemOptionSelected: {
    borderColor: '#4CAF50',
  },
  itemImage: {
    width: '96%',
    height: '80%',
  },
  bottomButtonsContainer: {
    width: '100%',
    maxWidth: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#E3F2FD',
    flexShrink: 0,
    overflow: 'hidden',
  },
  bottomButtonsShadow: {
    position: 'absolute',
    top: -4,
    left: 16,
    right: 16,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exitButton: {
    minWidth: 100,
    maxWidth: 120,
    height: 50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    minWidth: 180,
    maxWidth: 220,
    height: 50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    paddingTop: 56, // Extra padding at top to account for close button (32px button + 16px top + 8px spacing)
    maxWidth: 400,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 24,
  },
  nameInputContainer: {
    width: '100%',
    marginTop: 24,
  },
  nameInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#999',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 0.5,
    minWidth: 100,
    height: 50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    flex: 1,
    minWidth: 150,
  },
})
