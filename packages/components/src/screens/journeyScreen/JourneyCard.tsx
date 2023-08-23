import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'
import { CalendarCardContent } from './CalendarCardContent'
import { WheelPickerContent } from '../../components/WheelPickerContent'
import { Avatar } from '../../components/common/Avatar/Avatar'
import { assets } from '../../assets'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'

export function JourneyCard({
  question,
  onRemember,
  onForget,
  onChange,
  optionsRange = null,
  optionsUnit = [],
  questionAnswer,
  setQuestionAnswer,
  status = 'initial',
  description,
  onConfirm,
  answersData,
  id,
  confirmMessage,
  defaultAnswerMessage,
  pickerLabel = null,
  pickerType = 'options',
  leftButtonTitle = 'i_dont_remember',
  rightButtonTitle = 'i_remember',
}) {
  const selectedAvatar = useSelector(selectors.currentAvatarSelector)
  return (
    <>
      {status === 'initial' && (
        <Container>
          <WhiteContainer>
            <BubbleAvatarImage
              resizeMode="contain"
              source={assets.avatars[selectedAvatar].bubbles}
            />
            <Text style={{ fontSize: 14, textAlign: 'left', color: '#000' }}>{description}</Text>
            <BigOrangeText>{question}</BigOrangeText>
          </WhiteContainer>
          <ButtonContainer>
            <LeftButton onPress={onForget} title={leftButtonTitle} />
            <RightButton onPress={onRemember} title={rightButtonTitle} />
          </ButtonContainer>
        </Container>
      )}
      {status === 'remember' && (
        <Container>
          <WhiteContainer>
            {pickerLabel && (
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Roboto-Black',
                  color: '#f49200',
                  fontSize: 26,
                }}
              >
                {pickerLabel}
              </Text>
            )}
            {pickerType === 'options' && (
              <WheelPickerContent
                {...{
                  id,
                  answersData,
                  optionsRange,
                  optionsUnit,
                  questionAnswer,
                  setQuestionAnswer,
                }}
              />
            )}
            {pickerType === 'calendar' && (
              <CalendarCardContent {...{ answersData, questionAnswer, setQuestionAnswer, id }} />
            )}
            {pickerType === 'non_period' && (
              <>
                <Avatar
                  style={{ height: 140, width: 130 }}
                  alertTextVisible={false}
                  stationary={true}
                  isProgressVisible={false}
                />
                <BigOrangeText>{confirmMessage}</BigOrangeText>
              </>
            )}
          </WhiteContainer>
          <ButtonContainer>
            <RightButton onPress={onConfirm} title={'confirm'} />
          </ButtonContainer>
        </Container>
      )}
      {status === 'not_remember' && (
        <Container>
          <WhiteContainer>
            <Avatar
              style={{ height: 140, width: 130 }}
              stationary={true}
              isProgressVisible={false}
              alertTextVisible={false}
            />
            <Text
              style={{
                textAlign: 'justify',
                fontSize: 20,
              }}
            >
              {defaultAnswerMessage}
            </Text>
          </WhiteContainer>
          <ButtonContainer>
            {pickerType !== 'non_period' && <LeftButton onPress={onChange} title={'change'} />}
            <RightButton onPress={onConfirm} title={'confirm'} />
          </ButtonContainer>
        </Container>
      )}
    </>
  )
}

const RightButton = ({ onPress, title, ...props }) => (
  <Button activeOpacity={0.8} onPress={onPress} {...props}>
    <ButtonTitle style={{ fontSize: 16, ...props.textStyle }}>{title}</ButtonTitle>
  </Button>
)

const LeftButton = ({ title, onPress }) => (
  <RightButton
    onPress={onPress}
    title={title}
    style={{ borderRightWidth: 2, borderRightColor: '#AAA' }}
  />
)

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  border-radius: 10px;
  elevation: 4;
  margin-bottom: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
  align-items: center;
`

const WhiteContainer = styled.View`
  flex: 1;
  width: 100%;
  background-color: #fff;
  padding-vertical: 25px;
  padding-horizontal: 30px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  align-items: center;
  justify-content: space-around;
  elevation: 4;
`

const ButtonContainer = styled.View`
  background-color: #efefef;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  flex-direction: row;
`

const Button = styled.TouchableOpacity`
  flex: 1;
  height: 70px;
  justify-content: center;
  padding-horizontal: 30px;
`

const ButtonTitle = styled(Text)`
  text-align: center;
  font-family: Roboto-Black;
  font-size: 16;
  color: black;
`

const BubbleAvatarImage = styled.Image`
  width: 90%;
  height: 100px;
`

const BigOrangeText = styled(Text)`
  font-size: 30;
  font-family: Roboto-Black;
  color: #f49200;
`
