import React from 'react'
import styled from 'styled-components/native'
import { ScrollView, Animated } from 'react-native'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { useCommonSelector } from '../redux/useCommonSelector'
import { commonSelectors } from '../redux/selectors'
import { Category } from './encyclopediaScreen/Category'
import { SubCategoryCard, VideoSubCategoryCard } from './encyclopediaScreen/SubCategoryCard'
import Accordion from 'react-native-collapsible/Accordion'
import { navigate } from '../services/navigationService'
import { SearchBar } from './encyclopediaScreen/SearchBar'
import _ from 'lodash'
import { Avatar } from '../components/common/Avatar/Avatar'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import { encyclopediaScreenText } from '../config'
import analytics from '@react-native-firebase/analytics'
import { fetchNetworkConnectionStatus } from '../services/network'

export function EncyclopediaScreen({ navigation }) {
  const categories = useCommonSelector(commonSelectors.allCategoriesSelector)
  const articles = useCommonSelector(commonSelectors.allArticlesSelector)
  const subCategories = useCommonSelector(commonSelectors.allSubCategoriesSelector)
  const subCategoriesObject = useCommonSelector(commonSelectors.allSubCategoriesObjectSelector)
  const [activeCategories, setActiveCategory] = React.useState([])
  const [filteredCategories, setFilteredCategories] = React.useState(categories)
  const [shownCategories, setShownCategories] = React.useState(categories)
  const [searching, setSearching] = React.useState(false)
  const [position] = React.useState(new Animated.Value(0))
  const currentUser = useCommonSelector(commonSelectors.currentUserSelector)

  const categoryNames = categories.map((item) => item?.name)
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
    if (fetchNetworkConnectionStatus() && currentUser) {
      analytics().logEvent('users_accessing_encyclopedia', { user: currentUser })
    }
    setShownCategories(categories)
    setActiveCategory([])
    setFilteredCategories(categories)
  }, [categories])

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
          {!_.isEmpty(filteredCategories) && (
            <Accordion
              sections={!_.isEmpty(filteredCategories) ? filteredCategories : shownCategories}
              renderHeader={(category: any, i, isActive) => (
                <Category
                  title={category.name}
                  tags={category.tags}
                  onPress={() => {
                    analytics().logScreenView({
                      screen_class: 'ActiveCateogrey',
                      screen_name: 'CategoriesTapCount',
                    })
                    setActiveCategory(isActive ? [] : [i])
                  }}
                  {...{ isActive }}
                />
              )}
              activeSections={activeCategories}
              onChange={() => true}
              renderContent={(category: any) => (
                <Row>
                  {category?.videos && category?.videos.length > 0 ? (
                    <VideoSubCategoryCard
                      key={`${category.name}-videos}`}
                      title={'videos'}
                      onPress={() => {
                        analytics().logScreenView({
                          screen_class: 'ActiveSubCateogrey',
                          screen_name: 'SubCategoriesTapCount',
                        })
                        navigate('Videos', { categoryId: category.id })
                      }}
                    />
                  ) : null}
                  {category.subCategories.map((subCategory) => (
                    <SubCategoryCard
                      key={subCategory}
                      title={
                        (
                          subCategories.find((item) => item?.id === subCategory) || {
                            name: 'no_name',
                          }
                        ).name
                      }
                      onPress={() => {
                        analytics().logScreenView({
                          screen_class: 'ActiveSubCateogrey',
                          screen_name: 'SubCategoriesTapCount',
                        })
                        navigate('Articles', { subCategory })
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
