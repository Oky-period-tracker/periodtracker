import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { WheelPickerModal } from '../../../components/WheelPickerModal'
import { WheelPickerOption } from '../../../components/WheelPicker'
import { Text } from '../../../components/Text'
import { AuthCardBody } from './AuthCardBody'
import { useColor } from '../../../hooks/useColor'
import { listAccounts, switchToAccount } from '../../../services/auth/accountFlows'

// The dropdown trigger: looks like the app's input boxes (rounded, filled) with a chevron, so it
// reads as a dropdown. Renders "Select a user" directly to avoid the translate fallback.
const SelectUserToggle: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { inputBackgroundColor, placeholderTextColor, color } = useColor()
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.toggle, { backgroundColor: inputBackgroundColor }]}
    >
      <Text enableTranslate={false} style={[styles.toggleText, { color: placeholderTextColor }]}>
        Select a user
      </Text>
      <FontAwesome name="chevron-down" size={16} color={color} />
    </TouchableOpacity>
  )
}

// Dropdown of the accounts registered on this device. Selecting one switches the active store to
// that account, after which the auth flow shows its passcode screen. Shown on the logged-out
// start screen; renders nothing when there are no saved accounts.
export const AccountSwitcher = () => {
  const [options, setOptions] = React.useState<WheelPickerOption[]>([])

  React.useEffect(() => {
    let mounted = true
    listAccounts().then((list) => {
      if (mounted) {
        setOptions(list.map((account) => ({ label: account.name, value: account.id })))
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  if (options.length === 0) {
    return null
  }

  const onSelect = (option?: WheelPickerOption) => {
    if (option) {
      void switchToAccount(option.value)
    }
  }

  return (
    <AuthCardBody>
      <WheelPickerModal
        initialOption={options[0]}
        options={options}
        onSelect={onSelect}
        allowUndefined={false}
        ToggleComponent={SelectUserToggle}
      />
    </AuthCardBody>
  )
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  toggleText: {
    fontSize: 16,
  },
})
