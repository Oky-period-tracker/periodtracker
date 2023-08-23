import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'

export function ForgotPasswordFormLayout({ children, onSubmit }) {
  return (
    <Container>
      <Container
        style={{
          height: 180,
          backgroundColor: 'white',
          paddingHorizontal: 15,
          elevation: 4,
        }}
      >
        {children}
      </Container>
      {onSubmit && (
        <Touchable onPress={onSubmit}>
          <HeaderText>confirm</HeaderText>
        </Touchable>
      )}
    </Container>
  )
}

const Container = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #d2d2d2;
  shadow-offset: 0px 2px;
  shadow-opacity: 2;
  shadow-radius: 2;
`

const Touchable = styled.TouchableOpacity`
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const HeaderText = styled(Text)<{ expanded: boolean }>`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: ${(props) => (props.expanded ? `#fff` : `#000`)};
  font-family: Roboto-Black;
`
