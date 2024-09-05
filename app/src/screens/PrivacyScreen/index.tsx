import * as React from 'react'
import { ScrollView } from 'react-native'
import { InfoDisplay } from '../../components/InfoDisplay'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useSelector } from '../../redux/useSelector'
import { privacyContent } from '../../redux/selectors'
import { Screen } from '../../components/Screen'

const PrivacyScreen: ScreenComponent<'Privacy'> = () => {
  const content = useSelector(privacyContent)

  return (
    <Screen>
      <ScrollView>
        <InfoDisplay content={content} />
      </ScrollView>
    </Screen>
  )
}

export default PrivacyScreen
