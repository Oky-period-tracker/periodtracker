import React from 'react'
import styled from 'styled-components/native'
import { ThemeSelectItem } from './ThemeSelectItem'
import { Icon } from '../../components/common/Icon'
import { assets } from '../../assets/index'
import { Text } from '../../components/common/Text'
import { ThemeName } from '@oky/core'
import { StyleSheet } from 'react-native'

export function ThemeSelect({
  themes,
  value,
  onSelect,
}: {
  themes: ThemeName[]
  value: ThemeName
  onSelect: (theme: ThemeName) => void
}) {
  return (
    <Container>
      {themes.map((theme) => (
        <Option key={theme} onPress={() => onSelect(theme)} activeOpacity={0.8}>
          <ThemeSelectItem theme={theme} />
          <ThemeText>{theme}</ThemeText>
          {value === theme && (
            <Tick>
              <Icon source={assets.static.icons.tick} style={styles.icon} />
            </Tick>
          )}
        </Option>
      ))}
    </Container>
  )
}

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
`

const Option = styled.TouchableOpacity`
  flex-basis: 44%;
  max-height: 200px;
  aspect-ratio: 1.5;
  margin: 4px;
  border-radius: 8px;
  elevation: 4;
`

const ThemeText = styled(Text)`
  color: #f49200;
  font-size: 14;
  font-family: Roboto-Black;
  top: 4px;
  right: 28px;
  position: absolute;
  text-transform: capitalize;
`

const Tick = styled.View`
  position: absolute;
  top: 8;
  left: 8;
  justify-content: center;
  align-items: center;
  border-radius: 15;
  width: 28px;
  height: 28px;
  background-color: #fff;
`

const styles = StyleSheet.create({
  icon: { width: 20, height: 20 },
})
