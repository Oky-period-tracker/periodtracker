import React from 'react'
import styled from 'styled-components/native'
import { Icon } from './Icon'
import { assets } from '../../assets/index'
import { translate } from '../../i18n'
import { TouchableOpacity } from 'react-native'
import { Text } from './Text'
import { ThemedModal } from './ThemedModal'

export const TextInput = ({
  onChange = null,
  onEndEditing = null,
  label,
  secureTextEntry = false,
  hasError = false,
  isValid = false,
  style = null,
  inputStyle = null,
  keyboardType = null,
  onFocus = null,
  onBlur = null,
  multiline = false,
  showInfoButton = false,
  numberOfLines = 2,
  value,
  errorHeading = 'No error Heading',
  errorContent = 'No message',
  placeholderColor = '#28b9cb',
  infoAccessibilityLabel = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  return (
    <>
      <FormControl style={style}>
        <Row>
          <Input
            onFocus={onFocus}
            onBlur={onBlur}
            autoCorrect={false}
            placeholder={translate(label)}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onChangeText={onChange}
            onEndEditing={onEndEditing}
            placeholderTextColor={placeholderColor || '#28b9cb'}
            keyboardType={keyboardType || 'default'}
            style={{ color: '#555', ...inputStyle }}
            secureTextEntry={secureTextEntry}
            value={value}
          />
          {isValid && !hasError && (
            <Icon
              source={assets.static.icons.tick}
              style={{ position: 'absolute', right: 8, bottom: 10 }}
            />
          )}
          {hasError && (
            <Icon
              source={assets.static.icons.closeLine}
              style={{ position: 'absolute', right: 8, bottom: 10 }}
            />
          )}
          {showInfoButton && (
            <TouchableOpacity
              accessibilityLabel={infoAccessibilityLabel}
              style={{
                height: '90%',
                aspectRatio: 1,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5,
                zIndex: 999,
                bottom: '5%',
              }}
              onPress={() => setIsVisible(true)}
            >
              <Icon style={{ height: 25, aspectRatio: 1 }} source={assets.static.icons.infoPink} />
            </TouchableOpacity>
          )}
        </Row>
      </FormControl>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          <Heading accessibilityLabel={errorHeading}>{errorHeading}</Heading>
          <TextContent>{errorContent}</TextContent>
        </CardPicker>
      </ThemedModal>
    </>
  )
}

const FormControl = styled.View`
  height: 45px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`
const Row = styled.View`
  height: 100%;
  width: 100%;
  flex-direction: column;
`
const Input = styled.TextInput`
  height: 45px;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 22.5px;
  background-color: #efefef;
  border-width: 0px;
  font-family: Roboto-Regular;
  font-size: 15;
  padding-vertical: 0px;
  padding-horizontal: 10px;
`
const CardPicker = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15px;
  padding-horizontal: 15px;
`
const Heading = styled(Text)`
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10px;
  color: #a2c72d;
`
const TextContent = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10px;
`
