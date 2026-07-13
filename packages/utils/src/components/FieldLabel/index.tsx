import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SizeType } from 'antdv-next'
import type { VNode } from 'vue'
import type { VueNode } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { CloseCircleFilled, DownOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next'
import { useConfig as useAntdConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import useStyle from './style'

export interface FieldLabelProps {
  label?: VueNode
  value?: VueNode
  disabled?: boolean
  onClear?: () => void
  size?: SizeType
  ellipsis?: boolean
  placeholder?: VueNode
  formatter?: (value: any) => VueNode
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
  allowClear?: boolean
  downIcon?: VueNode
  onClick?: () => void
  valueMaxLength?: number
  /**
   * 点击标签的事件，用来唤醒 down menu 状态
   */
  onLabelClick?: () => void
}

const FieldLabel = defineComponent<FieldLabelProps, {}, string, CustomSlotsType<{
  default?: () => VNode[]
}>>(
  (props = { valueMaxLength: 41 }, { expose, attrs }) => {
    const config = useAntdConfig()
    const { componentSize } = useConfig()
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-core-field-label`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const intl = useIntl()
    const clearRef = shallowRef<HTMLSpanElement | null>(null)
    const labelRef = shallowRef<HTMLSpanElement | null>(null)
    const wrapElements = (array: (string | VNode)[]): VNode[] | string => {
      if (array.every(item => typeof item === 'string'))
        return array.join(',')
      return array.map((item, index) => {
        const comma = index === array.length - 1 ? '' : ','
        if (typeof item === 'string') {
          return (
            <span key={index}>
              {item}
              {comma}
            </span>
          )
        }
        return (
          <span key={index} style={{ display: 'flex' }}>
            {item}
            {comma}
          </span>
        )
      })
    }

    const formatterText = (aValue: any) => {
      if (props.formatter) {
        return props.formatter(aValue)
      }
      return Array.isArray(aValue) ? wrapElements(aValue) : aValue
    }

    const getTextByValue = (
      aLabel?: VueNode | VueNode[],
      aValue?: string | string[],
    ): VueNode | VueNode[] => {
      if (
        aValue !== undefined
        && aValue !== null
        && aValue !== ''
        && (!Array.isArray(aValue) || aValue.length)
      ) {
        const prefix = aLabel ? (
          <span onClick={() => props.onLabelClick?.()} class={`${baseClassName.value}-text`}>
            {aLabel}
            {': '}
          </span>
        ) : (
          ''
        )
        const str = formatterText(aValue)
        if (!props.ellipsis) {
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {prefix}
              {formatterText(aValue)}
            </span>
          )
        }
        const getText = () => {
          const isArrayValue = Array.isArray(aValue) && aValue.length > 1
          const unitText = intl.value.getMessage({
            id: 'form.lightFilter.itemUnit',
            defaultMessage: '项',
          })
          if (typeof str === 'string' && str.length > props.valueMaxLength! && isArrayValue) {
            return `...${aValue.length}${unitText}`
          }
          return ''
        }
        const tail = getText()

        return (
          <span
            title={typeof str === 'string' ? str : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {prefix}
            <span style={{ paddingInlineStart: '4px', display: 'flex' }}>
              {typeof str === 'string' ? str?.toString()?.slice?.(0, props.valueMaxLength) : str}
            </span>
            {tail}
          </span>
        )
      }
      return aLabel || props.placeholder
    }

    expose({
      labelRef,
      clearRef,
    })
    return () => {
      const {
        label,
        onClear,
        value,
        disabled,
        variant = 'borderless',
        size: propsSize,
        downIcon,
        allowClear = true,
      } = props
      const size = componentSize.value ? componentSize.value : 'middle'
      return (
        <span
          class={classNames(
            baseClassName.value,
            hashId.value,
            cssVarCls.value,
            `${baseClassName.value}-${propsSize ?? size ?? 'middle'}`,
            {
              [`${baseClassName.value}-${variant}-active`]:
            (Array.isArray(value) ? value.length > 0 : !!value) || value === 0,
              [`${baseClassName.value}-active`]:
                (Array.isArray(value) ? value.length > 0 : !!value) || value === 0,
              [`${baseClassName.value}-disabled`]: disabled,
              [`${baseClassName.value}-${variant}`]: variant,
              [`${baseClassName.value}-allow-clear`]: allowClear,
            },
            attrs.class,
          )}
          style={attrs.style}
          ref={labelRef}
          onClick={() => {
            props?.onClick?.()
          }}
        >
          {getTextByValue(label, value as string[])}
          {(value || value === 0) && allowClear && (
            <span
              role="button"
              class={classNames(
                `${baseClassName.value}-icon`,
                hashId.value,
                cssVarCls.value,
                `${baseClassName.value}-close`,
              )}
              title={intl.value.getMessage({
                id: 'form.lightFilter.clear',
                defaultMessage: '清除',
              })}
              onClick={(e) => {
                if (!disabled)
                  onClear?.()
                e.stopPropagation()
              }}
              ref={clearRef}

            >
              <CloseCircleFilled />
            </span>

          )}
          {downIcon !== false
            ? (downIcon ?? (
                <DownOutlined
                  class={classNames(
                    `${baseClassName.value}-icon`,
                    hashId.value,
                    cssVarCls.value,
                    `${baseClassName.value}-arrow`,
                  )}
                />
              ))
            : null}
        </span>
      )
    }
  },
  {
    name: 'FieldLabel',
    inheritAttrs: false,
  },
)

export default FieldLabel
