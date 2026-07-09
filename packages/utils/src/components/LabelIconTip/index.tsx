import type { VueNode } from '@v-c/util'
import type { FormItemTooltipType, FormTooltipProps } from 'antdv-next/dist/form/FormItemLabel'
import { InfoCircleOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Tooltip } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, isVNode } from 'vue'
import useStyle from './style'

export interface LabelIconTipProps {
  label?: VueNode
  subTitle?: VueNode
  tooltip?: FormItemTooltipType
  ellipsis?: boolean | { showTitle?: boolean }
}
const LabelIconTip = defineComponent<LabelIconTipProps>(
  (props) => {
    const config = useConfig()
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-core-label-tip`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    return () => {
      const { tooltip, subTitle, label, ellipsis } = props
      if (!tooltip && !subTitle) {
        return <>{label}</>
      }
      const tooltipProps
        = typeof tooltip === 'string' || isVNode(tooltip)
          ? { title: tooltip }
          : (tooltip as FormTooltipProps)

      const icon = tooltipProps?.icon || <InfoCircleOutlined />

      return (
        <div
          class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}
          onMousedown={e => e.stopPropagation()}
          onMouseleave={e => e.stopPropagation()}
          onMousemove={e => e.stopPropagation()}
        >
          <div
            class={classNames(`${baseClassName.value}-title`, hashId.value, cssVarCls.value, {
              [`${baseClassName.value}-title-ellipsis`]: ellipsis,
            })}
          >
            {label}
          </div>
          {subTitle && (
            <div class={classNames(`${baseClassName.value}-subtitle`, hashId.value, cssVarCls.value)}>
              {subTitle}
            </div>
          )}
          {tooltip && (
            <Tooltip {...tooltipProps}>
              <span class={classNames(`${baseClassName.value}-icon`, hashId.value, cssVarCls.value)}>{icon}</span>
            </Tooltip>
          )}
        </div>
      )
    }
  },
  {
    name: 'LabelIconTip',
    inheritAttrs: false,
  },
)
export default LabelIconTip
