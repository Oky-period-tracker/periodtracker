import { getFormContents } from '../../src/helpers/HelpCenterService'

const request = (body: any): any => ({
  body: {
    title: 'Clinic',
    caption: 'Caption',
    contactOne: '123',
    address: 'Street',
    primaryAttribute: '1',
    ...body,
  },
  user: { lang: 'en' },
})

const stored = (isActive: boolean): any => ({ id: 1, title: 'Clinic', isActive, lang: 'en' })

describe('help center form Active switch', () => {
  it('creates an active entry only when the switch is on', () => {
    expect(getFormContents(request({ isActive: 'true' })).isActive).toBe(true)
    expect(getFormContents(request({ isActive: 'false' })).isActive).toBe(false)
    expect(getFormContents(request({})).isActive).toBe(false)
    // The old hidden checkbox posted "0" when ticked
    expect(getFormContents(request({ isActive: '0' })).isActive).toBe(false)
  })

  it('saves the switch state when an entry is edited', () => {
    expect(getFormContents(request({ isActive: 'true' }), stored(false)).isActive).toBe(true)
    expect(getFormContents(request({ isActive: 'false' }), stored(true)).isActive).toBe(false)
  })

  it('keeps the stored state when an edit does not send the switch', () => {
    expect(getFormContents(request({}), stored(true)).isActive).toBe(true)
    expect(getFormContents(request({}), stored(false)).isActive).toBe(false)
  })

  it('still lets the list Live switch turn an entry on and off', () => {
    const toggle = (isActive: string, current: boolean) =>
      getFormContents(
        { body: { isActive, toggleOnly: '1' }, user: { lang: 'en' } } as any,
        stored(current),
      ).isActive
    expect(toggle('true', false)).toBe(true)
    expect(toggle('false', true)).toBe(false)
  })
})
