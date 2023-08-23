import React from 'react'
import { WheelPicker } from 'react-native-wheel-picker-android'
import { translate } from '../i18n'
import { Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'

export const WheelPickerContent = ({
  optionsRange,
  optionsUnit,
  setQuestionAnswer,
  answersData,
  questionAnswer,
  id,
}) => {
  return (
    <>
      {Platform.OS === 'ios' ? (
        <Picker
          style={{
            width: 300,
            height: 200,
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
          selectedValue={(questionAnswer + 1).toString()}
          onValueChange={(itemValue, itemIndex) => {
            setQuestionAnswer({
              data: answersData.data.map((item) =>
                item.id === id ? { ...item, answer: itemIndex } : item,
              ),
            })
          }}
        >
          {optionsRange.map((item, index) => (
            <Picker.Item
              label={`${item} ${
                item === 1 ? translate(optionsUnit[0]) : translate(optionsUnit[1])
              }`}
              value={`${item}`}
              key={index}
            />
          ))}
        </Picker>
      ) : (
        <WheelPicker
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            width: 300,
            height: 200,
          }}
          itemTextSize={18}
          selectedItemTextSize={18}
          // @ts-ignore
          itemStyle={{ height: Platform.OS === 'ios' ? 150 : 50 }}
          selectedItem={questionAnswer}
          data={optionsRange.map(
            (option) =>
              `${option} ${option === 1 ? translate(optionsUnit[0]) : translate(optionsUnit[1])}`,
          )}
          onTouchStart={() => false}
          onItemSelected={(index) => {
            setQuestionAnswer({
              data: answersData.data.map((item) =>
                item.id === id ? { ...item, answer: index } : item,
              ),
            })
          }}
        />
      )}
    </>
  )
}
