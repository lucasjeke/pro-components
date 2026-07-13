import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VNode } from 'vue'
import type { SubmitterProps } from '../../BaseForm/Submitter'
import type { CollapseRender } from '../../RenderTypings'
import { useIntl, useProConfig } from '@antdv-next1/pro-provider'
import { omitBoolean } from '@antdv-next1/pro-utils'
import { DownOutlined } from '@antdv-next/icons'
import { Space } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { defineComponent } from 'vue'

export interface ActionsProps {
  submitter: VNode<any, any, SubmitterProps<any>>
  /** 是否收起 */
  collapsed?: boolean
  /** 收起按钮的事件 */
  onCollapse?: (collapsed: boolean) => void

  setCollapsed: (collapse: boolean) => void
  isForm?: boolean
  // style?: CSSProperties
  /** 收起按钮的 render */
  collapseRender?: CollapseRender
  /** 隐藏个数 */
  hiddenNum?: false | number
}

const defaultCollapseRender: ActionsProps['collapseRender'] = (collapsed, _, intl, hiddenNum) => {
  if (collapsed) {
    return (
      <>
        {intl.getMessage({ id: 'tableForm.collapsed', defaultMessage: '展开' })}
        {hiddenNum && `(${hiddenNum})`}
        <DownOutlined
          style={{
            marginInlineStart: '0.5em',
            transition: '0.3s all',
            transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
          }}
        />
      </>
    )
  }
  return (
    <>
      {intl.getMessage({ id: 'tableForm.expand', defaultMessage: '收起' })}
      <DownOutlined
        style={{
          marginInlineStart: '0.5em',
          transition: '0.3s all',
          transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
        }}
      />
    </>
  )
}

const Actions = defineComponent<ActionsProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { attrs }) => {
  const config = useConfig()
  const intl = useIntl()
  const proProvide = useProConfig()
  return () => {
    const { setCollapsed, collapsed = false, submitter, hiddenNum } = props
    const collapseRender = omitBoolean(props.collapseRender) || defaultCollapseRender
    return (
      <Space style={attrs.style} size={16}>
        {submitter}
        {props.collapseRender !== false && (
          <a
            class={`${config.value.getPrefixCls('pro-query-filter-collapse-button')} ${proProvide.value.hashId}`.trim()}
            onClick={() => setCollapsed?.(!collapsed)}
          >
            {collapseRender?.(collapsed, props, intl.value, hiddenNum)}
          </a>
        )}
      </Space>
    )
  }
}, {
  name: 'Actions',
  inheritAttrs: false,
  props: ['collapseRender', 'collapsed', 'hiddenNum', 'isForm', 'onCollapse', 'setCollapsed', 'submitter'],
})
export default Actions
