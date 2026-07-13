import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { PopoverProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import { useProConfig } from '@antdv-next1/pro-provider'
import { classNames } from '@v-c/util'
import { Popover } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import ProHelpContentPanel from './ProHelpContentPanel'

export type ProHelpPopoverProps = Omit<PopoverProps, 'content'> & {
  /**
   * 悬浮提示文字的 CSS 类名
   */
  textClassName?: string

  /**
   * Popover 内容的 content 的 CSS 类名
   */
  popoverContextClassName?: string

  /**
   * 悬浮提示文字的 CSS 样式对象
   */
  textStyle?: CSSProperties

  /**
   * 当前选中的帮助文档的 key 值
   */
  selectedKey: string

  /**
   * 可选的悬浮提示 Popover 组件的 Props，用于自定义悬浮提示的样式和行为。
   * 该属性可以传递 Ant Design Popover 组件的 props，如位置、大小、触发方式等等
   * @see popoverProps 注意，content 属性已经被从 PopoverProps 中删除，因为这个属性由 ProHelpPopover 内部控制。
   */
  popoverProps?: PopoverProps
}
/**
 * 异步加载内容的面板组件
 */

const ProHelpPopover = defineComponent<ProHelpPopoverProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots }) => {
  const config = useConfig()
  const proConfig = useProConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-help-popover`)
  return () => {
    return (
      <Popover
        styles={{
          container: {
            padding: 0,
          },
        }}
        content={(
          <div
            class={classNames(
              `${baseClassName.value}-content`,
              proConfig.value.hashId,
              props.popoverContextClassName,
            )}
          >
            <ProHelpContentPanel selectedKey={props.selectedKey} />
          </div>
        )}
        {...props.popoverProps}
      >
        <span
          class={classNames(
            `${baseClassName.value}-text`,
            proConfig.value.hashId,
            props.textClassName,
          )}
        >
          {slots.default?.()}
        </span>
      </Popover>
    )
  }
}, {
  name: 'ProHelpPopover',
  inheritAttrs: false,
})

export default ProHelpPopover
