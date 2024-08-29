import React from 'react'

export const useToggle = (initialValue = false): [boolean, () => void] => {
  const [bool, setBool] = React.useState(initialValue)
  const toggle = () => setBool((current) => !current)
  return [bool, toggle]
}
