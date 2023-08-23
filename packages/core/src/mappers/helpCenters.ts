import { HelpCenterResponse } from '../api/types'

interface HelpCenterResponseItem {
  id: number
  title: string
  caption: string
  contactOne: string
  contactTwo: string
  address: string
  website: string
  lang: string
}
export interface HelpCenters extends Array<HelpCenterResponseItem> {}

export type HepCenter = ReturnType<typeof fromHelpCenters>

export function fromHelpCenters(response: HelpCenterResponse) {
  const helpCenters = response
  return { helpCenters }
}
