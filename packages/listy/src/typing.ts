import type { ProCheckCardProps } from '@antdv-next1/pro-card'
import type { ProTableInstance, ProTableProps } from '@antdv-next1/pro-table'
import type { GetComponentProps } from '@v-c/table'
import type { VueNode } from '@v-c/util/dist/type'
import type { RowProps, TooltipProps } from 'antdv-next'
import type { ListyProps, ListyRef } from './components/Listy'

export type ColumnCount = number

export type ColumnType = 'gutter' | 'column' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface ProListyGridType {
  gutter?: RowProps['gutter']
  column?: ColumnCount
  xs?: ColumnCount
  sm?: ColumnCount
  md?: ColumnCount
  lg?: ColumnCount
  xl?: ColumnCount
  xxl?: ColumnCount
}
export type ListySize = 'small' | 'default' | 'large'

export type ListyItemLayout = 'horizontal' | 'vertical'

export type AntdListyProps<RecordType> = Omit<ListyProps<RecordType>, 'variant' | 'rowKey' | 'items' | 'itemRender'>

export type ProListyProps<RecordType = any, Params = Record<string, any>, ValueType = 'text'> = Omit<ProTableProps<RecordType, Params, ValueType>, 'size' | 'footer'> & AntdListyProps<RecordType> & {
  tooltip?: TooltipProps & {
    icon?: VueNode
  } | string
  variant?: 'outlined' | 'borderless' | 'filled'
  itemCardProps?: ProCheckCardProps
  rowClassName?: string | ((item: RecordType, index: number) => string)
  itemRender?: (item: RecordType, index: number, dom: VueNode) => VueNode
  onRow?: GetComponentProps<RecordType>
  onItem?: GetComponentProps<RecordType>
}

export type ProListyInstance<RecordType extends Record<string, any>> = ListyRef & ProTableInstance<RecordType>

export type { ListyRef }
