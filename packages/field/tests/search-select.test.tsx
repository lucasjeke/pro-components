import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

const state = vi.hoisted(() => ({
  selectAttrs: [] as Record<string, unknown>[],
  selectProps: [] as Record<string, unknown>[],
}))

vi.mock('@antdv-next1/pro-utils', () => ({
  nanoid: () => 'test-id',
  useEffect: () => {},
  useState: <T,>(initialValue: T) => {
    const stateRef = ref(initialValue)
    return [
      stateRef,
      (nextValue: T) => {
        stateRef.value = nextValue
      },
    ]
  },
}))

vi.mock('@v-c/util', () => ({
  classNames: (...classes: unknown[]) => classes.flatMap((value) => {
    if (!value)
      return []
    if (typeof value === 'object')
      return Object.entries(value).filter(([, enabled]) => enabled).map(([className]) => className)
    return [String(value)]
  }).join(' '),
}))

vi.mock('antdv-next/config-provider/context', () => ({
  useConfig: () => ref({
    getPrefixCls: (suffix: string) => `ant-${suffix}`,
  }),
}))

vi.mock('antdv-next', () => ({
  Select: defineComponent({
    name: 'Select',
    inheritAttrs: false,
    props: ['disabled', 'options'],
    setup(props, { attrs }) {
      return () => {
        state.selectAttrs.push(attrs)
        state.selectProps.push({ ...props })
        return h('div', { class: attrs.class })
      }
    },
  }),
}))

describe('SearchSelect class compatibility', () => {
  it('keeps corrected and legacy classes for the root, disabled state, and options', async () => {
    const { default: SearchSelect } = await import('../src/components/Select/SearchSelect')
    state.selectAttrs = []
    state.selectProps = []

    mount(SearchSelect as any, {
      props: {
        disabled: true,
        fetchData: vi.fn(),
        resetData: vi.fn(),
        options: [{ label: 'Option', value: 'option' }],
      },
    })
    const rootClass = String(state.selectAttrs.at(-1)?.class)
    const options = state.selectProps.at(-1)?.options as Array<{ class?: string }>

    expect(rootClass).toContain('ant-pro-field-search-select')
    expect(rootClass).toContain('ant-pro-filed-search-select')
    expect(rootClass).toContain('ant-pro-field-search-select-disabled')
    expect(rootClass).toContain('ant-pro-filed-search-select-disabled')
    expect(options[0]?.class).toContain('ant-pro-field-search-select-option')
    expect(options[0]?.class).toContain('ant-pro-filed-search-select-option')
  })
})
