import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { CheckboxGroupProps, RadioGroupProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import type { FieldSelectProps } from '../Select'
import {
  objectToMap,
  proFieldParsingText,

} from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { RadioGroup, Spin } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { useFormItemInputContext } from 'antdv-next/dist/form/context'
import { computed, defineComponent, ref } from 'vue'
import { useFieldFetchData } from '../Select'
import useStyle from './style'

export type FieldRadioProps = ProFieldFC<{
  options?: RadioGroupProps['options']
  radioType?: RadioGroupProps['optionType']
}, RadioGroupProps & { class?: string, style?: CSSProperties, layout?: 'horizontal' | 'vertical' }> & Omit<FieldSelectProps, 'variant' | 'fieldProps' | 'id' | 'label' | 'labelTrigger' | 'lightLabel' | 'light' | 'plain'>

const FieldRadio = defineComponent<FieldRadioProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { expose, attrs }) => {
    const config = useConfig()
    const formItemInputContext = useFormItemInputContext()

    const layoutClassName = computed(() => config.value.getPrefixCls('pro-field-radio'))
    const [loading, options, fetchData] = useFieldFetchData(props)
    const radioRef = ref()
    const [hashId, cssVarCls] = useStyle(layoutClassName)
    expose({
      fetchData: (keyWord: string) => fetchData(keyWord),
    })
    return () => {
      const { mode, render, formItemRender, options: propsOptions, request, params, debounceTime, defaultKeyWords, radioType, ...rest } = props
      if (loading.value) {
        return <Spin size="small" />
      }
      if (mode === 'read') {
        const optionsValueEnum = options.value?.length
          ? options.value?.reduce((pre, cur) => {
              return { ...pre, [(cur.value as string) ?? '']: cur.label }
            }, {})
          : undefined
        const dom = (
          <>{proFieldParsingText(rest.text as string, objectToMap(rest.valueEnum || optionsValueEnum))}</>
        )

        if (render) {
          return <>{render(rest.text!, { mode, ...rest }, dom) ?? null}</>
        }
        return dom
      }

      if (props.mode === 'edit') {
        const dom = (
          <RadioGroup
            ref={radioRef}
            {...attrs}
            optionType={radioType}
            {...rest.fieldProps}
            class={classNames(
              rest.fieldProps?.class,
              {
                [`${layoutClassName.value}-error`]: formItemInputContext.value.status === 'error',
                [`${layoutClassName.value}-warning`]: formItemInputContext.value.status === 'warning',
              },
              hashId.value,
              cssVarCls.value,
              `${layoutClassName.value}-${props.fieldProps?.layout || 'horizontal'}`,
            )}
            options={options.value as CheckboxGroupProps['options']}
          />
        )
        if (formItemRender) {
          return (
            <>
              { formItemRender(
                rest.text!,
                {
                  mode,
                  ...rest,
                  options: options.value,
                  loading: loading.value,
                },
                dom,
              ) ?? null}
            </>
          )
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldRadio',
    inheritAttrs: false,
  },
)

export default FieldRadio
