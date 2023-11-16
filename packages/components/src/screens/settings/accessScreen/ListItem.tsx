import React from 'react'
import styled from 'styled-components/native'
import { Dimensions, StyleSheet, ViewStyle } from 'react-native'
import { Text } from '../../../components/common/Text'

export const ListItem = ({
  title = null,
  subtitle = null,
  renderControls = null,
  innerStyle = null,
  style = null,
}: {
  title?: string | null
  subtitle?: string | null
  renderControls?: () => React.ReactNode
  innerStyle?: ViewStyle
  style?: ViewStyle
}) => {
  return (
    <Container style={style}>
      <Row style={innerStyle}>
        <Col>
          <Title style={styles.capitalize}>{title}</Title>
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

const Row = styled.View`
  flex-direction: row;
  padding-left: 43;
  padding-right: 21;
  padding-vertical: 16;
  align-items: center;
  justify-content: space-between;
  border-color: #ddd;
  border-bottom-width: 1px;
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
  flex-basis: 50%;
`

const Controls = styled.View``

const styles = StyleSheet.create({
  capitalize: {
    textTransform: 'capitalize',
  },
})
