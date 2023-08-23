import React from 'react'
import styled from 'styled-components/native'
import { AvatarOption } from './avatarSelect/AvatarOption'

const Select = styled.View`
  flex-direction: row;
  width: 100%;
  margin-horizontal: 3px;
  flex-wrap: wrap;
  margin-right: 5;
`
export function AvatarSelect({ avatars, value, onSelect }) {
  return (
    <Select>
      {avatars.map((avatar) => (
        <AvatarOption
          key={avatar}
          avatar={avatar}
          isSelected={value === avatar}
          onSelect={() => onSelect(avatar)}
          style={{ width: '24%' }}
        />
      ))}
    </Select>
  )
}
