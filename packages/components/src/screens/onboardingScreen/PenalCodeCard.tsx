import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'
import { VerticalSelectBox } from '../../components/common/VerticalSelectBox'
import { assets } from '../../assets'
import { Dimensions } from 'react-native'
import { availableAppLocales } from '@oky/core'

const locales = ['lang_select', ...availableAppLocales]
const width = Dimensions.get('window').width

export const PenalCodeCard = ({ onConfirm = (args) => null }) => {
  const [intermediateLocale, setIntermediateLocale] = React.useState('lang_select')
  return (
    <Container>
      <Card>
        <WhiteContainer>
          <WelcomeContainer>
            <LaunchContainer>
              <LaunchLogo resizeMode="contain" source={assets.static.launch_icon} />
            </LaunchContainer>
            <WelcomeText>welcome_heading</WelcomeText>
          </WelcomeContainer>
          <ContentContainer>
            <HeadingText>penal_code_heading</HeadingText>
            <InformationText>penal_code_text1</InformationText>
            <VerticalSelectBox
              onValueChange={(item) => setIntermediateLocale(item)}
              items={locales}
              containerStyle={{
                height: 45,
                borderRadius: 22.5,
              }}
              height={45}
              maxLength={20}
              buttonStyle={{ right: 5, bottom: 7 }}
            />
          </ContentContainer>
        </WhiteContainer>
        <ButtonContainer>
          <Button
            disabled={intermediateLocale === 'lang_select'}
            activeOpacity={0.8}
            onPress={() => onConfirm(intermediateLocale)}
          >
            <ButtonTitle style={{ fontSize: 16 }}>confirm</ButtonTitle>
          </Button>
        </ButtonContainer>
      </Card>
    </Container>
  )
}

const Container = styled.View`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`

const WelcomeContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const ContentContainer = styled.View`
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
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
  justify-content: flex-start;
  elevation: 4;
`

const HeadingText = styled(Text)`
  font-size: 20;
  font-family: Roboto-Black;
  color: #e3629b;
  text-align: center;
`

const WelcomeText = styled(Text)`
  font-size: 28;
  text-align: left;
  width: 65%;
  font-family: Roboto-Black;
  color: #e3629b;
`
const InformationText = styled(Text)`
  margin-vertical: 30px;
  font-size: 12;
  font-family: Roboto-Regular;
  text-align: center;
`

const Card = styled.View`
  height: 420px;
  width: ${width * 0.95};
  elevation: 4;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
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

const LaunchContainer = styled.View`
  width: 30%;
  aspect-ratio: 1;
  background-color: #fff;
  elevation: 5;
  border-radius: 200px;
  margin-right: 5%;
  justify-content: center;
  align-items: center;
`
const LaunchLogo = styled.Image`
  height: 85%;
  aspect-ratio: 1;
`
