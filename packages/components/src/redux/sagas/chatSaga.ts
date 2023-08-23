import { eventChannel } from 'redux-saga'
import { all, call, select, put, takeLatest } from 'redux-saga/effects'
import messaging from '@react-native-firebase/messaging'
import _ from 'lodash'
import { ExtractActionFromActionType } from '../types'
import { ReduxState } from '../store'
import * as actions from '../actions'
import { httpClient } from '../../services/HttpClient'

function* getCredentials() {
  const fcmToken = yield messaging().getToken()
  const { auth }: ReduxState = yield select()
  if (auth.user && auth.user.id) {
    return {
      urn: `external:${auth.user.id}`,
      fcmToken,
      name: auth.user.name,
    }
  }
  return {
    urn: `fcm:${fcmToken}`,
    fcmToken,
    name: null,
  }
}

function* createFirebaseChannel() {
  return eventChannel((emit) => {
    return messaging().onNotificationOpenedApp((message) => {
      emit(message)
    })
  })
}

function* subscribeToFirebase() {
  // ask permissions
  while (!(yield messaging().hasPermission())) {
    try {
      yield messaging().requestPermission()
    } catch (error) {
      console.error(error)
    }
  }

  const channel = yield call(createFirebaseChannel)
  yield takeLatest(channel, function* () {
    yield put(actions.refreshChatMessages())
  })
}

function* onSetupChat() {
  try {
    const { urn, fcmToken, name } = yield getCredentials()

    const { contact } = yield httpClient.registerContact({
      urn,
      fcmToken,
      name,
    })

    yield put(actions.setChatContact(contact))
    yield put(actions.refreshChatMessages())
    yield call(subscribeToFirebase)
  } catch (err) {
    // ignore
  }
}

function* onSendChatMessage(action: ExtractActionFromActionType<'SEND_CHAT_MESSAGE'>) {
  const { message: msg } = action.payload
  const { urn, fcmToken } = yield getCredentials()
  yield httpClient.receiveIncomingMessage({
    from: urn,
    fcmToken,
    msg,
  })

  const { chat }: ReduxState = yield select()
  yield put(
    actions.setChatMessages({
      messages: [
        {
          id: null,
          direction: 'in',
          text: msg,
          sentAt: null,
        },
        ...chat.messages,
      ],
      rules: [],
      isFlowRunning: true,
    }),
  )
}

function* getCurrentRuleSet(contact) {
  const runs = yield httpClient.getRuns(contact)
  const activeRun = runs.results.find((result) => result.exit_type === null)
  if (!activeRun) {
    return
  }

  if (activeRun.path.length === 0) {
    return
  }

  const flowId = activeRun.flow.uuid
  const flowCurrentNodeId = _.last<any>(activeRun.path).node

  const definitions = yield httpClient.getDefinitions(flowId)
  const currentRuleSet = definitions.flows[0].rule_sets.find(
    (rule) => rule.uuid === flowCurrentNodeId,
  )
  const ruleSet = currentRuleSet.rules.map((rule) => {
    return rule.category.eng
  })

  return ruleSet
}

function* onRefreshChatMessages() {
  const {
    chat: { contact },
  }: ReduxState = yield select()
  if (!contact) {
    return
  }

  const messages = yield httpClient.getMessages(contact)
  const rules = yield call(getCurrentRuleSet, contact)
  if (rules) {
    return yield put(actions.setChatMessages({ messages, rules, isFlowRunning: true }))
  }

  yield put(actions.setChatMessages({ messages, rules: [], isFlowRunning: false }))
}

export function* chatSaga() {
  yield all([
    takeLatest('SETUP_CHAT', onSetupChat),
    takeLatest('SEND_CHAT_MESSAGE', onSendChatMessage),
    takeLatest('REFRESH_CHAT_MESSAGES', onRefreshChatMessages),
  ])
}
