import * as React from 'react'
import { ScrollView } from 'react-native'
import { InfoDisplay } from '../../components/InfoDisplay'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useSelector } from '../../redux/useSelector'
import { termsAndConditionsContent } from '../../redux/selectors'
import { Screen } from '../../components/Screen'

const TermsScreen: ScreenComponent<'Terms'> = () => {
  const content = useSelector(termsAndConditionsContent)

  return (
    <Screen>
      <ScrollView>
        <InfoDisplay content={content} />
      </ScrollView>
    </Screen>
  )
}

export default TermsScreen
