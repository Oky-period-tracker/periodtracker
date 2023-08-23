import React from 'react'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'
import { ChatMessage } from '../../types'
import moment from 'moment'

export const Message = ({ avatar, message }: { avatar: string; message: ChatMessage }) => {
  const wasReceived = message.direction === 'out'
  const wasSent = message.direction === 'in'

  return (
    <ChatRow wasSent={wasSent}>
      {wasReceived ? (
        <SmallAvatar source={assets.avatars[avatar].theme} style={{ backgroundColor: 'white' }} />
      ) : null}
      {wasReceived ? <ReceivedMessageTriangle /> : null}

      <MessageBox wasSent={wasSent}>
        <MessageText>{message.text}</MessageText>
        <MessageTime>{message.sentAt ? moment(message.sentAt).format('HH:mm') : 'now'}</MessageTime>
      </MessageBox>
      {wasSent ? <SentMessageTriangle /> : null}
    </ChatRow>
  )
}

const SmallAvatar = styled.Image`
  width: 30;
  height: 30px;
  border-radius: 10px;
  margin-right: 5;
`

const ChatRow = styled.View<{ wasSent: boolean }>`
  flex-direction: row;
  margin-vertical: 8px;
  justify-content: ${(props) => (props.wasSent ? 'flex-end' : 'flex-start')};
`

const MessageBox = styled.View<{ wasSent: boolean }>`
  background-color: ${(props) => (props.wasSent ? '#e1ffc7' : '#FFF')};
  border-radius: 5px;
  border-top-right-radius: ${(props) => (props.wasSent ? 0 : 5)};
  max-width: 80%;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
`

const MessageText = styled.Text`
  font-size: 14;
  padding-bottom: 5px;
  color: #000;
  width: 80%;
`

const MessageTime = styled.Text`
  font-size: 11;
  color: #a39f98;
`

const ReceivedMessageTriangle = styled.View`
  flex-direction: row;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-top-width: 5px;
  border-right-width: 10px;
  border-bottom-width: 5px;
  top: 10px;
  border-left-width: 0;
  border-top-color: transparent;
  border-right-color: white;
  border-bottom-color: transparent;
  border-left-color: transparent;
  position: relative;
  left: 0px;
`

const SentMessageTriangle = styled.View`
  flex-direction: row;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-top-width: 10px;
  border-right-width: 7px;
  border-bottom-width: 0px;
  top: 0;
  border-left-width: 0;
  border-top-color: #e1ffc7;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  position: relative;
  left: 0;
`

const AnswersSection = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 15px;
  width: 100%;
  justify-content: center;
`
