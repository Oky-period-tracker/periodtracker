import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { TitleText } from '../../components/common/TitleText'
import { assets } from '../../assets/index'
import { Text } from '../../components/common/Text'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { Icon } from '../../components/common/Icon'
import * as selectors from '../../redux/selectors'
import { useSelector } from '../../hooks/useSelector'
import { useColor } from '../../hooks/useColor'
import { translate } from '../../i18n'

const deviceWidth = Dimensions.get('window').width

export function DayCarouselItem({ content, cardName, dataEntry, onPress, index }) {
  const selectedEmojis = useSelector((state) => selectors.cardAnswerSelector(state, dataEntry.date))

  const color = useColor(dataEntry.onPeriod, dataEntry.onFertile)
  const source = selectedEmojis[cardName]
    ? assets.static.icons.starOrange.full
    : assets.static.icons.starOrange.empty
  return (
    <DayCarouselItemContainer
      style={{
        width: 0.9 * deviceWidth,
        height: '95%',
        alignSelf: 'center',
        marginLeft: index === 0 ? 15 : 5,
      }}
    >
      <Row
        style={{
          height: '42%',
          width: '100%',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TitleText style={{ marginBottom: 8 }} size={25}>
          {cardName}
        </TitleText>
        <ContentText>{contentText[cardName]}</ContentText>
      </Row>
      <Row style={{ height: 50, width: '100%', marginBottom: 5 }}>
        {dataEntry.onPeriod && (
          <Icon source={source} style={{ height: 30, width: 30, marginRight: 10 }} />
        )}
        <TitleText style={{ flex: 1, textTransform: null, flexWrap: 'wrap' }} size={18}>
          {headingText[cardName]}
        </TitleText>
      </Row>
      <Row
        style={{ height: '40%', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {Object.keys(content).map((item, ind) => (
          <EmojiContainer key={ind}>
            <EmojiSelector
              color={color}
              onPress={() => onPress(cardName, item)}
              isActive={
                Array.isArray(selectedEmojis[cardName])
                  ? selectedEmojis[cardName].includes(item)
                  : selectedEmojis[cardName] === item
              }
              style={{
                height: 45,
                width: 45,
                borderRadius: 22.5,
              }}
              title={translate(item)}
              emojiStyle={{ fontSize: 20 }}
              textStyle={{ fontSize: 10, width: '220%' }}
              emoji={content[item]}
            />
          </EmojiContainer>
        ))}
      </Row>
    </DayCarouselItemContainer>
  )
}

const contentText = {
  mood: 'daily_mood_content',
  body: 'daily_body_content',
  activity: 'daily_activity_content',
  flow: 'daily_flow_content',
  survey: 'daily_survey_content',
  notes: 'daily_notes_content',
}
const headingText = {
  mood: 'daily_mood_heading',
  body: 'daily_body_heading',
  activity: 'daily_activity_heading',
  flow: 'daily_flow_heading',
  survey: 'daily_survey_heading',
  notes: 'daily_notes_heading',
}

const DayCarouselItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  justify-content: space-between;
  elevation: 6;
  margin-horizontal: 10px;
  padding-horizontal: 30;
  padding-vertical: 30;
`

const Row = styled.View`
  width: 100%;
  flex-direction: row;
`

const EmojiContainer = styled.View`
  height: 50%;
  width: 33%;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`

const ContentText = styled(Text)`
  width: 100%;
  color: #4d4d4d;
  font-size: 12;
  text-align: justify;
`
