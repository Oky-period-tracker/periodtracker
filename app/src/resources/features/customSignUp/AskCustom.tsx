import React from 'react'
import { AuthCardBody } from '../../../screens/AuthScreen/components/AuthCardBody'
import { SignUpState, useSignUp } from '../../../screens/AuthScreen/components/SignUp/SignUpContext'
import { UserMetadata } from '../../../types'
import { WheelPickerModal } from '../../../components/WheelPickerModal'
import { Text } from '../../../components/Text'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../../components/Button'
import { useTranslate } from '../../../hooks/useTranslate'
import { contentOptions, disabilities, religions } from './customOptions'

export const customStepIndex = 2

export const AskCustom = () => {
  const { state, dispatch, errors } = useSignUp()
  const translate = useTranslate()

  const onChange = <K extends keyof UserMetadata>(key: K, value: UserMetadata[K]) => {
    dispatch({
      type: 'metadata',
      value: {
        ...state.metadata,
        [key]: value,
      },
    })
  }

  const accommodationOptions = disabilities.map((item) => ({
    label: translate(item.label),
    value: item.label,
    emoji: item.emoji,
  }))

  const religionOptions = religions.map((item) => ({
    label: translate(item),
    value: item,
  }))

  const initialAccommodation = accommodationOptions.find(
    (item) => item.value === state.metadata.accommodationRequirement,
  )

  const religion = state.metadata?.religion
  const initialReligion = religionOptions.find((item) => item.value === religion)
  const showVersionQuestion = religion !== 'islam' && religion === 'undisclosed_religion'

  return (
    <AuthCardBody>
      <WheelPickerModal
        initialOption={initialAccommodation}
        options={accommodationOptions}
        placeholder={'disability_question'}
        onSelect={(value) => onChange('accommodationRequirement', value?.value)}
        errors={errors}
        errorKeys={['accommodation_error']}
        errorsVisible={state.errorsVisible}
      />

      <WheelPickerModal
        initialOption={initialReligion}
        options={religionOptions}
        placeholder={'religion_question'}
        onSelect={(value) => onChange('religion', value?.value)}
        errors={errors}
        errorKeys={['religion_error']}
        errorsVisible={state.errorsVisible}
      />

      {showVersionQuestion && (
        <>
          <Text style={styles.label}>encyclopedia_version_question</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {contentOptions.map((option) => {
              const selected = state.metadata.contentSelection === option.value
              const status = selected ? 'primary' : 'basic'

              return (
                <Button
                  key={option.value}
                  status={status}
                  style={styles.segmentButton}
                  onPress={() => onChange('contentSelection', option.value)}
                >
                  <Text>{option.label}</Text>
                </Button>
              )
            })}
          </View>
        </>
      )}
    </AuthCardBody>
  )
}

export const validateCustomStep = ({
  state,
  isValid,
  errors,
}: {
  state: SignUpState
  isValid: boolean
  errors: string[]
}) => {
  if (!state.metadata.accommodationRequirement) {
    isValid = false
    errors.push('accommodation_error')
  }

  if (!state.metadata.religion) {
    isValid = false
    errors.push('religion_error')
  }

  return { isValid, errors }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
  },
  segmentButton: {
    marginTop: 8,
    marginHorizontal: 4,
  },
})
