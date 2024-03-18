import React from 'react'
import styled from 'styled-components/native'
import { assets } from '../../../assets/index'
import { BodyFontSize } from '../../../fonts/fontsGlobal'
import { View, Text } from 'react-native'
import { translate } from '../../../i18n'

export const AccommodationRequirementSelectItem = ({
  accommodationRequirement,
  onPress,
  isActive,
}) => {
  return (
    <Touchable onPress={onPress}>
      <Block isActive={isActive}>
        <View style={{ width: '20%' }}>
          <AccommodationRequirementIcon
            source={assets.static.icons[accommodationRequirement]}
            resizeMode="center"
          />
        </View>
        <View style={{ width: '80%', flexDirection: 'row' }}>
          <Text
            numberOfLines={2}
            style={{
              flexWrap: 'wrap',
              flex: 1,
              fontFamily: 'Roboto-Regular',
              fontSize: BodyFontSize,
              color: isActive ? 'white' : '#DB307A',
              textAlign: 'left',
              paddingLeft: 5,
            }}
          >
            {translate(accommodationRequirement)}
          </Text>
        </View>
      </Block>
    </Touchable>
  )
}

const Block = styled.View`
  padding: 5px;
  width: 300;
  align-items: center;
  border-radius: 25;
  flex-direction: row;
  margin-bottom: 10;
  background-color: ${(props) => (props.isActive ? '#A4D223' : 'lightgrey')};
  opacity: ${(props) => (props.isActive ? 1 : 0.4)};
`

const Touchable = styled.TouchableOpacity``

const AccommodationRequirementIcon = styled.ImageBackground`
  width: 100%;
  height: 40px;
  justify-content: center;
  align-items: center;
`
