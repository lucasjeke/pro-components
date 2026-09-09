import { describe, expect, it, vi } from 'vitest'

vi.mock('@antdv-next1/pro-provider', () => ({
  useStyle: () => () => [],
}))

vi.mock('@antdv-next/cssinjs', () => ({
  mergeToken: (token: unknown) => token,
}))

describe('SettingDrawer color weak styles', () => {
  it('covers portal roots nested in the default body wrapper', async () => {
    const styleModule = await import('../src/components/SettingDrawer/style')
    const genSettingDrawerStyle = styleModule.genSettingDrawerStyle

    expect(genSettingDrawerStyle).toBeTypeOf('function')

    const styles = genSettingDrawerStyle!({
      antCls: '.ant',
      componentCls: '.ant-pro-setting-drawer',
    } as any) as Record<string, Record<string, unknown>>
    const colorWeakStyles = styles['[data-color-weak]']

    expect(Object.keys(colorWeakStyles)).toContain('> div > .ant-drawer')
  })
})
