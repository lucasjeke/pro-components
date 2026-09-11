import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { InputNumberProps, ProgressProps } from 'antdv-next'
import type { ProFieldFC } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { useMemo } from '@antdv-next1/pro-utils'
import { InputNumber, Progress } from 'antdv-next'
import { defineComponent } from 'vue'
import { toNumber } from '../Percent/util'

export function getProgressStatus(text: number): 'success' | 'exception' | 'normal' | 'active' {
  if (text === 100) {
    return 'success'
  }
  if (text < 0) {
    return 'exception'
  }
  if (text < 100) {
    return 'active'
  }

  return 'normal'
}

//

export type FieldProgressProps = ProFieldFC<{
  text: number | string
  placeholder?: string
}, ProgressProps | InputNumberProps>

const FieldProgress = defineComponent<FieldProgressProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props) => {
    const intl = useIntl()
    const realValue = useMemo(
      () =>
        typeof props.text === 'string' && (props.text as string).includes('%')
          ? toNumber((props.text as string).replace('%', ''))
          : toNumber(props.text),
      [() => props.text],
    )
    return () => {
      const { text, mode, render, formItemRender, fieldProps, placeholder: propsPlaceholder } = props
      if (mode === 'read') {
        const dom = (
          <Progress
            size="small"
            style={{ minWidth: `${100}px`, maxWidth: `${320}px` }}
            percent={realValue.value}
            steps={(fieldProps as ProgressProps)?.steps}
            status={getProgressStatus(realValue.value as number)}
            {...fieldProps as ProgressProps}
          />
        )
        if (render) {
          return <>{ render(realValue.value, { mode, fieldProps }, dom)}</>
        }
        return dom
      }

      if (mode === 'edit' || mode === 'update') {
        const placeholder = propsPlaceholder
          || intl.value.getMessage({ id: 'tableForm.inputPlaceholder', defaultMessage: '请输入' })
        const dom = (
          <InputNumber
            max={100}
            min={0}
            placeholder={placeholder}
            {...fieldProps as InputNumberProps}
          />
        )
        if (formItemRender) {
          return <>{formItemRender(text, { mode, fieldProps, placeholder }, dom)}</>
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldProgress',
    inheritAttrs: false,
  },
)

export default FieldProgress
