import React from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Text } from '../components/common/Text'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'

export function DataCollection() {
  return (
    <BackgroundTheme>
      <PageContainer>
        <Text>Here are a few questions about you and your period.</Text>
      </PageContainer>
    </BackgroundTheme>
  )
}

export const DATA_COLLECTION_SCREEN = 'DATA_COLLECTION_SCREEN'
