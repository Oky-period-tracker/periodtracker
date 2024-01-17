import React from 'react'
import { decrypt, encrypt, formatPassword, hash, verifyStoreCredentials } from '../../services/auth'
import { useDispatch, useSelector } from 'react-redux'
import * as selectors from '../../redux/selectors'
import * as actions from '../../redux/actions'
import { v4 as uuidv4 } from 'uuid'
import { httpClient } from '../../services/HttpClient'

export const useEditProfile = () => {
  const reduxDispatch = useDispatch()

  const appToken = useSelector(selectors.appTokenSelector)
  const currentUser = useSelector(selectors.currentUserSelector)
  const storeCredentials = useSelector(selectors.storeCredentialsSelector)

  const [isPasswordModalVisible, setIsPasswordModalVisible] = React.useState(false)
  const [isSecretModalVisible, setIsSecretModalVisible] = React.useState(false)

  const onConfirmPassword = async ({
    answer,
    newPassword,
  }: {
    answer: string
    newPassword: string
  }) => {
    const usernameHash = hash(currentUser.name)
    const credentials = storeCredentials[usernameHash]

    if (!credentials) {
      return // TODO: ERROR ?
    }

    const secretAnswer = formatPassword(answer)

    const currentAnswerCorrect = verifyStoreCredentials({
      username: currentUser.name,
      password: secretAnswer,
      storeCredentials,
      method: 'answer',
    })

    if (!currentAnswerCorrect) {
      return // TODO: Show alert
    }

    const secretKey = decrypt(credentials.secretKeyEncryptedWithAnswer, secretAnswer)

    const password = formatPassword(newPassword)
    const secretKeyEncryptedWithPassword = encrypt(secretKey, password)

    const passwordSalt = uuidv4()
    const passwordHash = hash(password + passwordSalt)

    try {
      // TODO: Check user is guest

      await httpClient.resetPassword({
        name,
        secretAnswer,
        password,
      })

      // Update redux AFTER successful API request
      reduxDispatch(
        actions.editPassword({
          usernameHash,
          passwordSalt,
          passwordHash,
          secretKeyEncryptedWithPassword,
        }),
      )

      setIsSecretModalVisible(false)
    } catch (err) {
      // TODO: Show alert, update failed
    }
  }

  const onConfirmResetQuestion = async ({
    currentAnswer,
    newAnswer,
  }: // question,
  {
    currentAnswer: string
    newAnswer: string
    question: string
  }) => {
    const usernameHash = hash(currentUser.name)
    const credentials = storeCredentials[usernameHash]

    if (!credentials) {
      return // TODO: ERROR ?
    }

    const currentAnswerCorrect = verifyStoreCredentials({
      username: currentUser.name,
      password: currentAnswer,
      storeCredentials,
      method: 'answer',
    })

    if (!currentAnswerCorrect) {
      return // TODO: Show alert
    }

    const secretKey = decrypt(
      credentials.secretKeyEncryptedWithAnswer,
      formatPassword(currentAnswer),
    )

    const answer = formatPassword(newAnswer)
    const secretKeyEncryptedWithAnswer = encrypt(secretKey, answer)

    const answerSalt = uuidv4()
    const answerHash = hash(answer + answerSalt)

    try {
      // TODO: Check user is guest

      await httpClient.editUserSecretAnswer({
        appToken,
        previousSecretAnswer: formatPassword(currentAnswer),
        nextSecretAnswer: answer,
      })

      // Update redux AFTER successful API request
      reduxDispatch(
        actions.editAnswer({
          usernameHash,
          answerSalt,
          answerHash,
          secretKeyEncryptedWithAnswer,
        }),
      )

      setIsSecretModalVisible(false)
    } catch (err) {
      // TODO: Show alert, update failed
    }
  }

  return {
    // State
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    isSecretModalVisible,
    setIsSecretModalVisible,
    // Methods
    onConfirmPassword,
    onConfirmResetQuestion,
  }
}
