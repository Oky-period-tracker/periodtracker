import React from 'react'
import styled from 'styled-components/native'
import { WheelPicker } from 'react-native-wheel-picker-android'
import moment from 'moment'
import _ from 'lodash'
import { Text, TextWithoutTranslation } from './Text'
import { ThemedModal } from './ThemedModal'
import { translate } from '../../i18n'
import { Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'

const now = moment()
const currentYear = now.year()
const currentMonth = now.month()
const monthRange = moment.months()
const yearRange = _.range(currentYear, currentYear - 100).map(String)

export function DateOfBirthInput({ style, textStyle = null, label, onChange, value }) {
  const dateOfBirth = value && moment(value)
  const selectedMonth = dateOfBirth ? dateOfBirth.month() : currentMonth
  const selectedYear = dateOfBirth ? currentYear - dateOfBirth.year() : currentYear - 13
  const [isVisible, setIsVisible] = React.useState(false)
  const [monthSelected, setMonthSelected] = React.useState('')
  const [yearSelected, setYearSelected] = React.useState('')

  return (
    <>
      <FormControl style={style}>
        <Label>{label}</Label>
        <Input onPress={() => setIsVisible(true)}>
          <InputValue style={textStyle}>
            {dateOfBirth && translate(dateOfBirth.format('MMM')) + ' ' + dateOfBirth.format('YYYY')}
          </InputValue>
        </Input>
        <Underline />
      </FormControl>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          {Platform.OS === 'ios' ? (
            <Column>
              <Picker
                style={{ width: '50%', height: 200, marginBottom: 20 }}
                selectedValue={monthSelected || monthRange[selectedMonth]}
                onValueChange={(itemValue, itemIndex) => setMonthSelected(monthRange[itemIndex])}
              >
                {monthRange.map((item, index) => (
                  <Picker.Item
                    label={`${translate(item)}`}
                    value={`${translate(item)}`}
                    key={index}
                  />
                ))}
              </Picker>
              <Picker
                style={{ width: '50%', height: 200, marginBottom: 20 }}
                selectedValue={yearSelected || yearRange[selectedYear]}
                onValueChange={(itemValue, itemIndex) => setYearSelected(yearRange[itemIndex])}
              >
                {yearRange.map((item, index) => (
                  <Picker.Item label={item} value={item} key={index} />
                ))}
              </Picker>
            </Column>
          ) : (
            <Column>
              <WheelPicker
                style={{ width: '50%', height: 200 }}
                // @ts-ignore
                itemStyle={{ height: Platform.OS === 'ios' ? 132 : 44 }}
                selectedItem={selectedMonth}
                data={monthRange.map((item) => `${translate(item)}`)}
                onItemSelected={(option) => setMonthSelected(monthRange[option])}
              />
              <WheelPicker
                style={{ width: '50%', height: 200 }}
                // @ts-ignore
                itemStyle={{ height: Platform.OS === 'ios' ? 132 : 44 }}
                selectedItem={selectedYear}
                data={yearRange}
                onItemSelected={(option) => setYearSelected(yearRange[option])}
              />
            </Column>
          )}
          <Confirm
            onPress={() => {
              onChange(moment(monthSelected + ' ' + yearSelected, 'MMMM YYYY').toISOString())
              setIsVisible(false)
            }}
          >
            <ConfirmText>confirm</ConfirmText>
          </Confirm>
        </CardPicker>
      </ThemedModal>
    </>
  )
}

const Column = styled.View`
  flex-direction: row;
  width: 100%;
`

const FormControl = styled.View`
  width: 150;
  margin-bottom: 10;
`

const Label = styled(Text)`
  color: #28b9cb;
  width: 150;
  font-size: 12;
`

const Input = styled.TouchableOpacity`
  width: 100%;
  height: 25px;
`

const InputValue = styled(TextWithoutTranslation)`
  font-size: 16;
`

const Underline = styled.View`
  height: 1px;
  width: 100%;
  background: #eaeaea;
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
const ConfirmText = styled(Text)`
  font-family: Roboto-Black;
  font-size: 14;
  color: #fff;
`
