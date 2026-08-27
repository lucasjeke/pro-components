import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { RangePickerProps } from 'antdv-next'
import type { ProFieldFC, ProFieldLightProps } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { FieldLabel, parseValueToDay, useState } from '@antdv-next1/pro-utils'
import { DateRangePicker, Space } from 'antdv-next'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { defineComponent } from 'vue'

dayjs.extend(advancedFormat)
dayjs.extend(quarterOfYear)
dayjs.extend(weekOfYear)

export type FieldDateRangePickerProps = ProFieldFC<{
  text: string[]
  format?: string
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
  showTime?: boolean
  separator?: string
  picker?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year'
} & ProFieldLightProps, RangePickerProps>

type FormatType = FieldDateRangePickerProps['format'] | RangePickerProps['format']

function getFormatByIndex(format: FormatType, index: 0 | 1) {
  if (Array.isArray(format)) {
    return format[index] || format[0]
  }
  if (typeof format === 'object' && format && 'format' in format) {
    return format.format
  }
  return format
}

function formatRangeDateText(text: any, format: FormatType, index: 0 | 1) {
  if (!text)
    return ''
  const date = dayjs(text)
  const currentFormat = getFormatByIndex(format, index)
  if (typeof currentFormat === 'function') {
    return date.isValid() ? currentFormat(date) : String(text)
  }
  if (!date.isValid()) {
    return String(text)
  }
  return date.format(currentFormat || 'YYYY-MM-DD')
}

const FieldDateRangePicker = defineComponent<FieldDateRangePickerProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { slots }) => {
    const intl = useIntl()
    const [open, setOpen] = useState<boolean>(false)

    return () => {
      const {
        text,
        mode,
        light,
        label,
        format = 'YYYY-MM-DD',
        render,
        picker,
        formItemRender,
        showTime,
        separator = '~',
        lightLabel,
        variant: propsVariant,
        fieldProps,
        ...rest
      } = props
      const [startText, endText] = Array.isArray(text) ? text : []
      const mergedFormat = fieldProps?.format || format || 'YYYY-MM-DD'

      const parsedStartText = formatRangeDateText(startText, mergedFormat, 0)
      const parsedEndText = formatRangeDateText(endText, mergedFormat, 1)
      if (mode === 'read') {
        const dom = (
          <Space align="center" wrap>
            <div>{parsedStartText || '-'}</div>
            {' '}
            {separator}
            {' '}
            <div>{parsedEndText || '-'}</div>
          </Space>
        )
        if (render) {
          return <>{render(text, { mode, ...rest, fieldProps }, <span>{dom}</span>)}</>
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dayValue = parseValueToDay(fieldProps?.value as string[]) as [dayjs.Dayjs, dayjs.Dayjs]
        const placeholder = fieldProps?.placeholder! || [
          intl.value.getMessage({
            id: 'tableForm.selectPlaceholder',
            defaultMessage: '请选择',
          }),
          intl.value.getMessage({
            id: 'tableForm.selectPlaceholder',
            defaultMessage: '请选择',
          }),
        ]
        let dom = (
          <DateRangePicker
            format={format}
            showTime={showTime}
            placeholder={
              placeholder
            }
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
              disabled={Array.isArray(fieldProps?.disabled) ? fieldProps.disabled[0] : fieldProps?.disabled}
              value={
                dayValue || open.value ? (
                  <DateRangePicker
                    picker={picker}
                    showTime={showTime}
                    format={format}
                    {...fieldProps}
                    placeholder={placeholder}
                    value={dayValue}
                    onOpenChange={(isOpen) => {
                      if (dayValue)
                        setOpen(isOpen)
                      fieldProps?.onOpenChange?.(isOpen)
                    }}
                    onChange={(dates, dateStrings) => {
                      fieldProps?.onChange?.(dates, dateStrings)
                      if (!dates) {
                        setOpen(false)
                      }
                    }}
                  />
                ) : null
              }
              allowClear={false}
              variant={propsVariant}
              ref={lightLabel}
              downIcon={dayValue || open.value ? false : undefined}
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
  },
  {
    name: 'FieldDateRangePicker',
    inheritAttrs: false,
  },
)

export default FieldDateRangePicker
