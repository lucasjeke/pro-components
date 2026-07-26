import { describe, expect, it } from 'vitest'
import { getCollapsedSiderWidth, getLeftSecondarySiderCollapsedWidth, getSiderMenuWidth } from '../src/utils/siderWidth'

describe('sider width helpers', () => {
  it('caps left collapsed width at the configured sider width', () => {
    expect(getCollapsedSiderWidth({
      layout: 'left',
      siderWidth: 120,
      collapsedWidth: 64,
      firstMenuWidth: 80,
    })).toBe(120)
  })

  it('uses rail plus collapsed menu width for normal left collapsed layout', () => {
    expect(getCollapsedSiderWidth({
      layout: 'left',
      siderWidth: 256,
      collapsedWidth: 64,
      firstMenuWidth: 80,
    })).toBe(144)
  })

  it('uses only the collapsed width outside left layout', () => {
    expect(getCollapsedSiderWidth({
      layout: 'side',
      siderWidth: 256,
      collapsedWidth: 64,
      firstMenuWidth: 80,
    })).toBe(64)
  })

  it('keeps only the first left rail when no secondary menu is rendered', () => {
    expect(getSiderMenuWidth({
      layout: 'left',
      collapsed: true,
      hasMenu: false,
      siderWidth: 256,
      collapsedWidth: 64,
      firstMenuWidth: 80,
    })).toBe(80)
  })

  it('shrinks the left secondary collapsed width to keep total width aligned', () => {
    expect(getLeftSecondarySiderCollapsedWidth({
      siderWidth: 120,
      collapsedWidth: 64,
      firstMenuWidth: 80,
    })).toBe(40)
  })
})
