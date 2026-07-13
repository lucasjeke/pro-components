import type { ProFieldValueEnumType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { CheckboxGroupProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import type { FieldSelectProps } from '../Select'
import { useToken } from '@antdv-next1/pro-provider'
import {
  objectToMap,
  proFieldParsingText,
} from '@antdv-next1/pro-utils'
import { classNames, omit } from '@v-c/util'
import { CheckboxGroup, Spin } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { useFormItemInputContext } from 'antdv-next/dist/form/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { useFieldFetchData } from '../Select'
import useStyle from './style'

export type FieldCheckBoxProps = ProFieldFC<{
  layout?: 'horizontal' | 'vertical'
  options?: CheckboxGroupProps['options']
}, CheckboxGroupProps & { class?: string, style?: CSSProperties }> & Omit<FieldSelectProps, 'variant' | 'fieldProps' | 'id' | 'label' | 'labelTrigger' | 'lightLabel' | 'light' | 'plain'>

export interface FieldCheckboxRef {
  focus: () => void
  blur: () => void
  fetchData: (keyWord: string) => void
}

const FieldCheckbox = defineComponent<FieldCheckBoxProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { expose, attrs }) => {
    const config = useConfig()
    const formItemInputContext = useFormItemInputContext()
    const layoutClassName = computed(() => config.value.getPrefixCls('pro-field-checkbox'))
    const [loading, options, fetchData] = useFieldFetchData(props)
    const [hashId, cssVarCls] = useStyle(layoutClassName)
    const { token } = useToken()
    const checkBoxRef = shallowRef<FieldCheckboxRef | null>(null)
    expose({
      fetchData: (keyWord: string) => fetchData(keyWord),
    })
    return () => {
      const { mode, render, formItemRender, options: propsOptions, request, params, debounceTime, defaultKeyWords, layout = 'horizontal', ...rest } = props
      if (loading.value) {
        return <Spin size="small" />
      }
      if (mode === 'read') {
        const optionsValueEnum = options.value?.length
          ? options.value?.reduce((pre, cur) => {
              return { ...pre, [(cur.value as string) ?? '']: cur.label }
            }, {} as ProFieldValueEnumType)
          : undefined

        const dom = proFieldParsingText(
          rest.text! as string,
          objectToMap(rest.valueEnum || optionsValueEnum),
        )

        if (render) {
          return (
            <>
              {render(
                rest.text,
                { mode, ...rest },
                <>{dom}</>,
              ) ?? null}
            </>
          )
        }
        return (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: `${token.value.marginSM}px`,
            }}
          >
            {dom}
          </div>
        )
      }
      if (mode === 'edit') {
        const dom = (
          <CheckboxGroup
            ref={checkBoxRef}
            {...omit(attrs, ['lightProps'])}
            {...rest.fieldProps}
            class={classNames(
              rest.fieldProps?.class,
              hashId.value,
              cssVarCls.value,
              `${layoutClassName.value}-${layout}`,
              {
                [`${layoutClassName.value}-error`]: formItemInputContext.value.status === 'error',
                [`${layoutClassName.value}-warning`]: formItemInputContext.value.status === 'warning',
              },
            )}
            options={options.value as CheckboxGroupProps['options']}
          />
        )
        if (formItemRender) {
          return (
            <>
              {
                formItemRender(
                  rest.text,
                  {
                    mode,
                    ...rest,
                    options: options.value,
                    loading: loading.value,
                  },
                  dom,
                ) ?? null
              }
            </>
          )
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldCheckBox',
    inheritAttrs: false,
  },
)

export default FieldCheckbox
