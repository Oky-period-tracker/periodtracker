import React from 'react'
import {Platform, Alert, KeyboardAvoidingView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Input } from '../../../../components/Input'
import { Text } from '../../../../components/Text'
import { Hr } from '../../../../components/Hr'
import { currentUserSelector, notesAnswerSelector } from '../../../../redux/selectors'
import { useSelector } from '../../../../redux/useSelector'
import { DayData } from '../../../MainScreen/DayScrollContext'
import { useDispatch } from 'react-redux'
import { answerNotesCard } from '../../../../redux/actions'
import { useTranslate } from '../../../../hooks/useTranslate'
import useAlert from '../../../../hooks/useAlert'

export const NotesCard = ({ dataEntry, goBack }: { dataEntry?: DayData; goBack?: () => void }) => {
  const translate = useTranslate()
  const userID = useSelector(currentUserSelector)?.id

  const showAlert = useAlert();
  const reduxEntry = useSelector((state) => notesAnswerSelector(state, dataEntry?.date))

  const reduxDispatch = useDispatch()

  const [title, setTitle] = React.useState(reduxEntry.title)
  const [notes, setNotes] = React.useState(reduxEntry.notes)

  const onPress = () => {
    
    if (!userID || !dataEntry) {
      return

    }

    if(!title || !notes){
      showAlert('request_error')
    }    

    reduxDispatch(
      answerNotesCard({
        title,
        notes,
        userID,
        utcDateTime: dataEntry?.date,
      }),
    )

    Alert.alert(translate('note_saved'), translate('note_saved_caption'), [
      {
        text: translate('continue'),
        onPress: goBack,
      },
    ])
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.page}>
        <Input value={title} onChangeText={setTitle} placeholder="title" />
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder="daily_note_description"
          multiline={true}
        />
      </View>
      <Hr />
      <TouchableOpacity onPress={onPress} style={styles.confirm}>
        <Text style={styles.confirmText}>confirm</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  page: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
