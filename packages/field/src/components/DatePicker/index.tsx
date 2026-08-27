import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { DatePickerProps } from 'antdv-next'
import type { ProFieldFC, ProFieldLightProps } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { FieldLabel, parseValueToDay, useState } from '@antdv-next1/pro-utils'
import { DatePicker } from 'antdv-next'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { defineComponent } from 'vue'

dayjs.extend(advancedFormat)
dayjs.extend(quarterOfYear)
dayjs.extend(weekOfYear)

function formatDate(text: any, format: any) {
  if (!text)
    return '-'
  const date = dayjs(text)
  if (typeof format === 'function') {
    return format(date)
  }
  if (!date.isValid()) {
    return String(text)
  }
  return date.format((Array.isArray(format) ? format[0] : format) || 'YYYY-MM-DD')
}

export type FieldDatePickerProps = ProFieldFC<{
  text: string | number
  format?: string
  showTime?: boolean
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
  picker?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year'
} & ProFieldLightProps, DatePickerProps>

const FieldDatePicker = defineComponent<FieldDatePickerProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots }) => {
  const intl = useIntl()
  const [open, setOpen] = useState<boolean>(false)
  return () => {
    const {
      text,
      mode,
      format,
      label,
      light,
      render,
      formItemRender,
      showTime,
      variant,
      fieldProps,
      picker,
      lightLabel,
      ...rest
    } = props
    if (mode === 'read') {
      const dom = formatDate(text, fieldProps?.format || format)
      if (render) {
        return <>{render(text, { mode, ...rest, fieldProps }, <>{dom}</>)}</>
      }
      return <>{dom}</>
    }
    if (mode === 'edit' || mode === 'update') {
      const { value, disabled, placeholder = intl.value.getMessage({
        id: 'tableForm.selectPlaceholder',
        defaultMessage: '请选择',
      }) } = fieldProps!
      const dayValue = parseValueToDay(value!)
      let dom = (
        <DatePicker
          picker={picker}
          showTime={showTime}
          format={format}
          placeholder={placeholder}
          variant={variant}
          {...fieldProps}
          value={dayValue}
          v-slots={slots}
        />
      )

      if (light) {
        dom = (
          <FieldLabel
            label={label}
            onClick={() => {
              fieldProps?.onOpenChange?.(true)
              setOpen(true)
            }}
            style={
              dayValue
                ? {
                    paddingInlineEnd: 0,
                  }
                : undefined
            }
            disabled={disabled}
            value={
              dayValue || open.value ? (
                <DatePicker
                  picker={picker}
                  showTime={showTime}
                  format={format}
                  {...fieldProps}
                  value={dayValue}
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen)
                    fieldProps?.onOpenChange?.(isOpen)
                  }}
                  open={open.value}
                />
              ) : undefined
            }
            allowClear={false}
            downIcon={dayValue || open.value ? false : undefined}
            variant={variant}
            ref={lightLabel}
          />
        )
      }
      if (formItemRender) {
        return <>{formItemRender(text, { mode, ...rest, fieldProps }, dom)}</>
      }
      return dom
    }
    return null
  }
}, {
  name: 'FieldDatePicker',
  inheritAttrs: false,
})

export default FieldDatePicker
