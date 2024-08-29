import React from 'react'
import { A } from '../../components/A'
import { Image, StyleSheet, View } from 'react-native'
import { Text } from '../../components/Text'

type ArticleContentProps = {
  articleId: string
  text: string
}

export const ArticleContent = ({ articleId, text }: ArticleContentProps) => {
  const parts = React.useMemo(() => text.split(/(link::[^\s]+|image::[^\s]+)/).filter(Boolean), [
    text,
  ])

  return (
    <>
      {parts.map((part, index) => {
        const key = `${articleId}-${index}`

        if (part.startsWith('link::')) {
          const url = part.slice(6) // length of prefix
          return (
            <A key={key} href={url}>
              {url}
            </A>
          )
        }

        if (part.startsWith('image::')) {
          const src = part.slice(7) // length of prefix
          return (
            <View key={key} style={styles.imageContainer}>
              <Image source={{ uri: src }} style={styles.image} />
            </View>
          )
        }

        return (
          <Text key={key} enableTranslate={false}>
            {part}
          </Text>
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
    maxHeight: 200,
  },
  image: {
    height: '100%',
    resizeMode: 'contain',
  },
})
