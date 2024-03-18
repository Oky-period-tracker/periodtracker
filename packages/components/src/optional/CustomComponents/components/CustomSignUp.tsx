import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'
import { BodyFontSize, SubTitleFontSize } from '../../../fonts/fontsGlobal'
import { disabilityQs, genderIdentityOptions, religionOptions } from '../config'
import { GenderIdentitySelectItem } from './GenderIdentitySelectItem'
import { AccommodationRequirementSelectItem } from './AccommodationRequirementSelectItem'
import { VerticalSelectBox } from '../../../components/common/VerticalSelectBox'

export const CustomSignUp = ({ dispatch, state }) => {
  const { genderIdentity, accommodationRequirement, encyclopediaVersion, religion } = state

  return (
    <>
      <GenderIdentityText>your_gender_identity</GenderIdentityText>
      <Row>
        {genderIdentityOptions.map((value) => {
          return (
            <GenderIdentitySelectItem
              key={value}
              genderIdentity={value}
              isActive={genderIdentity === value}
              onPress={() =>
                dispatch({ type: 'change-form-data', inputName: 'genderIdentity', value })
              }
            />
          )
        })}
      </Row>

      <DisabilityText>disability_question</DisabilityText>
      <Column>
        {disabilityQs.map((value) => (
          <AccommodationRequirementSelectItem
            key={value}
            accommodationRequirement={value}
            isActive={accommodationRequirement === value}
            onPress={() =>
              dispatch({
                type: 'change-form-data',
                inputName: 'accommodationRequirement',
                value,
              })
            }
          />
        ))}
      </Column>

      <ReligionText>religion_question</ReligionText>
      <VerticalSelectBox
        items={religionOptions.map((option) => (option ? option : ''))}
        containerStyle={{
          height: 45,
          borderRadius: 22.5,
        }}
        height={45}
        maxLength={20}
        buttonStyle={{ right: 5, bottom: 7 }}
        onValueChange={(value) => {
          dispatch({ type: 'change-form-data', inputName: 'religion', value })

          if (value === 'islam') {
            dispatch({
              type: 'change-form-data',
              inputName: 'encyclopediaVersion',
              value: 'Yes',
            })
          } else {
            dispatch({
              type: 'change-form-data',
              inputName: 'encyclopediaVersion',
              value: 'No',
            })
          }
        }}
        hasError={true} // this is to permanently display the i button
        errorHeading="religion_perspective_heading"
        errorContent="religion_perspective_content"
      />

      {religion !== 'islam' && religion === 'undisclosed_religion' && (
        <>
          <EncyclopediaVersionText>encyclopedia_version_question</EncyclopediaVersionText>
          <VerticalSelectBox
            items={['No', 'Yes'].map((option) => (option ? option : ''))}
            containerStyle={{
              height: 45,
              borderRadius: 22.5,
            }}
            height={45}
            maxLength={20}
            buttonStyle={{ right: 5, bottom: 7 }}
            onValueChange={(value) =>
              dispatch({ type: 'change-form-data', inputName: 'encyclopediaVersion', value })
            }
            hasError={encyclopediaVersion === 'Yes'}
            errorHeading="islamic_perspective_heading"
            errorContent="islamic_perspective_content"
          />
        </>
      )}
    </>
  )
}

const GenderIdentityText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${SubTitleFontSize};
  margin-bottom: 10px;
  margin-top: 20px;
  color: #28b9cb;
  text-align: center;
`

const DisabilityText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${SubTitleFontSize};
  margin-bottom: 10px;
  margin-top: 20px;
  color: #28b9cb;
  text-align: center;
`

const ReligionText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${SubTitleFontSize};
  margin-bottom: 10px;
  margin-top: 20px;
  color: #28b9cb;
`

const EncyclopediaVersionText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${BodyFontSize};
  margin-bottom: 10px;
  margin-top: 40px;
  color: #28b9cb;
  text-align: center;
`

const Row = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`

const Column = styled.View`
  width: 80%;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`
