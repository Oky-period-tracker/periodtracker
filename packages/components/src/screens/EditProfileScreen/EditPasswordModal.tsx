import React from 'react'
import { validatePassword } from '../../services/auth'
import { ThemedModal } from '../../components/common/ThemedModal'
import { TextInput } from '../../components/common/TextInput'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'

export const EditPasswordModal = ({
  isVisible,
  setIsVisible,
  onConfirm,
}: {
  isVisible: boolean
  setIsVisible: (val: boolean) => void
  onConfirm: (result: { answer: string; newPassword: string }) => void
}) => {
  const [answer, setAnswer] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')

  const isValid = validatePassword(newPassword)

  React.useEffect(() => {
    setAnswer('')
    setNewPassword('')
  }, [isVisible])

  return (
    <ThemedModal {...{ isVisible, setIsVisible }}>
      <CardModal>
        <QuestionText>reset_secret_question</QuestionText>

        <TextContainer>
          <TextInput
            onChange={(value) => setAnswer(value)}
            label="old_secret_answer"
            value={answer}
          />
          <TextInput
            onChange={(value) => setNewPassword(value)}
            label="secret_answer"
            isValid={isValid}
            hasError={!isValid}
            value={newPassword}
            multiline={true}
          />
        </TextContainer>
        <Confirm
          disabled={!isValid}
          onPress={() =>
            onConfirm({
              answer,
              newPassword,
            })
          }
        >
          <ConfirmText>confirm</ConfirmText>
        </Confirm>
      </CardModal>
    </ThemedModal>
  )
}

const TextContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 2px;
`

const Confirm = styled.TouchableOpacity`
  width: 100%;
  height: 45px;
  border-radius: 22.5px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
`

const CardModal = styled.View`
  width: 90%;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  padding-horizontal: 20px;
  padding-vertical: 20px;
  align-items: center;
  justify-content: space-around;
  align-self: center;
`

const ConfirmText = styled(Text)`
  font-family: Roboto-Black;
  text-align: center;
  font-size: 16;
  color: #fff;
`

const QuestionText = styled(Text)`
  font-size: 16;
  text-align: center;
`
