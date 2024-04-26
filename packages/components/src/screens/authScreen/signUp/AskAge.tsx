import React from 'react'
import _ from 'lodash'
import styled from 'styled-components/native'
import { SignUpFormLayout } from './SignUpFormLayout'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { WheelPicker } from 'react-native-wheel-picker-android'
import { Text, TextWithoutTranslation } from '../../../components/common/Text'
import { Icon } from '../../../components/common/Icon'
import { assets } from '../../../assets/index'
import moment from 'moment'
import { translate } from '../../../i18n'
import { TouchableOpacity, Animated, Platform } from 'react-native'
import { ThemedModal } from '../../../components/common/ThemedModal'
import { formHeights } from './FormHeights'
import { Picker } from '@react-native-picker/picker'
import { FAST_SIGN_UP } from '../../../config'

const now = moment()
const currentYear = now.year()
const monthRange = moment.months()
const yearRange = _.range(currentYear - 7, currentYear - 100).map(String)

export function AskAge({ step, heightInner }) {
  const [{ app: state }, dispatch] = useMultiStepForm()
  const { location, dateOfBirth } = state
  const [notValid, setNotValid] = React.useState(false)
  const [flag, setFlag] = React.useState(false)
  const [monthSelected, setMonthSelected] = React.useState(FAST_SIGN_UP ? 'January' : '')
  const [yearSelected, setYearSelected] = React.useState(FAST_SIGN_UP ? '2016' : '')
  const [selectedItem] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [infoDisplay, setInfoDisplay] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  function checkValidity() {
    return location.length >= 4 && dateOfBirth && monthSelected !== '' && yearSelected !== ''
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
          toValue: formHeights.askLocation + formHeights.buttonConfirmHeight,
          duration: 350,
          useNativeDriver: false,
        }).start(() => {
          dispatch({ formAction: formActions.goToStep('ask-location') })
        })
      }}
    >
      <Container
        style={{
          height: formHeights.askAge,
          paddingHorizontal: 15,
          elevation: 4,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        {/* TODO:PH */}
        {/* {formSubmitted && !monthSelected && (
          <ErrorMessage>Pakisagutan ang bahaging ito</ErrorMessage>
        )} */}
        <AgeContentPicker
          onPress={() => {
            setFlag(true)
            setIsVisible(true)
          }}
          isValid={monthSelected !== ''}
          hasError={monthSelected === '' && notValid}
        >
          <TouchableOpacity
            style={{ position: 'absolute', left: 10, bottom: 12.5, elevation: 5, zIndex: 999 }}
            onPress={() => {
              setInfoDisplay(true)
              setIsVisible(true)
            }}
          >
            <Icon style={{ height: 25, aspectRatio: 1 }} source={assets.static.icons.infoPink} />
          </TouchableOpacity>
          <LocationText>{monthSelected === '' ? 'month_of_birth' : monthSelected}</LocationText>
        </AgeContentPicker>
        {/* TODO:PH */}
        {/* {formSubmitted && !yearSelected && (
          <ErrorMessage>Pakisagutan ang bahaging ito</ErrorMessage>
        )} */}
        <AgeContentPicker
          onPress={() => {
            setFlag(false)
            setIsVisible(true)
          }}
          hasError={yearSelected === '' && notValid}
          isValid={yearSelected !== ''}
        >
          <TouchableOpacity
            style={{ position: 'absolute', left: 10, bottom: 12.5, elevation: 5, zIndex: 999 }}
            onPress={() => {
              setInfoDisplay(true)
              setIsVisible(true)
            }}
          />
          <YearText>{yearSelected === '' ? translate('year_of_birth') : yearSelected}</YearText>
        </AgeContentPicker>
        <ThemedModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          onModalHide={() => setInfoDisplay(false)}
          animationOutTiming={Platform.OS === 'ios' ? 100 : 600}
        >
          {!infoDisplay && (
            <CardPicker accessibilityLabel={translate('month_selector')}>
              {Platform.OS === 'ios' ? (
                <Picker
                  style={{ width: 250, height: 200 }}
                  selectedValue={(flag ? monthSelected : yearSelected) || selectedItem}
                  onValueChange={(itemValue, itemIndex) => {
                    flag
                      ? setMonthSelected(monthRange[itemIndex])
                      : setYearSelected(yearRange[itemIndex])
                  }}
                >
                  {flag
                    ? monthRange.map((item, index) => (
                        <Picker.Item
                          label={`${translate(item)}`}
                          value={`${translate(item)}`}
                          key={index}
                        />
                      ))
                    : yearRange.map((item, index) => (
                        <Picker.Item label={item} value={item} key={index} />
                      ))}
                </Picker>
              ) : (
                <WheelPicker
                  style={{ width: 250, height: 200 }}
                  // @ts-ignore
                  itemStyle={{ height: Platform.OS === 'ios' ? 132 : 44 }}
                  selectedItem={selectedItem}
                  data={flag ? monthRange.map((item) => `${translate(item)}`) : yearRange}
                  onItemSelected={(option) =>
                    flag ? setMonthSelected(monthRange[option]) : setYearSelected(yearRange[option])
                  }
                />
              )}

              <Confirm
                onPress={() => {
                  const month = monthSelected ?? monthRange[0]
                  const year = yearSelected ?? yearRange[0]

                  dispatch({
                    type: 'change-form-data',
                    inputName: 'dateOfBirth',
                    value: moment(month + ' ' + year, 'MMMM YYYY').toISOString(),
                  })
                  setIsVisible(false)
                }}
              >
                <ConfirmText>confirm</ConfirmText>
              </Confirm>
            </CardPicker>
          )}
          {infoDisplay && (
            <InfoCardPicker>
              <Heading>birth_info_heading</Heading>
              <TextContent>birth_info</TextContent>
            </InfoCardPicker>
          )}
        </ThemedModal>
      </Container>
    </SignUpFormLayout>
  )
}

const AgeContentPicker = ({ onPress, children, isValid, hasError }) => {
  return (
    <AgePicker onPress={onPress}>
      {children}
      {isValid && !hasError ? (
        <Icon
          source={assets.static.icons.tick}
          style={{ position: 'absolute', right: 8, bottom: 10 }}
        />
      ) : null}
      {hasError ? (
        <Icon
          source={assets.static.icons.closeLine}
          style={{ position: 'absolute', right: 8, bottom: 10 }}
        />
      ) : null}
    </AgePicker>
  )
}

const Container = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`
const LocationText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 14;
  color: #28b9cb;
`

const YearText = styled(TextWithoutTranslation)`
  font-family: Roboto-Regular;
  font-size: 14;
  color: #28b9cb;
`

const ConfirmText = styled(Text)`
  font-family: Roboto-Black;
  font-size: 14;
  color: #fff;
`
const Row = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`

const AgePicker = styled.TouchableOpacity`
  width: 100%;
  height: 45px;
  border-radius: 22.5px;
  background-color: #efefef;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
`

const Confirm = styled.TouchableOpacity`
  width: 200px;
  height: 45px;
  border-radius: 22.5px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
`

const CardPicker = styled.View`
  width: 85%;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  align-self: center;
`
const InfoCardPicker = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15px;
  padding-horizontal: 15px;
`

const Heading = styled(Text)`
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10px;
  color: #a2c72d;
`

const TextContent = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10px;
`
// TODO:PH
// const ErrorMessage = styled(TextWithoutTranslation)`
//   font-size: 12
//   margin-top: 10px;
//   color: red;
//   `
