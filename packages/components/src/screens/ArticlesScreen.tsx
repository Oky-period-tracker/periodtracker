import React from 'react'
import styled from 'styled-components/native'
import { FlatList } from 'react-native'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import { Header } from '../components/common/Header'
import { TextWithoutTranslation } from '../components/common/Text'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'

const ArticleItem = ({ article, index, articles }) => {
  const articleObject = useSelector((state) => selectors.articleByIDSelector(state, article))
  return (
    <ArticleContainer
      style={{
        width: '95%',
        minWidth: '95%',
        marginBottom: index === articles.length - 1 ? 20 : 5,
      }}
    >
      <Row style={{ alignItems: 'center' }}>
        <ArticleTitle>{articleObject.subCategory}</ArticleTitle>
      </Row>
      <Row style={{ alignItems: 'center' }}>
        <ArticleTitle style={{ fontSize: 14 }}>{articleObject.title}</ArticleTitle>
      </Row>
      <ArticleContent>{articleObject.content}</ArticleContent>
    </ArticleContainer>
  )
}

export function ArticlesScreen({ navigation }) {
  const subCategory = navigation.getParam('subCategory')
  const subCategoryObject = useSelector((state) =>
    selectors.subCategoryByIDSelector(state, subCategory),
  )
  const allArticlesByIDObject = useSelector(selectors.articlesObjectByIDSelector)
  const articles = subCategoryObject.articles
  const articlesTextArray = articles.reduce((acc, item) => {
    const selectedArticle = allArticlesByIDObject[item]
    return acc.concat([selectedArticle.subCategory, selectedArticle.title, selectedArticle.content])
  }, [])

  useTextToSpeechHook({ navigation, text: articlesTextArray })

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="encyclopedia" />
        <FlatList
          data={articles}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return <ArticleItem index={index} article={item} articles={articles} />
          }}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center', width: '100%' }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
        />
      </PageContainer>
    </BackgroundTheme>
  )
}

const Row = styled.View`
  flex-direction: row;
  margin-bottom: 10;
  flex-wrap: wrap;
`

const ArticleContainer = styled.View`
  margin-vertical: 5px;
  border-radius: 10px;
  elevation: 3;
  background-color: #fff;
  padding-top: 20;
  padding-bottom: 35;
  padding-horizontal: 40;
`

const ArticleTitle = styled(TextWithoutTranslation)`
  font-size: 20;
  font-family: Roboto-Black;
  color: #e3629b;
  padding-bottom: 5;
`

const ArticleContent = styled(TextWithoutTranslation)`
  text-align: left;
  color: #1c1c1c;
`
