import React from 'react'
import { validatePassword } from '../../services/auth'
import { ThemedModal } from '../../components/common/ThemedModal'
import { VerticalSelectBox } from '../../components/common/VerticalSelectBox'
import { TextInput } from '../../components/common/TextInput'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'

const secretQuestions = [
  'secret_question',
  `favourite_actor`,
  `favourite_teacher`,
  `childhood_hero`,
]

export const EditSecretQuestionModal = ({
  isVisible,
  setIsVisible,
  onConfirm,
}: {
  isVisible: boolean
  setIsVisible: (val: boolean) => void
  onConfirm: (result: { currentAnswer: string; newAnswer: string; question: string }) => void
}) => {
  const [oldSecretAnswer, setOldSecretAnswer] = React.useState('')
  const [secretQuestion, setSecretQuestion] = React.useState(secretQuestions[0])
  const [secretAnswer, setSecretAnswer] = React.useState('')

  const isValid = validatePassword(secretAnswer)

  React.useEffect(() => {
    setOldSecretAnswer('')
    setSecretQuestion('')
    setSecretAnswer('')
  }, [isVisible])

  return (
    <ThemedModal {...{ isVisible, setIsVisible }}>
      <CardModal>
        <QuestionText>reset_secret_question</QuestionText>

        <TextContainer>
          <TextInput
            onChange={(value) => setOldSecretAnswer(value)}
            label="old_secret_answer"
            value={oldSecretAnswer}
          />
          <VerticalSelectBox
            items={secretQuestions.map((questions) => (questions ? questions : ''))}
            containerStyle={{
              height: 45,
              borderRadius: 22.5,
            }}
            height={45}
            maxLength={20}
            buttonStyle={{ right: 5, bottom: 7 }}
            onValueChange={(value) => setSecretQuestion(value)}
            errorHeading="secret_q_error_heading"
            errorContent="secret_que_info"
          />
          <TextInput
            onChange={(value) => setSecretAnswer(value)}
            label="secret_answer"
            isValid={isValid}
            hasError={!isValid}
            value={secretAnswer}
            multiline={true}
          />
        </TextContainer>
        <Confirm
          onPress={() =>
            onConfirm({
              currentAnswer: oldSecretAnswer,
              newAnswer: secretAnswer,
              question: secretQuestion,
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
