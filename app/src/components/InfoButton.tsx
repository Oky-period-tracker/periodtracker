import React from 'react'
import { Button, ButtonProps } from './Button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { StyleSheet, View } from 'react-native'
import { useToggle } from '../hooks/useToggle'
import { Modal } from './Modal'
import { Text } from './Text'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { useColor } from '../hooks/useColor'

type InfoButtonProps = ButtonProps & {
  title: string
  content: string
  accessibilityLabel?: string
}

export const InfoButton = ({ title, content, accessibilityLabel, ...props }: InfoButtonProps) => {
  const [visible, toggleVisible] = useToggle()
  const { backgroundColor } = useColor()

  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel(accessibilityLabel ?? 'info_button')

  return (
    <>
      <Button
        onPress={toggleVisible}
        style={styles.default}
        status={'danger_light'}
        accessibilityLabel={label}
        {...props}
      >
        <FontAwesome size={12} name={'info'} color={'#fff'} />
      </Button>

      <Modal visible={visible} toggleVisible={toggleVisible}>
        <View style={[styles.modal, { backgroundColor }]}>
          <Text style={styles.title} status={'primary'}>
            {title}
          </Text>
          <Text>{content}</Text>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  default: {
    height: 24,
    width: 24,
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
})
