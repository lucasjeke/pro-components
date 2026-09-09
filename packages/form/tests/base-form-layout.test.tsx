import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

const state = vi.hoisted(() => ({
  baseFormAttrs: [] as Record<string, unknown>[],
  draggableAttrs: [] as Record<string, unknown>[],
  draggableChildren: [] as unknown[],
  modalAttrs: [] as Record<string, unknown>[],
}))

vi.mock('@antdv-next1/pro-provider', () => ({
  useIntl: () => ref({
    getMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
  useStyle: () => () => [ref('hash-id'), ref('css-var')],
}))

vi.mock('@antdv-next1/pro-utils', () => ({
  Draggable: defineComponent({
    name: 'Draggable',
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      return () => {
        const children = slots.default?.() || []
        state.draggableAttrs.push(attrs)
        state.draggableChildren.push(children)
        return h('div', { 'data-testid': 'draggable' }, children)
      }
    },
  }),
  isBrowser: () => false,
  omitUndefined: (obj: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)),
  transformBooleanProps: () => ({}),
  useEffect: (effect: () => void) => effect(),
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
  merge: (...values: Record<string, unknown>[]) => Object.assign({}, ...values),
  useMergedState: <T,>(initialValue: () => T) => {
    const stateRef = ref(initialValue())
    return [
      stateRef,
      (nextValue: T) => {
        stateRef.value = nextValue
      },
    ]
  },
}))

vi.mock('antdv-next', () => ({
  Button: defineComponent({
    name: 'Button',
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      return () => h('button', attrs, slots.default?.())
    },
  }),
  Drawer: defineComponent({
    name: 'Drawer',
    setup(_props, { slots }) {
      return () => h('div', { 'data-testid': 'drawer' }, slots.default?.())
    },
  }),
  Modal: defineComponent({
    name: 'Modal',
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      return () => {
        state.modalAttrs.push(attrs)
        const modalNode = h('div', { 'data-testid': 'modal-node' }, slots.default?.())
        const renderedModal = typeof attrs.modalRender === 'function'
          ? attrs.modalRender(modalNode)
          : modalNode
        return h('div', { 'data-testid': 'modal' }, [
          attrs.title,
          renderedModal,
        ])
      }
    },
  }),
}))

vi.mock('@antdv-next/icons', () => ({
  FullscreenExitOutlined: defineComponent(() => () => h('span', { 'data-testid': 'fullscreen-exit-icon' })),
  FullscreenOutlined: defineComponent(() => () => h('span', { 'data-testid': 'fullscreen-icon' })),
}))

vi.mock('antdv-next/config-provider/context', () => ({
  useConfig: () => ref({
    getPrefixCls: (suffix: string) => `ant-${suffix}`,
    locale: {},
  }),
}))

vi.mock('../src/layouts/DrawerForm/style', () => ({
  default: () => [ref(''), ref('')],
}))

vi.mock('../src/layouts/ModalForm/style', () => ({
  default: () => [ref('hash-id'), ref('css-var')],
}))

vi.mock('../src/BaseForm', () => ({
  BaseForm: defineComponent({
    name: 'BaseForm',
    inheritAttrs: false,
    setup(_props, { attrs }) {
      state.baseFormAttrs.push(attrs)
      return () => h('form', { 'data-layout': attrs.layout as string })
    },
  }),
}))

describe('form layout wrappers', () => {
  it('keeps form production source free of runtime console output', () => {
    const sourceDirs = [
      path.resolve(import.meta.dirname, '../src'),
      path.resolve(import.meta.dirname, '../../utils/src/components/FormItem'),
    ]
    const files: string[] = []
    const collectFiles = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const fullPath = path.join(dir, entry)
        if (statSync(fullPath).isDirectory()) {
          collectFiles(fullPath)
        }
        else if (/\.(ts|tsx)$/.test(entry)) {
          files.push(fullPath)
        }
      }
    }

    sourceDirs.forEach(collectFiles)

    const runtimeConsoleLines = files.flatMap((file) => {
      const source = readFileSync(file, 'utf8')
      return source
        .split('\n')
        .flatMap((line, index) =>
          /^\s*console\.(log|debug|info|warn|error)\(/.test(line)
            ? [`${path.relative(path.resolve(import.meta.dirname, '../../..'), file)}:${index + 1}`]
            : [],
        )
    })

    expect(runtimeConsoleLines).toEqual([])
  })

  it('passes a custom layout through ModalForm instead of forcing vertical', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')

    state.baseFormAttrs = []
    mount(ProModalForm as any, {
      props: {
        layout: 'horizontal',
        open: true,
        submitter: false,
      },
    })

    expect(state.baseFormAttrs.at(-1)?.layout).toBe('horizontal')
  })

  it('uses vertical as the default ModalForm layout', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')

    state.baseFormAttrs = []
    mount(ProModalForm as any, {
      props: {
        open: true,
        submitter: false,
      },
    })

    expect(state.baseFormAttrs.at(-1)?.layout).toBe('vertical')
  })

  it('keeps the fullscreen title controls when title is provided through modalProps', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')

    state.modalAttrs = []
    const wrapper = mount(ProModalForm as any, {
      props: {
        fullscreenable: true,
        modalProps: {
          title: 'Modal props title',
        },
        open: true,
        submitter: false,
      },
    })

    expect(wrapper.text()).toContain('Modal props title')
    expect(wrapper.find('[data-testid="fullscreen-icon"]').exists()).toBe(true)
  })

  it('renders a title provided through modalProps without fullscreen controls', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')

    const wrapper = mount(ProModalForm as any, {
      props: {
        modalProps: {
          title: 'Regular modal title',
        },
        open: true,
        submitter: false,
      },
    })

    expect(wrapper.text()).toContain('Regular modal title')
  })

  it('keeps an element wrapper when switching a draggable modal to fullscreen', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')

    state.draggableChildren = []
    state.draggableAttrs = []
    const wrapper = mount(ProModalForm as any, {
      props: {
        draggable: true,
        fullscreenable: true,
        open: true,
        submitter: false,
      },
    })

    expect(wrapper.find('[data-testid="draggable"]').exists()).toBe(true)
    expect(state.draggableAttrs.at(-1)).toEqual(expect.objectContaining({
      cancel: '.ant-pro-modal-form-fullscreen',
      handle: '.ant-pro-modal-form-title-text',
    }))

    await wrapper.get('button').trigger('click')

    const modalAttrs = state.modalAttrs.at(-1)
    expect(modalAttrs?.width).toBe('100vw')
    expect(String(modalAttrs?.class)).toContain('ant-pro-modal-form-is-fullscreen')
    expect(wrapper.find('[data-testid="draggable"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="modal-node"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="fullscreen-exit-icon"]').exists()).toBe(true)
  })

  it('uses modal text slots for the ProForm submitter', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')
    state.baseFormAttrs = []

    mount(ProModalForm as any, {
      props: {
        open: true,
      },
      slots: {
        okText: () => 'Save',
        cancelText: () => 'Dismiss',
      },
    })

    const submitter = state.baseFormAttrs.at(-1)?.submitter as {
      searchConfig?: { submitText?: unknown, resetText?: unknown }
    }
    const [submitText] = submitter.searchConfig?.submitText as Array<{ children?: unknown }>
    const [resetText] = submitter.searchConfig?.resetText as Array<{ children?: unknown }>
    expect(submitText.children).toBe('Save')
    expect(resetText.children).toBe('Dismiss')
  })

  it('uses a custom footer without rendering the default submitter', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')
    state.baseFormAttrs = []
    state.modalAttrs = []

    mount(ProModalForm as any, {
      props: {
        open: true,
      },
      slots: {
        footer: () => 'Custom footer',
      },
    })

    expect(state.baseFormAttrs.at(-1)?.submitter).toBe(false)
    expect(typeof state.modalAttrs.at(-1)?.footer).toBe('function')
  })

  it('resets fullscreen state after the modal closes', async () => {
    const { default: ProModalForm } = await import('../src/layouts/ModalForm')
    state.modalAttrs = []
    const wrapper = mount(ProModalForm as any, {
      props: {
        fullscreenable: true,
        open: true,
        submitter: false,
      },
    })

    await wrapper.get('button').trigger('click')
    expect(state.modalAttrs.at(-1)?.width).toBe('100vw')

    ;(state.modalAttrs.at(-1)?.afterClose as (() => void))()
    await wrapper.vm.$nextTick()

    expect(state.modalAttrs.at(-1)?.width).toBe(800)
    expect(wrapper.find('[data-testid="fullscreen-icon"]').exists()).toBe(true)
  })

  it('passes a custom layout through DrawerForm instead of forcing vertical', async () => {
    const { default: ProDrawerForm } = await import('../src/layouts/DrawerForm')

    state.baseFormAttrs = []
    mount(ProDrawerForm as any, {
      props: {
        layout: 'horizontal',
        open: true,
        submitter: false,
      },
    })

    expect(state.baseFormAttrs.at(-1)?.layout).toBe('horizontal')
  })

  it('uses vertical as the default DrawerForm layout', async () => {
    const { default: ProDrawerForm } = await import('../src/layouts/DrawerForm')

    state.baseFormAttrs = []
    mount(ProDrawerForm as any, {
      props: {
        open: true,
        submitter: false,
      },
    })

    expect(state.baseFormAttrs.at(-1)?.layout).toBe('vertical')
  })
})
