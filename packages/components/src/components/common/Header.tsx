import React from 'react'
import styled from 'styled-components/native'
import { IconButton } from './buttons/IconButton'
import { TextWithoutTranslation } from './Text'
import { BackOneScreen } from '../../services/navigationService'
import { translate } from '../../i18n'

export const Header = ({
  showGoBackButton = true,
  showScreenTitle = true,
  onPressBackButton = null,
  screenTitle,
  LeftComponent = null,
  style = null,
  textStyle = null,
}) => {
  return (
    <Container style={style}>
      {showGoBackButton && !LeftComponent && (
        <IconButton
          accessibilityLabel={translate('arrow_buton')}
          onPress={onPressBackButton || (() => BackOneScreen())}
          name="back"
        />
      )}
      {LeftComponent && <LeftComponent />}
      {showScreenTitle && (
        <TextWithoutTranslation
          style={{
            flex: 1,
            color: '#F49200',
            fontFamily: 'Roboto-Black',
            fontSize: 22,
            textAlign: 'right',
            ...textStyle,
          }}
        >
          {capitalizeFLetter(translate(screenTitle))}
        </TextWithoutTranslation>
      )}
    </Container>
  )
}

const capitalizeFLetter = (inputString): string => {
  if (inputString.length === 0) return ''
  return inputString[0].toUpperCase() + inputString.slice(1)
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 10px;
  margin-vertical: 10px;
  height: 35px;
  z-index: 9;
`
