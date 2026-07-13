import type { ProSchemaValueEnumObj } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { CascaderProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import type { FieldSelectProps } from '../Select'
import { useIntl } from '@antdv-next1/pro-provider'
import {
  FieldLabel,
  objectToMap,
  proFieldParsingText,
  useMemo,
  useState,
} from '@antdv-next1/pro-utils'
import { LoadingOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Cascader } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, ref } from 'vue'
import { useFieldFetchData } from '../Select'

export type FieldCascaderProps = ProFieldFC<{
  options?: CascaderProps['options']
  placeholder?: string
  variant?: 'outlined' | 'borderless' | 'filled'
}, CascaderProps & { class?: string, style?: CSSProperties }> & Omit<FieldSelectProps, 'variant' | 'fieldProps' | 'id' | 'label' | 'labelTrigger' | 'lightLabel' | 'text' | 'light' | 'plain'>

export interface FieldCascaderRef {
  focus: () => void
  blur: () => void
  fetchData: (keyWord: string) => void
}

const FieldCascader = defineComponent<FieldCascaderProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { expose }) => {
  const config = useConfig()
  const layoutClassName = computed(() => config.value.getPrefixCls('field-cascader'))
  const [loading, options, fetchData] = useFieldFetchData(props)
  const intl = useIntl()
  const cascaderRef = ref<FieldCascaderRef | null>(null)
  const [open, setOpen] = useState(false)
  const optionsValueEnum = useMemo(() => {
    if (props.mode !== 'read')
      return
    /**
     * Support cascader fieldNames
     *
     * @see https://ant.design/components/cascader-cn/#header
     */
    const {
      value: valuePropsName = 'value',
      label: labelPropsName = 'label',
      children: childrenPropsName = 'children',
    } = props.fieldProps?.fieldNames || {}

    const valueEnumObj = {} as ProSchemaValueEnumObj

    const traverseOptions = (_options: typeof options.value) => {
      if (!_options?.length) {
        return valueEnumObj
      }

      const length = _options.length
      let i = 0
      while (i < length) {
        const cur = _options[i++]
        valueEnumObj[cur![valuePropsName]] = {
          text: cur!.text || cur![labelPropsName],
          status: cur!.status,
          color: cur!.color,
          disabled: cur!.disabled,
        }
        traverseOptions(cur?.[childrenPropsName])
      }
      return valueEnumObj
    }

    return traverseOptions(options?.value)
  }, [() => props.mode, options, () => props.fieldProps?.fieldNames])
  expose({
    focus: () => cascaderRef.value?.focus(),
    blur: () => cascaderRef.value?.blur(),
    fetchData: (keyWord: string) => fetchData(keyWord),
  } as FieldCascaderRef)

  return () => {
    const { mode, render, formItemRender, variant, placeholder: propsPlaceholder, ...rest } = props
    if (mode === 'read') {
      const dom = (
        <>
          {proFieldParsingText(
            rest.text! as string[],
            objectToMap(rest.valueEnum || optionsValueEnum.value),
          )}
        </>
      )

      if (render) {
        return <>{render(rest.text, { mode, ...rest }, dom) ?? null}</>
      }
      return dom
    }
    if (mode === 'edit') {
      const placeholder = rest.fieldProps?.placeholder || propsPlaceholder || intl.value.getMessage({
        id: 'tableForm.selectPlaceholder',
        defaultMessage: '请选择',
      })
      let dom = (
        <Cascader
          ref={cascaderRef}
          open={open.value}
          suffixIcon={loading.value ? <LoadingOutlined /> : undefined}
          placeholder={placeholder}
          allowClear={rest.fieldProps?.allowClear !== false}
          {...rest.fieldProps}
          onOpenChange={(isOpen) => {
            rest.fieldProps?.onOpenChange?.(isOpen)
            setOpen(isOpen)
          }}
          class={classNames((rest.fieldProps || {}).class, layoutClassName.value)}
          options={options.value as CascaderProps['options']}
        />
      )

      if (formItemRender) {
        dom = (
          <>
            {formItemRender(
              rest.text,
              {
                mode: props.mode,
                ...rest,
                options: options.value,
                loading: loading.value,
              },
              dom,
            ) ?? null}
          </>
        )
      }

      if (rest.light) {
        const { disabled, value } = props.fieldProps!
        const notEmpty = !!value && value?.length !== 0
        return (
          <FieldLabel
            label={rest.label}
            disabled={disabled}
            variant={variant}
            value={notEmpty || open.value ? dom : null}
            style={
              notEmpty
                ? {
                    paddingInlineEnd: 0,
                  }
                : undefined
            }
            allowClear={false}
            downIcon={notEmpty || open.value ? false : undefined}
            onClick={() => {
              setOpen(true)
              rest.fieldProps?.onOpenChange?.(true)
            }}
          />
        )
      }
      return dom
    }
    return null
  }
}, {
  name: 'FieldCascader',
  inheritAttrs: false,
})

export default FieldCascader
