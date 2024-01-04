import React from 'react'
import styled from 'styled-components/native'
import { AvatarOption } from './avatarSelect/AvatarOption'
import { AvatarName } from '@oky/core'

export function AvatarSelect({
  avatars,
  value,
  onSelect,
}: {
  avatars: AvatarName[]
  value: AvatarName
  onSelect: (avatar: AvatarName) => void
}) {
  return (
    <Container>
      {avatars.map((avatar) => (
        <AvatarOption
          key={avatar}
          avatar={avatar}
          isSelected={value === avatar}
          onSelect={() => onSelect(avatar)}
        />
      ))}
    </Container>
  )
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`
