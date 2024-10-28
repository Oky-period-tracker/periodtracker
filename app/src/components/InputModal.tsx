import React from 'react'
import { Modal, ModalProps } from './Modal'
import { Input, InputProps } from './Input'
import { useColor } from '../hooks/useColor'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from './Text'
import { Hr } from './Hr'

type InputModalProps = {
  title: string
  onConfirm: () => void
} & ModalProps &
  InputProps

export const InputModal = ({
  title,
  visible,
  toggleVisible,
  onChangeText,
  value,
  onConfirm,
  ...props
}: InputModalProps) => {
  const { backgroundColor } = useColor()

  return (
    <Modal
      visible={visible}
      toggleVisible={toggleVisible}
      style={[styles.modal, { backgroundColor }]}
    >
      <View style={styles.modalBody}>
        <Text style={styles.title}>{title}</Text>
        <Input value={value} onChangeText={onChangeText} secureTextEntry={props.secureTextEntry} />
      </View>

      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.modalConfirm}>
        <Text style={styles.modalConfirmText}>confirm</Text>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 20,
  },
  modalBody: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalConfirm: {
    padding: 24,
  },
  modalConfirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
