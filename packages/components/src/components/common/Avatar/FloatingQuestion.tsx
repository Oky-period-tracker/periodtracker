import React from 'react'
import styled from 'styled-components/native'

export const FloatingQuestion = ({ children, containerStyle = null }) => {
  return (
    <Container style={containerStyle}>
      <Dialog>{children}</Dialog>
      <Triangle />
    </Container>
  )
}

const Container = styled.View``

const Dialog = styled.View`
  width: 150;
  padding-horizontal: 16;
  padding-vertical: 10;
  border-radius: 14;
  background: #ffffff;
  elevation: 3;
  position: relative;
`

const Triangle = styled.View`
  flex-direction: row;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-top-width: 22;
  border-right-width: 13;
  border-bottom-width: 0;
  border-left-width: 0;
  border-top-color: white;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  position: relative;
  left: 20;
`
