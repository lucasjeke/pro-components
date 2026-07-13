import type { ProCheckCardProps } from '@antdv-next1/pro-card'
import type { GetComponentProps } from '@v-c/table'
import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { ExpandableConfig } from 'antdv-next/dist/table/interface'
import type { SetupContext } from 'vue'
import type { ListyItemProps } from './components/Listy'
// import { useProConfig } from '@antdv-next1/pro-provider'

import { ProCheckCard } from '@antdv-next1/pro-card'
// import { ProCheckCard } from '@antdv-next1/pro-card'
import { transformVueNodeType, useMountMergeState } from '@antdv-next1/pro-utils'
import { RightOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Skeleton, Space } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, h, shallowRef } from 'vue'
import { ListyItem, ListyItemMeta } from './components/Listy'

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

export type ProListyItemProps<RecordType> = Omit<ListyItemProps, 'actions'> & {
  cardProps?: ProCheckCardProps
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
  const hoverable = shallowRef(false)
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-listy-item`)

  const [expanded, setExpanded] = useMountMergeState(() => {
    return !!props.expand || props.expand
  }, {
    defaultValue: !!props.expand,
    value: computed(() => props.expand),
    onChange: value => props.onExpand?.(value!),
  })
  expose({})
  return () => {
    const { title, subTitle, description, actions, loading = false, onItem, rowHoverable = true, index, avatar, content, record, type, cardProps, rowSupportExpand, checkbox, expandable: expandableConfig, onMouseenter, onMouseleave, ...rest } = props
    const {
      expandIcon,
    } = expandableConfig || {}
    const hasExpandBehavior
      = expandableConfig != null && Object.keys(expandableConfig).length > 0
    const needExpanded = expanded.value || !hasExpandBehavior
    const itemProps = onItem?.(record!, index)

    const hasExpandableConfig = hasExpandBehavior
    const actionsDom = transformVueNodeType(actions)
    const contentDom = transformVueNodeType(content)
    const cardTitleDom = avatar || title ? (
      <Space>
        {avatar}
        <span class={classNames(`${prefixCls.value}-item-meta-title`)}>
          {title}
        </span>
        {subTitle}
      </Space>
    ) : null
    // 卡片模式渲染
    // if (cardProps) {
    //   const cardTitleDom = avatar || title ? (
    //     <Space>
    //       {avatar}
    //       <span class={classNames(`${prefixCls.value}-item-meta-title`, proConfig.value.hashId)}>
    //         {title}
    //       </span>
    //       {subTitle}
    //     </Space>
    //   ) : null
    //   //         = console.log(cardProps, 'cardProps')
    //   // cardProps ? (
    //   //             <ProCheckCard
    //   //               {...cardProps}
    //   //               title={}
    // extra={actionsDom as AntVueNode}
    // description={contentDom as AntVueNode}
    //   //             />
    //   //           )
    //   //             :
    //   return (
    //     <ListyItem
    //       {...rest}
    //       key={index}
    //       class={classNames(baseClassName.value, {
    //         [`${baseClassName.value}-hover`]: !cardProps && rowHoverable && hoverable.value,
    //       })}
    //       onMouseenter={() => {
    //         hoverable.value = true
    //       }}
    //       onMouseleave={() => {
    //         hoverable.value = false
    //       }}
    //     >
    //       <ProCheckCard
    //         {...cardProps}
    //         title={cardTitleDom}
    //         // extra={actionsDom as AntVueNode}
    //         // description={contentDom as AntVueNode}
    //       />
    //     </ListyItem>
    //   )
    // }
    return (
      <ListyItem
        {...rest}
        actions={cardProps ? [] : Array.isArray(actions) ? actions : [actions]}
        key={index}
        class={classNames(baseClassName.value, {
          [`${baseClassName.value}-hover`]: !cardProps && rowHoverable && hoverable.value,
        })}
        onMouseenter={() => {
          hoverable.value = true
        }}
        onMouseleave={() => {
          hoverable.value = false
        }}

      >
        {cardProps ? (
          <ProCheckCard
            {...cardProps}
            style={{
              width: '100%',
            }}
            title={cardTitleDom}
            extra={actionsDom as AntVueNode}
            onClick={(e) => {
              cardProps?.onClick?.(e)
              itemProps?.onClick?.(e as PointerEvent)
            }}
          >
            {contentDom}
          </ProCheckCard>
        ) : (
          <Skeleton avatar title={false} loading={loading} active>
            <>
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
                  <ListyItemMeta
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
              {slots.default?.().length || content ? (<div class={`${baseClassName.value}-content`}>{slots.default?.() || content}</div>) : null}
            </>
          </Skeleton>
        )}
      </ListyItem>
    )
  }
}, {
  name: 'ProListyItem',
  inheritAttrs: false,
  props: ['actions', 'avatar', 'rowHoverable', 'loading', 'content', 'description', 'extra', 'record', 'subTitle', 'title', 'type', 'cardProps', 'checkbox', 'expand', 'isEditable', 'onExpand', 'onMouseenter', 'onMouseleave', 'rowSupportExpand', 'recordKey', 'expandable', 'classes', 'colStyle', 'index', 'prefixCls', 'selected', 'record', 'styles', 'onRow', 'onItem'],
})

export default ProListyItem
