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
  const { secretQuestion, secretAnswer } = state

  const [notValid, setNotValid] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const minPasswordLength = 1

  function checkValidity() {
    return secretQuestion !== '' && secretAnswer.length >= minPasswordLength
  }
  if (loading) {
    return null
  }

  return (
    <SignUpFormLayout
      isValid={checkValidity()}
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
        {/* TODO:PH */}
        {/* {formSubmitted && !selectedQuestion && (
          <ErrorMessage>Pakisagutan ang bahaging ito</ErrorMessage>
        )} */}
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
            dispatch({ type: 'change-form-data', inputName: 'secretQuestion', value })
          }
          hasError={true} // this is to permanently display the i button
          errorHeading="secret_q_error_heading"
          errorContent="secret_que_info"
        />
        {/* TODO:PH */}
        {/* {formSubmitted && !answer && <ErrorMessage>Pakisagutan ang bahaging ito</ErrorMessage>} */}
        <TextInput
          inputStyle={{ color: '#555' }}
          onChange={(value) =>
            dispatch({ type: 'change-form-data', inputName: 'secretAnswer', value })
          }
          label="secret_answer"
          isValid={secretAnswer.length >= minPasswordLength}
          hasError={notValid && !(secretAnswer.length >= minPasswordLength)}
          showInfoButton={true}
          value={secretAnswer}
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
// const ErrorMessage = styled(TextWithoutTranslation)`
//   font-size: 12
//   margin-top: 10px;
//   color: red;
// `
