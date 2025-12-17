import * as React from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
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
    bodyType: 'body-small' | 'body-medium' | 'body-large'
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

  return (
    <Modal
      visible={visible}
      toggleVisible={onClose}
      style={styles.nameModal}
    >
      <Text style={styles.modalTitle} enableTranslate={true}>
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
    </Modal>
  )
}

