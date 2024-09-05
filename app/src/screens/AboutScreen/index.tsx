import * as React from 'react'
import { StyleSheet, ScrollView, Image } from 'react-native'
import { InfoDisplay } from '../../components/InfoDisplay'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useSelector } from '../../redux/useSelector'
import { aboutBannerSelector, aboutContent, currentLocaleSelector } from '../../redux/selectors'
import { assets } from '../../resources/assets'
import { Screen } from '../../components/Screen'

const AboutScreen: ScreenComponent<'About'> = () => {
  const content = useSelector(aboutContent)
  const locale = useSelector(currentLocaleSelector)
  const aboutBanner = useSelector(aboutBannerSelector)

  const source = aboutBanner
    ? { uri: aboutBanner }
    : // @ts-expect-error TODO:
      assets?.general?.aboutBanner[locale]

  return (
    <Screen>
      <ScrollView>
        <Image source={source} style={styles.banner} resizeMode="contain" />
        <InfoDisplay content={content} />
      </ScrollView>
    </Screen>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 200,
  },
})
