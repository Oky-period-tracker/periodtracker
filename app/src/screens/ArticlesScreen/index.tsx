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
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'
import { AudioPlayer } from '../../components/AudioPlayer'
import { AUDIO_BASE_URL } from '../../config/env'

const ArticlesScreen: ScreenComponent<'Articles'> = ({ navigation, route }) => {
  const { backgroundColor, palette } = useColor()
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
          const audioAssetUri = `${AUDIO_BASE_URL}/${article?.voiceOverKey}?alt=media`

          return (
            <View style={[styles.card, { backgroundColor }, globalStyles.shadow]} key={article.id}>
              {article.title && (
                <Text
                  style={[styles.title, { color: palette.danger.text }]}
                  enableTranslate={false}
                >
                  {article.title}
                </Text>
              )}
              <Text
                style={[styles.subCategory, { color: palette.danger.text }]}
                enableTranslate={false}
              >
                {subcategory.name}
              </Text>

              {article?.voiceOverKey ? <AudioPlayer audioAssetUri={audioAssetUri} /> : null}
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
  },
  subCategory: {
    fontWeight: 'bold',
    marginBottom: 24,
  },
})
