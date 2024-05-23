import React, { FunctionComponent } from 'react'
import Modal from 'react-native-modal'
import { Text } from '../../../components/common/Text'
import styled from 'styled-components/native'

interface IModalAlert {
  isOpen: boolean
  setOpen: (b: boolean) => void
  translations: {
    title: string
    message1: string
    message2: string
    buttonCancel: string
    buttonProceed: string
  }
  onConfirm: () => void
  onCancel: () => void
}

export const ModalAlert: FunctionComponent<IModalAlert> = ({
  isOpen,
  setOpen,
  translations,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isVisible={isOpen}
      backdropOpacity={0.8}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackdropPress={() => setOpen(false)}
      useNativeDriver={true}
    >
      <ModalBody>
        <ModalTitle>{translations.title}</ModalTitle>
        <ModalMessage>{translations.message1}</ModalMessage>
        <ModalMessage>{translations.message2}</ModalMessage>
        <ButtonContainer>
          <ButtonText color="#DB307A" onPress={() => onCancel()}>
            {translations.buttonCancel}
          </ButtonText>
          <ButtonText color="#333481" onPress={() => onConfirm()}>
            {translations.buttonProceed}
          </ButtonText>
        </ButtonContainer>
      </ModalBody>
    </Modal>
  )
}

const ModalBody = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  padding-vertical: 20;
  padding-horizontal: 20;
  align-self: center;
`

const ModalTitle = styled(Text)`
  font-size: 20;
  color: #ff9e00;
  margin-bottom: 15;
`
const ModalMessage = styled(Text)`
  font-size: 14;
  color: #000;
  margin-bottom: 10;
`

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20;
`

const ButtonText = styled(Text)<{ color: string }>`
  color: ${(prop) => (prop.color ? prop.color : '#000')};
  font-size: 16;
  flex: 1;
  align-items: center;
  text-align: center;
`
