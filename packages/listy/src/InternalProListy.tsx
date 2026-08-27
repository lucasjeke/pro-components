import type { ProColumns, ProColumnType, ProTableInstance } from '@antdv-next1/pro-table'
import type { ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { PaginationProps } from 'antdv-next'
import type { SetupContext } from 'vue'
import type { ProListyProps } from './typing'
import { ProTable, useProTableInstanceExpose } from '@antdv-next1/pro-table'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import ListView from './ListView'
import useStyle from './style'

/** 根据 listSlot 推导默认的 valueType */
const DEFAULT_VALUE_TYPE_MAP: Record<string, ProFieldValueType> = {
  avatar: 'avatar',
  actions: 'option',
  description: 'textarea',
}

/**
 * 为带有 listSlot 的 columns 填充默认 valueType
 */
function enrichColumnsWithDefaults<RecordType>(
  columns: ProColumns<RecordType>[],
): ProColumnType<RecordType>[] {
  return columns.map((col) => {
    const { listSlot } = col
    if (!listSlot)
      return col
    const valueType = col.valueType || DEFAULT_VALUE_TYPE_MAP[listSlot]
    return valueType ? { ...col, valueType } : col
  })
}

const InternalProListy = defineComponent(
  <RecordType extends Record<string, any>, U extends Record<string, any> = Record<string, any>>(props: ProListyProps<RecordType, U>, {
    slots,
    attrs,
    expose,
  }: SetupContext<
    {},
    CustomSlotsType<{
      itemRender?: ProListyProps<RecordType, U>['itemRender']
      default?: () => VueNode
    }>
  >) => {
    const config = useConfig()
    const tableRef = shallowRef<ProTableInstance<RecordType> | null>(null)
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-listy`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    /**
     * - 如果传入了 columns（且含有 listSlot），直接使用 columns
     */
    const proTableColumns = computed(() => {
      if (props.columns && props.columns.length > 0) {
        return enrichColumnsWithDefaults<RecordType>(props.columns)
      }
      return []
    })
    expose(useProTableInstanceExpose(tableRef))
    return () => {
      const {
        columns: propsColumns,
        split,
        variant,
        rowKey,
        tooltip,
        grid,
        itemLayout,
        options = false,
        search = false,
        expandable,
        rowSelection: propRowSelection = false,
        pagination: propsPagination = false,
        itemRender,
        itemCardProps,
        onRow,
        rowClassName,
        locale,
        group,
        height,
        virtual,
        onScroll,
        onChange,
        classes,
        styles,
        sticky,
        onItem,
        size: propsSize,
        loadMore,
        ...rest
      } = props
      return (
        <ProTable
          ref={tableRef}
          {...rest}
          tooltip={tooltip}
          pagination={propsPagination}
          type="listy"
          size={propsSize === 'default' ? 'medium' : propsSize}
          rowSelection={propRowSelection}
          search={search}
          options={options}
          class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value, {
            [`${baseClassName.value}-no-split`]: !split,
            [`${baseClassName.value}-${variant}`]: variant,
          })}
          columns={proTableColumns.value}
          rowKey={rowKey}
          tableViewRender={({ columns, size, pagination, rowSelection, dataSource, loading }) => (
            <ListView
              columns={columns}
              size={size === 'medium' || size === 'middle' ? 'default' : size}
              grid={grid}
              itemRender={itemRender!}
              prefixCls={baseClassName.value}
              class={classNames(`${baseClassName.value}-container`, hashId.value, cssVarCls.value)}
              itemLayout={itemLayout}
              sticky={sticky}
              ghost={rest.ghost}
              action={{
                isEditable: (row: RecordType & {
                  index: number
                }) => tableRef.value?.isEditable?.(row),
              }}
              virtual={virtual}
              height={height}
              onScroll={onScroll}
              group={group}
              expandable={expandable}
              loadMore={loadMore}
              rowHoverable={rest.rowHoverable}
              pagination={pagination! as PaginationProps}
              rowSelection={propRowSelection === false ? undefined : rowSelection}
              dataSource={(dataSource || []) as RecordType[]}
              split={split}
              locale={locale}
              variant={variant}
              onRow={onRow}
              itemCardProps={itemCardProps}
              rowClassName={rowClassName}
              rowKey={rowKey}
              onItem={onItem}
              loading={loading}
              hashId={hashId.value}
              cssVarCls={cssVarCls.value}
            />
          )}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'InternalProListy',
    inheritAttrs: false,
    props: [
      'grid',
      'itemLayout',
      'onItem',
      'onRow',
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
      'tooltip',
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
      'size',
      'classes',
      'styles',
      'loadMore',
    ],
  },
)

export default InternalProListy
