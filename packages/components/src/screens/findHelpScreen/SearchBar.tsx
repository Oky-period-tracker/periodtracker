import React, { FunctionComponent } from 'react'
import { View, TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FindHelpFilter } from './FindHelpFilter'
import styled from 'styled-components/native'
import { Icon } from '../../components/common/Icon'
import { translate } from '../../i18n'
import { useHapticAndSound } from '../../hooks/useHapticAndSound'
import { assets } from '../../assets'

interface ISearchBar {
  isFilterActive: boolean
  setFilterActive: (b: boolean) => void
  onGlobalFilter: (s: string) => void
  onFilterByAttribute: (s: string[] | number[]) => void
  onFilterByLocation: (s: string[]) => void
  onFilterHelpCenter: (attributeIds: number[], locationCode: string[]) => void
}

export const SearchBar: FunctionComponent<ISearchBar> = ({
  isFilterActive,
  setFilterActive,
  onGlobalFilter,
  onFilterByAttribute,
  onFilterByLocation,
  onFilterHelpCenter,
}) => {
  const hapticAndSoundFeedback = useHapticAndSound()

  return (
    <>
      {isFilterActive && (
        <FindHelpFilter
          onFilterHelpCenter={onFilterHelpCenter}
          onFilterByAttribute={onFilterByAttribute}
          onFilterByLocation={onFilterByLocation}
          setFilterActive={setFilterActive}
        />
      )}
      {!isFilterActive && (
        <Row>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 42,
              elevation: isFilterActive ? 0 : 2,
              marginHorizontal: 2,
              flexGrow: 7,
              flexShrink: 1,
              flexBasis: 0,
              borderRadius: 50,
              height: 40,
              justifyContent: 'center',
              flex: 7,
            }}
          >
            <TextInput
              placeholder={translate('type_to_search')}
              placeholderTextColor="gray"
              onChangeText={onGlobalFilter}
              style={{ color: '#000000' }}
            />
          </View>
          <View
            style={{
              flex: 1,
              margin: 'auto',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                hapticAndSoundFeedback('general')
                setFilterActive(!isFilterActive)
              }}
            >
              <Icon source={assets.static.icons.filter} />
            </TouchableOpacity>
          </View>
        </Row>
      )}
    </>
  )
}

const Row = styled.View`
  flex-direction: row;
`
