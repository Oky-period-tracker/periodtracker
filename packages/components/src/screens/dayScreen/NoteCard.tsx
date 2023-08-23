import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import * as selectors from '../../redux/selectors'
import * as actions from '../../redux/actions'
import { useSelector } from '../../hooks/useSelector'
import { TextInput } from '../../components/common/TextInput'
import { useDispatch } from 'react-redux'
import { BackOneScreen } from '../../services/navigationService'
import { Text } from '../../components/common/Text'
import { Icon } from '../../components/common/Icon'
import { assets } from '../../assets'
import { ConfirmAlert } from '../../components/common/ConfirmAlert'
import { translate } from '../../i18n'

const deviceWidth = Dimensions.get('window').width

export function NoteCard({ dataEntry }) {
  const noteObject: any = useSelector((state) =>
    selectors.notesAnswerSelector(state, dataEntry.date),
  )
  const userID = useSelector(selectors.currentUserSelector).id
  const [title, setTitle] = React.useState(noteObject.title || '')
  const [titlePlaceholder, setTitlePlaceholder] = React.useState('title')
  const [notesPlaceholder, setNotesPlaceholder] = React.useState('daily_note_description')
  const dispatch = useDispatch()
  const [notes, setNotes] = React.useState(noteObject.notes || '')

  return (
    <NoteCardContainer
      style={{
        width: 0.9 * deviceWidth,
        height: '95%',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 15,
      }}
    >
      <UpperContent>
        <Row style={{ alignItems: 'center' }}>
          <Icon
            style={{ height: 30, width: 30, marginLeft: 10, marginRight: 10 }}
            source={assets.static.icons.edit}
          />
          <Container>
            <TextInput
              onFocus={() => setTitlePlaceholder('empty')}
              onBlur={() => setTitlePlaceholder('title')}
              onChange={(text) => setTitle(text)}
              onEndEditing={() =>
                dispatch(
                  actions.answerNotesCard({ title, notes, userID, utcDateTime: dataEntry.date }),
                )
              }
              label={titlePlaceholder}
              value={title}
              inputStyle={{
                fontStyle: title === '' ? 'italic' : 'normal',
                textAlign: 'left',
              }}
              style={{ width: '100%' }}
            />
          </Container>
        </Row>
        <Row style={{ flex: 1, width: '100%' }}>
          <TextInput
            onChange={(text) => setNotes(text)}
            onFocus={() => setNotesPlaceholder('empty')}
            onBlur={() => setNotesPlaceholder('daily_note_description')}
            onEndEditing={() =>
              dispatch(
                actions.answerNotesCard({ title, notes, userID, utcDateTime: dataEntry.date }),
              )
            }
            label={notesPlaceholder}
            value={notes || ''}
            inputStyle={{
              paddingTop: 20,
              textAlignVertical: 'top',
              textAlign: 'left',
              height: '100%',
              fontStyle: notes === '' ? 'italic' : 'normal',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
            style={{
              height: '100%',
              marginTop: 0,
            }}
            multiline={true}
          />
        </Row>
      </UpperContent>
      <LowerContent
        onPress={() => {
          ConfirmAlert(translate('note_saved'), translate('note_saved_caption'), () => {
            BackOneScreen()
          })
        }}
      >
        <HeaderText>save</HeaderText>
      </LowerContent>
    </NoteCardContainer>
  )
}

const NoteCardContainer = styled.View`
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  margin-horizontal: 10px;
`

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`

const Container = styled.View`
  flex: 1;
`

const UpperContent = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding-horizontal: 12;
  padding-vertical: 12;
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  elevation: 5;
`

const LowerContent = styled.TouchableOpacity`
  height: 80px;
  width: 100%;
  elevation: 4;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  background-color: #efefef;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled(Text)`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: #000;
  font-family: Roboto-Black;
`
