import React from 'react'
import styled from 'styled-components/native'
import { Dimensions, AccessibilityInfo, Text as RNText } from 'react-native'
import { TextWithoutTranslation, Text } from '../../components/common/Text'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { TitleText } from '../../components/common/TitleText'
import { useSelector } from '../../hooks/useSelector'
import _ from 'lodash'
import * as selectors from '../../redux/selectors'
import * as actions from '../../redux/actions'
import { useDispatch } from 'react-redux'
import { TextInput } from '../../components/common/TextInput'
import { SurveyInformationButton } from '../../components/common/SurveyInformationButton'
import { PrimaryButton } from '../../components/common/buttons/PrimaryButton'

import { useScreenDimensions } from '../../hooks/useScreenDimensions'

// TODO_ALEX: survey

const fetchOptionKey = (data, dataIndex) => {
  // TODO_ALEX: survey temp key not used ?
  const tempKey = `${data.option}${dataIndex + 1}`
  const value = Object.values(data)

  return value
}

export const SurveyCard = React.memo<{
  dataEntry: any
  index: number
  selectAnswer: any
  startSurveyQuestion: boolean
  endSurvey: any
  showEndButton: boolean
  onEndPress: () => void
}>(
  ({
    dataEntry,
    index,
    selectAnswer,
    startSurveyQuestion,
    endSurvey,
    showEndButton,
    onEndPress,
  }) => {
    const { screenWidth: width } = useScreenDimensions()

    const [title, setTitle] = React.useState('')
    const [titlePlaceholder, setTitlePlaceholder] = React.useState('type_answer_placeholder')
    const [isSkip, setSkip] = React.useState(null)
    const userID = useSelector(selectors.currentUserSelector).id
    const dispatch = useDispatch()
    const [showThankYouMsg, setThankYouMsg] = React.useState(null)
    const [selectedIndex, setSelectedIndex] = React.useState(null)
    const completedSurveys = useSelector(selectors.completedSurveys)
    const allSurveys = useSelector(selectors.allSurveys)

    const checkUserPermission = (option, optionIndex) => {
      setSelectedIndex(optionIndex)
      if (!startSurveyQuestion) {
        if (optionIndex === 0) {
          setTimeout(() => {
            selectAnswer(true, option, optionIndex)
            setSelectedIndex(null)
          }, 500)
        } else {
          setThankYouMsg(true)
          setTimeout(() => {
            endSurvey()
          }, 5000)

          // TODO_ALEX: Does this do anything?
          dispatch(
            actions.answerSurvey({
              id: dataEntry.surveyId,
              isCompleted: true,
              isSurveyAnswered: false,
              questions: [],
              user_id: userID,
              utcDateTime: dataEntry.utcDateTime,
            }),
          )
          const tempData = allSurveys
          const tempCompletedSurveys = completedSurveys ? completedSurveys : []
          dispatch(actions.updateCompletedSurveys([tempData[0], ...tempCompletedSurveys]))
          tempData.shift()
          dispatch(actions.updateAllSurveyContent(tempData))
          dispatch(actions.fetchSurveyContentRequest(userID))
        }
      } else {
        setTimeout(() => {
          selectAnswer(true, option, optionIndex)
          setSelectedIndex(null)
        }, 500)
      }
    }

    const onSelectAnswer = (flag, item, ind) => {
      setSelectedIndex(ind)
      setTimeout(() => {
        selectAnswer(true, item, ind)
        setSelectedIndex(null)
      }, 500)
    }

    React.useEffect(() => {
      if (!dataEntry?.question) {
        return
      }
      AccessibilityInfo.announceForAccessibility(dataEntry?.question)
    }, [dataEntry])

    const SurveyContent = () => {
      if (dataEntry?.thankYouMsg && selectedIndex === 1) {
        return (
          <EmojiContainer>
            <EmojiSelector
              color={'#f49200'}
              isActive={true}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                height: 40,
                width: '100%',
                marginRight: 10,
                marginBottom: 8,
              }}
              maskStyle={{ flexDirection: 'row' }}
              emojiStyle={{ fontSize: 16 }}
              title={fetchOptionKey(dataEntry?.options[1], 0)}
              textStyle={{
                width: '85%',
                fontSize: 15,
                fontFamily: 'Roboto-Black',
                color: '#f49200',
                marginLeft: 10,
                textAlign: 'left',
              }}
              emoji={''}
            />
          </EmojiContainer>
        )
      }

      return dataEntry?.options.map((item, ind) => {
        if (item[`option${ind + 1}`].replace(/ /g, '').toLowerCase() === 'na') return <Empty />
        return (
          <EmojiContainer key={ind}>
            <EmojiSelector
              color={ind === selectedIndex ? '#f49200' : '#f49200'}
              onPress={() => {
                !startSurveyQuestion
                  ? checkUserPermission(item, ind)
                  : onSelectAnswer(true, item, ind)
              }}
              isActive={ind === selectedIndex ? true : false}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                height: 40,
                width: '100%',
                marginRight: 10,
                marginBottom: 8,
              }}
              title={fetchOptionKey(item, ind)}
              maskStyle={{ flexDirection: 'row' }}
              emojiStyle={{ fontSize: 16 }}
              textStyle={{
                width: '85%',
                fontSize: 15,
                fontFamily: 'Roboto-Black',
                color: '#f49200',
                marginLeft: 10,
                textAlign: 'left',
              }}
              emoji={''}
            />
          </EmojiContainer>
        )
      })
    }

    return (
      <SurveyCardContainer
        style={{
          width: 0.9 * width,
          height: '95%',
          alignSelf: 'center',
          marginLeft: index === 0 ? 15 : 5,
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <Row
          style={{
            height: '20%',
            justifyContent: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <Row style={{ justifyContent: 'flex-start' }}>
            <TitleText size={26} style={{ width: 150, height: 50 }}>
              survey
            </TitleText>
            <SurveyInformationButton
              iconStyle={{ height: 25, width: 25 }}
              style={{
                marginLeft: 10,
                paddingVertical: 0,
              }}
            />
          </Row>

          <ContentText>anonymous_answer</ContentText>
          {dataEntry?.is_multiple ? <ContentText>choose_one</ContentText> : null}
        </Row>
        <Row
          style={{
            flexDirection: 'column',
            height: '85%',
            justifyContent: 'center',
          }}
        >
          <Row style={{ marginBottom: 10 }}>
            <RNText
              style={{
                flex: 1,
                fontSize: 20,
                marginBottom: 15,
                color: '#f49200',
                fontFamily: 'Roboto-Black',
              }}
            >
              {dataEntry?.question}
            </RNText>
          </Row>
          {!dataEntry?.is_multiple && !dataEntry?.endSurvey && (
            <UpperContent>
              <RowTextInput style={{ flex: 1, width: '100%' }}>
                <TextInput
                  onFocus={() => setTitlePlaceholder('empty')}
                  onBlur={() => setTitlePlaceholder('title')}
                  onChange={(text) => {
                    setTitle(text)
                    setSkip(false)
                  }}
                  label={titlePlaceholder}
                  value={title}
                  inputStyle={{
                    paddingTop: 20,
                    textAlignVertical: 'top',
                    textAlign: 'left',
                    height: '100%',
                    fontStyle: 'italic',
                  }}
                  style={{
                    height: '95%',
                    marginTop: 0,
                  }}
                  multiline={true}
                  placeholderColor="#ADAEAD"
                />
              </RowTextInput>
            </UpperContent>
          )}
          {dataEntry?.is_multiple && !dataEntry?.endSurvey && (
            <Row
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {dataEntry?.options && <SurveyContent />}
            </Row>
          )}

          {!dataEntry?.is_multiple && !dataEntry?.endSurvey && (
            <LowerContent>
              <LowerContentButton
                onPress={() => {
                  selectAnswer(title, isSkip)
                  setTitle('')
                }}
              >
                <HeaderText>skip</HeaderText>
              </LowerContentButton>

              <LowerContentButton
                onPress={() => {
                  selectAnswer(title, isSkip)
                  setTitle('')
                }}
              >
                <HeaderText>submit</HeaderText>
              </LowerContentButton>
            </LowerContent>
          )}

          {showEndButton ? (
            <PrimaryButton style={{ marginTop: 12 }} onPress={() => onEndPress()}>
              continue
            </PrimaryButton>
          ) : null}

          {/* TODO_ALEX This is never actually displayed ?? is actually shown via DayCarousel lastQuestion */}
          {showThankYouMsg && (
            <Row>
              <ThankYouContainer>thank_you_msg</ThankYouContainer>
            </Row>
          )}
        </Row>
      </SurveyCardContainer>
    )
  },
)

const RowTextInput = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`

const UpperContent = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`

const Empty = styled.View``

const SurveyCardContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  elevation: 5;
  margin-horizontal: 10px;
  padding-horizontal: 40px;
  padding-vertical: 20px;
`

const LowerContent = styled.View`
  height: 40px;
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const LowerContentButton = styled.TouchableOpacity`
  height: 40px;
  padding-horizontal: 20px;
  margin-vertical: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled(Text)`
  text-align: center;
  align-self: center;
  font-size: 16;
  color: #f49200;
  font-family: Roboto-Black;
`

const Row = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

const EmojiContainer = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const ThankYouContainer = styled(Text)`
  width: 85%;
  font-size: 19;
  color: #f49200;
  margin-left: 5px;
  text-align: left;
  margin-top: 50px;
  font-family: Roboto-Black;
`

const InnerTitleText = styled(TextWithoutTranslation)`
  flex: 1;
  font-size: 20;
  margin-bottom: 15px;
  color: #f49200;
  font-family: Roboto-Black;
`

const ContentText = styled(Text)`
  width: 100%;
  color: #4d4d4d;
  font-size: 14;
  text-align: justify;
`
