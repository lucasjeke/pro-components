import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SegmentedProps } from 'antdv-next'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import type { FieldSelectProps } from '../Select'
import { objectToMap, proFieldParsingText } from '@antdv-next1/pro-utils'
import { Segmented, Spin } from 'antdv-next'
import { defineComponent, ref } from 'vue'
import { useFieldFetchData } from '../Select'

export type FieldSegmentedProps = ProFieldFC<{
  options?: SegmentedProps['options']
  emptyText?: VueNode
}, SegmentedProps & { class?: string, style?: CSSProperties, layout?: 'horizontal' | 'vertical' }> & Omit<FieldSelectProps, 'variant' | 'fieldProps' | 'id' | 'label' | 'labelTrigger' | 'lightLabel' | 'light' | 'plain'>

const FieldSegmented = defineComponent<FieldSegmentedProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { expose }) => {
    const inputRef = ref<HTMLInputElement>()
    const [loading, options, fetchData] = useFieldFetchData(props)
    expose({
      fetchData: (keyWord: string) => fetchData(keyWord),
    })
    return () => {
      const { mode, render, formItemRender, options: propsOptions, fieldProps, emptyText = '-', ...rest } = props
      if (loading.value) {
        return <Spin size="small" />
      }
      if (mode === 'read') {
        const optionsValueEnum = options.value?.length
          ? options.value?.reduce((pre, cur) => {
              return { ...pre, [(cur.value ?? '') as string]: cur.label }
            }, {})
          : undefined
        const dom = (
          <>{proFieldParsingText(rest.text! as string[], objectToMap(rest.valueEnum || optionsValueEnum))}</>
        )

        if (render) {
          return <>{render(rest.text, { mode, ...rest, fieldProps }, <>{dom}</>) ?? emptyText}</>
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <Segmented
            ref={inputRef}
            {...fieldProps}
            options={options.value as SegmentedProps['options']}
          />
        )

        if (formItemRender) {
          return (
            <>
              {formItemRender(
                rest.text,
                { mode, ...rest, fieldProps, options: options.value, loading: loading.value },
                dom,
              )}
            </>
          )
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldSegmented',
    inheritAttrs: false,
  },
)

export default FieldSegmented
