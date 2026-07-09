import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { PopoverProps, TooltipPlacement } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { VueNode } from '../../typing'
import type { DropdownFooterProps } from '../DropdownFooter'
import { classNames } from '@v-c/util'
import { ConfigProvider, Popover } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { useMemo } from '../../hooks'
import DropdownFooter from '../DropdownFooter'
import useStyle from './style'

export type FooterRender
  = | ((
    onConfirm?: (e?: MouseEvent) => void,
    onClear?: (e?: MouseEvent) => void,
  ) => VueNode)
  | false

export interface FilterDropdownProps {
  label?: VueNode
  footer?: DropdownFooterProps
  footerRender?: FooterRender
  padding?: number
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: TooltipPlacement
  /**
   * @name 透传给 Popover 的属性
   *
   * @description
   * 用于给弹层（portal 到 body 的容器）设置自定义类名/样式等，例如通过 classNames.root 控制样式范围。
   *
   * @example
   * popoverProps={{ classNames: { root: 'my-lightfilter-popover' } } }
   */
  popoverProps?: Omit<
    PopoverProps,
'content' | 'trigger' | 'styles' | 'open' | 'onOpenChange' | 'placement'
  > & {
    styles?: PopoverProps['styles'] & {
      container?: CSSProperties
    }
  }
}
const FilterDropdown = defineComponent<FilterDropdownProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots }) => {
  const config = useConfig()
  const prefixCls = computed(() => config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-core-field-dropdown`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const htmlRef = shallowRef<HTMLDivElement | null>(null)
  const styles = useMemo(
    () => ({
      container: {
        // padding: 0,
        ...(props.popoverProps?.styles?.container || {}),
      },
      ...(props.popoverProps?.styles || {}),
    }),
    [() => props.popoverProps?.styles],
  )
  return () => {
    const { label, footer, open, popoverProps, onOpenChange, disabled, footerRender, placement } = props
    return (
      <Popover
        {...popoverProps}
        placement={placement}
        trigger={['click']}
        open={open || false}
        onOpenChange={onOpenChange}
        styles={styles.value}
        content={(
          <div
            ref={htmlRef}
            class={classNames(
              `${baseClassName.value}-overlay`,
              {
                [`${baseClassName.value}-overlay-${placement}`]: placement,
              },
              hashId.value,
              cssVarCls.value,
            )}
          >
            <ConfigProvider getPopupContainer={() => htmlRef.value || document.body}>
              <div class={classNames(`${baseClassName.value}-content`, hashId.value, cssVarCls.value)}>
                {slots.default?.()}
              </div>
            </ConfigProvider>
            {footer && (
              <DropdownFooter disabled={disabled} footerRender={footerRender} {...footer} />
            )}
          </div>
        )}
      >
        <span class={classNames(`${baseClassName.value}-label`, hashId.value, cssVarCls.value)}>{label}</span>
      </Popover>
    )
  }
}, {
  name: 'FilterDropdown',
  inheritAttrs: false,
})

export default FilterDropdown
