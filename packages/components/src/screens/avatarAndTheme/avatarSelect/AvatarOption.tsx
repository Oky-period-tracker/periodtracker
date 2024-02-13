import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { AvatarSelectItem } from '../AvatarSelectItem'
import { Icon } from '../../../components/common/Icon'
import { assets } from '../../../assets/index'
import { Text } from '../../../components/common/Text'

export function AvatarOption({
  avatar,
  isSelected,
  onSelect = null,
  style = null,
  nameStyle = null,
  isDisabled = false,
}) {
  return (
    <Option
      disabled={isDisabled}
      style={style}
      onPress={onSelect}
      isSelected={isSelected}
      activeOpacity={1}
    >
      <AvatarSelectItem avatarName={avatar} />
      <AvatarName style={{ textTransform: 'capitalize', ...nameStyle }}>{avatar}</AvatarName>
      {isSelected && (
        <Tick>
          <Icon source={assets.static.icons.tick} style={styles.icon} />
        </Tick>
      )}
    </Option>
  )
}

const Option = styled(TouchableOpacity)<{ isSelected: boolean }>`
  align-items: center;
  margin-bottom: 8px;
  width: 24%;
  max-width: 100px;
  max-height: 100px;
`

const Tick = styled.View`
  position: absolute;
  top: 10;
  left: 10;
  justify-content: center;
  align-items: center;
`

const AvatarName = styled(Text)`
  color: #f49200;
  font-size: 12;
  font-family: Roboto-Black;
  top: 2px;
  position: absolute;
`

const styles = StyleSheet.create({
  icon: { width: 20, height: 20 },
})
