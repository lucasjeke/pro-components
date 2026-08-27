import type { ProFormInstance } from '@antdv-next1/pro-form'
import type { IntlType, ParamsType } from '@antdv-next1/pro-provider'
import type { FormItemProps, ProFieldValueObjectType, ProFieldValueType, RowEditableConfig, WithFalse } from '@antdv-next1/pro-utils'
import type { GetRowKey } from '@v-c/table'
import type { CustomSlotsType, Key, VueNode } from '@v-c/util/dist/type'
import type { ButtonProps } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { ComputedRef, CSSProperties, FunctionalComponent, Ref, SetupContext, ShallowRef } from 'vue'
import type { ProTableInstance, ProTableProps } from '../../typing'
import { ProFormDependency } from '@antdv-next1/pro-form'
import { useIntl } from '@antdv-next1/pro-provider'
import { childrenToArray, isSpecialNode, runFunction, stringify, transformBooleanProps, useEffect, useMemo } from '@antdv-next1/pro-utils'
import { PlusOutlined } from '@antdv-next/icons'
import { get, set, useMergedState } from '@v-c/util'
import isEqual from '@v-c/util/dist/isEqual'
import { Button } from 'antdv-next'
import { cloneVNode, computed, defineComponent, isVNode, ref, shallowRef, toRef } from 'vue'
import ProTable from '../../Table'
import { useProTableInstanceExpose } from '../../utils'
import { useEditableTableActionContextInject, useEditableTableActionContextProvider } from './context'

export type EditableProTableInstance<T extends Record<string, any>> = ProTableInstance<T> & {
  editableFormRef: ProFormInstance<T>
  /**
   * 获取一行数据的
   * @param rowIndex
   * @returns T | undefined
   *
   * @example getRowData(1)  可以传入第几行的数据
   * @example getRowData("id")  也可以传入 rowKey，根据你列的唯一key 来获得。
   */
  getRowData?: (rowIndex: string | number) => T | undefined
  /**
   * 获取整个 table 的数据
   * @returns T[] | undefined
   */
  getRowsData?: () => T[] | undefined
  /**
   * 设置一行的数据，会将数据进行简单的 merge
   *
   * {title:"old", decs:"old",id:"old"} -> set {title:"new"} -> {title:"new", decs:"old",id:"old"}
   *
   * @description 只会做最第一层对象的 merge 哦。
   * {title:"old", decs:{name:"old",key:"old"},id:"old"} -> set {decs:{name:"new"}} -> {title:"old", decs:{name:"new"},id:"old"} -> set {decs:{name:"old"}}
   *
   * @param rowIndex
   * @param data
   * @returns void
   *
   * 根据行号设置
   * @example setRowData(1, { title:"new" })  可以传入修改第几行
   *
   * 根据行 id 设置
   * @example setRowData("id", { title:"new" })  也可以传入 rowKey，根据你列的唯一 key 来设置。
   *
   * 清空原有数据
   * @example setRowData(1, { title:undefined })
   *
   */
  setRowData?: (rowIndex: string | number, data: Partial<T>) => void
}

interface CreatorButtonResult {
  creatorButtonDom: ComputedRef<WithFalse<VueNode>>
  buttonRenderProps: ComputedRef<Record<string, any>>
}

export interface RecordCreatorProps<DataSourceType> {
  record: DataSourceType | ((index: number, dataSource: DataSourceType[]) => DataSourceType)
  position?: 'top' | 'bottom'
  /**
   * 新增一行的类型
   *
   * @augments dataSource 将会新增一行数据到 dataSource 中，不支持取消，只能删除
   * @augments cache 将会把数据放到缓存中，取消后消失
   */
  newRecordType?: 'dataSource' | 'cache'
  /** 要增加到哪个节点下，一般用于多重嵌套表格 */
  parentKey?: Key | ((index: number, dataSource: DataSourceType[]) => Key)
}
export type EditableProTableProps<
  T,
  U extends ParamsType,
  ValueType = 'text',
> = Omit<ProTableProps<T, U, ValueType>, 'onChange'> & {
  defaultValue?: T[]
  value?: T[]
  'onUpdate:value'?: (value?: T[]) => void
  onChange?: (value?: T[]) => void
  /** @name onTableChange 原先的 table OnChange */
  onTableChange?: ProTableProps<T, U>['onChange']
  /** @name recordCreatorProps 新建按钮的设置 */
  recordCreatorProps?: WithFalse<(RecordCreatorProps<T>
    & ButtonProps & {
      style?: CSSProperties
      creatorButtonText?: VueNode
    })>
  /** 最大行数 */
  maxLength?: number
  /** Table 的值发生改变，为了适应 Form 调整了顺序 */
  onValuesChange?: (values: T[], record: T) => void
  /** 是否受控，如果为 true，每次 value 更新都会重置表单 */
  controlled?: boolean
  /** FormItem 的设置 */
  formItemProps?: Omit<FormItemProps, 'name'>
}

/** 可编辑表格的按钮 */
export const RecordCreator: FunctionalComponent<RecordCreatorProps<Record<string, any>>> = (
  { record, position, newRecordType, parentKey },
  { slots },
) => {
  const actionRef = useEditableTableActionContextInject()
  const childrens = childrenToArray(slots.default?.(), true) as VueNode[]
  return childrens.map((vnode) => {
    if (isVNode(vnode) && !isSpecialNode(vnode)) {
      return cloneVNode(vnode, {
        ...vnode.props,
        onClick: async (e: MouseEvent) => {
          // 如果返回了false，接触掉默认行为
          const isOk = await vnode.props?.onClick?.(e)
          if (isOk === false)
            return
          if (actionRef) {
            actionRef.value?.addEditRecord?.(record, {
              position,
              newRecordType,
              parentKey: parentKey as Key,
            })
          }
        },
      })
    }
    return vnode
  })
}
RecordCreator.displayName = 'RecordCreator'
RecordCreator.inheritAttrs = false

/**
 * 检查是否应该显示创建按钮
 */
function shouldShowCreatorButton<DataType, U extends ParamsType, ValueType>(
  maxLength: number | undefined,
  valueLength: number,
  recordCreatorProps: EditableProTableProps<DataType, U, ValueType>['recordCreatorProps'],
): boolean {
  if (typeof maxLength === 'number' && maxLength <= valueLength) {
    return false
  }
  return recordCreatorProps !== false
}

/**
 * 创建按钮 DOM
 */
function createButtonDom<DataType, U extends ParamsType, ValueType>(
  recordCreatorProps: Exclude<
    EditableProTableProps<DataType, U, ValueType>['recordCreatorProps'],
    false | undefined
  >,
  value: readonly DataType[] | undefined,
  intl: IntlType,
): VueNode {
  const {
    record,
    position,
    creatorButtonText,
    newRecordType,
    parentKey,
    style,
    ...restButtonProps
  } = recordCreatorProps

  return (
    <RecordCreator
      record={runFunction(record, value?.length, value) || {}}
      position={position}
      parentKey={runFunction(parentKey, value?.length, value)}
      newRecordType={newRecordType}
    >
      <Button
        type="dashed"
        style={{
          display: 'block',
          margin: '10px 0',
          width: '100%',
          ...style,
        }}
        icon={<PlusOutlined />}
        {...restButtonProps}
      >
        {creatorButtonText
          || intl.getMessage({ id: 'editableTable.action.add', defaultMessage: '添加一行数据' })}
      </Button>
    </RecordCreator>
  )
}
/**
 * 创建顶部按钮的渲染属性
 */
function createTopButtonProps(
  creatorButtonDom: VueNode,
  columnsLength: number | undefined,
) {
  const wrapper: FunctionalComponent<any, any, {
    default: () => VueNode
  }> = (_, { attrs, slots }) => (
    <thead class={attrs.class}>
      {slots.default?.()}
      <tr style={{ position: 'relative' }}>
        <td col-span={0} style={{ visibility: 'hidden' }}>
          {creatorButtonDom}
        </td>
        <td
          style={{ position: 'absolute', left: 0, width: '100%' }}
          col-span={columnsLength}
        >
          {creatorButtonDom}
        </td>
      </tr>
    </thead>
  )
  return {
    components: {
      header: {
        wrapper,
      },
    },
  }
}

/**
 * 创建底部按钮的渲染属性
 */
function createBottomButtonProps<T, U extends ParamsType, ValueType>(
  creatorButtonDom: VueNode,
  tableViewRender: ProTableProps<T, U, ValueType>['tableViewRender'],
) {
  return {
    tableViewRender: (_: any, dom: any) => (
      <>
        {tableViewRender?.(_, dom) ?? dom}
        {creatorButtonDom}
      </>
    ),
  }
}

export function useCreatorButton<DataType, U extends ParamsType, ValueType>({
  recordCreatorProps,
  maxLength,
  value,
  intl,
  columnsLength,
  tableViewRender,
}: {
  recordCreatorProps: ComputedRef<EditableProTableProps<
    DataType,
    U,
    ValueType
  >['recordCreatorProps']>
  maxLength: ComputedRef<EditableProTableProps<DataType, U, ValueType>['maxLength']>
  value: Ref<readonly DataType[] | undefined>
  intl: ComputedRef<IntlType>
  columnsLength: ComputedRef<number | undefined>
  tableViewRender: ProTableProps<DataType, U, ValueType>['tableViewRender']
}): CreatorButtonResult {
  const creatorButtonDom = computed(() => {
    if (
      !shouldShowCreatorButton<DataType, U, ValueType>(
        maxLength.value,
        value.value?.length || 0,
        recordCreatorProps.value,
      )
    ) {
      return false
    }
    if (!recordCreatorProps.value) {
      return false
    }
    return createButtonDom<DataType, U, ValueType>(recordCreatorProps.value, value.value, intl.value)
  })
  const buttonRenderProps = computed(() => {
    if (!recordCreatorProps.value) {
      return {}
    }
    const { position } = recordCreatorProps.value
    if (!creatorButtonDom) {
      return {}
    }
    return position === 'top'
      ? createTopButtonProps(creatorButtonDom.value, columnsLength.value)
      : createBottomButtonProps<DataType, U, ValueType>(creatorButtonDom.value, tableViewRender)
  })

  return { creatorButtonDom, buttonRenderProps }
}

export function useEditableProTableInstanceExpose<T extends Record<string, any>>(editableTableRef: ShallowRef<EditableProTableInstance<T> | null>) {
  return {
    ...useProTableInstanceExpose(editableTableRef),
    get nativeElement() {
      return editableTableRef.value?.nativeElement
    },
    get pageInfo() {
      return editableTableRef.value?.pageInfo
    },
    get formRef() {
      return editableTableRef.value?.formRef?.nativeElement ? editableTableRef.value?.formRef : null
    },
    get editableFormRef() {
      return editableTableRef.value?.editableFormRef
    },
    getRowData: (rowIndex: string | number) => editableTableRef.value?.getRowData?.(rowIndex),
    getRowsData: () => editableTableRef.value?.getRowsData?.(),
    setRowData: (rowIndex: string | number, data: Partial<T>) => editableTableRef.value?.setRowData?.(rowIndex, data),
  }
}

const InternalEditableProTable = defineComponent(<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'>(props: EditableProTableProps<DataType, Params, ValueType>, { slots, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
  tableViewRender?: () => VueNode
  tableExtraRender?: () => VueNode
  toolBarRender?: () => VueNode
  optionsRender?: () => VueNode
  tableRender?: () => VueNode
}>>) => {
  const intl = useIntl()
  const preData = ref<DataType[] | undefined>(undefined)
  const tableRef = shallowRef<ProTableInstance<DataType> | null>(null)
  const formRef = shallowRef<ProFormInstance<DataType> | null>(null)
  const hasHydratedEditableForm = ref(false)
  const booleanProps = transformBooleanProps(['manualRequest', 'showSorterTooltip', 'showHeader', 'rowHoverable', 'revalidateOnFocus', 'loading', 'virtual', 'sticky', 'tailor', 'bordered', 'cardBordered', 'ghost'], props)
  const [value, setValue] = useMergedState<DataType[]>(
    () => props.value || props.defaultValue || [],
    {
      value: toRef(() => props.value!),
      defaultValue: props.defaultValue,
      onChange: (value) => {
        props.onChange?.(value)
        props['onUpdate:value']?.(value)
      },
    },
  )
  const getRowKey = useMemo<GetRowKey<DataType>>((): GetRowKey<DataType> => {
    if (typeof props.rowKey === 'function') {
      return props.rowKey
    }
    return (record: DataType, index?: number) =>
      record[props.rowKey as string] || index
  }, [() => props.rowKey])
  /**
   * 根据不同的情况返回不同的 rowKey
   * @param finlayRowKey
   * @returns string | number
   */
  const coverRowKey = (finlayRowKey: number | string): string | number => {
    /**
     * 如果是 prop.name 的模式，就需要把行号转化成具体的rowKey。
     */
    if (typeof finlayRowKey === 'number' && !props.name) {
      if (finlayRowKey >= value.value.length)
        return finlayRowKey
      const rowData = value.value && value.value[finlayRowKey]
      return getRowKey.value?.(rowData!, finlayRowKey) as string | number
    }

    /**
     * 如果是 prop.name 的模式，就直接返回行号
     */
    if ((typeof finlayRowKey === 'string' || finlayRowKey >= value.value.length) && props.name) {
      const rowIndex = value.value.findIndex((item, index) => {
        return getRowKey.value?.(item, index)?.toString() === finlayRowKey?.toString()
      })
      if (rowIndex !== -1)
        return rowIndex
    }
    return finlayRowKey
  }
  useEffect(() => {
    if (!formRef.value || (!props.controlled && (props.name || hasHydratedEditableForm.value)))
      return

    const formValues = (value.value || []).reduce<Record<string, DataType>>(
      (result, current, index) => {
        result[String(getRowKey.value(current, index))] = current
        return result
      },
      {},
    )

    if (Object.keys(formValues).length === 0)
      return

    formRef.value.setFieldsValue(formValues)
    hasHydratedEditableForm.value = true
  }, [() => stringify(value.value), () => props.controlled, () => formRef.value])

  useEffect(() => {
    if (props.name && props?.editable?.form) {
      formRef.value = props?.editable?.form
    }
  }, [() => props.editable?.form, () => props.name])
  /**
   * 防止闭包的onchange
   *
   */
  const handleValuesChange = (record?: DataType, dataSource?: DataType[]) => {
    props.editable?.onValuesChange?.(record, dataSource || [])
    props.onValuesChange?.(dataSource || [], record!)

    // 在受控模式下，当表单值变化时也应该触发 onChange
    // 这样外部可以同步更新 value，实现真正的受控
    if (props.controlled && props?.onChange) {
      props.onChange(dataSource)
    }
    // 非受控模式下，onChange 应该在 onDataSourceChange 中触发
    // 这样可以确保数据已经正确更新
  }
  useEditableTableActionContextProvider(tableRef)

  /**
   * 获取一行数据的
   * @param rowIndex
   */
  const getRowData = (rowIndex: string | number): DataType | undefined => {
    if (rowIndex === undefined) {
      throw new Error('rowIndex is required')
    }
    const finlayRowKey = coverRowKey(rowIndex)
    const rowKeyName = [props.name, finlayRowKey?.toString() ?? '']
      .flat(1)
      .filter(Boolean) as NamePath
    return formRef.value?.getFieldValue(rowKeyName) as DataType
  }
  /**
   * 获取整个 table 的数据
   */
  const getRowsData = (): DataType[] | undefined => {
    const rowKeyName = [props.name].flat(1).filter(Boolean) as NamePath<string | number | boolean>
    if (Array.isArray(rowKeyName) && rowKeyName.length === 0) {
      const rowData = formRef.value?.getFieldsValue()
      if (Array.isArray(rowData))
        return rowData
      return Object.keys(rowData || {}).map((key) => {
        return rowData?.[key]
      })
    }
    return formRef.value?.getFieldValue(rowKeyName) as DataType[]
  }
  /**
   * 设置一行的数据，会将数据进行简单的 merge
   * @param rowIndex
   * @param data
   * @returns void
   */
  const setRowData = (rowIndex: string | number, data: Partial<DataType>): boolean => {
    if (rowIndex === undefined) {
      throw new Error('rowIndex is required')
    }
    const finlayRowKey = coverRowKey(rowIndex)
    const rowKeyName = [props.name, finlayRowKey?.toString() ?? '']
      .flat(1)
      .filter(Boolean) as string[]

    const newRowData = Object.assign(
      {},
      {
        // 只是简单的覆盖，如果很复杂的话，需要自己处理
        ...getRowData(rowIndex),
        ...(data || {}),
      },
    )
    // 在 name 模式下，需要更新整个数组
    if (props.name) {
      const tableName = [props.name].flat(1).filter(Boolean) as NamePath<string | number | boolean>[]
      // 优先从 value prop 获取数据（受控模式），否则从表单值获取
      const currentTableData
        = (props.value as DataType[] | undefined)
          || (formRef.value?.getFieldValue(tableName) as DataType[] | undefined)

      if (Array.isArray(currentTableData)) {
        // 找到要更新的行的索引
        const rowIndexToUpdate
          = typeof finlayRowKey === 'number'
            ? finlayRowKey
            : currentTableData.findIndex((row, index) => {
                const rowKey = getRowKey.value?.(row, index)
                return (
                  rowKey === finlayRowKey
                  || rowKey?.toString() === finlayRowKey?.toString()
                )
              })

        if (
          rowIndexToUpdate >= 0
          && rowIndexToUpdate < currentTableData.length
        ) {
          // 更新数组中的对应行
          const updatedTableData = [...currentTableData]
          updatedTableData[rowIndexToUpdate] = newRowData as DataType

          // 设置整个数组，使用 set 来构建正确的路径
          // 使用与 syncFormValuesExcludingEditing 相同的路径格式（数组路径）
          // 这样可以确保 getFieldValue 能正确获取值
          const updateValues = set({}, tableName as string[], updatedTableData)
          formRef.value?.setFieldsValue(updateValues)

          // 在受控模式下，触发 onChange
          if (props.controlled && props.onChange) {
            props.onChange(updatedTableData)
          }
        }
      }
      else {
        // 如果当前没有数据，直接设置单个字段
        const updateValues = set({}, rowKeyName, newRowData)
        formRef.value?.setFieldsValue(updateValues)
      }
    }
    else {
      const updateValues = set({}, rowKeyName, newRowData)
      formRef.value?.setFieldsValue(updateValues)
    }
    return true
  }

  const { buttonRenderProps } = useCreatorButton<DataType, Params, ValueType>({
    recordCreatorProps: computed(() => props.recordCreatorProps),
    maxLength: computed(() => props.maxLength),
    value,
    intl,
    columnsLength: computed(() => props.columns?.length),
    tableViewRender: props.tableViewRender,
  })
  /**
   * 创建编辑 keys 的 Set，用于快速查找
   */
  const createEditingKeysSet
    = (editingKeys: Key[] | undefined): Set<string> => {
      return new Set((editingKeys || []).map(key => String(key)))
    }
  /**
   * 同步表单值，排除正在编辑的行
   */
  const syncFormValuesExcludingEditing
    = (
      dataSource: readonly DataType[],
      editingKeysSet: Set<string>,
      namePath?: string[],
    ): void => {
      if (!formRef.value)
        return
      try {
        if (namePath && namePath.length > 0) {
          // name 模式：需要保留正在编辑的行
          const currentFormValues = formRef.value.getFieldsValue() || {}
          const currentList = get(currentFormValues, namePath) as
            | DataType[]
            | undefined

          if (currentList && Array.isArray(currentList)) {
            // 构建新的表单值，保留正在编辑的行
            // 使用 Map 优化查找性能，将 O(n²) 降低到 O(n)
            const currentListMap = new Map<string, DataType>()
            currentList.forEach((item, idx) => {
              const key = getRowKey.value(item, idx)
              currentListMap.set(String(key), item)
            })

            const newList = dataSource.map((item, index) => {
              const key = getRowKey.value(item, index)
              const keyStr = String(key)

              // 如果该行正在编辑，保留表单中的值
              if (editingKeysSet.has(keyStr)) {
                return currentListMap.get(keyStr) || item
              }

              return item
            })

            const newValue = set({}, namePath, newList)
            formRef.value.setFieldsValue(newValue)
          }
          else {
            const newValue = set({}, namePath, dataSource)
            formRef.value.setFieldsValue(newValue)
          }
        }
        else {
          // 非 name 模式：直接设置值
          const formValues: Record<string, DataType> = {}
          dataSource.forEach((current, index) => {
            const key = getRowKey.value(current, index)
            const keyStr = String(key)

            if (!editingKeysSet.has(keyStr)) {
              formValues[keyStr] = current
            }
          })

          if (Object.keys(formValues).length > 0) {
            formRef.value.setFieldsValue(formValues)
          }
        }
      }
      catch (error) {
        console.warn('Failed to sync form values:', error)
      }
    }
  expose({
    ...useProTableInstanceExpose(tableRef),
    get nativeElement() {
      return tableRef.value?.nativeElement
    },
    get pageInfo() {
      return tableRef.value?.pageInfo
    },
    get formRef() {
      return tableRef.value?.formRef?.nativeElement ? tableRef.value?.formRef : null
    },
    get editableFormRef() {
      return formRef.value
    },
    getRowData,
    getRowsData,
    setRowData,
  })
  return () => {
    const {
      onTableChange,
      maxLength,
      formItemProps,
      recordCreatorProps,
      rowKey,
      controlled,
      defaultValue,
      onChange,
      onDataSourceChange,
      ...rest
    } = props
    const editableProps = props.name
      ? { ...props.editable, form: tableRef.value?.formRef }
      : {
          ...props.editable,
        }

    if (
      props?.onValuesChange
      || props.editable?.onValuesChange
      // 受控模式需要触发 onchange
      || (props.controlled && props?.onChange)
    ) {
      editableProps.onValuesChange = handleValuesChange
    }

    return (
      <>
        <ProTable
          ref={tableRef}
          {...rest}
          {...booleanProps}
          search={rest.search || false}
          options={rest.options || false}
          pagination={rest.pagination || false}
          rowKey={rowKey}
          scroll={
            props.scroll || {
              x: 'max-content',
            }
          }
          revalidateOnFocus={rest.revalidateOnFocus || false}
          tableLayout={props.tableLayout || 'fixed'}
          {...buttonRenderProps.value}
          editable={{
            ...editableProps,
            formProps: {
              formRef,
              ...editableProps.formProps,
            },
          } as RowEditableConfig<DataType>}
          dataSource={value.value}
          onDataSourceChange={(dataSource: DataType[]) => {
            // setValue 会触发 onChange，但我们需要确保数据已经正确更新
            // 所以先设置数据，然后手动触发 onChange
            setValue(dataSource)
            /**
             * 如果是 name 模式，需要同步表单值
             * 避免表单值和数据源不一致
             * 注意：不会覆盖正在编辑的行
             */
            if (props.name && formRef.value) {
              const editingKeys = props.editable?.editableKeys
              const editingKeysSet = createEditingKeysSet(editingKeys)
              const namePath = [props.name].flat(1).filter(Boolean)
              syncFormValuesExcludingEditing(
                dataSource,
                editingKeysSet,
                namePath as string[],
              )
            }
            // 在非受控模式下，通过 onDataSourceChange 触发 onChange
            // 这样可以确保数据已经正确更新
            if (!props.controlled && props.onChange) {
              props.onChange(dataSource)
            }
          }}
          v-slots={slots}
        />
        {/* 模拟 onValuesChange */}
        {props.name ? (
          <ProFormDependency
            name={[props.name!]}
            v-slots={{
              default: (changeValue: Record<string, any>) => {
                if (!preData.value) {
                  preData.value = value.value
                  return null
                }

                const namePath = [props.name].flat(1) as string[]
                const list = get(changeValue, namePath) as DataType[] | undefined

                // 添加空值检查，避免后续操作出错
                if (!list || !Array.isArray(list)) {
                  preData.value = value.value
                  return null
                }

                // 在更新 preData 之前找到变化的项
                // 使用 findIndex 可以同时获取变化的项和索引
                const changeIndex = list.findIndex((item, index) => {
                  return !isEqual(item, preData.value?.[index])
                })

                // 只有在找到变化项时才触发回调
                if (changeIndex !== -1) {
                  const changeItem = list[changeIndex]
                  props?.editable?.onValuesChange?.(changeItem, list)
                }

                // 在找到 changeItem 之后再更新 preData，确保后续比较正确
                preData.value = list

                return null
              },
            }}
          />
        ) : null}
      </>
    )
  }
}, {
  name: 'InternalEditableTable',
  inheritAttrs: false,
  props: ['beforeSearchSubmit', 'bodyCell', 'bordered', 'caption', 'cardBordered', 'cardProps', 'childrenColumnName', 'classes', 'columnEmptyText', 'columns', 'columnsState', 'components', 'controlled', 'dataSource', 'dateFormatter', 'debounceTime', 'defaultData', 'defaultExpandAllRows', 'defaultExpandedRowKeys', 'defaultSize', 'defaultValue', 'direction', 'dropdownPrefixCls', 'editable', 'errorBoundaryRender', 'expandIcon', 'expandIconColumnIndex', 'expandRowByClick', 'expandable', 'expandedRowClassName', 'expandedRowKeys', 'expandedRowRender', 'footer', 'form', 'formItemProps', 'getContainerWidth', 'getPopupContainer', 'ghost', 'headerCell', 'headerTitle', 'id', 'indentSize', 'loading', 'locale', 'manualRequest', 'maxLength', 'measureRowRender', 'name', 'onChange', 'onDataSourceChange', 'onExpand', 'onExpandedRowsChange', 'onHeaderRow', 'onLoad', 'onLoadingChange', 'onRequestError', 'onReset', 'onRow', 'onSizeChange', 'onSubmit', 'onTableChange', 'onValuesChange', 'options', 'optionsRender', 'pagination', 'params', 'polling', 'postData', 'prefixCls', 'recordCreatorProps', 'request', 'revalidateOnFocus', 'rootClass', 'rowClassName', 'rowHoverable', 'rowKey', 'rowSelection', 'scroll', 'search', 'searchFormRender', 'showHeader', 'showSorterTooltip', 'size', 'sortDirections', 'sticky', 'styles', 'summary', 'tableAlertOptionRender', 'tableAlertRender', 'tableClass', 'tableExtraRender', 'tableLayout', 'tableRender', 'tableStyle', 'tableViewRender', 'tailor', 'title', 'toolBarRender', 'toolbar', 'tooltip', 'type', 'value', 'virtual'],
})

export default InternalEditableProTable
