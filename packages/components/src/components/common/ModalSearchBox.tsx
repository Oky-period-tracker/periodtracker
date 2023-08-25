import React from 'react'
import styled from 'styled-components/native'
import { Icon } from './Icon'
import { assets } from '../../assets/index'
import { TextWithoutTranslation } from './Text'
import { ThemedModal } from './ThemedModal'
import { TextInput } from './TextInput'
import _ from 'lodash'
import { FlatList } from 'react-native-gesture-handler'
import { translate } from '../../i18n'
import { countries, defaultLocale, provinces } from '@oky/core'

export const ModalSearchBox = ({
  lang = defaultLocale as string, // TODO: FIXME
  hasError = false,
  containerStyle = null,
  itemStyle = null,
  height = 45,
  buttonStyle = null,
  location = null,
  isCountrySelector = true,
  searchInputPlaceholder = '',
  accessibilityLabel = '',
  filterCountry = null,
  onSelection = (val) => null,
  isValid,
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const filteredCountryCode = filterCountry ? filterCountry.code : null
  const serializeLocation = ({ item, code }: { item: string; code: string }) => {
    return `${item}, ${code}`
  }

  const deserializeLocation = (serializedLocation: string) => {
    const [item, code] = serializedLocation.split(', ')
    return { item, code }
  }

  const currentItem = location !== null ? serializeLocation(location) : null
  const items = React.useMemo(() => {
    if (isCountrySelector) {
      return _.uniq(
        Object.entries(countries).map(([code, country]) =>
          serializeLocation({ item: country[lang], code }),
        ),
      )
    }
    // -------------- Provinces -----------------------
    if (filteredCountryCode) {
      const filteredProvinces = provinces.filter(
        ({ code, uid }) => code === filteredCountryCode || uid === 0,
      )

      return _.uniq(
        filteredProvinces.map((province) =>
          serializeLocation({ item: province[lang], code: province.uid.toString() }),
        ),
      )
    }

    return _.uniq(
      provinces.map((province) => serializeLocation({ item: province[lang], code: province.code })),
    )
  }, [filteredCountryCode])

  const selectThenGoBack = (item: string) => {
    onSelection(deserializeLocation(item))
    setIsVisible(false)
  }

  return (
    <>
      <FormControl style={{ height, ...containerStyle }}>
        <Row
          accessibilityLabel={accessibilityLabel}
          onPress={() => setIsVisible(true)}
          style={{ height, alignItems: 'center', justifyContent: 'center' }}
        >
          <SelectedItem style={[itemStyle, { color: '#28b9cb' }]}>
            {location ? location.item : translate(isCountrySelector ? 'country' : 'province')}
          </SelectedItem>
        </Row>
        {isValid && !hasError && (
          <Icon
            source={assets.static.icons.tick}
            style={{ position: 'absolute', right: 8, bottom: 10 }}
          />
        )}
        {hasError && (
          <Icon
            source={assets.static.icons.closeLine}
            style={{ position: 'absolute', right: 8, bottom: 10 }}
          />
        )}
      </FormControl>
      <ThemedModal
        {...{ isVisible, setIsVisible, animationIn: 'slideInUp', animationOut: 'slideOutDown' }}
      >
        <CardPicker>
          <SearchList
            items={items}
            value={currentItem}
            onPress={selectThenGoBack}
            searchInputPlaceholder={searchInputPlaceholder}
            resultNotFoundErrorMessage={`No result found. Check your spelling, or find the nearest larger city.`} // @TODO: translation
          />
        </CardPicker>
      </ThemedModal>
    </>
  )
}

const SearchList = ({
  items,
  onPress,
  value,
  searchInputPlaceholder,
  resultNotFoundErrorMessage,
}) => {
  const [searchText, setSearchText] = React.useState('')

  const itemsFound = React.useMemo(() => {
    const normalizedSearchText = searchText.toLowerCase()

    const matchPartialResult = (item: string) => {
      const normalizedItem = item.toLowerCase()

      return (
        normalizedItem.startsWith(normalizedSearchText) ||
        normalizedSearchText.startsWith(normalizedItem)
      )
    }

    return items.filter(matchPartialResult)
  }, [items, searchText])

  const onPressRef = React.useRef(onPress)
  React.useLayoutEffect(() => {
    onPressRef.current = onPress
  })

  const renderItem = React.useCallback(
    ({ item }) => {
      const isSelected = Array.isArray(value) ? value.includes(item) : item === value
      const text = item.split(', ')[0]
      return (
        <ItemButton onPress={() => onPressRef.current(item)} isSelected={isSelected}>
          <FlatListText isSelected={isSelected}>{text}</FlatListText>
        </ItemButton>
      )
    },
    [value],
  )

  const renderItemNotFound = () => {
    return <ResultNotFoundText>{resultNotFoundErrorMessage}</ResultNotFoundText>
  }

  return (
    <Container>
      <TextInput onChange={setSearchText} label={searchInputPlaceholder} value={searchText} />
      <FlatList
        data={itemsFound}
        keyExtractor={(nothing, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        ListEmptyComponent={renderItemNotFound}
        numColumns={1}
      />
    </Container>
  )
}

const FormControl = styled.View`
  width: 100%;
  background-color: #efefef;
`

const Row = styled.TouchableOpacity`
  width: 100%;
  flex-direction: column;
`

const FlatListText = styled(TextWithoutTranslation)<{ isSelected: boolean }>`
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  text-transform: capitalize;
  font-size: 14;
  color: ${(props) => (props.isSelected ? '#fff' : '#000')};
`
const SelectedItem = styled(TextWithoutTranslation)`
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  font-size: 15;
`

const ResultNotFoundText = styled(TextWithoutTranslation)`
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  font-size: 15;
  color: grey;
`
const CardPicker = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-top: 15px;
  padding-horizontal: 15px;
`
const Container = styled.View`
  width: 100%;
  height: 350px;
`

const ItemButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  height: 50px;
  width: 90%;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 10px;
  background-color: ${(props) => (props.isSelected ? props.theme.mediumGreen : '#fff')};
  border-radius: 5px;
  elevation: 5;
`
