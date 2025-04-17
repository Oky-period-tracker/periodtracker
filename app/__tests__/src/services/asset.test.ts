import { getAsset } from '../../../src/services/asset'

jest.mock('../../../src/resources/assets', () => ({
  assets: {
    images: {
      logo: 'mock-logo-path',
      icon: {
        home: 'mock-home-icon-path',
      },
    },
  },
}))

describe('getAsset', () => {
  it('should return the asset if the path exists', () => {
    const result = getAsset('images.logo')
    expect(result).toBe('mock-logo-path')
  })

  it('should return nested assets if the path exists', () => {
    const result = getAsset('images.icon.home')
    expect(result).toBe('mock-home-icon-path')
  })

  it('should return undefined and log a warning if the asset does not exist', () => {
    console.warn = jest.fn() // Mock console.warn

    const result = getAsset('images.nonExistent')
    expect(result).toBeUndefined()
    expect(console.warn).toHaveBeenCalledWith('Asset not found: images.nonExistent')
  })

  it('should handle an empty path gracefully', () => {
    console.warn = jest.fn() // Mock console.warn

    const result = getAsset('')
    expect(result).toBeUndefined()
    expect(console.warn).toHaveBeenCalledWith('Asset not found: ')
  })

  it('should handle a partially valid path and return undefined', () => {
    console.warn = jest.fn() // Mock console.warn

    const result = getAsset('images.nonExistent.deep')
    expect(result).toBeUndefined()
    expect(console.warn).toHaveBeenCalledWith('Asset not found: images.nonExistent.deep')
  })
})
