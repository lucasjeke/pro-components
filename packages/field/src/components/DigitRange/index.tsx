import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { InputNumberProps } from 'antdv-next'
import type { ProFieldFC } from '../../typing'
import { proTheme, useIntl } from '@antdv-next1/pro-provider'
import { omitUndefined } from '@antdv-next1/pro-utils'
import { omit, useMergedState } from '@v-c/util'
import { Input, InputNumber, Space, SpaceCompact } from 'antdv-next'
import { computed, defineComponent } from 'vue'

export type Value = string | number | undefined | null

export type ValuePair = Value[]

export type FieldDigitRangeProps = ProFieldFC<{
  text: ValuePair
  placeholder?: string[]
  separator?: string
  separatorWidth?: number
}, Omit<InputNumberProps, 'placeholder' | 'value' | 'defaultValue' | 'onChange'> & {
  id?: string
  placeholder?: string[]
  value?: ValuePair
  onChange?: (value?: ValuePair) => void
  defaultValue?: ValuePair
  intlProps?: Intl.NumberFormatOptions
}>

const FieldDigitRange = defineComponent<FieldDigitRangeProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props) => {
    const intl = useIntl()
    const { token } = proTheme.useToken()
    const [valuePair, setValuePair] = useMergedState(() => props.fieldProps?.defaultValue, {
      value: computed(() => props.fieldProps?.value),
      defaultValue: props.fieldProps?.defaultValue,
      onChange: props.fieldProps?.onChange,
    })
    return () => {
      const {
        text,
        mode: type,
        render,
        placeholder: propsPlaceholder,
        formItemRender,
        separator = '~',
        separatorWidth = 30,
        ...rest
      } = props
      if (type === 'read') {
        const getContent = (number: Value) => {
          const digit = new Intl.NumberFormat(undefined, {
            minimumSignificantDigits: 2,
            ...(rest.fieldProps?.intlProps || {}),
          }).format(Number(number) as number)

          return rest.fieldProps?.formatter?.(digit, { userTyping: false, input: '' }) || digit
        }
        const dom = (
          <Space align="center" wrap>
            {getContent(text![0])}
            {' '}
            {separator}
            {' '}
            {getContent(text![1])}
          </Space>
        )
        if (render) {
          return <>{render(text, { mode: type, ...rest }, dom)}</>
        }
        return dom
      }
      if (type === 'edit' || type === 'update') {
        const handleGroupBlur = () => {
          if (Array.isArray(valuePair.value)) {
            //   仅在两个值均为数字时才做比较并转换
            const [value0, value1] = valuePair.value
            if (typeof value0 === 'number' && typeof value1 === 'number' && value0 > value1) {
              setValuePair([value1, value0])
            }
            else if (value0 === undefined && value1 === undefined) {
              // 当两个值均为undefined时将值变为undefined，方便required处理
              setValuePair(undefined)
            }
          }
        }

        const handleChange = (index: number, changedValue: Value) => {
          const newValuePair = [...(valuePair.value || [])]
          newValuePair[index] = changedValue === null ? undefined : changedValue
          setValuePair(newValuePair)
        }
        const placeholderValue = rest.fieldProps?.placeholder
          || propsPlaceholder || [
          intl.value.getMessage({ id: 'tableForm.inputPlaceholder', defaultMessage: '请输入' }),
          intl.value.getMessage({ id: 'tableForm.inputPlaceholder', defaultMessage: '请输入' }),
        ]

        const getInputNumberPlaceholder = (index: number) =>
          Array.isArray(placeholderValue) ? placeholderValue[index] : placeholderValue
        const dom = (
          <SpaceCompact block {...({ onBlur: handleGroupBlur })}>
            <InputNumber
              {...omit(rest.fieldProps || {}, ['onChange', 'onUpdate:value'])}
              onUpdate:value={(value) => {
                const newValuePair = [...(valuePair.value || [])]
                newValuePair[0] = value === null ? undefined : value
                rest.fieldProps?.['onUpdate:value']?.(newValuePair)
              }}
              placeholder={getInputNumberPlaceholder(0)}
              {...(omitUndefined({ id: rest.fieldProps?.id ?? `${rest.fieldProps?.id}-0` }))}
              style={{ width: `calc((100% - ${separatorWidth}px) / 2)` }}
              value={valuePair.value?.[0]}
              defaultValue={rest.fieldProps?.defaultValue?.[0] || text![0] as number}
              onChange={changedValue => handleChange(0, changedValue)}
            />
            <Input
              style={{
                width: `${separatorWidth}px`,
                textAlign: 'center',
                borderInlineStart: 0,
                borderInlineEnd: 0,
                pointerEvents: 'none',
                backgroundColor: token.value?.colorBgContainer,
              }}
              placeholder={separator}
              disabled
            />
            <InputNumber
              {...omit(rest.fieldProps || {}, ['onChange', 'onUpdate:value'])}
              onUpdate:value={(value) => {
                const newValuePair = [...(valuePair.value || [])]
                newValuePair[1] = value === null ? undefined : value
                rest.fieldProps?.['onUpdate:value']?.(newValuePair)
              }}
              placeholder={getInputNumberPlaceholder(1)}
              {...(omitUndefined({ id: rest.fieldProps?.id ?? `${rest.fieldProps?.id}-1` }))}
              style={{
                width: `calc((100% - ${separatorWidth}px) / 2)`,
              }}
              value={valuePair.value?.[1]}
              defaultValue={rest.fieldProps?.defaultValue?.[1] || text![1] as number}
              onChange={changedValue => handleChange(1, changedValue)}
            />
          </SpaceCompact>
        )
        if (formItemRender) {
          return <>{formItemRender(text, { mode: type, ...rest, placeholder: placeholderValue as string[] }, dom)}</>
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldDigitRange',
    inheritAttrs: false,
  },
)

export default FieldDigitRange
