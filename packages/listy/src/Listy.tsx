import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { App, ComponentOptionsMixin, CreateComponentPublicInstanceWithMixins, Plugin, SetupContext } from 'vue'
import type { ProListyInstance, ProListyProps } from './typing'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { transformBooleanProps } from '@antdv-next1/pro-utils'
import { defineComponent, shallowRef } from 'vue'
import InternalProListy from './InternalProListy'
import ProListyItem from './Item'
import { useProListyInstanceExpose } from './utils'

const _ProListy = defineComponent(
  <RecordType extends Record<string, any>, U extends Record<string, any> = Record<string, any>>(props: ProListyProps<RecordType, U>, {
    slots,
    attrs,
    expose,
  }: SetupContext<
    {},
    CustomSlotsType<{
      default?: () => VueNode
      itemRender?: ProListyProps<RecordType, U>['itemRender']
    }>
  >) => {
    const listyRef = shallowRef<ProListyInstance<RecordType> | null>(null)
    expose(useProListyInstanceExpose(listyRef))
    return () => {
      const booleanProps = transformBooleanProps([
        'manualRequest',
        'showSorterTooltip',
        'showHeader',
        'rowHoverable',
        'revalidateOnFocus',
        'loading',
        'virtual',
        'sticky',
        'tailor',
        'bordered',
        'cardBordered',
        'ghost',
      ], props)
      return (
        <ProConfigProvider needDeps>
          <InternalProListy ref={listyRef} {...attrs} {...props} {...booleanProps} v-slots={slots} />
        </ProConfigProvider>
      )
    }
  },
  {
    name: 'ProListy',
    inheritAttrs: false,
    props: [
      'grid',
      'itemLayout',
      'variant',
      'split',
      'beforeSearchSubmit',
      'bodyCell',
      'bordered',
      'caption',
      'cardBordered',
      'cardProps',
      'childrenColumnName',
      'classes',
      'columnEmptyText',
      'columns',
      'columnsState',
      'components',
      'dataSource',
      'dateFormatter',
      'debounceTime',
      'defaultData',
      'defaultExpandAllRows',
      'defaultExpandedRowKeys',
      'defaultSize',
      'direction',
      'dropdownPrefixCls',
      'editable',
      'errorBoundaryRender',
      'expandIcon',
      'expandIconColumnIndex',
      'expandRowByClick',
      'expandable',
      'expandedRowClassName',
      'expandedRowKeys',
      'expandedRowRender',
      'form',
      'getContainerWidth',
      'getPopupContainer',
      'ghost',
      'group',
      'headerCell',
      'headerTitle',
      'height',
      'id',
      'indentSize',
      'itemCardProps',
      'tooltip',
      'itemHeight',
      'itemRender',
      'loading',
      'locale',
      'manualRequest',
      'measureRowRender',
      'name',
      'onChange',
      'onDataSourceChange',
      'onExpand',
      'onExpandedRowsChange',
      'onHeaderRow',
      'onLoad',
      'onLoadingChange',
      'onRequestError',
      'onReset',
      'onRow',
      'onScroll',
      'onSizeChange',
      'onSubmit',
      'options',
      'optionsRender',
      'pagination',
      'params',
      'polling',
      'postData',
      'prefixCls',
      'request',
      'revalidateOnFocus',
      'rootClass',
      'rowClassName',
      'rowHoverable',
      'rowKey',
      'rowSelection',
      'scroll',
      'search',
      'searchFormRender',
      'showHeader',
      'showSorterTooltip',
      'sortDirections',
      'sticky',
      'styles',
      'summary',
      'tableAlertOptionRender',
      'tableAlertRender',
      'tableClass',
      'tableExtraRender',
      'tableLayout',
      'tableRender',
      'tableStyle',
      'tableViewRender',
      'tailor',
      'title',
      'toolBarRender',
      'toolbar',
      'type',
      'virtual',
      'onItem',
    ],
  },
) as new <RecordType extends Record<string, any>, U extends Record<string, any> = Record<string, any>>(
  props: ProListyProps<RecordType, U>,
) => CreateComponentPublicInstanceWithMixins<
  ProListyProps<RecordType, U>,
  {},
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  {},
  {},
  {},
  false,
  {},
  CustomSlotsType<{
    itemRender?: ProListyProps<RecordType, U>['itemRender']
    default?: () => VueNode
  }>
>
const ProListy = _ProListy as typeof _ProListy
  & Plugin & {
    Item: typeof ProListyItem
  }
ProListy.Item = ProListyItem

ProListy.install = (app: App) => {
  app.component(ProListy.name!, ProListy)
  app.component(ProListyItem.name!, ProListyItem)
}

export default ProListy
