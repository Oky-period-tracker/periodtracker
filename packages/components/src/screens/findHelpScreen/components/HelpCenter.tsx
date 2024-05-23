import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useHelpCenter } from '../hooks/useHelpCenter'
import { ModalAlert } from './ModalAlert'
import Icon from 'react-native-vector-icons/Feather'
import { Text, TextWithoutTranslation } from '../../../components/common/Text'
import { EmojiText } from '../../../components/common/EmojiText'
import { HelpCenterUI } from '../../../types'
import { HelpCenters } from '@oky/core'
import { useHapticAndSound } from '../../../hooks/useHapticAndSound'

interface IHelpCenter {
  helpCenters?: HelpCenters
  type: string
  activeTab: number
}

export const HelpCenter: FunctionComponent<IHelpCenter> = ({ helpCenters, type, activeTab }) => {
  const {
    expandedHelpCenters,
    modifyActiveHelpCenters,
    removeEmojis,
    isConfirmationOpen,
    setConfirmationOpen,
    onPressLink,
    onCancel,
    onSaveHelpCenter,
    onUnsaveHelpCenter,
    savedHelpCenters,
    handleOpenLink,
    triggerer,
  } = useHelpCenter(activeTab)

  const hapticAndSoundFeedback = useHapticAndSound()

  const data = type === HelpCenterUI.HC ? helpCenters : savedHelpCenters

  if (!data?.length) {
    if (type === HelpCenterUI.HC) {
      return (
        <EmptyCard>
          <Text>empty_hc</Text>
          <Text>empty_hc_2</Text>
        </EmptyCard>
      )
    }
    return (
      <EmptyCard>
        <Text>empty_saved</Text>
      </EmptyCard>
    )
  }

  return (
    <>
      <ScrollView style={{ marginTop: 10 }}>
        {data?.map((helpCenter, i) => {
          const isExpanded = expandedHelpCenters.includes(i)
          const isSaved = savedHelpCenters.find((item) => item.id === helpCenter.id)
          const locationString = [
            helpCenter.address ?? '',
            helpCenter.place ?? '',
            helpCenter?.location ?? '',
          ]
            .filter((item) => item.length)
            .join(', ')

          return (
            <CardRow
              key={helpCenter.title}
              onPress={() => {
                hapticAndSoundFeedback('general')
                modifyActiveHelpCenters(i)
              }}
              isExpanded={isExpanded}
            >
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingRight: 20,
                }}
              >
                <EmojiText content={helpCenter.attributeName} />
              </View>
              <View
                style={{
                  flex: 5,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingVertical: isExpanded ? 10 : 15,
                }}
              >
                <InfoItemTitle>{helpCenter.title}</InfoItemTitle>
                {isExpanded && (
                  <AttributeName>{removeEmojis(helpCenter.attributeName)}</AttributeName>
                )}

                {locationString ? (
                  <InfoItemDescription color="#DB307A">{locationString}</InfoItemDescription>
                ) : null}

                {isExpanded && (
                  <InfoItemDescription style={{ textAlign: 'justify' }}>
                    {helpCenter.caption}
                  </InfoItemDescription>
                )}

                {isExpanded && (
                  <TouchableOpacity
                    onPress={() =>
                      onPressLink(`${helpCenter.contactOne},${helpCenter.contactTwo}`, 'phone')
                    }
                  >
                    <ClickableTextLink>
                      <Icon name="phone" size={15} /> {helpCenter.contactOne}{' '}
                      {helpCenter.contactTwo}
                    </ClickableTextLink>
                  </TouchableOpacity>
                )}

                {isExpanded && (
                  <TouchableOpacity
                    onPress={() => {
                      onPressLink(helpCenter.website, 'web')
                    }}
                  >
                    <ClickableTextLink>
                      <Icon name="link-2" size={15} /> {helpCenter.website}
                    </ClickableTextLink>
                  </TouchableOpacity>
                )}

                <View style={{ flexDirection: 'row' }}>
                  {isExpanded && (
                    <Button
                      disabled={HelpCenterUI.HC === type && isSaved}
                      saved={HelpCenterUI.HC === type && isSaved}
                      type={type}
                      onPress={() => {
                        hapticAndSoundFeedback('general')
                        if (HelpCenterUI.HC === type) {
                          onSaveHelpCenter(helpCenter)
                        }

                        if (HelpCenterUI.SAVED_HC === type) {
                          onUnsaveHelpCenter(helpCenter)
                        }
                      }}
                    >
                      <ButtonLabel>
                        <Icon name="save" size={14} />{' '}
                        {HelpCenterUI.HC === type && isSaved
                          ? 'Saved'
                          : isSaved
                          ? 'Unsave'
                          : 'Save'}
                      </ButtonLabel>
                    </Button>
                  )}
                </View>
              </View>
            </CardRow>
          )
        })}
      </ScrollView>
      <ModalAlert
        isOpen={isConfirmationOpen}
        setOpen={setConfirmationOpen}
        onConfirm={() => handleOpenLink()}
        onCancel={onCancel}
        translations={{
          title: 'cm_wait',
          message1: triggerer === 'web' ? 'cm_wait_message1' : 'cm_wait_message1_2',
          message2: 'cm_wait_message2',
          buttonCancel: 'cm_button_cancel',
          buttonProceed: 'cm_button_proceed',
        }}
      />
    </>
  )
}

const Button = styled.TouchableOpacity<{ type: string; saved: boolean }>`
  border-radius: 5px;
  background-color: ${(prop) => (prop.saved ? '#ed85b2' : '#db307a')};
  margin-bottom: 10;
`

const ButtonLabel = styled(TextWithoutTranslation)`
  color: #fff;
  font-family: Roboto-Black;
  font-size: 14;
  padding-horizontal: 5;
  padding-vertical: 5;
  margin-horizontal: 5;
`

const InfoItemTitle = styled(TextWithoutTranslation)`
  font-size: 16;
  margin-bottom: 2px;
  color: #ff9e00;
`

const ClickableTextLink = styled(TextWithoutTranslation)`
  color: #333481;
  textdecorationline: underline;
  margin-bottom: 10px;
`

const InfoItemDescription = styled(TextWithoutTranslation)<{ color: string }>`
  font-size: 14;
  width: 100%;
  color: ${(prop) => (prop.color ? prop.color : '#000')};
  align-self: flex-start;
  flex-wrap: wrap;
  font-family: Roboto-Regular;
  margin-bottom: 10;
`

const AttributeName = styled(TextWithoutTranslation)`
  color: #333481;
  font-size: 14;
  margin-bottom: 10;
`

const CardRow = styled.TouchableOpacity<{ isExpanded: boolean }>`
  flex-direction: row;
  width: 95%;
  margin-bottom: 10px;
  overflow-hidden;
  background: #fff;
  borderRadius: 10;
  padding-horizontal: 20px;
`

const EmptyCard = styled.View`
  width: 95%;
  margin-bottom: 10px;
  overflow-hidden;
  background: #fff;
  borderRadius: 10;
  padding-horizontal: 5px;
  height: 100px;
`
