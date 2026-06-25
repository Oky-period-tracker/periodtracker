import * as React from 'react'
import {
  Dimensions,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { Modal } from '../../../components/Modal'
import { Text } from '../../../components/Text'
import { AvatarPreview } from '../../../components/AvatarPreview'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'
import type { UIConfig } from '../../../config/UIConfig'

interface AvatarNamingModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  onSkip: () => void
  tempName: string
  onNameChange: (name: string) => void
  avatarSelection: {
    bodyType: 'small' | 'medium' | 'large'
    skinColor?: string
    hairStyle: string | null
    hairColor?: string
    eyeShape: string | null
    eyeColor?: string
    smile?: string
    clothing: string | null
    devices: string[]
  }
  avatarConfig: UIConfig['avatarCustomization']
  styles: any
}

export const AvatarNamingModal: React.FC<AvatarNamingModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onSkip,
  tempName,
  onNameChange,
  avatarSelection,
  avatarConfig,
  styles,
}) => {
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  const { height: windowHeight } = useWindowDimensions()
  const [keyboardHeight, setKeyboardHeight] = React.useState(0)
  const isKeyboardVisible = keyboardHeight > 0

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    )
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const originalHeight = avatarConfig.avatarPreviewSize.height
  const originalWidth = avatarConfig.avatarPreviewSize.width
  const aspectRatio = originalWidth / originalHeight

  // The avatar fills whatever vertical room is left after the surrounding
  // modal pieces (title, input, hint, footer) plus a small breathing margin.
  // Bounded by two constraints so it never overflows:
  //   1. visible window minus keyboard minus the rest of the card content
  //      and the footer area.
  //   2. the Modal component's own maxHeight (60% of the screen) minus the
  //      non avatar card content so the AvatarPreview never renders larger
  //      than the SafeAreaView that wraps it.
  const screenHeight = Dimensions.get('screen').height
  const NON_AVATAR_CONTENT = 260
  const FOOTER_AND_MARGINS = 110
  const visibleHeight = windowHeight - keyboardHeight
  const availableFromWindow = visibleHeight - NON_AVATAR_CONTENT - FOOTER_AND_MARGINS
  const availableFromModalMax = screenHeight * 0.6 - NON_AVATAR_CONTENT
  const availableForAvatar = Math.max(40, Math.min(availableFromWindow, availableFromModalMax))

  // Tighten the result toward a more consistent visual size across devices:
  // shrink by 7% when there is more room than the original size, grow by 7%
  // when the available space is tighter than the original size.
  let adjustedAvatar = availableForAvatar
  if (isKeyboardVisible) {
    adjustedAvatar =
      availableForAvatar > originalHeight ? availableForAvatar * 0.93 : availableForAvatar * 1.07
  }

  const previewHeight = isKeyboardVisible
    ? adjustedAvatar
    : Math.min(originalHeight, availableForAvatar)
  const previewWidth = previewHeight * aspectRatio

  const renderAvatarPreview = () => {
    return (
      <View
        style={[
          styles.avatarContainer,
          { backgroundColor: '#fff' },
          isKeyboardVisible && { maxHeight: previewHeight, marginBottom: 0 },
        ]}
        pointerEvents="none"
      >
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
          width={previewWidth}
          height={previewHeight}
        />
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      toggleVisible={onClose}
      style={[styles.nameModal, isKeyboardVisible && { paddingTop: 16, alignSelf: 'flex-start' }]}
      footer={
        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={onSkip}
            style={[styles.modalButton, styles.orangeButton]}
            accessibilityLabel={getAccessibilityLabel('skip_name_button')}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText} enableTranslate={true}>
              skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            style={[styles.modalButton, styles.modalButtonPrimary, styles.orangeButton]}
            accessibilityLabel={getAccessibilityLabel('save_and_continue_button')}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText} enableTranslate={true}>
              save_and_continue_button
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text
        style={[styles.modalTitle, isKeyboardVisible && { marginBottom: 8 }]}
        enableTranslate={true}
      >
        avatar_naming_modal_title
      </Text>

      {renderAvatarPreview()}

      <View style={styles.nameInputContainer}>
        <TextInput
          style={styles.nameInput}
          placeholder={translate('avatar_naming_modal_placeholder')}
          placeholderTextColor="#999"
          value={tempName}
          onChangeText={(text) => onNameChange(text.substring(0, 8))}
          maxLength={8}
          accessibilityLabel={getAccessibilityLabel('name_input')}
          accessibilityRole="text"
        />
        <Text style={styles.characterCount}>
          {tempName.length}/08 {translate('characters')}
        </Text>
        <Text style={styles.hintText} enableTranslate={true}>
          avatar_naming_modal_hint
        </Text>
      </View>
    </Modal>
  )
}
