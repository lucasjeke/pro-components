import type { ProSchemaValueEnumType } from '@antdv-next1/pro-provider'
import type { Key, VueNode } from '@v-c/util/dist/type'
import type { AvatarProps, CascaderProps, CheckboxProps, ColorPickerProps, DatePickerProps, DividerProps, FormInstance, FormItemProps, ImageProps, InputNumberProps, InputProps, PopoverProps, ProgressProps, RadioProps, RangePickerProps, RateProps, SegmentedProps, SelectProps, SliderProps, SpaceProps, SwitchProps, TextAreaProps, TimeRangePickerProps, TreeSelectProps } from 'antdv-next'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { PasswordProps } from 'antdv-next/dist/input/Password'
import type { CSSProperties, VNode } from 'vue'
import type { UseEditableUtilType } from './useEditableArray'

export type WithFalse<T> = T | false

export type { Key, VueNode }

export interface ProFormBaseGroupProps {
  /**
   * @name title 分组的标题
   */
  title?: VueNode
  /**
   * @name tooltip 标题旁边的？号提示展示的信息
   *
   * @example 自定义提示信息
   * <ProForm.Group title="标题"  tooltip="自定义提示信息">
   * @example 自定义Icon
   * <ProForm.Group title="标题"  tooltip={{icon:<Info/>,title:自定义提示信息}}>
   */
  tooltip?: FormItemTooltipType | string
  /**
   * @name extra 额外的内容配置,在标题的另外一边
   *
   * @example 额外的内容配置
   * <ProForm.Group title="标题" extra={<ProFormSwitch name="open"/>} />
   */
  extra?: VueNode
  /**
   * @name size 组件之前的间隔
   */
  size?: SpaceProps['size']
  /**
   * @name style 自定义样式
   */
  style?: CSSProperties
  /**
   * @name titleStyle 自定义 title 样式
   * @example 增加背景颜色
   * <ProForm.Group titleStyle={{ backgroundColor: '#f0f0f0' }} />
   */
  titleStyle?: CSSProperties
  /**
   * @name titleRender 自定义title
   * @example 自定义标题
   * <ProForm.Group title={(_,props)=><span>自定义标题</span>}>
   */
  titleRender?: (title: VueNode, props: ProFormBaseGroupProps) => VueNode
  /** @name align 子项的对齐方式 */
  align?: SpaceProps['align']
  spaceProps?: SpaceProps & { class?: string, style?: CSSProperties }
  /**
   * @name orientation 子项的排列方式
   */
  orientation?: SpaceProps['orientation']
  /**
   * @name labelLayout 布局方式，键值对模式和两行模式
   * @default inline
   */
  labelLayout?: 'inline' | 'twoLine'
  /**
   * @name collapsed 是否折叠
   */
  collapsed?: boolean
  /**
   * @name collapsible 是否可折叠
   */
  collapsible?: boolean
  /**
   * @name defaultCollapsed 默认的折叠状态
   */
  defaultCollapsed?: boolean
  /**
   * @name onCollapse 折叠修改的事件
   */
  onCollapse?: (collapsed: boolean) => void
  /**
   * @name autoFocus 自定选中一个input，只能有一个生效
   */
  autoFocus?: boolean
}

export type Value = string | number | undefined | null

export type ValuePair = Value[]
/**
 * ProFieldValueTypeWithFieldProps
 * 字段值类型与 ProFieldProps 的映射关系
 */
export interface ProFieldValueTypeWithFieldProps {
  /** 文本输入框 */
  text: InputProps
  /** 密码输入框 */
  password: PasswordProps
  /** 金额 */
  money: InputNumberProps & {
    numberFormatOptions?: {
      localeMatcher?: string
      style?: string
      currency?: string
      currencyDisplay?: string
      currencySign?: string
      useGrouping?: boolean
      minimumIntegerDigits?: number
      minimumFractionDigits?: number
      maximumFractionDigits?: number
      minimumSignificantDigits?: number
      maximumSignificantDigits?: number
    }
    numberPopoverRender?: | ((props: InputNumberProps, defaultText: string) => VueNode)
      | boolean
    customSymbol?: string
    moneySymbol?: boolean
    open?: boolean
  }
  /** 索引 */
  index: Record<string, any>
  /** 索引带边框 */
  indexBorder: Record<string, any>
  /** 下拉选择 */
  option: Record<string, any>
  /** 多行文本 */
  textarea: TextAreaProps
  /** 日期选择器 */
  date: DatePickerProps
  /** 周选择器 */
  dateWeek: DatePickerProps
  /** 月选择器 */
  dateMonth: DatePickerProps
  /** 季度选择器 */
  dateQuarter: DatePickerProps
  /** 年选择器 */
  dateYear: DatePickerProps
  /** 日期时间选择器 */
  dateTime: DatePickerProps
  /** 相对时间 */
  fromNow: DatePickerProps
  /** 日期范围选择器 */
  dateRange: RangePickerProps
  /** 日期时间范围选择器 */
  dateTimeRange: RangePickerProps
  /** 周范围选择器 */
  dateWeekRange: RangePickerProps
  /** 月范围选择器 */
  dateMonthRange: RangePickerProps
  /** 季范围选择器 */
  dateQuarterRange: RangePickerProps
  /** 年范围选择器 */
  dateYearRange: RangePickerProps
  /** 时间选择器 */
  time: TimeRangePickerProps
  /** 时间范围选择器 */
  timeRange: TimeRangePickerProps
  /** 下拉选择器 */
  select: SelectProps
  /** 复选框 */
  checkbox: CheckboxProps
  /** 评分 */
  rate: RateProps
  slider: SliderProps
  /** 单选框 */
  radio: RadioProps
  /** 单选框按钮 */
  radioButton: RadioProps
  /** 进度条 */
  progress: ProgressProps | InputNumberProps
  /** 百分比输入框 */
  percent: InputNumberProps
  /** 数字输入框 */
  digit: InputNumberProps & {
    intlProps: Intl.NumberFormatOptions
  }
  /** 数字范围输入框 */
  digitRange: Omit<InputNumberProps, 'placeholder' | 'value' | 'defaultValue' | 'onChange'> & {
    id?: string
    placeholder?: string[]
    value?: ValuePair
    defaultValue?: ValuePair
    onChange?: (value?: ValuePair) => void
    intlProps?: Intl.NumberFormatOptions
  }
  /** 秒数输入框 */
  second: InputNumberProps
  /** 代码输入框 */
  code: InputProps | TextAreaProps
  /** JSON 代码输入框 */
  jsonCode: InputProps | TextAreaProps
  /** 头像 */
  avatar: AvatarProps
  /** 开关 */
  switch: SwitchProps
  /** 图片 */
  image: ImageProps | InputProps
  /** 级联选择 */
  cascader: CascaderProps<any>
  /** 树形选择 */
  treeSelect: TreeSelectProps
  /** 颜色选择器 */
  color: ColorPickerProps & {
    value?: string
    popoverProps?: PopoverProps
    mode?: 'read' | 'edit'
    onChange?: (color: string) => void
    colors?: string[]
  }
  /** 分段器 */
  segmented: SegmentedProps
  /** 分组 */
  group: ProFormBaseGroupProps
  /** 表单列表 */
  formList: Record<string, any>
  /** 表单集合 */
  formSet: Record<string, any>
  /** 分割线 */
  divider: DividerProps
  /** 显示/隐藏 */
  dependency: FormItemProps
}

/**
 * @param textarea 文本框
 * @param password 密码框
 * @param money 金额 option 操作 需要返回一个数组
 * @param date 日期 YYYY-MM-DD
 * @param dateWeek 周选择器
 * @param dateMonth 月选择器
 * @param dateQuarter 季度选择器
 * @param dateYear 年选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param dateTime 日期和时间 YYYY-MM-DD HH:mm:ss
 * @param dateTimeRange 范围日期和时间 YYYY-MM-DD HH:mm:ss[]
 * @param time 时间 HH:mm:ss
 * @param timeRange 时间区间 HH:mm:ss[]
 * @param index 序列
 * @param indexBorder 序列
 * @param progress 进度条
 * @param percent 百分比
 * @param digit 数值
 * @param second 秒速
 * @param fromNow 相对于当前时间
 * @param avatar 头像
 * @param code 代码块
 * @param image 图片设置
 * @param jsonCode Json 的代码块，格式化了一下
 * @param color 颜色选择器
 */
export type ProFieldValueType = Extract<keyof ProFieldValueTypeWithFieldProps, any>

/**
 * 这是一个泛型类型定义，用于定义 FieldPropsTypeBase 类型。该类型包含了以下类型参数：
 * Entity：表示表单项的数据实体类型，默认为 Record<string, any>。
 * ComponentsType：表示表单项对应的组件类型，默认为 'text'。
 * ExtraProps：表示表单项组件的额外属性类型，默认为 Record<string, any>。
 * FieldPropsType：表示表单项组件的属性类型，默认为 Record<string, any>。
 *
 * 该类型定义了一种联合类型，可以是一个函数类型，也可以是一个对象类型。具体来说：
 * 如果是一个函数类型，它接收两个参数 form 和 config，并返回一个对象类型，该对象类型可以是 FieldPropsType 或 Record<string, any>。
 * 其中，form 是 antd 的 FormInstance 类型，config 是 ProSchema 和其它额外属性的联合类型，并包含了一些表单项相关的信息。
 * 如果不是一个函数类型，它可以是 FieldPropsType 或 Record<string, any> 中的任意一个。
 * 该类型的作用是定义一个通用的表单项属性类型，使得在不同的表单项组件中，可以共用这个属性类型，提高了代码的重用性。
 */

type FieldPropsTypeBase<
  Entity = Record<string, any>,
  ComponentsType = 'text',
  ExtraProps = Record<string, any>,
  FieldPropsType = ProFieldValueTypeWithFieldProps['text'],
>
  = | ((
    form: FormInstance | undefined,
    config: ProSchema<Entity, ExtraProps> & {
      type: ComponentsType
      isEditable?: boolean
      rowKey?: string
      rowIndex: number
      entity: Entity
    },
  ) => FieldPropsType | Record<string, any>)
  | FieldPropsType
  | Record<string, any>

/**
 * 这段代码定义了一个泛型类型 ProFieldValueObject<Type>，它的泛型参数 Type 必须是 'progress'、'money'、'percent'、'image' 中的一个。
 * 当 Type 为 'progress'、'money'、'percent'、'image' 中的一种时，这个类型将被定义为一个对象，包含以下属性：
 *
 * - type: Type 类型值，即 'progress'、'money'、'percent'、'image' 中的一种；
 * - status: 字符串类型，表示状态，可选值为 'normal'、'active'、'success'、'exception' 或 undefined；
 * - locale: 字符串类型，表示地区；
 * - showSymbol: 布尔类型或函数类型，表示是否显示符号；
 * - showColor: 布尔类型，表示是否显示颜色；
 * - precision: 数字类型，表示精度；
 * - moneySymbol: 布尔类型，表示是否显示货币符号；
 * - request: ProFieldRequestData 类型，表示请求数据；
 * - width: 数字类型，表示宽度。
 *
 * 如果 Type 不是 'progress'、'money'、'percent'、'image' 中的一种，那么 ProFieldValueObject<Type> 的类型为 never。
 */
export type ProFieldValueObject<Type> = Type extends 'progress' | 'money' | 'percent' | 'image'
  ? {
      type: Type
      status?: 'normal' | 'active' | 'success' | 'exception' | undefined
      locale?: string
      /** Percent */
      showSymbol?: ((value: any) => boolean) | boolean
      showColor?: boolean
      precision?: number
      moneySymbol?: boolean
      request?: ProFieldRequestData
      /** Image */
      width?: number
    }
  : never

/**
 * 这段代码定义了一个泛型类型 ValueTypeWithFieldPropsBase，它包含了以下属性：
 * - Entity：泛型类型，表示数据实体对象的类型；
 * - ComponentsType：泛型类型，表示组件的类型；
 * - ExtraProps：泛型类型，表示额外的属性；
 * - ValueType：泛型类型，表示字段的值类型，默认为字符串类型。
 *
 * 该类型的主要作用是用于定义 ProTable 组件的列属性 ProColumns 中的字段属性，包括字段的类型（valueType）和自定义属性（fieldProps）。其中：
 * - valueType 属性可以是字符串类型，也可以是 ProFieldValueType 枚举类型，也可以是一个对象类型 ProFieldValueObject，或者是一个返回值为这些类型之一的函数。它表示字段的类型，如文本、数字、日期等；
 * - fieldProps 属性是一个泛型类型 FieldPropsTypeBase，它表示该字段对应的组件的属性，用于定制组件的展示形式、校验规则、事件等等。根据字段类型的不同，其属性值也会有所不同。
 */
interface ValueTypeWithFieldPropsBase<Entity = Record<string, any>, ComponentsType = 'form', ExtraProps = Record<string, any>, ValueType = 'text'> {
  valueType?:
    | ValueType
    | ProFieldValueType
    | ProFieldValueObject<ValueType | ProFieldValueType>
    | ((entity: Entity, type: ComponentsType) => ValueType | ProFieldValueType | ProFieldValueObject<ValueType | ProFieldValueType>)
  fieldProps?: FieldPropsTypeBase<
    Entity,
    ComponentsType,
    ExtraProps,
    ValueType extends ProFieldValueType ? ProFieldValueTypeWithFieldProps[ValueType] : ProFieldValueTypeWithFieldProps['text']
  >
}

/**
 * 这段代码定义了一个泛型类型 ValueTypeWithFieldProps，它有四个类型参数。
 * 这个类型的作用是用来描述在一个数据表格中某个字段的值（value）以及可能需要传递给这个字段的其他属性（fieldProps），以便在 UI 上正确地展示这个字段。
 * 具体来说，这个类型有一个属性 valueType，表示字段的值的类型，可以是 'text'、'money'、'percent'、'image'、ProFieldValueType 中的一个，也可以是一个函数。
 *
 * 它的参数是该行数据和组件类型（例如 'table' 或 'form'），返回值为上述值中的一种。
 *
 * 此外，这个类型还有一个属性 fieldProps，表示需要传递给该字段的其他属性，它的类型是一个泛型 FieldPropsTypeBase。这个泛型有四个类型参数，
 * 分别是：
 *  - Entity 表示该字段所在行的数据类型；
 *  - ComponentsType 表示该字段所在的组件类型；
 *  - ExtraProps 表示传递给该字段的其他属性的类型；
 *  - ValueType 表示该字段的值的类型，可以是 'text'、'money'、'percent'、'image'、ProFieldValueType 中的一种。
 * 最终，fieldProps 属性的类型会根据 valueType 的不同，来选择特定的类型进行限制，以确保传递给该字段的其他属性符合它的值的类型。
 */
export type ValueTypeWithFieldProps<Entity, ComponentsType, ExtraProps, ValueType = 'text'> = ValueTypeWithFieldPropsBase<
  Entity,
  ComponentsType,
  ExtraProps,
  ValueType
>

export interface PageInfo {
  pageSize: number
  total: number
  current: number
}

export interface RequestOptionsType {
  /**
   * 选项的文本内容，可以是一个 Vue 组件。
   */
  label?: VueNode
  /**
   * 选项的值，可以是一个字符串或数字类型。
   */
  value?: string | number | boolean
  /** 渲染的节点类型 */
  optionType?: 'optGroup' | 'option'
  /**
   * 当节点类型为 optGroup 时，可以使用该属性来定义其包含的子选项，每个子选项也可以使用 RequestOptionsType 类型来定义。
   */
  options?: Omit<RequestOptionsType, 'children' | 'optionType'>[]
  /** 其他自定义属性。 */
  [key: string]: any
}

export type ProFieldRequestData<U = any> = (params: U, props: any) => Promise<RequestOptionsType[]>

/**
 * 支持 Map 和 Record<string,any>
 *
 * @name ProSchemaValueEnumMap ValueEnum 的类型
 */
export type ProSchemaValueEnumMap = Map<string | number | boolean, ProSchemaValueEnumType | VueNode>

export type ProSchemaValueEnumObj = Record<string, ProSchemaValueEnumType | VueNode>

export type ProFieldValueEnumType = ProSchemaValueEnumMap | ProSchemaValueEnumObj

/**
 * ProFieldValueObjectType 对象，用于描述值为 'progress' | 'money' | 'percent' | 'image' 类型的 ProField 的属性。
 * @typedef {object} ProFieldValueObjectType
 * @property {('progress' | 'money' | 'percent' | 'image')} type - 值的类型。
 * @property {('normal' | 'active' | 'success' | 'exception' | undefined)} [status] - 状态。
 * @property {string} [locale] - 本地化语言。
 * @property {((value: any) => boolean) | boolean} [showSymbol] - 是否显示符号。
 * @property {boolean} [showColor] - 是否显示颜色。
 * @property {number} [precision] - 精度。
 * @property {boolean} [moneySymbol] - 是否显示货币符号。
 * @property {ProFieldRequestData} [request] - 远程请求数据。
 * @property {number} [width] - 图片的宽度。
 */
export interface ProFieldValueObjectType {
  /**
   * 类型
   * - 'progress': 进度条
   * - 'money': 金钱格式
   * - 'percent': 百分比
   * - 'image': 图片
   */
  type: 'progress' | 'money' | 'percent' | 'image'
  /**
   * 状态
   * - 'normal': 正常
   * - 'active': 活动中
   * - 'success': 成功
   * - 'exception': 异常
   */
  status?: 'normal' | 'active' | 'success' | 'exception'
  /** 本地化信息 */
  locale?: string
  /**
   * 百分比相关
   * - showSymbol?: 是否显示百分号，默认为 true
   * - showColor?: 是否显示颜色条，默认为 false
   * - precision?: 保留几位小数，默认为 2
   */
  showSymbol?: ((value: any) => boolean) | boolean
  showColor?: boolean
  precision?: number
  /**
   * 金钱相关
   * - moneySymbol?: 是否显示货币符号，默认为 true
   */
  moneySymbol?: boolean
  /** 数据请求 */
  request?: ProFieldRequestData
  /**
   * width?: 图片宽度，默认为 80
   */
  width?: number
}

export type ProFieldTextType = VueNode | VueNode[] | Record<string, any> | Record<string, any>[]

export type SearchTransformKeyFn = (value: any, namePath: string[], allValues: any) => any

export type SearchConvertKeyFn = (value: any, field: NamePath) => string | boolean | Record<string, any>

export type ProTableEditableFnType<T> = (value: any, record: T, index: number) => boolean

/** 支持的变形，还未完全支持完毕 */
export type ProSchemaComponentTypes = 'form' | 'listy' | 'descriptions' | 'table' | 'cardList' | undefined

/** 操作类型 */
export type ProCoreActionType<T extends Record<string, any>, U> = {
  /** @name reload 刷新 */
  reload?: (resetPageIndex?: boolean) => Promise<void>
  /** @name reloadAndRest 刷新并清空，只清空页面，不包括表单 */
  reloadAndRest?: () => Promise<void>
  /** @name reset 重置任何输入项，包括表单 */
  reset?: () => Promise<void>
  /** @name clearSelected 清空选择 */
  clearSelected?: () => Promise<void>
  /** @name pageInfo 页面的信息都在里面 */
  pageInfo?: PageInfo
} & Omit<
  Partial<UseEditableUtilType<U>>,
  'newLineRecord' | 'editableKeys' | 'actionRender' | 'setEditableRowKeys'
>
& T

export type ProSchemaFieldProps<T> = Record<string, any> | T | Partial<InputProps>

/** 各个组件公共支持的 render */
export type ProSchema<
  Entity = Record<string, any>,
  ExtraProps = unknown,
  ComponentsType extends ProSchemaComponentTypes = 'form',
  ValueType = 'text',
  ExtraFormItemProps = unknown,
> = {
  /** @name 确定这个列的唯一值,一般用于 dataIndex 重复的情况 */
  key?: Key
  /**
   * 支持一个数字，[a,b] 会转化为 obj.a.b
   *
   * @name dataIndex 与实体映射的key
   */
  dataIndex?: unknown
  /**
   * 支持 VueNode 和 方法
   *
   * @name title 标题
   */
  title?: ((schema: ProSchema<Entity, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps>, type: ComponentsType, dom: VueNode) => AntVueNode) | AntVueNode

  /** @name tooltip 展示一个 icon，hover 是展示一些提示信息 */
  tooltip?: FormItemTooltipType | string
  /**
   * 支持 object 和Map，Map 是支持其他基础类型作为 key
   *
   * @name valueEnum 映射值的类型
   */
  valueEnum?: ((row: Entity) => ProSchemaValueEnumObj | ProSchemaValueEnumMap) | ProSchemaValueEnumObj | ProSchemaValueEnumMap

  /**
   * @name formItemProps 自定义的 formItemProps
   */
  formItemProps?:
    | (FormItemProps & { style?: CSSProperties, class?: string } & ExtraFormItemProps)
    | ((
      form: FormInstance,
      config: ProSchema<Entity, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps> & {
        type: ComponentsType
        isEditable?: boolean
        rowKey?: string
        rowIndex: number
        entity: Entity
      },
    ) => FormItemProps & { style?: CSSProperties, class?: string } & ExtraFormItemProps)
  /**
   * 修改的数据是会被 valueType 消费
   *
   * @name renderText 自定义 render 内容
   */
  renderText?: <T extends Record<string, any>>(text: VueNode, record: Entity, index: number, action?: ProCoreActionType<T, Entity>) => AntVueNode
  /**
   * Render 方法只管理的只读模式，编辑模式需要使用 renderFormItem
   *
   * @name render 自定义只读模式的dom
   */
  render?: <T extends Record<string, any>>(
    dom: VueNode,
    entity: Entity,
    index: number,
    action: ProCoreActionType<T, Entity> | undefined,
    schema: ProSchema<Entity, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps> & {
      isEditable?: boolean
      type: ComponentsType
    },
  ) => VueNode

  /**
   * 返回一个 VueNode，会自动包裹 value 和 onChange
   *
   * @name formItemRender 自定义编辑模式
   */
  formItemRender?: (
    schema: ProSchema<Entity, ExtraProps, ComponentsType, ValueType, ExtraFormItemProps> & {
      isEditable?: boolean
      index?: number
      type: ComponentsType
      originProps?: any
    },
    config: {
      onSelect?: (value: any) => void
      onChange?: <T = any>(value: T) => void
      value?: any
      type: ComponentsType
      recordKey?: Key | Key[]
      record?: Entity
      isEditable?: boolean
      defaultRender: (newItem: ProSchema<Entity, ExtraProps, ComponentsType, ValueType>) => VNode | null
    },
    form: FormInstance | undefined,
    action?: Omit<
      UseEditableUtilType<Entity>,
      'newLineRecord' | 'editableKeys' | 'actionRender' | 'setEditableRowKeys'
    >,
  ) => VueNode
  /**
   * @name editable 可编辑表格是否可编辑
   *
   * @example 不允许编辑
   * editable=false
   *
   * @example 如果id=1不允许编辑
   * editable={(value,row,Slider.tsx)=> row.id !==1 }
   */
  editable?: false | ProTableEditableFnType<Entity>

  /** @name request 从服务器请求枚举 */
  request?: ProFieldRequestData
  /** @name debounceTime request防抖动时间 默认10 单位ms */
  debounceTime?: number
  /** @name params 从服务器请求的参数，改变了会触发 reload */
  params?: | ((record: Entity, column: ProSchema<Entity, ExtraProps>) => Record<string, any>) | Record<string, any>
  /** @name dependencies 依赖字段的name，暂时只在拥有 request 的项目中生效，会自动注入到 params 中 */
  dependencies?: NamePath<string | number | boolean>[]
  /**
   *  @name ignoreFormItem  忽略 FormItem，必须要和 renderFormItem 组件一起使用
   */
  ignoreFormItem?: boolean
  /** @name hideInDescriptions 在 descriptions 隐藏 */
  hideInDescriptions?: boolean
  /** @name hideInForm 在 Form 中隐藏 */
  hideInForm?: boolean
  /** @name hideInTable 在 table 中隐藏 */
  hideInTable?: boolean

  /** @name proFieldProps 设置到 ProField 上面的 Props，内部属性 */
  proFieldProps?: CommomProFieldProps & Record<string, any>
} & ExtraProps
& ValueTypeWithFieldProps<Entity, ComponentsType, ExtraProps, ValueType>

export interface CommomProFieldProps {
  /**
   * 是否启用轻量模式
   */
  light?: boolean
  /**
   * 空文本占位符
   */
  emptyText?: VueNode
  /**
   * 标签名称
   */
  label?: VueNode
  /**
   * 渲染模式
   */
  mode?: 'read' | 'edit'
  /**
   * 设置 useSwr 的 key
   */
  proFieldKey?: string
  /**
   * 自定义渲染函数
   */
  render?: any
  /**
   * 是否只读
   */
  readonly?: boolean
}

// export type WrapperTooltipProps = TooltipProps & {
//   icon?: VNode
// }
// export type LabelTooltipType = WrapperTooltipProps | AntVueNode
