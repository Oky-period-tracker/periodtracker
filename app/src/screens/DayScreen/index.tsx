import * as React from 'react'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { FullScreen } from '../../components/Screen'
import { DayTracker } from './components/DayTracker'
import { Survey } from './components/Survey'
import { SurveyProvider } from './components/Survey/SurveyContext'
import { useSelector } from '../../redux/useSelector'
import { allSurveysSelector, completedSurveysSelector } from '../../redux/selectors'

const DayScreen: ScreenComponent<'Day'> = (props) => {
  const allSurveys = useSelector(allSurveysSelector) ?? []
  const allSurveysIds = allSurveys.map((item) => item.id)

  const completedSurveys = useSelector(completedSurveysSelector) ?? []
  const completedSurveyIds = completedSurveys.map((item) => item.id)

  const incompleteSurveyIds = allSurveysIds.filter((item) => !completedSurveyIds.includes(item))

  const newSurveyId = incompleteSurveyIds?.length ? incompleteSurveyIds[0] : null

  const newSurvey = allSurveys.find((item) => item.id === newSurveyId)

  const [hasSurvey, setHasSurvey] = React.useState(!!newSurvey)

  React.useEffect(() => {
    if (!newSurvey) {
      return
    }
    setHasSurvey(true)
  }, [newSurvey])

  const onFinishSurvey = () => {
    setHasSurvey(false)
  }

  return (
    <FullScreen>
      {hasSurvey ? (
        <SurveyProvider survey={newSurvey} onFinish={onFinishSurvey}>
          <Survey />
        </SurveyProvider>
      ) : (
        <DayTracker {...props} />
      )}
    </FullScreen>
  )
}

export default DayScreen
