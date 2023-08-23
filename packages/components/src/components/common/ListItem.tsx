import React from 'react'
import styled from 'styled-components/native'
import { Text } from './Text'

export const ListItem = ({
  title = null,
  description = null,
  renderControls = null,
  style = null,
}) => {
  return (
    <Container>
      <Row style={style}>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {renderControls && <Selectors>{renderControls()}</Selectors>}
      </Row>
    </Container>
  )
}
const Container = styled.View`
  flex: 1;
  padding-horizontal: 2px;
`

const Row = styled.View`
  height: 100%;
  flex-direction: row;
  padding-horizontal: 10px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`
const Title = styled(Text)`
  width: 33%;
  font-size: 16;
  text-align: left;
  font-family: Roboto-Black;
  text-transform: capitalize;
  padding-right: 10px;
  padding-left: 10px;
  color: #000;
`

const Description = styled(Text)`
  flex: 1;
  font-size: 12;
  color: #000;
`

const Selectors = styled.View`
  flex: 0.8;
  align-items: flex-end;
`
