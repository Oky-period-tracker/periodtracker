import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'
import { Icon } from '../../components/common/Icon'
import { TextInput } from '../../components/common/TextInput'
import { Text } from '../../components/common/Text'
import { translate } from '../../i18n'
import Tts from 'react-native-tts'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('screen').height

export function NoteAssetDemo({ step }) {
  const hasTtsActive = useSelector(selectors.isTtsActiveSelector)

  React.useEffect(() => {
    if (hasTtsActive) {
      if (step === 4) {
        Tts.speak(translate('title'))
        Tts.speak(translate('daily_note_description'))
        Tts.speak(translate('save'))
      }
    }
  }, [step, hasTtsActive])

  return (
    <NoteCardContainer
      style={{
        width: 0.6 * deviceWidth,
        height: 0.4 * deviceHeight,
        marginLeft: 30,
      }}
    >
      <UpperContent>
        <Row style={{ alignItems: 'center' }}>
          <Icon
            style={{ height: 20, width: 20, marginLeft: 2, marginRight: 2 }}
            source={assets.static.icons.edit}
          />
          <Container>
            <TextInput
              label={'title'}
              value={''}
              inputStyle={{
                fontStyle: 'italic',
                textAlign: 'left',
                fontSize: 8,
                height: 20,
                borderRadius: 10,
              }}
              style={{ height: 20, width: '100%' }}
            />
          </Container>
        </Row>
        <Row style={{ flex: 1, width: '100%' }}>
          <TextInput
            label={'daily_note_description'}
            value={''}
            inputStyle={{
              paddingTop: 10,
              textAlign: 'left',
              textAlignVertical: 'top',
              height: '100%',
              fontStyle: 'italic',
              fontSize: 8,
              borderRadius: 10,
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
      <LowerContent>
        <HeaderText>save</HeaderText>
      </LowerContent>
    </NoteCardContainer>
  )
}

const NoteCardContainer = styled.View`
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  elevation: 6;
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
  padding-horizontal: 5;
  padding-vertical: 5;
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  elevation: 5;
`

const LowerContent = styled.TouchableOpacity`
  height: 40px;
  width: 100%;
  elevation: 4;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  background-color: #efefef;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled(Text)`
  font-size: 8;
  text-align: center;
  align-self: center;
  color: #000;
  font-family: Roboto-Black;
`
