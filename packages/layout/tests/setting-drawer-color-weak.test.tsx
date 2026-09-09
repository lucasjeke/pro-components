import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, isRef, ref } from 'vue'

vi.mock('@antdv-next1/pro-provider', () => ({
  useStyle: () => () => [ref('hash-id'), ref('css-var')],
}))

vi.mock('@antdv-next1/pro-utils', () => ({
  CopyToClipboard: defineComponent((_props, { slots }) => () => h('div', slots.default?.())),
  useMountMergeState: <T,>(defaultValue: T, options: {
    value?: { value: T }
    onChange?: (value: T) => void
  } = {}) => {
    const state = ref(options.value && isRef(options.value) ? options.value.value : defaultValue)
    return [
      state,
      (value: T) => {
        state.value = value
        options.onChange?.(value)
      },
    ]
  },
}))

vi.mock('@antdv-next/icons', () => ({
  CloseOutlined: defineComponent(() => () => h('span')),
  CopyOutlined: defineComponent(() => () => h('span')),
  NotificationOutlined: defineComponent(() => () => h('span')),
  SettingOutlined: defineComponent(() => () => h('span')),
}))

vi.mock('antdv-next/config-provider/context', () => ({
  useConfig: () => ref({
    getPrefixCls: (suffix: string) => `ant-${suffix}`,
  }),
}))

vi.mock('antdv-next', () => {
  const SlotStub = defineComponent((_props, { slots }) => () => h('div', slots.default?.()))
  return {
    Alert: SlotStub,
    Button: SlotStub,
    Divider: SlotStub,
    Drawer: defineComponent({
      name: 'Drawer',
      props: ['open'],
      emits: ['close'],
      setup(props, { emit, slots }) {
        return () => h('div', {
          'data-testid': 'drawer',
          'data-open': String(props.open),
        }, [
          h('button', {
            'data-testid': 'drawer-close',
            onClick: () => emit('close'),
          }),
          slots.default?.(),
        ])
      },
    }),
    Listy: defineComponent({
      props: ['items'],
      setup(props) {
        return () => h('div', (props.items || []).map((item: { action?: unknown }) => item.action))
      },
    }),
    Switch: defineComponent({
      name: 'Switch',
      props: ['checked'],
      emits: ['update:checked', 'change'],
      setup(props, { emit }) {
        return () => h('button', {
          'data-testid': 'color-weak-switch',
          onClick: () => emit('update:checked', !props.checked),
        })
      },
    }),
    message: {
      useMessage: () => [{ info: vi.fn() }, defineComponent(() => () => null)],
      loading: vi.fn(),
    },
  }
})

vi.mock('../src/components/SettingDrawer/style', () => ({
  default: () => [ref('hash-id'), ref('css-var')],
}))

vi.mock('../src/components/SettingDrawer/BlockCheckbox', () => ({
  default: defineComponent(() => () => null),
}))

vi.mock('../src/components/SettingDrawer/LayoutChange', () => ({
  getFormatMessage: () => ({ defaultMessage, id }: { defaultMessage?: string, id: string }) => defaultMessage || id,
  LayoutSetting: defineComponent(() => () => null),
  renderLayoutSettingItem: (item: { action?: unknown }) => item.action,
}))

vi.mock('../src/components/SettingDrawer/RegionalChange', () => ({
  default: defineComponent(() => () => null),
}))

vi.mock('../src/components/SettingDrawer/ThemeColor', () => ({
  default: defineComponent(() => () => null),
}))

vi.mock('../src/components/SettingDrawer/icon/group', () => ({
  GroupIcon: defineComponent(() => () => null),
}))

vi.mock('../src/components/SettingDrawer/icon/sub', () => ({
  SubIcon: defineComponent(() => () => null),
}))

afterEach(() => {
  delete document.body.dataset.colorWeak
  document.body.className = ''
  document.body.style.filter = ''
  document.body.innerHTML = ''
})

describe('SettingDrawer color weak mode', () => {
  it('syncs the initial setting to body and removes it when unmounted', async () => {
    const { default: SettingDrawer } = await import('../src/components/SettingDrawer')
    const wrapper = mount(SettingDrawer as any, {
      props: {
        hideCopyButton: true,
        hideHintAlert: true,
        settings: {
          colorWeak: true,
        },
      },
      attachTo: document.body,
    })

    expect(document.body.dataset).toHaveProperty('colorWeak')
    expect(document.body.classList.contains('hash-id')).toBe(true)
    expect(document.body.style.filter).toBe('')

    wrapper.unmount()

    expect(document.body.dataset).not.toHaveProperty('colorWeak')
    expect(document.body.classList.contains('hash-id')).toBe(false)
  })

  it('keeps the drawer behavior independent from the body filter', async () => {
    const { default: SettingDrawer } = await import('../src/components/SettingDrawer')
    document.body.style.filter = 'sepia(1)'
    const wrapper = mount(SettingDrawer as any, {
      props: {
        collapsed: true,
        hideCopyButton: true,
        hideHintAlert: true,
        settings: {
          colorWeak: false,
        },
      },
      attachTo: document.body,
    })

    expect(wrapper.get('[data-testid="drawer"]').attributes('data-open')).toBe('true')

    await wrapper.get('[data-testid="color-weak-switch"]').trigger('click')
    expect(document.body.dataset).toHaveProperty('colorWeak')
    expect(document.body.classList.contains('hash-id')).toBe(true)
    expect(document.body.style.filter).toBe('sepia(1)')

    await wrapper.get('[data-testid="drawer-close"]').trigger('click')
    expect(wrapper.get('[data-testid="drawer"]').attributes('data-open')).toBe('false')
    expect(document.body.dataset).toHaveProperty('colorWeak')

    wrapper.unmount()
  })

  it('does not clear a color weak marker owned by another instance or the host', async () => {
    const { default: SettingDrawer } = await import('../src/components/SettingDrawer')
    document.body.setAttribute('data-color-weak', '')
    document.body.classList.add('hash-id')
    const createWrapper = () => mount(SettingDrawer as any, {
      props: {
        hideCopyButton: true,
        hideHintAlert: true,
        settings: {
          colorWeak: true,
        },
      },
      attachTo: document.body,
    })
    const first = createWrapper()
    const second = createWrapper()

    first.unmount()
    expect(document.body.dataset).toHaveProperty('colorWeak')
    expect(document.body.classList.contains('hash-id')).toBe(true)

    second.unmount()
    expect(document.body.dataset).toHaveProperty('colorWeak')
    expect(document.body.classList.contains('hash-id')).toBe(true)
  })
})
