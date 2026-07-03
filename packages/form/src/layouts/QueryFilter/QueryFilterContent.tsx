import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ColProps, FormInstance, FormItemProps, FormProps, RowProps } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { SetupContext, VNode } from 'vue'
import type { SubmitterProps } from '../../BaseForm/Submitter'
import type { CollapseRender, OptionRender } from '../../RenderTypings'
import { useIntl, useProConfig } from '@antdv-next1/pro-provider'
import { FormItem, isSpecialNode } from '@antdv-next1/pro-utils'
import { classNames, useMergedState } from '@v-c/util'
import { Col, Row } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { cloneVNode, computed, defineComponent, isVNode } from 'vue'
import Actions from './Actions'

export interface ProQueryFilterContentProps<T extends Record<string, any>> {
  defaultCollapsed: boolean
  onCollapse?: (collapsed: boolean) => void
  collapsed?: boolean
  resetText?: string
  searchText?: string
  searchGutter?: RowProps['gutter']
  split?: boolean
  form?: FormInstance
  items?: VNode[]
  submitter?: VNode<any, any, SubmitterProps<T>> | null
  showLength?: number
  collapseRender?: CollapseRender
  spanSize?: {
    span?: number
    layout?: FormProps['layout']
  }
  // submitterColSpanProps 是一个可选属性，类型为一个对象。
  // 该对象使用 Omit 泛型去除了 ColProps 中的 'span' 属性，并新增了一个 'span' 属性，类型为 number 类型。
  // 也就是说，submitterColSpanProps 对象除了 'span' 属性外，还可以包含 ColProps 中的其他所有属性。
  submitterColSpanProps?: Omit<ColProps, 'span'> & {
    span?: number
    class?: string
  }
  baseClassName?: string
  optionRender?: OptionRender
  ignoreRules?: boolean
  preserve?: boolean
  showHiddenNum?: boolean
}

function flatMapItems(items: VNode<any, any, { title?: VueNode, colSize?: number, name?: NamePath<string | number | boolean>, hidden?: boolean, formItemProps?: FormItemProps }>[], ignoreRules?: boolean): VNode<any, any, { title?: VueNode, name?: NamePath<string | number | boolean>, colSize?: number, hidden?: boolean, formItemProps?: FormItemProps }>[] {
  return items?.flatMap((item) => {
    if ((item.type as { name: string })?.name === 'ProFormGroup') {
      return (item.children as { default: () => VNode[] })?.default?.()
    }
    if (ignoreRules && isVNode(item) && !isSpecialNode(item)) {
      return cloneVNode(item, {
        ...item.props,
        formItemProps: {
          ...item.props?.formItemProps,
          rules: [],
        },
      })
    }
    return item
  })
}

const ProQueryFilterContent = defineComponent(
  <T extends Record<string, any>>(props: ProQueryFilterContentProps<T>, { expose }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const config = useConfig()
    const intl = useIntl()
    const proProvide = useProConfig()
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-query-filter`)

    const [collapsed, setCollapsed] = useMergedState<boolean | undefined>(
      () => props.defaultCollapsed && !!props.submitter,
      {
        value: computed(() => props.collapsed),
        onChange: collapsed => props.onCollapse?.(collapsed!),
      },
    )
    expose({})
    return () => {
      const {
        collapseRender,
        items = [],
        ignoreRules,
        spanSize,
        submitterColSpanProps,
        showHiddenNum,
        submitter,
        split,
        showLength = 0,
        optionRender,
        resetText,
        searchText,
        searchGutter,
      } = props
      // 首个表单项是否占满第一行
      let firstRowFull = false
      // totalSpan 统计控件占的位置，计算 offset 保证查询按钮在最后一列
      let totalSpan = 0
      let itemLength = 0
      // totalSize 统计控件占的份数
      let totalSize = 0
      // for split compute
      let currentSpan = 0

      // 处理过，包含是否需要隐藏的 数组
      const processedList = flatMapItems(items, ignoreRules).map(
        (item, index): { itemDom: VNode<any, any, { title?: VueNode, colSize?: number, name?: NamePath<string | number | boolean>, hidden?: boolean, formItemProps?: FormItemProps }> | null, hidden: boolean, colSpan: number } => {
          // // 如果 formItem 自己配置了 hidden，默认使用它自己的
          const colSize
            = isVNode(item) && !isSpecialNode(item)
              ? (item?.props?.colSize ?? 1)
              : 1
          const colSpan = Math.min((props.spanSize?.span || 0) * (colSize || 1), 24)
          // 计算总的 totalSpan 长度
          totalSpan += colSpan
          // 计算总的 colSize 长度
          totalSize += colSize

          if (index === 0) {
            firstRowFull
              = colSpan === 24 && !item?.props?.hidden
          }
          const hidden
            = item?.props?.hidden
            // 如果收起了
              || (collapsed.value
                && (firstRowFull
                // 如果 超过显示长度 且 总长度超过了 24
                  || totalSize > showLength)
                && !!index)

          itemLength += 1
          const itemKey
            = (isVNode(item)
              && !isSpecialNode(item)
              && (item.props?.key || `${item.props?.name}`))
            || index
          if (isVNode(item) && !isSpecialNode(item) && hidden) {
            if (!props.preserve) {
              return {
                itemDom: null,
                colSpan: 0,
                hidden: true,
              }
            }
            return {
              itemDom: cloneVNode(item, {
                hidden: true,
                key: itemKey || index,
              }),
              hidden: true,
              colSpan,
            }
          }
          return {
            itemDom: item,
            colSpan,
            hidden: false,
          }
        },
      )

      const doms = processedList.map((itemProps, index: number) => {
        const { itemDom, colSpan } = itemProps
        const hidden = itemDom?.props?.hidden
        if (hidden)
          return itemDom
        // 每一列的key, 一般是存在的
        const itemKey
          = (isVNode(itemDom)
            && !isSpecialNode(itemDom)
            && (itemDom.props?.key || `${itemDom?.props?.name}`))
          || index
        if (24 - (currentSpan % 24) < colSpan) {
          // 如果当前行空余位置放不下，那么折行
          totalSpan += 24 - (currentSpan % 24)
          currentSpan += 24 - (currentSpan % 24)
        }
        currentSpan += colSpan
        if (split && currentSpan % 24 === 0 && index < itemLength - 1) {
          if (isVNode(itemDom) && !isSpecialNode(itemDom!)) {
            return (
              <Col
                key={itemKey}
                span={colSpan}
                class={`${props.baseClassName}-row-split-line ${props.baseClassName}-row-split ${proProvide.value.hashId}`.trim()}
              >
                {itemDom}
              </Col>
            )
          }
          return itemDom
        }
        if (isVNode(itemDom) && !isSpecialNode(itemDom!)) {
          return (
            <Col
              key={itemKey}
              class={`${props.baseClassName}-row-split ${proProvide.value.hashId}`.trim()}
              span={colSpan}
            >
              {itemDom}
            </Col>
          )
        }
        return itemDom
      })
      const offsetSpan
        = (currentSpan % 24) + ((submitterColSpanProps?.span ?? spanSize?.span) || 0)
      const offset = offsetSpan > 24 ? 24 - ((submitterColSpanProps?.span ?? spanSize?.span) || 0) : 24 - offsetSpan

      const hiddenNum = showHiddenNum && processedList.filter(item => item.hidden).length
      /** 是否需要展示 collapseRender */
      const needCollapseRender = !(totalSpan < 24 || totalSize <= showLength)

      const submitterDom
        = !submitter || optionRender === false
          ? null
          : cloneVNode(submitter, {
              searchConfig: {
                resetText:
                  resetText
                  || intl.value.getMessage({ id: 'tableForm.reset', defaultMessage: '重置' }),
                submitText:
                  searchText
                  || intl.value.getMessage({ id: 'tableForm.search', defaultMessage: '搜索' }),
              },
              render: optionRender
                ? (_: any, dom: VueNode[]) =>
                    typeof optionRender === 'function'
                    && optionRender(
                      {
                        ...props,
                        resetText:
                          resetText
                          || intl.value.getMessage({ id: 'tableForm.reset', defaultMessage: '重置' }),
                        searchText:
                          searchText
                          || intl.value.getMessage({ id: 'tableForm.search', defaultMessage: '搜索' }),
                      },
                      props,
                      dom,
                    )
                : optionRender,
              ...submitter.props,
            })
      return (
        <Row
          gutter={searchGutter}
          justify="start"
          class={classNames(`${baseClassName.value}-row`, proProvide.value.hashId)}
          key="resize-observer-row"
        >
          {doms}
          {submitterDom && (
            <Col
              key="submitter"
              span={spanSize?.span}
              offset={offset}
              class={classNames(submitterColSpanProps?.class)}
              {...props.submitterColSpanProps}
              style={{
                textAlign: 'end',
              }}
            >
              <FormItem
                label="&#x200B;"
                colon={false}
                class={`${baseClassName.value}-actions ${proProvide.value.hashId}`.trim()}
              >
                <Actions
                  hiddenNum={hiddenNum}
                  key="pro-form-query-filter-actions"
                  collapsed={collapsed.value}
                  collapseRender={needCollapseRender ? collapseRender : false}
                  submitter={submitterDom}
                  setCollapsed={setCollapsed}
                />
              </FormItem>
            </Col>
          )}
        </Row>
      )
    }
  },
  {
    name: 'ProQueryFilterContent',
    inheritAttrs: false,
    props: ['baseClassName', 'collapseRender', 'collapsed', 'defaultCollapsed', 'form', 'ignoreRules', 'items', 'onCollapse', 'optionRender', 'preserve', 'resetText', 'searchGutter', 'searchText', 'showHiddenNum', 'showLength', 'spanSize', 'split', 'submitter', 'submitterColSpanProps'],
  },
)

export default ProQueryFilterContent
