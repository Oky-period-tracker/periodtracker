import 'styled-components'
import { Theme } from '../src/types'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
