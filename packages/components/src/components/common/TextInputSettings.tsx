import React from 'react'
import styled from 'styled-components/native'
import { Icon } from './Icon'
import { Text } from './Text'
import { assets } from '../../assets/index'

export const TextInputSettings = ({
  onChange,
  onEndEditing = null,
  label,
  secureTextEntry = false,
  hasError = false,
  isValid = false,
  style = null,
  inputStyle = null,
  underlineStyle = null,
  keyboardType = null,
  onFocus = null,
  onBlur = null,
  multiline = false,
  numberOfLines = 2,
  value,
}) => {
  return (
    <FormControl style={style}>
      <Label>{label}</Label>
      <Row>
        <Input
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onChangeText={onChange}
          onEndEditing={onEndEditing}
          keyboardType={keyboardType || 'default'}
          style={{ color: '#555', ...inputStyle }}
          secureTextEntry={secureTextEntry}
          value={value}
        />
        {isValid && !hasError ? (
          <Icon
            source={assets.static.icons.tick}
            style={{ position: 'absolute', right: -30, bottom: 5 }}
          />
        ) : null}
        {hasError ? (
          <Icon
            source={assets.static.icons.closeLine}
            style={{ position: 'absolute', right: -30, bottom: 5 }}
          />
        ) : null}
      </Row>
      <Underline style={underlineStyle} />
    </FormControl>
  )
}

const FormControl = styled.View`
  width: 150;
  margin-bottom: 10;
`

const Row = styled.View`
  flex-direction: row;
`

const Label = styled(Text)`
  color: #28b9cb;
  width: 150;
  font-size: 12;
`
const Input = styled.TextInput`
  height: 25px;
  width: 100%;
  border-width: 0;
  font-size: 18;
  padding-vertical: 0;
  padding-horizontal: 0;
`

const Underline = styled.View`
  height: 1px;
  width: 100%;
  background: #eaeaea;
`
