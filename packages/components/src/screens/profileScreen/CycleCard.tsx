import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'
import { Icon } from '../../components/common/Icon'
import { assets } from '../../assets/index'
import * as selectors from '../../redux/selectors'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { useSelector } from '../../hooks/useSelector'
import { emojis } from '../../config'
import { translate } from '../../i18n'

const cardNames = ['mood', 'body', 'activity', 'flow']

export const CycleCard = ({ item, cycleNumber }) => {
  const cardAnswersValues = useSelector((state) =>
    selectors.mostAnsweredSelector(state, item.cycleStartDate, item.cycleEndDate),
  )

  return (
    <CycleCardContainer>
      <CycleCardHeader>
        <Col style={{ flexDirection: 'row', flex: 2 }}>
          <Icon source={assets.static.icons.cycle} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Roboto-Black',
              color: 'white',
              marginLeft: 10,
              marginRight: 5,
            }}
          >
            cycle
          </Text>
          <CycleCardHeadingText>{cycleNumber}</CycleCardHeadingText>
        </Col>
        <Col style={{ flexDirection: 'row', alignItems: 'center', flex: 2 }}>
          <CycleCardHeadingText>{item.cycleLength}</CycleCardHeadingText>
          <Text style={{ fontSize: 12, color: 'white', marginLeft: 3 }}>day_cycle</Text>
        </Col>
        <DateIntervalText
          startDate={item.cycleStartDate}
          endDate={item.cycleEndDate}
          color="white"
        />
      </CycleCardHeader>
      <CycleCardBody style={{ paddingRight: 10 }}>
        <Col style={{ justifyContent: 'space-between', flex: 2 }}>
          <Row style={{ paddingVertical: 5 }}>
            <Icon source={assets.static.icons.periodLength} style={{ marginRight: 15 }} />
            <CycleCardBodyText>{item.periodLength}</CycleCardBodyText>
            <CycleCardBodyText style={{ marginLeft: 5 }}>
              {translate('day_period')}
            </CycleCardBodyText>
          </Row>
          <Row style={{ paddingVertical: 5 }}>
            <Icon source={assets.static.icons.periodDays} style={{ marginRight: 15 }} />
            <DateIntervalText
              startDate={item.cycleStartDate}
              endDate={item.cycleStartDate.clone().add(item.periodLength, 'days')}
            />
          </Row>
        </Col>
        <Col
          style={{
            flex: 3,
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {cardNames.map((cardItem, ind) => (
            <EmojiSelector
              disabled={true}
              color={emojis[cardAnswersValues[cardItem]] ? '#e3629b' : '#fff'}
              key={ind}
              isActive={!!emojis[cardAnswersValues[cardItem]]}
              style={{ height: 35, width: 35, marginRight: 5, borderRadius: 17.5 }}
              emojiStyle={{ fontSize: 16 }}
              title={translate(cardItem)}
              emoji={emojis[cardAnswersValues[cardItem]] || '💁🏻‍'}
              textStyle={{ position: 'absolute', bottom: -10, fontSize: 8 }}
            />
          ))}
        </Col>
      </CycleCardBody>
    </CycleCardContainer>
  )
}

const DateIntervalText = ({ startDate, endDate, color = 'black' }) => {
  return (
    <Col style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <CycleCardBodyText style={{ color }}>
        {`${startDate.format('DD')} `}
        <RNText>{`${translate(startDate.format('MMM'))} -  `}</RNText>
      </CycleCardBodyText>
      <CycleCardBodyText style={{ color }}>
        {`${endDate.format('DD')} `}
        <RNText>{`${translate(endDate.format('MMM'))}`}</RNText>
      </CycleCardBodyText>
    </Col>
  )
}

const Col = styled.View``

const Row = styled.View`
  flex-direction: row;
`

const CycleCardContainer = styled.View`
  margin-top: 15px;
  background-color: #fff;
  elevation: 3;
  margin-horizontal: 3px;
  border-radius: 10px;
`

const CycleCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 40px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #e3629b;
  padding-horizontal: 20px;
`

const CycleCardBody = styled.View`
  flex-direction: row;
  width: 100%;
  padding-left: 20px;
  padding-right: 10px;
  padding-vertical: 15px;
`

const CycleCardHeadingText = styled.Text`
  font-family: Roboto-Black;
  font-size: 14;
  color: white;
`
const RNText = styled.Text`
  font-weight: normal;
  font-size: 12;
`

const CycleCardBodyText = styled.Text`
  font-family: Roboto-Black;
  font-size: 14;
`
