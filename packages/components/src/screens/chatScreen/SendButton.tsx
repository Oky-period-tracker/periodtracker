import React from 'react'
import styled from 'styled-components/native'

export const SendButton = ({ label, onPress = null }) => {
  return (
    <Button onPress={onPress}>
      <ButtonLabel>{label}</ButtonLabel>
    </Button>
  )
}

const Button = styled.TouchableOpacity`
  border-radius: 12px;
  background-color: #a2c72d;
  padding-vertical: 10;
  padding-horizontal: 30;
  margin-horizontal: 5px;
`

const ButtonLabel = styled.Text`
  color: #fff;
  font-family: Roboto-Black;
  font-size: 16;
`
