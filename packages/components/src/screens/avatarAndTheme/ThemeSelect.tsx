import React from 'react'
import styled from 'styled-components/native'
import { ThemeSelectItem } from './ThemeSelectItem'
import { Icon } from '../../components/common/Icon'
import { assets } from '../../assets/index'
import { Text } from '../../components/common/Text'

export function ThemeSelect({ themes, value, onSelect }) {
  return (
    <Select>
      {themes.map((theme) => (
        <Option key={theme} onPress={() => onSelect(theme)} activeOpacity={0.8}>
          <ThemeSelectItem theme={theme} style={{ borderRadius: 10 }} />
          <ThemeName style={{ textTransform: 'capitalize' }}>{theme}</ThemeName>
          {value === theme && (
            <Tick>
              <Icon source={assets.static.icons.tick} style={{ width: 20, height: 15 }} />
            </Tick>
          )}
        </Option>
      ))}
    </Select>
  )
}

const Select = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
`

const Option = styled.TouchableOpacity`
  flex-basis: 48%;
  aspect-ratio: 1.509;
  margin-vertical: 10px;
  border-radius: 10px;
  elevation: 4;
`

const ThemeName = styled(Text)`
  color: #f49200;
  font-size: 14;
  font-family: Roboto-Black;
  top: 5px;
  right: 30px;
  position: absolute;
`

const Tick = styled.View`
  position: absolute;
  top: 10;
  left: 10;
  justify-content: center;
  align-items: center;
  border-radius: 15;
  width: 30;
  height: 30px;
  background-color: #fff;
`
