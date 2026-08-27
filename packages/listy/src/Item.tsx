import type { GetComponentProps } from '@v-c/table'
import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ExpandableConfig } from 'antdv-next/dist/table/interface'
import type { SetupContext } from 'vue'
// import { ProCheckCard } from '@antdv-next1/pro-card'
import { useProConfig } from '@antdv-next1/pro-provider'
import { transformVueNodeType, useMountMergeState } from '@antdv-next1/pro-utils'
import { RightOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Skeleton } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, h } from 'vue'
import { useProListyContextInject } from './context'
import ProListyItemMeta from './ItemMeta'

export interface RenderExpandIconProps<RecordType> {
  prefixCls: string
  expanded: boolean
  expandIcon: VueNode
    | ((props: {
      onExpand: (expanded: boolean) => void
      expanded: boolean
      record: RecordType
    }) => VueNode)
  onExpand: (expanded: boolean) => void
  record: RecordType
  hashId: string
}

export function renderExpandIcon<RecordType>({
  prefixCls,
  expandIcon = <RightOutlined />,
  onExpand,
  expanded,
  record,
}: RenderExpandIconProps<RecordType>) {
  let icon = expandIcon
  const expandClassName = `${prefixCls}-icon`

  const onClick = (event: MouseEvent) => {
    onExpand(!expanded)
    event.stopPropagation()
  }

  if (typeof expandIcon === 'function') {
    icon = h(expandIcon, {
      expanded,
      onExpand,
      record,
    })
  }

  return (
    <span
      class={classNames(expandClassName, {
        [`${prefixCls}-icon-expanded`]: expanded,
        [`${prefixCls}-icon-collapsed`]: !expanded,
      })}
      onClick={onClick}
    >
      {icon}
    </span>
  )
}

export interface ProListyItemProps<RecordType> {
  prefixCls?: string
  record?: RecordType
  index?: number
  checkbox?: VueNode
  actions?: VueNode
  rowHoverable?: boolean
  selected?: boolean
  rowSupportExpand?: boolean
  isEditable?: boolean
  cardActionProps?: 'actions' | 'extra'
  showActions?: 'hover' | 'always'
  showExtra?: 'hover' | 'always'
  expand?: boolean
  recordKey?: string | number | undefined
  onExpand?: (expand: boolean) => void
  onRow?: GetComponentProps<RecordType>
  onItem?: GetComponentProps<RecordType>
  expandable?: ExpandableConfig<RecordType>
  itemHeaderRender?:
    | ((
      item: RecordType,
      index: number,
      defaultDom: VueNode,
    ) => VueNode)
    | false
  itemTitleRender?:
    | ((
      item: RecordType,
      index: number,
      defaultDom: VueNode | null,
    ) => VueNode)
    | false
  title?: VueNode
  loading?: boolean
  subTitle?: VueNode
  type?: 'new' | 'top' | 'inline' | 'subheader'
  avatar?: VueNode
  content?: VueNode
  extra?: VueNode
  description?: VueNode
}

const ProListyItem = defineComponent(<RecordType = Record<string, any>>(props: ProListyItemProps<RecordType>, {
  slots,
  expose,
}: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode[]
}>>) => {
  const config = useConfig()
  const proConfig = useProConfig()
  // const hoverable = shallowRef(false)
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-listy-item`)

  const [expanded, setExpanded] = useMountMergeState(() => {
    return !!props.expand || props.expand
  }, {
    defaultValue: !!props.expand,
    value: computed(() => props.expand),
    onChange: value => props.onExpand?.(value!),
  })
  const { itemLayout } = useProListyContextInject()
  expose({})
  return () => {
    const { title, subTitle, description, actions, extra, loading = false, index, isEditable = false, avatar, content, record, rowSupportExpand, checkbox, expandable: expandableConfig, type, selected } = props
    const {
      expandedRowRender,
      expandIcon,
      indentSize = 8,
      expandedRowClassName,
    } = expandableConfig || {}
    const isVerticalWithExtra = itemLayout?.value === 'vertical' && extra != null

    const hasExpandBehavior
      = expandableConfig != null && Object.keys(expandableConfig).length > 0
    const needExpanded = expanded.value || !hasExpandBehavior
    const expandedRowDom
      = expandedRowRender && expandedRowRender(record!, index!, indentSize, expanded.value!)

    const hasExpandableConfig = hasExpandBehavior
    const actionsDom = transformVueNodeType(actions)
    const expandedRowClassStr
      = typeof expandedRowClassName === 'function'
        ? expandedRowClassName(record!, index!, indentSize)
        : expandedRowClassName

    const extraContent
      = extra != null ? (
        <div class={`${baseClassName.value}-extra`} key="extra">
          {extra}
        </div>
      ) : null
    return (
      <Skeleton avatar title={false} loading={loading} active>
        <div class={classNames(`${baseClassName.value}-main`, proConfig.value.hashId, {
          [`${baseClassName.value}-main-selected`]: selected,
          [`${baseClassName.value}-main-editable`]: isEditable,
          [`${baseClassName.value}-main-type-${type}`]: !!type,
        })}
        >
          {(title || subTitle || description || avatar) ? (
            <div class={`${baseClassName.value}-header`}>
              {!!checkbox && (
                <div class={`${baseClassName.value}-checkbox`.trim()}>
                  {checkbox}
                </div>
              )}
              {
                hasExpandableConfig
                && rowSupportExpand ? (
                      <div class={`${baseClassName.value}-header-options`}>
                        {renderExpandIcon({
                          prefixCls: baseClassName.value,
                          expandIcon,
                          onExpand: setExpanded,
                          expanded: expanded.value,
                          record,
                        } as RenderExpandIconProps<RecordType>)}
                      </div>
                    ) : null
              }
              <ProListyItemMeta
                title={title || subTitle ? (
                  <div class={`${baseClassName.value}-meta-title-header`}>
                    { title && <div class={`${baseClassName.value}-meta-title-header-title`}>{title}</div>}
                    {subTitle && <div class={`${baseClassName.value}-meta-title-header-subTitle`}>{subTitle}</div>}
                  </div>
                ) : null}
                description={description && needExpanded ? description : null}
                avatar={avatar}
              />
            </div>
          ) : null }
          {needExpanded && ((slots.default?.().length || content) || expandedRowDom) ? (
            <div class={`${baseClassName.value}-content`}>
              {slots.default?.() || content}
              {expandedRowRender && rowSupportExpand && (
                <div class={expandedRowClassStr}>{expandedRowDom}</div>
              )}
            </div>
          ) : null}
          {actionsDom ? (
            <div class={`${baseClassName.value}-actions`}>
              {actionsDom}
            </div>
          ) : null}
          {!isVerticalWithExtra && extraContent}
        </div>
        {isVerticalWithExtra && extraContent}
      </Skeleton>
    )
  }
}, {
  name: 'ProListyItem',
  inheritAttrs: false,
  props: ['actions', 'avatar', 'cardActionProps', 'checkbox', 'content', 'description', 'expand', 'expandable', 'extra', 'index', 'isEditable', 'itemHeaderRender', 'itemTitleRender', 'loading', 'onExpand', 'onItem', 'onRow', 'prefixCls', 'record', 'recordKey', 'rowHoverable', 'rowSupportExpand', 'selected', 'showActions', 'showExtra', 'subTitle', 'title', 'type'],
})

export default ProListyItem
