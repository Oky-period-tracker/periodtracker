import React from 'react'
import { Image, ImageBackground, View } from 'react-native'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'
import styled from 'styled-components/native'
import { navigate } from '../../services/navigationService'
import { useHapticAndSound } from '../../hooks/useHapticAndSound'
import { translate } from '../../i18n'
import { assets } from '../../assets'

export const NeedHelpCard = ({ isVisible }: { isVisible: boolean }) => {
  const { screenWidth } = useScreenDimensions()
  const hapticAndSoundFeedback = useHapticAndSound()

  return (
    <NeedHelp>
      {isVisible && (
        <View style={{ alignItems: 'center' }}>
          <ImageBackground
            source={assets.general.tripleClouds}
            resizeMethod="scale"
            resizeMode="contain"
            style={{ width: screenWidth - 40, alignItems: 'center', paddingVertical: 30 }}
          >
            <Image
              source={assets.general.encylopediaAvatars}
              resizeMode="contain"
              style={{ width: '35%', height: 120 }}
            />

            <HelpText>{translate('you_are_not_alone')}</HelpText>

            <FloatingContainer
              onPress={() => {
                hapticAndSoundFeedback('general')
                navigate('FindHelp', null)
              }}
            >
              <View>
                <FindHelp>{translate('find_help_center')}</FindHelp>
              </View>
            </FloatingContainer>
          </ImageBackground>
        </View>
      )}
    </NeedHelp>
  )
}

const FloatingContainer = styled.TouchableOpacity`
  background-color: #f09408;
  width: 50%
  padding-vertical: 5;
  padding-horizontal: 25;
  border-radius: 16;
  margin-top: 15;
  elevation: 4;
`
const FindHelp = styled.Text`
  text-align: center;
  color: #ffffff;
  font-size: 20;
  font-weight: bold;
`

const NeedHelp = styled.View`
  align-self: center;
  width: 100%;
`

const HelpText = styled.Text`
  color: #db307a;
  font-weight: 700;
  font-size: 18;
  text-decoration: underline;
`
