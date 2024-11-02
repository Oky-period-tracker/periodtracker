import * as React from 'react'
import { StyleSheet, ScrollView, Image } from 'react-native'
import { InfoDisplay } from '../../components/InfoDisplay'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useSelector } from '../../redux/useSelector'
import { aboutBannerSelector, aboutContent } from '../../redux/selectors'
import { assets } from '../../resources/assets'
import { Screen } from '../../components/Screen'
import { useLocale } from '../../hooks/useLocale'

const AboutScreen: ScreenComponent<'About'> = () => {
  const content = useSelector(aboutContent)
  const aboutBanner = useSelector(aboutBannerSelector)
  const locale = useLocale()

  const source = aboutBanner ? { uri: aboutBanner } : assets?.general?.aboutBanner?.[locale]

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
