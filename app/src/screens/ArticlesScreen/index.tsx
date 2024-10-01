import * as React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Screen } from '../../components/Screen'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useEncyclopedia } from '../EncyclopediaScreen/EncyclopediaContext'
import { SearchBar } from '../../components/SearchBar'
import { ArticleContent } from './ArticleContent'
import { Text } from '../../components/Text'
import { Article } from '../../core/types'
import { useSelector } from '../../redux/useSelector'
import { articlesSelector, subCategoryByIDSelector } from '../../redux/selectors'
import { globalStyles, palette } from '../../config/theme'
import { useColor } from '../../hooks/useColor'

const ArticlesScreen: ScreenComponent<'Articles'> = ({ navigation, route }) => {
  const { backgroundColor } = useColor()
  const { query, setQuery, articleIds } = useEncyclopedia()

  const subcategoryId = route.params.subcategoryId
  const subcategory = useSelector((s) => subCategoryByIDSelector(s, subcategoryId))

  const allArticles = useSelector(articlesSelector)

  const articles = React.useMemo(() => {
    return subcategory?.articles.reduce<Article[]>((acc, articleId) => {
      if (articleIds.includes(articleId)) {
        acc.push(allArticles.byId[articleId])
      }
      return acc
    }, [])
  }, [subcategory, articleIds, allArticles])

  React.useLayoutEffect(() => {
    // Set Screen title
    if (subcategory) {
      navigation.setOptions({
        title: subcategory.name,
        // @ts-expect-error // TODO: CustomStackNavigationOptions
        disableTranslate: true,
      })
    }
  }, [navigation, subcategory])

  return (
    <Screen>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <SearchBar query={query} setQuery={setQuery} style={globalStyles.shadow} />
        {articles?.map((article) => {
          return (
            <View style={[styles.card, { backgroundColor }, globalStyles.shadow]} key={article.id}>
              {article.title && (
                <Text style={styles.title} enableTranslate={false}>
                  {article.title}
                </Text>
              )}
              <Text style={styles.subCategory} enableTranslate={false}>
                {subcategory.name}
              </Text>
              <ArticleContent articleId={article.id} text={article.content} />
            </View>
          )
        })}
      </ScrollView>
    </Screen>
  )
}

export default ArticlesScreen

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    minHeight: 120,
    marginVertical: 4,
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 24,
    color: palette['danger'].base,
  },
  subCategory: {
    fontWeight: 'bold',
    marginBottom: 24,
    color: palette['danger'].base,
  },
})
