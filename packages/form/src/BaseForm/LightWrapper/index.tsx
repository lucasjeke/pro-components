import type { VueNode } from '@antdv-next1/pro-utils'
import type { ChangeEvent } from '@v-c/util/dist/EventInterface'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SizeType, TooltipPlacement } from 'antdv-next'
import type { VNode } from 'vue'
import type { LightFilterFooterRender } from '../../RenderTypings'
import {
  childrenToArray,
  dateArrayFormatter,
  dateFormatterMap,
  FieldLabel,
  FilterDropdown,
  isSpecialNode,
  normalizeProps,
  useMountMergeState,
  useState,
} from '@antdv-next1/pro-utils'
import { classNames, omit } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { cloneVNode, computed, defineComponent, isVNode } from 'vue'
import useStyle from './style'

export interface LightWrapperProps {
  label?: VueNode
  id?: string
  disabled?: boolean
  placeholder?: VueNode
  size?: SizeType
  onChange?: (...args: any[]) => void
  onBlur?: (...args: any[]) => void
  onFocus?: (...args: any[]) => void
  valuePropName?: 'value' | 'checked' | 'fileList'
  customLightMode?: boolean
  light?: boolean
  /**
   * @name labelFormatter 自定义label的值
   *
   * @example <caption>自定义数组的转化</caption>
   * labelFormatter={(value) =>value.join('-')} }
   */
  labelFormatter?: (value: any) => VueNode
  variant?: 'outlined' | 'filled' | 'borderless'
  otherFieldProps?: any
  valueType?: string
  allowClear?: boolean
  footerRender?: LightFilterFooterRender
  placement?: TooltipPlacement
  form?: any
}

const LightWrapper = defineComponent<LightWrapperProps, {}, string, CustomSlotsType<{
  default?: (form?: any) => VNode[]
}>>(
  (props, { slots, attrs }) => {
    const config = useConfig()
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-field-light-wrapper`)

    const [hashId, cssVarCls] = useStyle(baseClassName)

    const labelValue = computed(() => attrs[props.valuePropName as keyof typeof props] as any)

    const [tempValue, setTempValue] = useState<string | undefined | null>(
      attrs[props.valuePropName as keyof typeof props] as string,
    )

    const [open, setOpen] = useMountMergeState<boolean>(false)

    /** DateRange的转化，dayjs 的 toString 有点不好用 */
    const labelValueText = computed(() => {
      if (!labelValue.value)
        return labelValue.value
      if (
        props.valueType?.toLowerCase()?.endsWith('range')
        && props.valueType !== 'digitRange'
        && !props.labelFormatter
      ) {
        return dateArrayFormatter(
          labelValue.value,
          dateFormatterMap[props.valueType as keyof typeof dateFormatterMap] || 'YYYY-MM-DD',
        )
      }
      if (Array.isArray(labelValue.value)) {
        return labelValue.value.map((item) => {
          if (typeof item === 'object' && item.label && item.value) {
            return item.label
          }
          return item
        })
      }

      return labelValue.value
    })
    const handleChange = (...restParams: any[]) => {
      props.otherFieldProps?.onChange?.(...restParams)
      props.onChange?.(...restParams);
      (attrs[`onUpdate:${props.valuePropName}`] as (...args: any[]) => void)(...restParams)
    }
    return () => {
      const {
        label,
        size,
        disabled,
        onChange,
        valuePropName,
        placeholder,
        labelFormatter,
        variant,
        footerRender,
        allowClear,
        otherFieldProps,
        valueType,
        placement,
        ...rest
      } = props

      const children: VNode<any, any, { fieldProps?: any, [key: string]: any }>[] = childrenToArray(slots.default?.(props.form), true)
      return (
        <FilterDropdown
          disabled={disabled}
          open={open.value}
          onOpenChange={setOpen}
          placement={placement}
          label={(
            <FieldLabel
              ellipsis
              size={size}
              onClear={() => {
                handleChange()
                setTempValue(null)
              }}
              variant={variant}
              label={label}
              placeholder={placeholder}
              value={labelValueText.value}
              disabled={disabled}
              formatter={labelFormatter}
              allowClear={allowClear}
            />
          )}
          footer={{
            onClear: () => setTempValue(null),
            onConfirm: () => {
              handleChange(tempValue.value)
              setOpen(false)
            },
          }}
          footerRender={footerRender}
        >
          <div
            class={classNames(`${baseClassName.value}-container`, hashId.value, cssVarCls.value, attrs.class)}
            style={attrs.style}
          >
            {children.map((child) => {
              if (isVNode(child) && !isSpecialNode(child)) {
                child.props = normalizeProps(child.props || {})
                return cloneVNode(child, {
                  ...rest,
                  ...omit(child?.props || {}, ['onChange']),
                  [valuePropName!]: tempValue.value,
                  [`onUpdate:${valuePropName}`]: (value: string) => setTempValue(value),
                  onChange: (e: ChangeEvent | string) => setTempValue(
                    (e as ChangeEvent)?.target
                      ? ((e as ChangeEvent)?.target as HTMLInputElement)?.value
                      : (e as string),
                  ),
                  // light 模式下由外层 FilterDropdown 统一描边，内层 Select/TreeSelect/DatePicker 等统一使用 borderless，各 Field 组件无需再根据 light 判断
                  variant: 'borderless' as const,
                  fieldProps: {
                    ...child.props?.fieldProps,
                    variant: 'borderless' as const,
                  },
                })
              }
              return child
            })}
          </div>
        </FilterDropdown>
      )
    }
  },
  {
    name: 'LightWrapper',
    inheritAttrs: false,
  },
)

export default LightWrapper
