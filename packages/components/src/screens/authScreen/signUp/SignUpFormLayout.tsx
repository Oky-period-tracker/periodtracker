import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'

export function SignUpFormLayout({ children, onSubmit, isButtonDisabled = false }) {
  return (
    <Container>
      {children}
      <Touchable disabled={isButtonDisabled} onPress={onSubmit}>
        <HeaderText isDisabled={isButtonDisabled}>continue</HeaderText>
      </Touchable>
    </Container>
  )
}

const Touchable = styled.TouchableOpacity`
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const HeaderText = styled(Text)<{ isDisabled: boolean }>`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: ${(props) => (props.isDisabled ? `#efefef` : `#000`)};
  font-family: Roboto-Black;
`

const Container = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 2;
`
