import type { ProFieldFCRenderProps } from '@antdv-next1/pro-provider'
import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { InputNumberProps } from 'antdv-next'
import type { ProFieldFC } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { useMemo } from '@antdv-next1/pro-utils'
import { InputNumber } from 'antdv-next'
import { defineComponent, Fragment } from 'vue'
import {
  getColorByRealValue,
  getRealTextWithPrecision,
  getSymbolByRealValue,
  toNumber,
} from './util'

export type FieldPercentProps = ProFieldFC<{
  prefix?: VueNode
  suffix?: VueNode
  text?: number | string
  precision?: number
  showColor?: boolean
  showSymbol?: boolean | ((value: any) => boolean)
  render?:
    | ((
      text: any,
      props: Omit<ProFieldFCRenderProps, 'value' | 'onUpdate:value' | 'onChange'> & {
        prefix?: VueNode
        precision?: number
        showSymbol?: boolean
        suffix?: VueNode
      },
      dom: VueNode,
    ) => VueNode)
  placeholder?: string
}, InputNumberProps>

const FieldPercent = defineComponent<FieldPercentProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props) => {
  const intl = useIntl()
  const realValue = useMemo(
    () =>
      typeof props.text === 'string' && (props.text as string).includes('%')
        ? toNumber((props.text as string).replace('%', ''))
        : toNumber(props.text),
    [() => props.text],
  )
  const showSymbol = useMemo(() => {
    if (typeof props.showSymbol === 'function') {
      return props.showSymbol(props.text)
    }
    return props.showSymbol
  }, [() => props.showSymbol, () => props.text])
  return () => {
    const {
      text,
      prefix,
      precision,
      suffix = '%',
      mode,
      showColor = false,
      render,
      formItemRender,
      fieldProps,
      placeholder: propsPlaceholder,
      ...rest
    } = props
    if (mode === 'read') {
      /** 颜色有待确定, 根据提供 colors: ['正', '负'] | boolean */
      const style = showColor ? { color: getColorByRealValue(realValue.value) } : {}

      const dom = (
        <span style={style}>
          {prefix && <span>{prefix}</span>}
          {showSymbol.value && (
            <Fragment>
              {getSymbolByRealValue(realValue.value)}
              {' '}
            </Fragment>
          )}
          {getRealTextWithPrecision(Math.abs(realValue.value), precision)}
          {suffix && suffix}
        </span>
      )
      if (render) {
        return (
          <>
            {render(
              text,
              { mode, ...rest, fieldProps, prefix, precision, showSymbol: showSymbol.value, suffix },
              dom,
            )}
          </>
        )
      }
      return dom
    }
    if (mode === 'edit' || mode === 'update') {
      const placeholder = propsPlaceholder
        || intl.value.getMessage({ id: 'tableForm.inputPlaceholder', defaultMessage: '请输入' })
      const dom = (
        <InputNumber
          defaultValue={text}
          formatter={(value) => {
            if (value && prefix) {
              return `${prefix} ${value}`.replace(/\B(?=(\d{3})+$)/g, ',')
            }
            return `${value}`
          }}
          parser={value => (value ? value.replace(/.*\s|,/g, '') : '')}
          placeholder={placeholder}
          {...fieldProps}
        />
      )
      if (formItemRender) {
        return <>{formItemRender(text, { mode, ...rest, placeholder }, dom)}</>
      }
      return dom
    }
    return null
  }
}, {
  name: 'FieldPercent',
  inheritAttrs: false,
})

export default FieldPercent
