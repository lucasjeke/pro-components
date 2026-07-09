import type { FunctionalComponent, VNode } from 'vue'
import { CheckOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Tooltip } from 'antdv-next'

const BlockCheckbox: FunctionalComponent<{
  list?: {
    title: string
    key: string
    icon?: VNode
  }[]
  prefixCls?: string
  value?: string
  hashId?: string
  cssVarCls?: string
  configType?: string
  onChange?: (value: string) => void
}> = (props) => {
  const baseClassName = `${props.prefixCls}-block-checkbox`
  return (
    <div class={classNames(baseClassName, props.hashId, props.cssVarCls)}>
      {(props.list || []).map(item => (
        <Tooltip title={item.title} key={item.key}>
          <div
            class={classNames(
              props.hashId,
              props.cssVarCls,
              `${baseClassName}-item`,
              `${baseClassName}-item-${item.key}`,
              `${baseClassName}-${props.configType}-item`,
            )}
            onClick={() => props.onChange?.(item.key)}
          >
            {item.key === 'left' && (
              <div class={classNames(`${baseClassName}-item-left-inner`, props.hashId, props.cssVarCls)} />
            )}
            <CheckOutlined
              class={classNames(`${baseClassName}-selectIcon`, props.hashId, props.cssVarCls)}
              style={{
                display: props.value === item.key ? 'block' : 'none',
              }}
            />
            {item?.icon
              ? (
                  <div class={classNames(`${baseClassName}-icon`, props.hashId, props.cssVarCls)}>{item.icon}</div>
                )
              : null}
          </div>
        </Tooltip>
      ))}
    </div>
  )
}
BlockCheckbox.inheritAttrs = false
export default BlockCheckbox
