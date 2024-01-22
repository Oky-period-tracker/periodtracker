import React from 'react'
import styled from 'styled-components/native'
import { ScrollView, Animated } from 'react-native'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import { Category, VideoCategory } from './encyclopediaScreen/Category'
import { SubCategoryCard } from './encyclopediaScreen/SubCategoryCard'
import Accordion from 'react-native-collapsible/Accordion'
import { navigate } from '../services/navigationService'
import { SearchBar } from './encyclopediaScreen/SearchBar'
import _ from 'lodash'
import { Avatar } from '../components/common/Avatar/Avatar'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import { encyclopediaScreenText } from '../config'
import { useDispatch } from 'react-redux'
import { logCategoryView, logSubCategoryView } from '../redux/actions'
import analytics from '@react-native-firebase/analytics'
import { VideoData } from '../types'

export function EncyclopediaScreen({ navigation }) {
  const categories = useSelector(selectors.allCategoriesSelector)
  const articles = useSelector(selectors.allArticlesSelector)
  const videos = useSelector(selectors.allVideosSelector)
  const subCategories = useSelector(selectors.allSubCategoriesSelector)
  const subCategoriesObject = useSelector(selectors.allSubCategoriesObjectSelector)
  const [activeCategories, setActiveCategory] = React.useState([])
  const [isVideoTabActive, setVideoTabActive] = React.useState(false)
  const [filteredCategories, setFilteredCategories] = React.useState(categories)
  // TODO_ALEX redundant useState?
  const [shownCategories, setShownCategories] = React.useState(categories)
  const [searching, setSearching] = React.useState(false)
  const [position] = React.useState(new Animated.Value(0))

  const dispatch = useDispatch()

  const categoryNames = categories.map((item) => item?.name)
  // TODO_ALEX redundant useState & useEffect?
  const [textArray, setTextArray] = React.useState(categoryNames)
  useTextToSpeechHook({ navigation, text: encyclopediaScreenText(categories) })

  const togglePosition = (isUp) => {
    Animated.timing(position, {
      duration: 1000,
      useNativeDriver: true,
      toValue: isUp ? -100 : 0,
    }).start()
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  React.useEffect(() => {
    if (!_.isEmpty(activeCategories)) {
      const subCatNamesText = categories[activeCategories[0]].subCategories.map(
        (item) => subCategoriesObject[item].name,
      )
      const tempCategoryArray = [categories[activeCategories[0]].name].concat(subCatNamesText) // this adds the category name to the front of the array
      setTextArray(tempCategoryArray)
      return
    }
    setTextArray(categoryNames)
  }, [activeCategories])

  return (
    <BackgroundTheme>
      <PageContainer>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              togglePosition(true)
              return
            }
            togglePosition(false)
          }}
          scrollEventThrottle={400}
          showsVerticalScrollIndicator={false}
        >
          <SearchBar
            {...{
              subCategories,
              categories,
              setActiveCategory,
              setFilteredCategories,
              shownCategories,
              searching,
              setSearching,
              articles,
            }}
          />
          {!_.isEmpty(videos) && (
            <Accordion
              sections={[{ videos }]}
              renderHeader={(video: any, i, isActive) => (
                <VideoCategory
                  onPress={() => {
                    // TODO_ALEX: analytics?
                    analytics().logScreenView({
                      screen_class: 'ActiveCateogrey',
                      screen_name: 'CategoriesTapCount',
                    })
                    setVideoTabActive((current) => !current)
                  }}
                  {...{ isActive: isVideoTabActive }}
                />
              )}
              activeSections={isVideoTabActive ? [0] : []}
              onChange={() => true}
              renderContent={(item: { videos: VideoData[] }) => (
                <Row>
                  {item.videos.map((videoData) => (
                    <SubCategoryCard
                      key={`${videoData.title}-videos}`}
                      title={videoData.title}
                      // TODO_ALEX: analytics?
                      onPress={() => {
                        analytics().logScreenView({
                          screen_class: 'ActiveSubCateogrey',
                          screen_name: 'SubCategoriesTapCount',
                        })
                        navigate('VideoScreen', { videoData })
                      }}
                    />
                  ))}
                </Row>
              )}
            />
          )}
          {!_.isEmpty(filteredCategories) && (
            <Accordion
              sections={!_.isEmpty(filteredCategories) ? filteredCategories : shownCategories}
              renderHeader={(category: any, i, isActive) => (
                <Category
                  title={category.name}
                  tags={category.tags}
                  onPress={() => {
                    setActiveCategory(isActive ? [] : [i])
                    dispatch(logCategoryView({ categoryId: category.id }))
                  }}
                  {...{ isActive }}
                />
              )}
              activeSections={activeCategories}
              onChange={() => true}
              renderContent={(category: any) => (
                <Row>
                  {category.subCategories.map((subCategoryId) => (
                    <SubCategoryCard
                      key={subCategoryId}
                      title={
                        (
                          subCategories.find((item) => item?.id === subCategoryId) || {
                            name: 'no_name',
                          }
                        ).name
                      }
                      onPress={() => {
                        navigate('Articles', { subCategory: subCategoryId })
                        dispatch(logSubCategoryView({ subCategoryId }))
                      }}
                    />
                  ))}
                </Row>
              )}
            />
          )}
          <EmptyFill />
        </ScrollView>
        {!searching && (
          <AnimatedContainer style={{ transform: [{ translateY: position }] }}>
            <FloatingContainer onPress={() => navigate('FindHelp', null)}>
              <Avatar
                stationary={true}
                disable={true}
                textShown={'find help'}
                isProgressVisible={false}
              />
            </FloatingContainer>
          </AnimatedContainer>
        )}
      </PageContainer>
    </BackgroundTheme>
  )
}

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6;
  flex-wrap: wrap;
`

const EmptyFill = styled.View`
  height: 40px;
`

const FloatingContainer = styled.TouchableOpacity``

const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: -10;
  right: 10;
`
