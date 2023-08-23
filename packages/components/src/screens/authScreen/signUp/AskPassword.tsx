import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { TextInput } from '../../../components/common/TextInput'
import { SignUpFormLayout } from './SignUpFormLayout'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { Text } from '../../../components/common/Text'
import { formHeights } from './FormHeights'
import { VerticalSelectBox } from '../../../components/common/VerticalSelectBox'

const secretQuestions = [
  'secret_question',
  `favourite_actor`,
  `favourite_teacher`,
  `childhood_hero`,
]

export function AskPassword({ step, heightInner }) {
  const [{ app: state }, dispatch] = useMultiStepForm()
  const { selectedQuestion, answer } = state
  const [notValid, setNotValid] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const minPasswordLength = 1

  function checkValidity() {
    return selectedQuestion !== '' && answer.length >= minPasswordLength
  }
  if (loading) {
    return null
  }

  return (
    <SignUpFormLayout
      onSubmit={() => {
        if (!checkValidity()) {
          setNotValid(true)
          return
        }
        setLoading(true)
        Animated.timing(heightInner, {
          toValue: formHeights.askAge + formHeights.buttonConfirmHeight,
          duration: 350,
          useNativeDriver: false,
        }).start(() => {
          dispatch({ formAction: formActions.goToStep('ask-age') })
        })
      }}
    >
      <Container
        style={{
          height: formHeights.askPassword,
          paddingHorizontal: 15,
          elevation: 4,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <VerticalSelectBox
          items={secretQuestions.map((questions) => (questions ? questions : ''))}
          containerStyle={{
            height: 45,
            borderRadius: 22.5,
          }}
          height={45}
          maxLength={20}
          buttonStyle={{ right: 5, bottom: 7 }}
          onValueChange={(value) =>
            dispatch({ type: 'change-form-data', inputName: 'selectedQuestion', value })
          }
          hasError={true} // this is to permanently display the i button
          errorHeading="secret_q_error_heading"
          errorContent="secret_que_info"
        />
        <TextInput
          inputStyle={{ color: '#555' }}
          onChange={(value) => dispatch({ type: 'change-form-data', inputName: 'answer', value })}
          label="secret_answer"
          isValid={answer.length >= minPasswordLength}
          hasError={notValid && !(answer.length >= minPasswordLength)}
          showInfoButton={true}
          value={answer}
          errorHeading="secret_error_heading"
          errorContent="secret_error_content"
        />
      </Container>
    </SignUpFormLayout>
  )
}

const Container = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`
