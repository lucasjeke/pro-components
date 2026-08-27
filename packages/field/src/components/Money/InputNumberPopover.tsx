import type { VueNode } from '@antdv-next1/pro-utils'
import type { InputNumberProps } from 'antdv-next'
import { useEffect, useState } from '@antdv-next1/pro-utils'
import { useMergedState } from '@v-c/util'
import { InputNumber, Popover } from 'antdv-next'
import { computed, defineComponent, onMounted, onUnmounted, shallowRef } from 'vue'

/**
 * input 的弹框，用于显示格式化之后的内容
 *
 * @result 10,000 -> 一万
 * @result 10, 00, 000, 000 -> 一亿
 */
const InputNumberPopover = defineComponent<InputNumberProps & {
  open?: boolean
  'onUpdate:open'?: (open: boolean) => void
  onOpenChange?: (open: boolean) => void
  contentRender?: (props: InputNumberProps) => VueNode
} & {
  numberFormatOptions?: {
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    localeMatcher?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    style?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currency?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currencyDisplay?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currencySign?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    useGrouping?: boolean
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumIntegerDigits?: number
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumFractionDigits?: number
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    maximumFractionDigits?: number
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumSignificantDigits?: number

    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    maximumSignificantDigits?: number
  }
  numberPopoverRender?: | ((props: InputNumberProps, defaultText: string) => VueNode)
    | boolean
}>((props, { attrs }) => {
  const [value, setValue] = useMergedState<InputNumberProps['value']>(
    () => props.value || props.defaultValue,
    {
      value: computed(() => props.value),
      defaultValue: props.defaultValue,
      onChange: (val) => {
        props['onUpdate:value']?.(val)
        props.onChange?.(val)
      },
    },
  )
  // 使用本地状态管理 Popover 显示，同时支持受控模式
  const [localOpen, setLocalOpen] = useState(props.open ?? false)
  // 跟踪组件挂载状态，防止在卸载后执行状态更新
  const mountedRef = shallowRef(true)
  onMounted(() => {
    mountedRef.value = true
  })
  onUnmounted(() => {
    mountedRef.value = false
  })
  // 同步外部 open 属性到本地状态，支持受控模式
  useEffect(() => {
    if (props.open !== undefined) {
      setLocalOpen(props.open)
    }
  }, [() => props.open])
  // 优化的 onOpenChange 处理器
  const handleOpenChange = (visible: boolean) => {
    // 通知父组件状态变化
    props.onOpenChange?.(visible)

    // 如果是受控模式（传入了 open prop），不更新本地状态
    if (open === undefined) {
      // 使用 queueMicrotask 延迟状态更新，避免在渲染期间触发 flushSync
      queueMicrotask(() => {
        // 检查组件是否仍然挂载，避免在卸载后更新状态
        if (mountedRef.value) {
          setLocalOpen(visible)
        }
      })
    }
  }
  return () => {
    const { contentRender: content, numberFormatOptions, numberPopoverRender, open, value: propsValue, onChange, ...rest } = props
    /**
     * 如果content 存在要根据 content 渲染一下
     */
    const dom = content?.({
      ...rest,
      value: value.value,
    })
    // 没有 dom 时不显示 Popover
    if (!dom) {
      return (
        <InputNumber
          {...attrs}
          {...rest}
          value={value.value}
          onChange={(value) => {
            setValue(value)
          }}
        />
      )
    }
    return (
      <Popover
        placement="topLeft"
        trigger={['focus', 'click']}
        open={localOpen.value}
        onOpenChange={handleOpenChange}
        content={<>{dom}</>}
        getPopupContainer={(triggerNode) => {
          return triggerNode?.parentElement || document.body
        }}
        onUpdate:open={(_open) => {
          props['onUpdate:open']?.(_open)
          setLocalOpen(_open)
        }}
      >
        <InputNumber
          {...attrs}
          {...rest}
          value={value.value}
          onChange={(value) => {
            setValue(value)
          }}
        />
      </Popover>
    )
  }
}, {
  name: 'InputNumberPopover',
  inheritAttrs: false,
})

export default InputNumberPopover
