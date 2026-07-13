import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VNode } from 'vue'
import type { VueNode } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { classNames } from '@v-c/util'
import { Button } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import useStyle from './style'

type LightFilterFooterRender
  = | ((onConfirm?: (e?: MouseEvent) => void, onClear?: (e?: MouseEvent) => void) => VueNode)
    | false

type OnClick = (e?: MouseEvent) => void

export interface DropdownFooterProps {
  onClear?: OnClick
  onConfirm?: OnClick
  disabled?: boolean
  prefixCls?: string
  footerRender?: LightFilterFooterRender
}

const DropdownFooter = defineComponent<DropdownFooterProps, {}, string, CustomSlotsType<{
  default?: () => VNode[]
}>>((props) => {
  const intl = useIntl()
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-core-field-dropdown-footer`)
  const [hashId, cssVarCls] = useStyle(baseClassName)

  return () => {
    const { onClear, onConfirm, disabled, footerRender } = props
    const defaultFooter = [
      <Button
        key="clear"
        style={{
          visibility: onClear ? 'visible' : 'hidden',
        }}
        type="link"
        size="small"
        disabled={disabled}
        onClick={(e) => {
          if (onClear) {
            onClear(e)
          }
          e.stopPropagation()
        }}
      >
        {intl.value.getMessage({ id: 'form.lightFilter.clear', defaultMessage: '清除' })}
      </Button>,
      <Button
        key="confirm"
        data-type="confirm"
        type="primary"
        size="small"
        onClick={onConfirm}
        disabled={disabled}
      >
        {intl.value.getMessage({ id: 'form.lightFilter.confirm', defaultMessage: '确认' })}
      </Button>,
    ]
    if (footerRender === false || footerRender?.(onConfirm, onClear) === false) {
      return null
    }

    const renderDom = footerRender?.(onConfirm, onClear) || defaultFooter
    return (
      <div
        class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}
        onClick={e =>
          (e.target as Element).getAttribute('data-type') !== 'confirm' && e.stopPropagation()}
      >
        {renderDom}
      </div>
    )
  }
}, {
  name: 'DropdownFooter',
  inheritAttrs: false,
})

export default DropdownFooter
