import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'
import { assets } from '../../assets/index'
import { TitleText } from '../../components/common/TitleText'
import { Icon } from '../../components/common/Icon'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { translate } from '../../i18n'
import Tts from 'react-native-tts'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

export function DayAssetDemo({ step }) {
  const hasTtsActive = useSelector(selectors.isTtsActiveSelector)

  React.useEffect(() => {
    if (hasTtsActive) {
      if (step === 3) {
        Tts.speak(translate('activity'))
        Tts.speak(translate('daily_activity_content'))
        Tts.speak(translate('daily_activity_heading'))
        Object.keys(activity).map((item) => {
          Tts.speak(translate(item))
        })
      }
    }
  }, [step, hasTtsActive])

  return (
    <DayCarouselItemContainer
      style={{
        width: 0.6 * deviceWidth,
        height: 0.4 * deviceHeight,
      }}
    >
      <Row
        style={{
          height: '40%',
          width: '100%',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TitleText size={15} style={{ marginBottom: 3 }}>
          activity
        </TitleText>
        <ContentText>daily_activity_content</ContentText>
      </Row>
      <Row style={{ height: 40, marginBottom: 2 }}>
        <Icon
          source={assets.static.icons.starOrange.full}
          style={{ height: 17, width: 17, marginRight: 5 }}
        />
        <TitleText style={{ flex: 1, height: '100%' }} size={14}>
          daily_activity_heading
        </TitleText>
      </Row>
      <Row style={{ height: '40%', alignItems: 'center', flexWrap: 'wrap' }}>
        {Object.keys(activity).map((item, ind) => (
          <EmojiContainer key={ind}>
            <EmojiSelector
              color={'#e3629b'}
              onPress={() => null}
              isActive={ind === 0}
              style={{
                height: 22,
                width: 22,
                borderRadius: 11,
              }}
              title={translate(item)}
              emojiStyle={{ fontSize: 12 }}
              textStyle={{ fontSize: 6, width: '260%' }}
              emoji={activity[item]}
            />
          </EmojiContainer>
        ))}
      </Row>
    </DayCarouselItemContainer>
  )
}
const activity = {
  exercise: '🏃',
  'healthy food': '🍏',
  'good sleep': '😴',
  socialising: '👋',
  "couldn't sleep": '😴',
  'unhealthy food': '🍰',
}
const DayCarouselItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  elevation: 6;
  margin-left: 30;
  justify-content: space-between;
  padding-horizontal: 20;
  padding-vertical: 15;
`

const Row = styled.View`
  flex-direction: row;
  width: 100%;
`

const EmojiContainer = styled.View`
  height: 50%;
  width: 33%;
  justify-content: center;
  align-items: center;
`

const ContentText = styled(Text)`
  width: 100%;
  color: #4d4d4d;
  font-size: 9;
  text-align: justify;
`
