import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { Text } from '../../../components/common/Text'

export const ListItem = ({
  title = null,
  subtitle = null,
  renderControls = null,
  innerStyle = null,
  style = null,
}) => {
  return (
    <Container {...{ style }}>
      <Row
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#DDD',
          ...innerStyle,
        }}
      >
        <Col style={{ width: titleBlockWidth, paddingRight: 30 }}>
          <Title style={{ textTransform: 'capitalize' }}>{title}</Title>
          {subtitle ? <Description>{subtitle}</Description> : null}
        </Col>
        {renderControls ? <Controls>{renderControls()}</Controls> : null}
      </Row>
    </Container>
  )
}

const Container = styled.View`
  padding-horizontal: 2px;
`

const titleBlockWidth = Math.round(Dimensions.get('window').width * 0.625)

const Row = styled.View`
  flex-direction: row;
  padding-left: 43;
  padding-right: 21;
  padding-vertical: 16;
  align-items: center;
`

const Title = styled(Text)`
  font-size: 26;
  font-family: Roboto-Black;
  color: #000;
`
const Description = styled(Text)`
  font-size: 16;
  color: #000;
`

const Col = styled.View`
  flex: 1;
`

const Controls = styled.View`
  flex: 1;
`
