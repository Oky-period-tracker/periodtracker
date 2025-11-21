import React from 'react'
import { Checkbox } from '../../../../components/Checkbox'
import { Input } from '../../../../components/Input'
import { getSurveyQuestionOptions, useSurvey } from './SurveyContext'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'

export const SurveyCollect = () => {
  const { state, dispatch } = useSurvey()

  const onCheckboxPress = (value: number) => {
    dispatch({ type: 'select_answer', value })
  }

  const setAnswerDraft = (value: string) => {
    dispatch({ type: 'answerDraft', value })
  }

  if (!state.survey) {
    return null
  }

  const currentQuestion = state.survey.questions[state.questionIndex]

  const options = getSurveyQuestionOptions(currentQuestion)

  const isMultiple = currentQuestion?.is_multiple

  return (
    <>
      {isMultiple ? (
        <ScrollView style={styles.scrollContainer}
        contentContainerStyle = {styles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
          {options.map((option, i) => {
            const checked = state.answerIndex === i
            const onPress = () => {
              onCheckboxPress(i)
            }

            return (
              <Checkbox
                key={`survey-${i}`}
                label={option}
                onPress={onPress}
                checked={checked}
                checkedStatus={'danger'}
                checkedTextStatus={'danger'}
                enableTranslate={false}
              />
            )
          })}
        </ScrollView>
      ) : (
        <Input
          value={state.answerDraft}
          onChangeText={setAnswerDraft}
          placeholder={'type_answer_placeholder'}
          multiline={true}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  scrollContainer:{
    maxHeight:Dimensions.get("window").height * 0.35,
    marginBottom:0
  },
  scrollContent:{
    paddingBottom:0
  }
})