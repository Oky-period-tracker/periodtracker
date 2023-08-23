import React from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'
import { SignUpFormLayout } from './SignUpFormLayout'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { navigate } from '../../../services/navigationService'
import { formHeights } from './FormHeights'
import { translate } from '../../../i18n'
export function AskUserConfirmation({ step, heightInner }) {
  const [, dispatch] = useMultiStepForm()
  const [loading, setLoading] = React.useState(false)
  const [isAgreed, setIsAgreed] = React.useState(false)

  if (loading) {
    return null
  }

  return (
    <SignUpFormLayout
      isButtonDisabled={!isAgreed}
      onSubmit={() => {
        setLoading(true)
        Animated.timing(heightInner, {
          toValue: formHeights.askUserInformation + formHeights.buttonConfirmHeight,
          duration: 350,
          useNativeDriver: false,
        }).start(() => {
          dispatch({ formAction: formActions.goToStep('ask-user-information') })
        })
      }}
    >
      <Container
        style={{
          height: formHeights.askUserConfirmation,
          elevation: 4,
          paddingHorizontal: 40,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <Row style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <GenderText>accept_conditions_1</GenderText>
          <TouchableOpacity
            accessibilityLabel={translate(`privacy_and_policy_link`)}
            onPress={() => navigate('PrivacyScreen', null)}
          >
            <GenderText style={{ color: '#28b9cb' }}>accept_conditions_2</GenderText>
          </TouchableOpacity>
          <GenderText>accept_conditions_3</GenderText>
          <TouchableOpacity
            accessibilityLabel={translate('t_and_c_link')}
            onPress={() => navigate('TermsScreen', null)}
          >
            <GenderText style={{ color: '#28b9cb' }}>accept_conditions_4</GenderText>
          </TouchableOpacity>
          <GenderText>accept_conditions_5</GenderText>
        </Row>

        <Row accessibilityLabel={translate('i_agree')} style={{ marginTop: 20 }}>
          <RadioButton selected={isAgreed} onPress={(val) => setIsAgreed(val)} />
          <AgreeText style={{ marginLeft: 20 }}>i_agree</AgreeText>
        </Row>
      </Container>
    </SignUpFormLayout>
  )
}

const RadioButton = ({ selected, onPress }) => {
  return <RadioCircle onPress={() => onPress(true)}>{selected && <RadioFill />}</RadioCircle>
}

const Row = styled.View`
  flex-direction: row;
`

const Container = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`

const RadioCircle = styled.TouchableOpacity`
  width: 25;
  aspect-ratio: 1;
  border-radius: 12.5;
  background-color: #efefef;
  border-width: 1px;
  border-color: grey;
  elevation: 5;
  align-items: center;
  justify-content: center;
`

const RadioFill = styled.View`
  width: 80%;
  aspect-ratio: 1;
  border-radius: 100px;
  background-color: rgb(143, 175, 5);
`
const GenderText = styled(Text)`
  font-family: Roboto-Regular;
  text-align: center;
  font-size: 14;
  color: black;
`

const AgreeText = styled(Text)`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: #000;
  font-family: Roboto-Black;
`
