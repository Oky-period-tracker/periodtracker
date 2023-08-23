import React from 'react'
import { Dimensions, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { useDispatch } from 'react-redux'
import { defaultAvatar } from '../themes'
import { RAPIDPRO_TRIGGER_WORDS } from '../config'
import { useSelector } from '../hooks/useSelector'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { Header } from '../components/common/Header'
import { Message } from './chatScreen/Message'
import { SendButton } from './chatScreen/SendButton'
import { ChatMessage } from '../types'

function useChat() {
  const dispatch = useDispatch()
  const { messages, ruleSet, isReady, isFlowRunning } = useSelector((state) => state.chat)

  React.useEffect(() => {
    dispatch(actions.setupChat())
  }, [])

  return {
    sendMessage(message) {
      dispatch(actions.sendChatMessage(message))
    },
    messages,
    ruleSet,
    isReady,
    isFlowRunning,
  }
}

const chatBoxHeight = Dimensions.get('window').height - 142

const initFlowAction = {
  message: {
    direction: 'out',
    id: null,
    sentAt: null,
    text: 'Hello! Press the button below to start!', // @TODO: change, and add translations
  },
  startFlow: (sendMessage, currentLanguage) => {
    const word = RAPIDPRO_TRIGGER_WORDS[currentLanguage]
    if (word) {
      sendMessage(word)
    }
  },
  labelButton: 'Start!', // @TODO: change and add translations
}

export function ChatScreen() {
  const chat = useChat()
  const avatar = useSelector((state) => state.app.avatar)
  const locale = useSelector(selectors.currentLocaleSelector)
  const [text, setText] = React.useState('')
  const messages = [...chat.messages, initFlowAction.message].slice().reverse()

  const scrollView = React.useRef<any>()

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle={'chat'} />
        <ChatBox
          ref={scrollView}
          onContentSizeChange={(_) => scrollView.current.scrollToEnd({ animated: true })}
          contentContainerStyle={{ justifyContent: 'flex-end' }}
        >
          {chat.isReady ? (
            messages.map((message: ChatMessage, index) => (
              <Message key={index} avatar={avatar || defaultAvatar} message={message} />
            ))
          ) : (
            <ActivityIndicator size={`large`} />
          )}
        </ChatBox>
        {!chat.isFlowRunning ? (
          <SendButton
            label={initFlowAction.labelButton}
            onPress={() => {
              initFlowAction.startFlow(chat.sendMessage, locale)
            }}
          />
        ) : (
          <InputContainer>
            <InputBox onChangeText={setText} value={text} placeholder={`Type a message...`} />
            <SendButton
              label={`>`}
              onPress={() => {
                if (!text) {
                  return
                }

                setText('')
                chat.sendMessage(text)
              }}
            />
          </InputContainer>
        )}
      </PageContainer>
    </BackgroundTheme>
  )
}

const PageContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  padding-horizontal: 10px;
  padding-bottom: 10;
`

const ChatBox = styled.ScrollView`
  height: ${chatBoxHeight};
  padding-bottom: 10;
`

const InputContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  padding-top: 10;
`

const InputBox = styled.TextInput`
  flex: 1;
  height: 42;
  background-color: #f4f4f4;
  border-radius: 21;
  elevation: 1;
  padding-horizontal: 15;
`
