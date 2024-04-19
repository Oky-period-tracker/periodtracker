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
import { AppAssets, countries, provinces } from '@oky/core'

export function AskLocation({ step, createAccount }) {
  const [{ app: state }, dispatch] = useMultiStepForm()
  const lang = useSelector(selectors.currentLocaleSelector)
  const { country, province, location } = state

  const [derivedCountry, setDerivedCountry] = React.useState<{ code: string; item: string }>(
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

  const filteredCountryCode = derivedCountry ? derivedCountry.code : null

  const serializeLocation = (obj: { item: string; code: string }) => {
    if (!obj) return
    const { item, code } = obj
    return `${item}, ${code}`
  }

  const deserializeLocation = (serializedLocation: string) => {
    const [item, code] = serializedLocation.split(', ')
    return { item, code }
  }

  const countryItems = React.useMemo(() => {
    return _.uniq(
      Object.entries(countries).map(([code, c]) => serializeLocation({ item: c[lang], code })),
    )
  }, [filteredCountryCode])

  const provinceItems = React.useMemo(() => {
    if (filteredCountryCode) {
      const filteredProvinces = provinces.filter(
        ({ code, uid }) => code === filteredCountryCode || uid === 0,
      )

      return _.uniq(
        filteredProvinces.map((item) =>
          serializeLocation({ item: item[lang], code: item.uid.toString() }),
        ),
      )
    }

    return _.uniq(provinces.map((item) => serializeLocation({ item: item[lang], code: item.code })))
  }, [filteredCountryCode])

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
          currentItem={derivedCountry?.item}
          items={countryItems}
          isValid={derivedCountry !== null}
          hasError={notValid && derivedCountry === null}
          containerStyle={{
            height: 45,
            borderRadius: 22.5,
            marginBottom: 10,
          }}
          onSelection={(value) => setDerivedCountry(deserializeLocation(value))}
          height={45}
          placeholder={'country'}
          searchInputPlaceholder={`search_country`}
          accessibilityLabel={translate('search_country')}
        />
        <ModalSearchBox
          currentItem={derivedProvince?.item}
          items={provinceItems}
          isValid={derivedProvince !== null}
          hasError={notValid && derivedProvince === null}
          containerStyle={{
            height: 45,
            borderRadius: 22.5,
            marginBottom: 10,
          }}
          onSelection={(value) => {
            setDerivedProvince(deserializeLocation(value))
          }}
          height={45}
          placeholder={'province'}
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
