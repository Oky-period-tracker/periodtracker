import React from 'react'
import { useSelector } from '../../../../redux/useSelector'
import { allDidYouKnowsSelectors } from '../../../../redux/selectors'
import _ from 'lodash'
import { StyleSheet, View } from 'react-native'
import { Text } from '../../../../components/Text'
import { useColor } from '../../../../hooks/useColor'

export const DidYouKnowCard = () => {
  const allDidYouKnows = useSelector(allDidYouKnowsSelectors)
  const randomDidYouKnow = React.useMemo(() => {
    return _.sample(allDidYouKnows)
  }, [])

  const { palette, backgroundColor } = useColor()

  return (
    <View style={[styles.page, { backgroundColor }]}>
      <Text style={[styles.title, { color: palette.secondary.text }]}>didYouKnow</Text>
      <Text>daily_didYouKnow_content</Text>
      <View style={styles.body}>
        <Text enableTranslate={false} style={[styles.content, { color: palette.danger.text }]}>
          {randomDidYouKnow?.content}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    padding: 24,
    maxWidth: 800,
    borderRadius: 20,
  },
  button: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
})
