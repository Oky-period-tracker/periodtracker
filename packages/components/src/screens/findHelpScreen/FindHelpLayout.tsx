import React, { FunctionComponent, ReactElement } from 'react'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import { PageContainer } from '../../components/layout/PageContainer'

interface IFindHelpLayout {
  SearchBar: ReactElement
  Header: ReactElement
  HelpCenters: ReactElement
}

export const FindHelpLayout: FunctionComponent<IFindHelpLayout> = ({
  SearchBar,
  Header,
  HelpCenters,
}) => {
  return (
    <BackgroundTheme>
      <PageContainer>
        {Header}
        {SearchBar}
        {HelpCenters}
      </PageContainer>
    </BackgroundTheme>
  )
}
