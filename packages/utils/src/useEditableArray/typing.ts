import type { FormInstance, FormProps } from 'antdv-next'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { ComputedRef, ShallowRef } from 'vue'
import type { Key, VueNode } from '../typing'

export type RowEditableType = 'single' | 'multiple'

export type RecordKey = Key | Key[]

export interface ActionTypeText<T> {
  deleteText?: VueNode
  cancelText?: VueNode
  saveText?: VueNode
  editorType?: 'Array' | 'Map'
  addEditRecord?: (row: T, options?: AddLineOptions) => Promise<boolean>
}

export interface SaveEditableActionRef<T = any> {
  /**
   * 直接触发保存动作
   * @throws 如果校验失败，会抛出异常
   */
  save: () => ReturnType<NonNullable<RowEditableConfig<T>['onSave']>> | Promise<void>
}

export interface AddLineOptions {
  position?: 'top' | 'bottom'
  recordKey?: RecordKey
  newRecordType?: 'dataSource' | 'cache'
  /** 要增加到哪个节点下，一般用于多重嵌套表格 */
  parentKey?: RecordKey | (() => RecordKey)
}
export interface NewLineConfig<T> {
  defaultValue?: T
  options: AddLineOptions
}

export type ActionRenderFunction<T> = (
  row: T | undefined,
  config: ActionRenderConfig<T, NewLineConfig<T>>,
  defaultDoms: {
    save: VueNode
    delete: VueNode
    cancel: VueNode
  },
) => VueNode[]

export interface RowEditableConfig<DataType> {
  /** @name formProps 控制可编辑表格的 From的设置 */
  formProps?: Omit<FormProps & {
    formRef?: ShallowRef<
      | FormInstance
      | undefined
    >
    onInit?: (
      values: DataType,
      form: FormInstance,
    ) => void
  }, 'onFinish'>
  // /** @name form 控制可编辑表格的 form */
  form?: FormInstance
  /**
   * @name type 编辑的类型，支持单选和多选
   */
  type?: RowEditableType
  /** @name editableKeys 正在编辑的列 */
  editableKeys?: Key[]
  /** 正在编辑的列修改的时候 */
  onChange?: (editableKeys: Key[], editableRows?: DataType[] | DataType) => void
  /** 正在编辑的列修改的时候 */
  onValuesChange?: (record: DataType | undefined, dataSource: DataType[]) => void
  /** @name actionRender  自定义编辑的操作 */
  actionRender?: ActionRenderFunction<DataType>
  /** 行保存的时候 */
  onSave?: (
    /** 行 id，一般是唯一id */
    key: RecordKey,
    /** 当前修改的行的值，只有 form 在内的会被设置 */
    record: DataType & { index?: number },
    /** 原始值，可以用于判断是否修改 */
    originRow: DataType & { index?: number },
    /** 新建一行的配置，一般无用 */
    newLineConfig?: NewLineConfig<DataType>,
  ) => Promise<any>
  /** 行取消编辑的时候 */
  onCancel?: (
    /** 行 id，一般是唯一id */
    key: RecordKey,
    /** 当前修改的行的值，只有 form 在内的会被设置 */
    record: DataType & { index?: number },
    /** 原始值，可以用于判断是否修改 */
    originRow: DataType & { index?: number } | undefined,
    /** 新建一行的配置，一般无用 */
    newLineConfig?: NewLineConfig<DataType>,
  ) => Promise<any>
  /** 行删除的时候 */
  onDelete?: (key: RecordKey, row: DataType & { index?: number } | undefined) => Promise<any>
  /** 删除行时的确认消息 */
  deletePopconfirmMessage?: AntVueNode
  /** 只能编辑一行的的提示 */
  onlyOneLineEditorAlertMessage?: AntVueNode
  /** 同时只能新增一行的提示 */
  onlyAddOneLineAlertMessage?: AntVueNode
  /** Table 上设置的name，用于拼接name来获取数据 */
  tableName?: ComputedRef<NamePath<string | number | boolean> | undefined>
  /** 保存一行的文字 */
  saveText?: VueNode
  /** 取消编辑一行的文字 */
  cancelText?: VueNode
  /** 删除一行的文字 */
  deleteText?: VueNode
  getRealIndex?: (record: DataType) => number
}

export type ActionRenderConfig<T, LineConfig = NewLineConfig<T>> = {
  editableKeys?: RowEditableConfig<T>['editableKeys']
  recordKey: RecordKey
  /** Form list 中的行路径；name 模式下通常是数组索引，区别于业务 recordKey。 */
  formRecordKey?: RecordKey
  preEditRow: T | null
  /**
   * 多行编辑场景下，按 recordKey 缓存每一行进入编辑前的快照（允许为 null，用于标记“新建行”）
   * 用于避免 preEditRow（单引用）在多行编辑时被覆盖导致取消误删/误还原的问题
   */
  preEditRows?: Map<string, T | null>
  'onUpdate:preEditRow': (preEditRow: T | null) => void
  index?: number
  cancelEditable: (key: RecordKey) => Promise<boolean | void>
  /** 仅结束编辑状态，不触发取消回调或恢复编辑前数据。 */
  finishEditable?: (key: RecordKey) => Promise<boolean | void>
  onSave: RowEditableConfig<T>['onSave']
  onCancel: RowEditableConfig<T>['onCancel']
  onDelete?: RowEditableConfig<T>['onDelete']
  deletePopconfirmMessage: RowEditableConfig<T>['deletePopconfirmMessage']
  setEditableRowKeys: (value: Key[]) => void
  newLineConfig?: LineConfig
  tableName?: NamePath<string | number | boolean>
} & ActionTypeText<T>
