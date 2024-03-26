import React from 'react'
import _, { transform } from 'lodash'
import styled from 'styled-components/native'
import { SignUpFormLayout } from './SignUpFormLayout'
import { useMultiStepForm } from '../../../components/common/MultiStepForm'
import { Text } from '../../../components/common/Text'
import { SegmentControl } from '../../../components/common/SegmentControl'
import { formHeights } from './FormHeights'
import { ModalSearchBox } from '../../../components/common/ModalSearchBox'
import { useSelector } from '../../../hooks/useSelector'
import * as selectors from '../../../redux/selectors'
import { translate } from '../../../i18n'
import { FAST_SIGN_UP } from '../../../config'
import { AppAssets } from '@oky/core'

export function AskLocation({ step, createAccount }) {
  const [{ app: state }, dispatch] = useMultiStepForm()
  const lang = useSelector(selectors.currentLocaleSelector)
  const { country, province, location } = state
  const [derivedCountry, setDerivedCountry] = React.useState(
    FAST_SIGN_UP ? { code: 'AF', item: 'Afghanistan' } : null,
  )
  const [derivedProvince, setDerivedProvince] = React.useState(
    FAST_SIGN_UP ? { code: '15', item: 'Ghazni' } : null,
  )
  const [notValid, setNotValid] = React.useState(false)

  React.useEffect(() => {
    if (derivedCountry !== null && derivedCountry.code !== country) {
      dispatch({ type: 'change-form-data', inputName: 'country', value: derivedCountry.code })
      return
    }
    if (derivedProvince !== null && derivedProvince.code !== province) {
      dispatch({ type: 'change-form-data', inputName: 'province', value: derivedProvince.code })
      return
    }
  }, [derivedCountry, derivedProvince])

  function checkValidity() {
    return location.length >= 4 && derivedProvince !== null && derivedCountry !== null
  }

  const locations: Array<keyof AppAssets['static']['icons']> = ['Urban', 'Rural']

  return (
    <SignUpFormLayout
      isValid={checkValidity()}
      onSubmit={() => {
        if (!checkValidity()) {
          setNotValid(true)
          return
        }
        createAccount(state)
      }}
    >
      <Container
        style={{
          height: formHeights.askLocation,
          paddingHorizontal: 15,
          elevation: 4,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        <ModalSearchBox
          isValid={derivedCountry !== null}
          hasError={notValid && derivedCountry === null}
          lang={lang}
          containerStyle={{
            height: 45,
            borderRadius: 22.5,
            marginBottom: 10,
          }}
          location={derivedCountry}
          onSelection={setDerivedCountry}
          height={45}
          buttonStyle={{ right: 5, bottom: 7 }}
          searchInputPlaceholder={`search_country`}
          accessibilityLabel={translate('search_country')}
        />
        <ModalSearchBox
          isValid={derivedProvince !== null}
          hasError={notValid && derivedProvince === null}
          containerStyle={{
            height: 45,
            borderRadius: 22.5,
            marginBottom: 10,
          }}
          lang={lang}
          isCountrySelector={false}
          filterCountry={derivedCountry}
          location={derivedProvince}
          onSelection={setDerivedProvince}
          height={45}
          buttonStyle={{ right: 5, bottom: 7 }}
          searchInputPlaceholder={`search_province`}
        />
        <LocationText>location</LocationText>
        <Row>
          {locations.map((value) => {
            return (
              <SegmentControl
                key={value}
                option={value}
                isActive={location === value}
                onPress={() => dispatch({ type: 'change-form-data', inputName: 'location', value })}
              />
            )
          })}
        </Row>
      </Container>
    </SignUpFormLayout>
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

const Row = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10;
`
