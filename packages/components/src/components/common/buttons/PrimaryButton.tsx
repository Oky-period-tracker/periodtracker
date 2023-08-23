import React from 'react'
import { Text as BaseText } from '../Text'
import styled from 'styled-components/native'
import { Icon } from '../Icon'
import { assets } from '../../../assets/index'

export function PrimaryButton({ children, ...props }) {
  return (
    <Button {...props} activeOpacity={0.7}>
      <Text style={props.textStyle}>{children}</Text>
      {props.rightIcon ? (
        <Icon
          style={{
            position: 'absolute',
            right: 10,
            top: 7,
            width: 35,
            height: 35,
          }}
          source={assets.static.icons[props.rightIcon]}
        />
      ) : null}
    </Button>
  )
}

const Button = styled.TouchableOpacity`
  margin-horizontal: 2px;
  margin-vertical: 2px;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: white;
  elevation: 4;
  border-radius: 10px;
`

const Text = styled(BaseText)`
  font-family: Roboto-Black;
  font-size: 16;
  text-align: center;
  color: #000;
`
