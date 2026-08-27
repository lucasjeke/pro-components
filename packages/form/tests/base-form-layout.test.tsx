import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

const state = vi.hoisted(() => ({
  baseFormAttrs: [] as Record<string, unknown>[],
}))

vi.mock('@antdv-next1/pro-provider', () => ({
  useIntl: () => ref({
    getMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
}))

vi.mock('@antdv-next1/pro-utils', () => ({
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
  classNames: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
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
  Drawer: defineComponent({
    name: 'Drawer',
    setup(_props, { slots }) {
      return () => h('div', { 'data-testid': 'drawer' }, slots.default?.())
    },
  }),
  Modal: defineComponent({
    name: 'Modal',
    setup(_props, { slots }) {
      return () => h('div', { 'data-testid': 'modal' }, slots.default?.())
    },
  }),
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
      path.resolve(process.cwd(), 'packages/form/src'),
      path.resolve(process.cwd(), 'packages/utils/src/components/FormItem'),
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
            ? [`${path.relative(process.cwd(), file)}:${index + 1}`]
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
