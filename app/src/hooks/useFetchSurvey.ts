import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSurveyContentRequest } from '../redux/actions'
import { currentUserSelector } from '../redux/selectors'

/*  TODO: 
    Would make more sense to fetch in the contentSaga on rehydrate, along with everything else 
    But we need the User Id to fetch surveys they haven't done yet,
    Unless we instead keep completed survey ids for each user persisted in redux (this would be better)
*/

export const useFetchSurvey = () => {
  const currentUser = useSelector(currentUserSelector)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!currentUser) {
      return
    }
    // TODO: user id not actually required here because its re-selected in the saga
    dispatch(fetchSurveyContentRequest(currentUser.id))
  }, [currentUser])
}
