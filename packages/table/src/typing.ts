import type { ProCardProps } from '@antdv-next1/pro-card'
import type { ProFieldEmptyText } from '@antdv-next1/pro-field'
import type { LightWrapperProps, ProFormInstance, ProFormProps, ProQueryFilterProps } from '@antdv-next1/pro-form'
import type {
  Key,
  PageInfo,
  ProCoreActionType,
  ProSchema,
  ProSchemaComponentTypes,
  ProTableEditableFnType,
  RowEditableConfig,
  SearchTransformKeyFn,
  VueNode,
  WithFalse,
} from '@antdv-next1/pro-utils'
import type { InputProps, SpinProps, TableProps } from 'antdv-next'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { ColumnType, SorterResult, SortOrder, TablePaginationConfig } from 'antdv-next/dist/table/index'
import type { ColumnFilterItem, CompareFn, TableCurrentDataSource } from 'antdv-next/dist/table/interface'
import type { Dayjs } from 'dayjs'
import type { ComputedRef, CSSProperties, Ref, ShallowRef, UnwrapRef, VNode } from 'vue'
import type { SearchConfig } from './components/Form/FormRender'
import type { BaseToolbarProps, OptionConfig, ToolBarProps } from './components/ToolBar'
import type { DensitySize } from './components/ToolBar/DensityIcon'
import type { ErrorBoundaryRender, TableAlertRender } from './RenderTypings'
import type { ColumnsState } from './Store/Provide'

/**
 * Request filter 參數
 * @description 与 antd 不同，Pro 有自己定义的 request FilterValue 类型，主要做了值内容的转换
 */
export type FilterValue = (string | number)[] | null

export type SearchProps = InputProps & {
  inputPrefixCls?: string
  enterButton?: AntVueNode
}

export type ProSorter<T>
  = | string // 支持变更请求时字段名称
    | boolean
    | CompareFn<T>
    | {
      compare?: CompareFn<T>
      /** Config multiple sorter order priority */
      multiple?: number
    }

export type ProSorterResult<T> = Omit<SorterResult<T>, 'column'> & {
  column?: ColumnType<T> & {
    sorter?: ProSorter<T>
  }
}

export type RequestData<T> = {
  data: T[] | undefined
  success?: boolean
  total?: number
} & Record<string, any>

export interface UseFetchDataAction<T = any> {
  dataSource: Ref<T[] | undefined>
  setDataSource: (dataSource: T[] | undefined) => void
  loading: Ref<boolean | SpinProps | undefined>
  pageInfo: Ref<PageInfo>
  reload: () => Promise<void>
  fullScreen?: () => void
  reset: () => Promise<void>
  pollingLoading: Ref<boolean>
  setPageInfo: (pageInfo: Partial<PageInfo>) => Promise<void>
}
export type FixedType = 'start' | 'end'

export type ExtraProColumnType<T> = Omit<
  ColumnType<T>,
  'render' | 'children' | 'title' | 'filters' | 'onFilter' | 'sorter' | 'fixed'
> & {
  sorter?: ProSorter<T>
}

export type ProColumnType<T = unknown, ValueType = 'text'> = ProSchema<
  T,
  ExtraProColumnType<T> & {
    children?: ProColumns<T>[]

    index?: number

    /**
     * 每个表单占据的格子大小
     *
     * @param 总宽度 = span* colSize
     * @param 默认为 1
     */
    colSize?: number

    /** 搜索表单的默认值 */
    initialValue?: any

    /** @name ellipsis 是否缩略 */
    ellipsis?: ColumnType<T>['ellipsis']

    /** @name copyable 是否拷贝 */
    copyable?: boolean
    /**
     * @name resizable 列宽调整
     */
    resizable?: boolean

    /** 在查询表单中隐藏 */
    search?: WithFalse<{
      /**
       * Transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
       *
       * @name transform  转化值的key, 一般用于事件区间的转化
       */
      transform: SearchTransformKeyFn
    }>

    /** @name hideInTable 在 table 中隐藏 */
    hideInTable?: boolean

    /** @name hideInForm 在新建表单中删除 */
    hideInForm?: boolean

    /** @name hideInSetting 不在配置工具中显示 */
    hideInSetting?: boolean

    /** @name filters 表头的筛选菜单项 */
    filters?: boolean | Partial<ColumnFilterItem>[]

    /** @name onFilter 筛选的函数，设置为 false 会关闭自带的本地筛选 */
    onFilter?: boolean | Partial<ColumnType<T>['onFilter']>

    /** @name Form 的排序 */
    order?: number
    fixed?: boolean | FixedType

    /** @name editable 可编辑表格是否可编辑 */
    editable?: boolean | ProTableEditableFnType<T>

    /**
     * 用于 ProListy，指定该列映射到列表项的哪个插槽位置
     *
     * @name 列表项插槽
     * @example listSlot: 'title'
     * @example listSlot: 'avatar'
     */
    listSlot?:
      | 'title'
      | 'subTitle'
      | 'avatar'
      | 'description'
      | 'content'
      | 'actions'
      | 'aside'
      | 'type'
      | (string & {})

    /** @name readonly 只读 */
    readonly?: boolean

    /** @name disable 列设置的 disabled */
    disable?:
      | boolean
      | {
        checkbox: boolean
      }
  },
  ProSchemaComponentTypes,
  ValueType,
  {
    lightProps?: LightWrapperProps
  }
>

export type ProColumns<T = any, ValueType = 'text'> = ProColumnType<T, ValueType>

export type BorderedType = 'search' | 'table'

export type Bordered
  = | boolean
    | {
      search?: boolean
      table?: boolean
    }

export interface ColumnStateType {
  /**
   * 持久化的类型，支持 localStorage 和 sessionStorage
   *
   * @param localStorage 设置在关闭浏览器后也是存在的
   * @param sessionStorage 关闭浏览器后会丢失
   */
  persistenceType?: 'localStorage' | 'sessionStorage'
  /** 持久化的key，用于存储到 storage 中 */
  persistenceKey?: string
  /** ColumnsState 的值 */
  defaultValue?: Record<string, ColumnsState>
  /** ColumnsState 的值 */
  value?: Record<string, ColumnsState>
  onChange?: (map: Record<string, ColumnsState>) => void
}

/** ProTable 的类型定义 继承自 antd 的 Table */
export type ProTableProps<DataSource, U, ValueType = 'text'> = {
  dataSource?: DataSource[]
  size?: DensitySize
  /**
   * @name columns 列配置能力，支持一个数组
   */
  columns?: ProColumns<DataSource, ValueType>[]
  /**
   * @name toolbar ToolBar 的属性
   */
  toolbar?: BaseToolbarProps
  /**
   * @name ghost 幽灵模式，即是否取消卡片内容区域的 padding 和 卡片的背景颜色。
   */
  ghost?: boolean

  /**
   * request 的参数，修改之后会触发更新
   *
   * @example pathname 修改重新触发 request
   * params={{ pathName }}
   */
  params?: U

  /** @name columnsState 列状态的配置，可以用来操作列功能 */
  columnsState?: ColumnStateType

  onSizeChange?: (size: DensitySize) => void

  /**
   * @name cardProps table 外面卡片的设置
   */
  cardProps?: ProCardProps | false

  /**
   * @name tableRender 渲染 table
   */
  tableRender?: (
    props: ProTableProps<DataSource, U, ValueType>,
    defaultDom: VueNode,
    /** 各个区域的 dom */
    domList: {
      toolbar: VueNode
      alert: VueNode
      table: VueNode
    },
  ) => VueNode

  /**
   * @name tableViewRender 渲染 table 视图，用于定制 ProList，不推荐直接使用
   */
  tableViewRender?: (
    props: TableProps<DataSource> & {
      class?: string
      style?: CSSProperties
      onChange?: (changePagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<DataSource> | SorterResult<DataSource>[], extra: TableCurrentDataSource<DataSource>) => void
    },
    defaultDom: VueNode,
  ) => VueNode

  /**
   * @name tableExtraRender table 和搜索表单之间的 dom 渲染
   *
   * @example 在table 上方增加一个统计表单
   *
   * tableExtraRender={()=> <Statistic title="统计" value={10} />}
   */
  tableExtraRender?: (
    props: ProTableProps<DataSource, U, ValueType>,
    dataSource: DataSource[],
  ) => VueNode
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataSource> | SorterResult<DataSource>[],
    extra: TableCurrentDataSource<DataSource>,
  ) => void
  /**
   * @name searchFormRender 渲染搜索表单
   */
  searchFormRender?: (
    props: ProTableProps<DataSource, U, ValueType>,
    defaultDom: VueNode,
  ) => VNode | VNode[]

  /** @name request 一个获得 dataSource 的方法 */
  request?: (
    params: U & {
      pageSize?: number
      current?: number
      keyword?: string
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, FilterValue>,
  ) => Promise<Partial<RequestData<DataSource>>>

  /** @name postData 对数据进行一些处理 */
  postData?: (dataSource: DataSource[]) => DataSource[]
  /** @name defaultData 默认的数据 */
  defaultData?: DataSource[]

  /**
   * @name actionRef 初始化的参数，可以操作 table
   *
   * @example 重新刷新表格
   * actionRef.current?.reload();
   *
   * @example 重置表格
   * actionRef.current?.reset();
   */
  // actionRef?: React.Ref<ActionType | undefined>

  /**
   * @name formRef 操作自带的 form
   */
  // formRef?: TableFormItem<DataSource>['formRef']
  /**
   * @name toolBarRender 渲染操作栏
   */
  toolBarRender?: WithFalse<ToolBarProps<DataSource, ValueType>['toolBarRender']>

  optionsRender?: ToolBarProps<DataSource, ValueType>['optionsRender']

  /**
   * @name onLoad 数据加载完成后触发
   */
  onLoad?: (dataSource: DataSource[]) => void

  /**
   * @name onLoadingChange loading 被修改时触发，一般是网络请求导致的
   */
  onLoadingChange?: (loading: boolean | SpinProps | undefined) => void

  /**
   * @name onRequestError 数据加载失败时触发
   */
  onRequestError?: (e: Error) => void

  /**
   * 是否轮询 ProTable 它不会自动提交表单，如果你想自动提交表单的功能，需要在 onValueChange 中调用 formRef.current?.submit()
   * @property {number} polling 表示轮询的时间间隔，0 表示关闭轮询，大于 0 表示开启轮询，最小的轮询时间为 2000ms
   * @param dataSource 返回当前的表单数据，你可以用它判断要不要打开轮询
   */
  polling?: number | ((dataSource: DataSource[]) => number)

  /** @name tableClass 给封装的 table 的 className */
  tableClass?: string

  /** @name tableStyle 给封装的 table 的 style */
  tableStyle?: CSSProperties

  /** @name headerTitle 左上角的 title */
  headerTitle?: VueNode

  /** @name tooltip 标题旁边的 tooltip */
  tooltip?: string | FormItemTooltipType

  /** @name options 操作栏配置 */
  options?: WithFalse<OptionConfig<DataSource, ValueType>>

  /**
   * @type SearchConfig
   * @name search 是否显示搜索表单
   */
  search?: WithFalse<SearchConfig>

  /**
   * 基本配置与 antd Form 相同, 但是劫持了 form onFinish 的配置
   *
   * @name form type="form" 和 搜索表单 的 Form 配置
   */
  form?: Omit<ProFormProps<DataSource, U> & ProQueryFilterProps<DataSource, U>, 'form'>
  /**
   * 暂时只支持 dayjs - string 会格式化为 YYYY-DD-MM - number 代表时间戳
   *
   * @name dateFormatter 如何格式化日期
   */
  dateFormatter?:
    | (string & {})
    | 'string'
    | 'number'
    | ((value: Dayjs, valueType: string) => string | number)
    | false
  /** @name beforeSearchSubmit 格式化搜索表单提交数据 */
  beforeSearchSubmit?: (params: Partial<U>) => any
  /**
   * 设置或者返回false 即可关闭
   *
   * @name tableAlertRender 自定义 table 的 alert
   */
  tableAlertRender?: TableAlertRender<DataSource>
  /**
   * 设置或者返回false 即可关闭
   *
   * @name tableAlertOptionRender 自定义 table 的 alert 的操作
   */
  tableAlertOptionRender?: TableAlertRender<DataSource>

  /** @name rowSelection 选择项配置 */
  rowSelection?:
    | (TableProps<DataSource>['rowSelection'] & {
      alwaysShowAlert?: boolean
    })
    | false

  /** 支持 ProTable 的类型 */
  type?: ProSchemaComponentTypes

  /** @name onSubmit 提交表单时触发 */
  onSubmit?: (params?: U) => void

  /** @name onReset 重置表单时触发 */
  onReset?: (params?: U) => void

  /** @name columnEmptyText 空值时显示 */
  columnEmptyText?: ProFieldEmptyText

  /** @name manualRequest 是否手动触发请求 */
  manualRequest?: boolean
  /**
   * @name editable 编辑行相关的配置
   *
   * @example 支持多行编辑
   * editable={{type:"multiple"}}
   *
   * @example 保存的时候请求后端
   * editable={{ onSave:async (rows)=>{ await save(rows) } }}
   */
  editable?: RowEditableConfig<DataSource>

  /**
   * @name onDataSourceChange 可编辑表格修改数据的改变
   */
  onDataSourceChange?: (dataSource: DataSource[]) => void
  /** @name cardBordered 查询表单和 Table 的卡片 border 配置 */
  cardBordered?: Bordered
  /** @name debounceTime 去抖时间 */
  debounceTime?: number
  /**
   * 只在request 存在的时候生效，可编辑表格也不会生效
   *
   * @default false
   * @name revalidateOnFocus 窗口聚焦时自动重新请求
   */
  revalidateOnFocus?: boolean
  /** 默认的表格大小 */
  defaultSize?: DensitySize
  /**
   * @name name 可编辑表格的name,通过这个name 可以直接与 form通信，无需嵌套
   */
  name?: NamePath<string | number | boolean>
  /**
   * 错误边界自定义
   */
  errorBoundaryRender?: ErrorBoundaryRender
} & Omit<TableProps<DataSource>, 'columns' | 'rowSelection' | 'size' | 'dataSource'>

export type ActionType<T extends Record<string, any>, U> = ProCoreActionType<T, U> & {
  /** 原生 DOM 元素引用 */
  nativeElement?: ComputedRef<HTMLDivElement | null | undefined>
  /** 聚焦方法 */
  focus?: () => void
  fullScreen: () => Promise<void>
  setPageInfo: (page: Partial<PageInfo>) => Promise<void>
  /**
   * 对齐 antd Table ScrollConfig
   * - number: 作为 top 处理
   * - { index?, key?, top? }
   */
  scrollTo?: (
    arg:
      | number
      | {
        index?: number
        key?: Key
        top?: number
      },
  ) => void
}
export type ProTableInstance<T extends Record<string, any>> = {
  formRef: ShallowRef<ProFormInstance<T>> | ComputedRef<ProFormInstance<T>>
} & ActionType<Record<string, any>, T>

/**
 * 用于定义 useFetch 的参数类型
 * @typedef {object} UseFetchProps
 * @property {any} [dataSource] - 数据源，可选参数
 * @property {UseFetchDataAction['loading']} loading - 数据加载状态，必须参数
 * @property {(loading: UseFetchDataAction['loading']) => void} [onLoadingChange] - 加载状态改变时的回调函数，可选参数
 * @property {(dataSource: any[], extra: any) => void} [onLoad] - 数据加载完成时的回调函数，可选参数
 * @property {(dataSource?: any) => void} [onDataSourceChange] - 数据源改变时的回调函数，可选参数
 * @property {any} postData - 发送到后端的数据，必须参数
 * @property {{current?: number; pageSize?: number; defaultCurrent?: number; defaultPageSize?: number;} | false} pageInfo - 分页信息，可选参数，false 表示不启用分页
 * @property {(pageInfo: PageInfo) => void} [onPageInfoChange] - 分页信息改变时的回调函数，可选参数
 * @property {any[]} [effects] - 依赖的其它 Hook 或其它变量，可选参数
 * @property {(e: Error) => void} [onRequestError] - 请求出错时的回调函数，可选参数
 * @property {boolean} manual - 是否手动触发请求，必须参数
 * @property {number} [debounceTime] - 延迟时间，可选参数，单位为毫秒
 * @property {number | ((dataSource: any[]) => number)} [polling] - 轮询时间，可选参数，单位为毫秒或一个返回时间的函数
 * @property {boolean} [revalidateOnFocus] - 是否在焦点回到页面时重新验证数据，可选参数
 */
export interface UseFetchProps<T = any> {
  /**
   * 数据源
   */
  dataSource?: UseFetchDataAction<T>['dataSource']
  /**
   * 是否处于加载状态
   */
  loading: UseFetchDataAction<T>['loading']
  /**
   * 加载状态改变时的回调函数
   */
  onLoadingChange?: (loading: UnwrapRef<UseFetchDataAction['loading']>) => void
  /**
   * 数据加载完成后的回调函数
   */
  onLoad?: (dataSource: any[], extra: any) => void
  /**
   * 数据源变化时的回调函数
   */
  onDataSourceChange?: (dataSource?: any) => void
  /**
   * 请求时附带的数据
   */
  postData?: (dataSource: any[]) => any[]
  /**
   * 分页信息
   */
  pageInfo: ComputedRef<
    WithFalse<{
      current?: number
      pageSize?: number
      defaultPageSize?: number
    }>
  >
  /**
   * 分页信息变化时的回调函数
   */
  onPageInfoChange?: (pageInfo: PageInfo) => void
  /**
   * 请求相关的副作用
   */
  effects?: any[]
  /**
   * 请求出错时的回调函数
   */
  onRequestError?: (e: Error) => void
  /**
   * 是否手动触发请求
   */
  manual: ComputedRef<boolean>
  /**
   * 请求防抖时间
   */
  debounceTime: Ref<number | undefined>
  /**
   * 数据源轮询间隔时间或轮询触发条件
   */
  polling: Ref<number | ((dataSource: any[]) => number) | undefined>
  /**
   * 是否在页面获得焦点时重新验证数据
   */
  revalidateOnFocus?: Ref<boolean>
}

export type OptionSearchProps = Omit<SearchProps, 'onSearch'> & {
  /** 如果 onSearch 返回一个false，直接拦截请求 */
  onSearch?: (
    keyword: string,
  ) => Promise<boolean | undefined> | boolean | undefined
}
