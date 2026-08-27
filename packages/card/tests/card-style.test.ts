import { beforeEach, describe, expect, it, vi } from 'vitest'

let generatedStyles: any[] = []

vi.mock('@antdv-next1/pro-provider', () => ({
  useStyle: (name: string, factory: (token: Record<string, any>) => any[]) => {
    const componentClsMap: Record<string, string> = {
      ProCard: '.ant-pro-card',
      ProCheckCard: '.ant-pro-checkcard',
      ProCheckCardGroup: '.ant-pro-checkcard-group',
    }
    generatedStyles = factory({
      antCls: '.ant',
      componentCls: componentClsMap[name] ?? '.ant-pro-card',
      padding: 16,
      paddingLG: 24,
      paddingSM: 12,
      paddingXS: 8,
      marginLG: 24,
      margin: 16,
      marginXS: 8,
      lineWidth: 1,
      lineType: 'solid',
      colorBorderSecondary: '#eee',
      colorBorder: '#ddd',
      colorBgContainerDisabled: '#f5f5f5',
      colorPrimary: '#1677ff',
      colorPrimaryBg: '#e6f4ff',
      colorSplit: '#eee',
      colorTextDisabled: '#999',
      controlItemBgActive: '#e6f4ff',
      controlOutline: 'rgba(5, 145, 255, 0.1)',
      borderRadius: 6,
      fontSize: 14,
      fontWeightStrong: 600,
      lineHeight: 1.5715,
      motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      screenXSMin: 0,
      screenSMMin: 576,
      screenMDMin: 768,
      screenLGMin: 992,
      screenXLMin: 1200,
      screenXXLMin: 1600,
      proComponentsCls: '.ant-pro',
      calc: (value: number) => ({
        add: (amount: number) => ({
          equal: () => value + amount,
        }),
      }),
    })
    return vi.fn()
  },
}))

describe('ProCard collapse styles', () => {
  beforeEach(async () => {
    generatedStyles = []
    vi.resetModules()
    await import('../src/style')
  })

  it('keeps the collapse header spacing stable while toggling', () => {
    const rootStyle = generatedStyles[0]['.ant-pro-card']
    const collapseStyle = rootStyle['&.ant-collapse']
    const nonSplitStyle = collapseStyle['&:not(.ant-pro-card-split):not(.ant-collapse-small)']
    const collapsedItemStyle = nonSplitStyle['.ant-collapse-item:not(.ant-collapse-item-active)']
    const activeItemStyle = nonSplitStyle['.ant-collapse-item-active']
    const collapseItemStyle = collapseStyle['&:not(.ant-collapse-small) .ant-collapse-item']

    expect(collapseStyle['&:not(.ant-pro-card-split)']).toBeUndefined()
    expect(collapsedItemStyle['.ant-collapse-header'].paddingBlockEnd).toBe('16px')
    expect(collapseItemStyle['&-active']['.ant-collapse-header'].paddingBlockEnd).toBe('16px')
    expect(activeItemStyle['.ant-collapse-panel']['.ant-collapse-body'].paddingBlockStart)
      .toBe('24px !important')
  })

  it('only renders a square header divider while header-bordered card is expanded', () => {
    const rootStyle = generatedStyles[0]['.ant-pro-card']
    const collapseStyle = rootStyle['&.ant-collapse']
    const headerBorderedStyle = collapseStyle['&.ant-pro-card-headerBordered']
    const collapsedHeaderStyle
      = headerBorderedStyle['.ant-collapse-item:not(.ant-collapse-item-active) > .ant-collapse-header']
    const activeHeaderStyle
      = headerBorderedStyle['.ant-collapse-item-active > .ant-collapse-header']

    expect(collapsedHeaderStyle.borderBlockEnd).toBe(0)
    expect(activeHeaderStyle).toMatchObject({
      borderBlockEnd: '1px solid #eee',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    })
  })

  it('lets the collapsible body height follow its child cards', () => {
    const rootStyle = generatedStyles[0]['.ant-pro-card']
    const collapseStyle = rootStyle['&.ant-collapse']
    const collapseBodyStyle = collapseStyle['.ant-collapse-panel']['.ant-collapse-body']
    const nestedCollapseBodyStyle = rootStyle['&&-contain-card']['.ant-collapse-body']

    expect(collapseBodyStyle).toBeUndefined()
    expect(nestedCollapseBodyStyle).toBeUndefined()
  })

  it('provides vertical and horizontal group divider styles', () => {
    const dividerStyle = generatedStyles[0]['.ant-pro-card']['&-divider']

    expect(dividerStyle).toMatchObject({
      flex: 'none',
      width: 1,
      marginInline: 8,
      marginBlock: 24,
      backgroundColor: '#eee',
    })
    expect(dividerStyle['&-horizontal']).toMatchObject({
      width: 'initial',
      height: 1,
      marginInline: 24,
      marginBlock: 8,
    })
  })
})

describe('ProCheckCard styles', () => {
  beforeEach(async () => {
    generatedStyles = []
    vi.resetModules()
    await import('../src/components/CheckCard/style')
  })

  it('keeps the selected corner visible above BorderBeam', () => {
    const rootStyle = generatedStyles[0]['.ant-pro-checkcard']
    const checkedCardStyle = rootStyle['&&-checked']['&.ant-card']
    const bodyCornerStyle = checkedCardStyle['.ant-card-body']['&:after']
    const coverCornerStyle = checkedCardStyle['.ant-card-cover']['&:after']

    expect(checkedCardStyle['.ant-border-beam']?.display).toBeUndefined()
    expect(bodyCornerStyle).toMatchObject({
      opacity: 1,
      pointerEvents: 'none',
      zIndex: 2,
    })
    expect(coverCornerStyle).toMatchObject({
      opacity: 1,
      pointerEvents: 'none',
      zIndex: 2,
    })
  })
})

describe('ProCheckCardGroup styles', () => {
  beforeEach(async () => {
    generatedStyles = []
    vi.resetModules()
    await import('../src/components/CheckCard/style/group')
  })

  it('keeps options spaced and collapsible option groups full width', () => {
    const rootStyle = generatedStyles[0]['.ant-pro-checkcard-group']
    const optionGroupStyle = rootStyle['&-option-group']

    expect(rootStyle.gap).toBe(16)
    expect(rootStyle['&-options'].gap).toBe(16)
    expect(optionGroupStyle).toMatchObject({
      flex: '0 0 100%',
      minWidth: 0,
      width: '100%',
    })
    expect(optionGroupStyle['.ant-collapse-content-box']).toMatchObject({
      boxSizing: 'border-box',
      width: '100%',
    })
    expect(optionGroupStyle['.ant-collapse-panel']).toMatchObject({
      width: '100%',
    })
  })
})
