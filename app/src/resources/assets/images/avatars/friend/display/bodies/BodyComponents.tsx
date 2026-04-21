// Public stub. Real body components live in the private Oky resources repo.

import * as React from 'react'

interface BodyProps {
  width?: number | string
  height?: number | string
  skinColor?: string
  animatedTransforms?: unknown
}

const EmptyBody: React.FC<BodyProps> = () => null

export const BodySmall = EmptyBody
export const BodyMedium = EmptyBody
export const BodyLarge = EmptyBody
