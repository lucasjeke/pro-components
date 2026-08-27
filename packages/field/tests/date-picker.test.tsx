import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import FieldDatePicker from '../src/components/DatePicker'
import { FieldDateRangePicker } from '../src/components/RangePicker'

vi.mock('@antdv-next1/pro-provider', () => ({
  useIntl: () => ref({
    getMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
}))

vi.mock('antdv-next', () => ({
  DatePicker: defineComponent({
    name: 'DatePicker',
    setup() {
      return () => h('input')
    },
  }),
  DateRangePicker: defineComponent({
    name: 'DateRangePicker',
    setup() {
      return () => h('input')
    },
  }),
  Space: defineComponent({
    name: 'Space',
    setup(_props, { slots }) {
      return () => h('span', slots.default?.())
    },
  }),
}))

vi.mock('@antdv-next1/pro-utils', () => ({
  FieldLabel: defineComponent({
    name: 'FieldLabel',
    props: ['value', 'onClick'],
    setup(props) {
      return () => h('label', { onClick: props.onClick }, props.value)
    },
  }),
  parseValueToDay: (value: string | number | null | undefined) =>
    value == null ? value : dayjs(value),
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

describe('FieldDatePicker', () => {
  it('only renders the picker after an empty light field is opened', async () => {
    const wrapper = mount(FieldDatePicker as any, {
      props: {
        mode: 'edit',
        label: '日期',
        light: true,
        fieldProps: {},
      },
    })

    expect(wrapper.find('input').exists()).toBe(false)

    await wrapper.findComponent({ name: 'FieldLabel' }).trigger('click')

    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('formats week timestamps in read mode', () => {
    const wrapper = mount(FieldDatePicker as any, {
      props: {
        mode: 'read',
        text: dayjs('2024-01-15').valueOf(),
        format: 'YYYY-wo',
        picker: 'week',
      },
    })

    expect(wrapper.text()).toBe('2024-3rd')
  })

  it('keeps formatted week text readable in read mode', () => {
    const wrapper = mount(FieldDatePicker as any, {
      props: {
        mode: 'read',
        text: '2024-3rd',
        format: 'YYYY-wo',
        picker: 'week',
      },
    })

    expect(wrapper.text()).toBe('2024-3rd')
  })

  it('formats quarter timestamps in read mode', () => {
    const wrapper = mount(FieldDatePicker as any, {
      props: {
        mode: 'read',
        text: dayjs('2024-01-15').valueOf(),
        format: 'YYYY-[Q]Q',
        picker: 'quarter',
      },
    })

    expect(wrapper.text()).toBe('2024-Q1')
  })

  it('keeps formatted quarter text readable in read mode', () => {
    const wrapper = mount(FieldDatePicker as any, {
      props: {
        mode: 'read',
        text: '2024-Q1',
        format: 'YYYY-[Q]Q',
        picker: 'quarter',
      },
    })

    expect(wrapper.text()).toBe('2024-Q1')
  })
})

describe('FieldDateRangePicker', () => {
  it('formats week range timestamps in read mode', () => {
    const wrapper = mount(FieldDateRangePicker as any, {
      props: {
        mode: 'read',
        text: [
          dayjs('2024-01-01').valueOf(),
          dayjs('2024-01-15').valueOf(),
        ],
        format: 'YYYY-wo',
        picker: 'week',
      },
    })

    expect(wrapper.text()).toContain('2024-1st')
    expect(wrapper.text()).toContain('2024-3rd')
  })

  it('keeps formatted week range text readable in read mode', () => {
    const wrapper = mount(FieldDateRangePicker as any, {
      props: {
        mode: 'read',
        text: ['2024-1st', '2024-3rd'],
        format: 'YYYY-wo',
        picker: 'week',
      },
    })

    expect(wrapper.text()).toContain('2024-1st')
    expect(wrapper.text()).toContain('2024-3rd')
  })

  it('formats quarter range timestamps in read mode', () => {
    const wrapper = mount(FieldDateRangePicker as any, {
      props: {
        mode: 'read',
        text: [
          dayjs('2024-01-15').valueOf(),
          dayjs('2024-07-15').valueOf(),
        ],
        format: 'YYYY-[Q]Q',
        picker: 'quarter',
      },
    })

    expect(wrapper.text()).toContain('2024-Q1')
    expect(wrapper.text()).toContain('2024-Q3')
  })

  it('keeps formatted quarter range text readable in read mode', () => {
    const wrapper = mount(FieldDateRangePicker as any, {
      props: {
        mode: 'read',
        text: ['2024-Q1', '2024-Q3'],
        format: 'YYYY-[Q]Q',
        picker: 'quarter',
      },
    })

    expect(wrapper.text()).toContain('2024-Q1')
    expect(wrapper.text()).toContain('2024-Q3')
  })
})
