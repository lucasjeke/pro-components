import type { AnyObject } from 'antdv-next/dist/_util/type'
import type { GetRowKey } from 'antdv-next/dist/table/interface'
import type { ComputedRef, Ref, ShallowRef, VNode } from 'vue'
import type { Key, VueNode } from '../typing'
import type {
  ActionRenderConfig,
  AddLineOptions,
  NewLineConfig,
  RecordKey,
  RowEditableConfig,
  SaveEditableActionRef,
} from './typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { get, useMergedState } from '@v-c/util'
import { noteOnce } from '@v-c/util/dist/warning'
import { message } from 'antdv-next'
import useLazyKVMap from 'antdv-next/dist/table/hooks/useLazyKVMap'
import { computed, shallowRef } from 'vue'
import { useDebounceFn } from '../hooks/useDebounceFn'
import { useEffect } from '../hooks/useEffect'
import { usePrevious } from '../usePrevious'
import CancelEditableAction, { normalizeNamePath, recordKeyToString } from './components/CancelEditableAction'
import DeleteEditableAction from './components/DeleteEditableAction'
import SaveEditableAction from './components/SaveEditableAction'

/**
 * 扁平化记录树结构为 Map
 */
function flattenRecordsToMap<RecordType>(
  records: RecordType[],
  getRowKey: GetRowKey<RecordType>,
  childrenColumnName: string,
  parentKey?: Key,
  parentIndex?: number,
): Map<
  string,
  RecordType & { map_row_key?: string, map_row_parentKey?: Key }
> {
  const kvMap = new Map<
    string,
    RecordType & { map_row_key?: string, map_row_parentKey?: Key }
  >()

  records.forEach((record, index) => {
    const eachIndex = (parentIndex || 0) * 10 + index
    const recordKey = getRowKey(record, eachIndex).toString()

    const hasChildren
      = record && typeof record === 'object' && childrenColumnName in record

    if (hasChildren) {
      const children = (record as any)[childrenColumnName] || []
      const childrenMap = flattenRecordsToMap(
        children,
        getRowKey,
        childrenColumnName,
        recordKey,
        eachIndex,
      )
      childrenMap.forEach((value, key) => kvMap.set(key, value))
    }

    const newRecord = {
      ...record,
      map_row_key: recordKey,
      map_row_parentKey: parentKey,
    }
    delete (newRecord as any).children
    if (!parentKey) {
      delete newRecord.map_row_parentKey
    }
    kvMap.set(recordKey, newRecord)
  })

  return kvMap
}

/**
 * 重建树结构
 */
function rebuildTreeStructure<RecordType>(
  map: Map<
    string,
    RecordType & { map_row_parentKey?: Key, map_row_key?: string }
  >,
  childrenColumnName: string,
  action: 'update' | 'top' | 'delete',
): RecordType[] {
  const childrenMap = new Map<string, RecordType[]>()
  const result: RecordType[] = []

  const addNewRecordToChildren = (fillChildren: boolean) => {
    map.forEach((value) => {
      if (value.map_row_parentKey != null && !value.map_row_key) {
        const { map_row_parentKey, ...rest } = value
        const parentKeyStr = String(map_row_parentKey)
        if (!childrenMap.has(parentKeyStr)) {
          childrenMap.set(parentKeyStr, [])
        }
        if (fillChildren) {
          childrenMap.get(parentKeyStr)?.push(rest as unknown as RecordType)
        }
      }
    })
  }

  addNewRecordToChildren(action === 'top')

  // 第一步：将所有有 parentKey 的节点添加到 childrenMap
  // 这一步不获取 children，只是添加节点到对应的父节点下
  map.forEach((value) => {
    if (value.map_row_parentKey != null && value.map_row_key) {
      const { map_row_parentKey, map_row_key, isNewRecord, ...rest }
        = value as any
      const record = { ...rest, map_row_key } as any
      // 确保 parentKey 的类型转换与 flattenRecordsToMap 中的 recordKey 一致
      // 在 flattenRecordsToMap 中，recordKey 被转换为字符串：getRowKey(record, eachIndex).toString()
      // 所以这里也需要确保 parentKey 被转换为字符串，并且类型一致
      const parentKeyStr
        = map_row_parentKey != null ? String(map_row_parentKey) : null

      if (!parentKeyStr) {
        return
      }

      if (!childrenMap.has(parentKeyStr)) {
        childrenMap.set(parentKeyStr, [])
      }

      // 如果是新记录且 action 为 'top'，添加到数组开头；否则添加到末尾
      if (isNewRecord && action === 'top') {
        childrenMap.get(parentKeyStr)?.unshift(record as RecordType)
      }
      else {
        childrenMap.get(parentKeyStr)?.push(record as RecordType)
      }
    }
  })

  // 第二步：为所有节点获取 children
  // 这一步确保所有子节点都已经被添加到 childrenMap，所以可以正确获取 children
  map.forEach((value) => {
    if (value.map_row_parentKey != null && value.map_row_key) {
      const { map_row_parentKey, map_row_key } = value as any
      const parentKeyStr
        = map_row_parentKey != null ? String(map_row_parentKey) : null

      if (!parentKeyStr) {
        return
      }

      const children = childrenMap.get(parentKeyStr)
      if (children && children.length > 0) {
        // 找到对应的 record 并添加 children
        const recordIndex = children.findIndex((r: any) => {
          // 比较时需要确保类型一致
          const recordKey = (r as any).map_row_key || (r as any).id
          return String(recordKey) === String(map_row_key)
        })

        if (recordIndex >= 0 && childrenMap.has(map_row_key)) {
          children[recordIndex] = {
            ...children[recordIndex],
            [childrenColumnName]: childrenMap.get(map_row_key),
          } as RecordType
        }
      }
    }
  })

  addNewRecordToChildren(action === 'update')

  map.forEach((value) => {
    if (!value.map_row_parentKey) {
      const { map_row_key, ...rest } = value
      const record
        = map_row_key && childrenMap.has(map_row_key)
          ? { ...rest, [childrenColumnName]: childrenMap.get(map_row_key) }
          : rest
      result.push(record as RecordType)
    }
  })

  return result
}

/**
 * 使用map 来删除数据，性能一般 但是准确率比较高
 *
 */
export function editableRowByKey<RecordType>(
  keyProps: {
    data?: RecordType[]
    childrenColumnName?: string
    getRowKey?: GetRowKey<RecordType>
    key?: RecordKey
    row?: RecordType
  },
  action: 'update' | 'top' | 'delete',
) {
  const { getRowKey, row, data, childrenColumnName = 'children' } = keyProps
  const key = recordKeyToString(keyProps.key)?.toString()

  const kvMap = flattenRecordsToMap(data!, getRowKey!, childrenColumnName)

  if (action === 'delete') {
    kvMap.delete(key!)
  }
  else if (action === 'top' || action === 'update') {
    const existingRecord = kvMap.get(key!)
    if (existingRecord) {
      kvMap.set(key!, {
        ...existingRecord,
        ...row,
      } as any)
    }
    else {
      // 如果记录不存在，创建一个新记录（用于新增场景）
      // 保留 map_row_parentKey 以便正确处理嵌套子节点
      // 添加标记以便在 rebuildTreeStructure 中识别新记录
      kvMap.set(key!, {
        ...row,
        map_row_key: key,
        map_row_parentKey: (row as any).map_row_parentKey,
        isNewRecord: true,
      } as any)
    }
  }

  return rebuildTreeStructure(kvMap, childrenColumnName, action)
}

export function defaultActionRender<T extends Record<string, any>>(row: T, config: ActionRenderConfig<T, NewLineConfig<T>>) {
  const { recordKey, newLineConfig, saveText, cancelText, deleteText } = config
  const saveRef = shallowRef<SaveEditableActionRef<T>>()
  return {
    save: (
      <SaveEditableAction key={`save${recordKey}`} {...config} row={row} ref={saveRef}>
        {saveText}
      </SaveEditableAction>
    ),
    delete:
      newLineConfig?.options.recordKey !== recordKey && deleteText
        ? (
            <DeleteEditableAction key={`delete${recordKey}`} {...config} row={row}>
              {deleteText}
            </DeleteEditableAction>
          )
        : undefined,
    cancel: (
      <CancelEditableAction key={`cancel${recordKey}`} {...config} row={row}>
        {cancelText}
      </CancelEditableAction>
    ),
    saveRef,
  }
}

/**
 * 一个方便的hooks 用于维护编辑的状态
 *
 * @param props
 */
//
export function useEditableArray<RecordType extends AnyObject>(props:
  Omit<RowEditableConfig<RecordType>, 'editableKeys' | 'type'> & {
    type?: ComputedRef<RowEditableConfig<RecordType>['type']>
    editableKeys: ComputedRef<RowEditableConfig<RecordType>['editableKeys']>
    getRowKey: ComputedRef<GetRowKey<RecordType>>
    dataSource: ComputedRef<RecordType[]>
    onValuesChange?: (record: RecordType, dataSource: RecordType[]) => void
    childrenColumnName?: ComputedRef<string | undefined>
    setDataSource: (dataSource: RecordType[]) => void
  }): UseEditableUtilType<RecordType> {
  // Internationalization
  const intl = useIntl()
  const [messageApi, ContextHolder] = message.useMessage()
  /**
   * 点击开始编辑之前的保存数据用的
   */
  const preEditRow = shallowRef<RecordType | null>(null)
  const preEditRows = shallowRef<Map<string, RecordType | null>>(new Map())
  const newLineRecordCache = shallowRef<NewLineConfig<RecordType> | undefined>(undefined)
  const dataSourceFormKeyMapRef = shallowRef<Map<Key, Key>>(new Map())
  const getBusinessRowKey: GetRowKey<RecordType> = record => props.getRowKey.value(record, -1)
  /**
   * 构建数据源 key 索引映射表
   */
  const buildDataSourceKeyIndexMap = () => {
    const map = new Map<Key, Key>()
    const formKeyMap = new Map<Key, Key>()
    // 存在children时会覆盖Map的key,导致使用数组索引查找key错误
    const loopGetKey = (dataSource: RecordType[], parentKey?: string) => {
      dataSource?.forEach((record, index) => {
        const indexKey
          = parentKey == null ? index.toString() : `${parentKey}_${index}`
        const recordKey = recordKeyToString(props.getRowKey.value(record, -1))
        // 如果 recordKey 是 undefined 或 null，跳过
        if (recordKey == null) {
          return
        }
        map.set(indexKey, recordKey)
        map.set(recordKey.toString(), indexKey)
        formKeyMap.set(recordKey.toString(), indexKey)

        const children
          = props.childrenColumnName?.value
            && record?.[props.childrenColumnName.value]
        if (children) {
          loopGetKey(children, indexKey)
        }
      })
    }
    loopGetKey(props.dataSource.value)
    dataSourceFormKeyMapRef.value = formKeyMap
    return map
  }
  const initDataSourceKeyIndexMap = computed(() => buildDataSourceKeyIndexMap())
  const dataSourceKeyIndexMapRef = shallowRef<Map<Key, Key>>(initDataSourceKeyIndexMap.value)
  const resolveFormRecordKey = (recordKey: RecordKey, fallbackIndex?: number): RecordKey => {
    if (!props.tableName?.value)
      return recordKey

    const normalizedRecordKey = recordKeyToString(recordKey)
    if (fallbackIndex != null)
      return fallbackIndex

    const cachedFormRecordKey = dataSourceFormKeyMapRef.value.get(normalizedRecordKey!)
    if (cachedFormRecordKey != null)
      return cachedFormRecordKey

    const latestKeyIndexMap = buildDataSourceKeyIndexMap()
    dataSourceKeyIndexMapRef.value = latestKeyIndexMap
    return dataSourceFormKeyMapRef.value.get(normalizedRecordKey!) ?? recordKey
  }
  const newLineRecordRef = shallowRef<NewLineConfig<RecordType> | undefined>(undefined)
  useEffect(() => {
    dataSourceKeyIndexMapRef.value = buildDataSourceKeyIndexMap()
  }, [() => props.dataSource.value])
  useEffect(() => {
    // 这里这么做是为了存上次的状态，不然每次存一下再拿
    newLineRecordRef.value = newLineRecordCache.value
  }, [() => newLineRecordCache.value])
  const editableType = computed(() => props.type?.value || 'single')
  const [getRecordByKey] = useLazyKVMap(
    props.dataSource,
    'children',
    props.getRowKey,
  )
  const [editableKeys, setEditableRowKeys] = useMergedState([], {
    value: computed(() => props.editableKeys.value),
    onChange: props.onChange
      ? (keys) => {
          props?.onChange?.(
            // 计算编辑的key
            keys?.filter(key => key !== undefined) ?? [],
            // 计算编辑的行
            keys?.map(key => getRecordByKey?.(key)).filter(key => key !== undefined) ?? [],
          )
        }
      : undefined,
  })
  const editableKeysRef = usePrevious(editableKeys)
  /**
   * 检查 key 是否在编辑列表中
   */
  const checkKeyInEditableList = (key: string, keysList: string[]): boolean => keysList.includes(key)

  /** 这行是不是编辑状态 */
  const isEditable = (row: RecordType & { index: number }) => {
    const { getRowKey } = props
    // // 为了兼容一下name 模式的 indexKey，所以需要判断两次，一次是index，一次是没有 Slider.tsx 的
    const recordKeyWithIndex = getRowKey.value(row, row.index)?.toString?.()
    const recordKey = getRowKey.value(row, -1)?.toString?.()
    // 都转化为了字符串，不然 number 和 string
    const stringEditableKeys = editableKeys.value?.map(key => key?.toString())
    const stringEditableKeysRef = editableKeysRef.value?.map(key => key?.toString()) || []
    const preIsEditable
      = checkKeyInEditableList(recordKey, stringEditableKeysRef)
        || checkKeyInEditableList(recordKeyWithIndex, stringEditableKeysRef)
    return {
      recordKey,
      isEditable:
        checkKeyInEditableList(recordKey, stringEditableKeys!)
        || checkKeyInEditableList(recordKeyWithIndex, stringEditableKeys!),
      preIsEditable,
    }
  }
  /**
   * 验证是否可以开始编辑
   */
  const validateCanStartEdit = () => {
    const hasEditableKeys = editableKeys.value && editableKeys.value.length > 0
    if (
      hasEditableKeys
      && editableType.value === 'single'
      && props.onlyOneLineEditorAlertMessage !== false
    ) {
      messageApi.warning(
        props.onlyOneLineEditorAlertMessage
        || intl.value.getMessage(
          {
            id: 'editableTable.onlyOneLineEditor',
            defaultMessage: '只能同时编辑一行',
          },
        ),
      )
      return false
    }
    return true
  }
  /**
   * 查找记录
   */
  const findRecordByKey = (recordKey: Key): RecordType | null => {
    const normalizedRecordKey = recordKeyToString(recordKey)?.toString()
    return (
      props.dataSource.value?.find((recordData) => {
        return recordKeyToString(getBusinessRowKey(recordData))?.toString()
          === normalizedRecordKey
      }) ?? null
    )
  }

  /**
   * 进入编辑状态
   *
   * @param recordKey
   * @param record
   */
  const startEditable = async (recordKey: Key, record?: RecordType) => {
    if (!validateCanStartEdit()) {
      return false
    }
    const isAlreadyEditable = editableKeys.value?.some(
      key => key === recordKey || key?.toString() === recordKey?.toString(),
    )

    if (!isAlreadyEditable) {
      const newKeys = editableKeys.value
        ? [...(editableKeys.value || []), recordKey]
        : [recordKey]
      setEditableRowKeys(newKeys)
    }
    preEditRow.value = record ?? findRecordByKey(recordKey) ?? null
    const recordKeyStr = recordKeyToString(recordKey)?.toString()
    if (recordKeyStr) {
      preEditRows.value.set(recordKeyStr, preEditRow.value)
    }
    return true
  }

  /**
   * 清理编辑状态
   */
  const clearEditableState = (recordKey: RecordKey) => {
    const relayKey = recordKeyToString(recordKey)
    const relayKeyStr = relayKey != null ? relayKey.toString() : null
    if (relayKeyStr == null) {
      return
    }
    const newKeys
      = editableKeys.value?.filter(
        key => key?.toString() !== relayKeyStr && key !== relayKey,
      ) ?? []
    setEditableRowKeys(newKeys)
  }

  /**
   * 保存或删除完成后仅结束编辑，不执行取消回调，也不恢复编辑前数据。
   */
  const finishEditable = async (recordKey: RecordKey) => {
    const recordKeyStr = recordKeyToString(recordKey)?.toString()
    const cacheRecordKey = newLineRecordCache.value?.options.recordKey
    const cacheRecordKeyStr = recordKeyToString(cacheRecordKey)?.toString()

    if (recordKeyStr != null && cacheRecordKeyStr === recordKeyStr) {
      newLineRecordCache.value = undefined
    }
    if (recordKeyStr != null) {
      preEditRows.value.delete(recordKeyStr)
    }
    if (
      preEditRow.value
      && recordKeyToString(props.getRowKey.value(preEditRow.value, -1))?.toString() === recordKeyStr
    ) {
      preEditRow.value = null
    }
    clearEditableState(recordKey)
    return true
  }

  /**
   * 退出编辑状态
   *
   * @param recordKey
   * @param needReTry
   */
  const cancelEditable = async (recordKey: RecordKey, needReTry?: boolean) => {
    const relayKey = recordKeyToString(recordKey)
    const relayKeyStr = relayKey != null ? relayKey.toString() : null
    const mappedKey
      = relayKeyStr != null
        ? dataSourceKeyIndexMapRef.value.get(relayKeyStr)
        : undefined
    const isInEditableSet = editableKeys.value?.some((key) => {
      if (relayKeyStr == null)
        return false
      return key?.toString() === relayKeyStr || key === relayKey
    })

    if (
      !isInEditableSet
      && mappedKey
      && (needReTry ?? true)
      && props.tableName?.value
    ) {
      return await cancelEditable(mappedKey, false)
    }

    // 如果提供了 onCancel，尝试调用它（用于测试场景）
    // 注意：在实际使用中，onCancel 应该在 CancelEditableAction 中被调用
    if (props.onCancel && isInEditableSet) {
      const keyForFind = Array.isArray(recordKey) ? recordKey[0] : recordKey
      const record = findRecordByKey(keyForFind!)
      const originRow = preEditRow.value as RecordType
      // 比较 recordKey 时需要考虑类型转换
      // newLineRecordCache.options.recordKey 是 addEditRecord 时设置的 recordKey
      // 而 recordKey 是 cancelEditable 的参数，需要确保它们匹配
      const cacheRecordKey = newLineRecordCache.value?.options?.recordKey
      const cacheKey
        = cacheRecordKey != null ? recordKeyToString(cacheRecordKey) : null
      const cacheKeyStr = cacheKey != null ? cacheKey.toString() : null
      // 检查 newLineRecordCache 是否匹配当前的 recordKey
      const newLineConfig
        = newLineRecordCache.value != null
          && cacheRecordKey != null
          && (cacheRecordKey === recordKey
            || (cacheKeyStr != null
              && relayKeyStr != null
              && cacheKeyStr === relayKeyStr)
            || cacheRecordKey?.toString() === recordKey?.toString()
            || String(cacheRecordKey) === String(recordKey))
          ? newLineRecordCache.value
          : undefined
      // 调用 onCancel，即使找不到记录（新行编辑场景）
      // 对于新行编辑，record 可能为 null，但 newLineConfig 应该包含 defaultValue
      try {
        await props.onCancel(
          recordKey,
          record || newLineConfig?.defaultValue || {} as RecordType,
          originRow
          || record
          || newLineConfig?.defaultValue
          || {},
          newLineConfig,
        )
      }
      catch (error) {
        // 如果 onCancel 抛出异常，仍然继续清理状态
        console.error('onCancel error:', error)
      }
    }
    // 清理 newLineRecordCache，需要比较 recordKey（考虑类型转换）
    if (newLineRecordCache.value) {
      const cacheRecordKey = newLineRecordCache.value?.options.recordKey
      // 重用之前计算的 relayKeyStr
      const cacheKeyStr
        = cacheRecordKey != null
          ? recordKeyToString(cacheRecordKey)?.toString()
          : null
      if (
        cacheRecordKey === recordKey
        || (cacheKeyStr != null
          && relayKeyStr != null
          && cacheKeyStr === relayKeyStr)
        || cacheRecordKey?.toString() === recordKey?.toString()
        || String(cacheRecordKey) === String(recordKey)
      ) {
        newLineRecordCache.value = undefined
      }
    }

    // 先清理 preEditRowRef 并重置表单字段，然后再清除编辑状态
    // 这样在清除编辑状态前，表单字段已经被清除，表格重新渲染时就不会显示输入框
    const originRow = preEditRow.value
    if (
      originRow
      && props.getRowKey.value(originRow, -1) === recordKey
      && isInEditableSet
    ) {
      try {
        // 尝试通过 formProps.formRef 访问 form
        const formRef = props.formProps?.formRef
        const form = formRef?.value || props.form
        if (form) {
          if (props.tableName?.value) {
            // name 模式：重置为原始值
            const namePath = normalizeNamePath(
              props.tableName.value,
              resolveFormRecordKey(recordKey),
            ) as string[]
            form.setFieldValue(namePath, originRow)
          }
          else {
            // 非 name 模式：清除该行的所有表单字段
            // 在非 name 模式下，表单字段路径是 [recordKey, columnDataIndex]
            // 如 [624748504, 'title']，需要清除所有以 recordKey 开头的字段
            const recordKeyStr = recordKeyToString(recordKey)?.toString()
            if (recordKeyStr) {
              try {
                // 在非 name 模式下，表单字段以嵌套对象的形式存储
                // 比如 { '624748504': { 'title': 'value', 'state': 'value' } }
                // 需要清除整个嵌套对象
                // 先使用 resetFields 清除字段状态
                form.resetFields([[recordKeyStr]])

                // 然后使用 setFieldsValue 清除字段值
                // 这样可以确保字段被完全清除，表格重新渲染时不会显示输入框
                form.setFieldsValue({
                  [recordKeyStr]: undefined,
                })
              }
              catch (error) {
                // 如果清除失败，忽略错误
                console.warn(
                  'Failed to clear form fields in cancelEditable:',
                  error,
                )
              }
            }
          }
        }
      }
      catch (error) {
        // 如果访问 form 失败，忽略错误
        console.warn('Failed to reset form fields in cancelEditable:', error)
      }
      preEditRow.value = null
    }

    // 最后清除编辑状态，这样表格会重新渲染，输入框会消失
    clearEditableState(recordKey)

    return true
  }

  const propsOnValuesChange = useDebounceFn(
    async (...rest: any[]) => {
      (props.onValuesChange as (...rest: any[]) => any)?.(...rest)
    },
    64,
  )

  /**
   * 构建表单字段路径
   */
  const buildFormFieldPath = (recordKey: RecordKey): string[] => {
    return normalizeNamePath(
      props.tableName?.value,
      resolveFormRecordKey(recordKey),
    ) as string[]
  }

  /**
   * 更新数据源中的编辑行
   */
  const updateDataSourceWithEditableRows
    = (dataSource: RecordType[], values: RecordType): RecordType[] => {
      let updatedDataSource = dataSource

      editableKeys.value?.forEach((eachRecordKey) => {
        if (newLineRecordCache.value?.options.recordKey === eachRecordKey) {
          return
        }

        const recordKey = eachRecordKey.toString()
        const fieldPath = buildFormFieldPath(recordKey)
        const editRow = get(values, fieldPath) as RecordType

        if (!editRow) {
          return
        }

        updatedDataSource = editableRowByKey(
          {
            data: updatedDataSource,
            getRowKey: getBusinessRowKey,
            row: editRow,
            key: recordKey,
            childrenColumnName: props.childrenColumnName?.value || 'children',
          },
          'update',
        )
      })
      return updatedDataSource
    }

  /**
   * 获取当前编辑的行数据
   */
  const getCurrentEditRow
    = (
      value: RecordType,
      values: RecordType,
      dataSource: RecordType[],
    ): RecordType => {
      const valueKeys = Object.keys(value || {})
      if (valueKeys.length === 0) {
        return newLineRecordCache.value?.defaultValue || ({} as RecordType)
      }

      const recordKey = valueKeys.pop()?.toString() || ''
      if (!recordKey) {
        return newLineRecordCache.value?.defaultValue || ({} as RecordType)
      }

      const fieldPath = buildFormFieldPath(recordKey)
      const newLineRecordData = {
        ...newLineRecordCache.value?.defaultValue,
        ...get(values, fieldPath),
      }

      const existsInDataSource = dataSourceKeyIndexMapRef.value.has(
        recordKeyToString(recordKey)!,
      )

      if (existsInDataSource) {
        const foundRow = dataSource.find((item, index) => {
          const key = props.getRowKey.value(item, index)?.toString()
          return key === recordKey
        })
        return foundRow || newLineRecordData
      }

      return newLineRecordData
    }

  const onValuesChange = (value: RecordType, values: RecordType) => {
    if (!props.onValuesChange) {
      return
    }
    const updatedDataSource = updateDataSourceWithEditableRows(
      props.dataSource.value,
      values,
    )
    const editRow = getCurrentEditRow(value, values, updatedDataSource)

    propsOnValuesChange.run(editRow, updatedDataSource)
  }

  const saveRefsMap = shallowRef<
    Map<Key, ShallowRef<SaveEditableActionRef<RecordType> | undefined>>
  >(new Map<Key, ShallowRef<SaveEditableActionRef<RecordType> | undefined>>())

  /** 一个用来标志的set 提供了方便的 api 来去重什么的 */
  useEffect(() => {
    const editableKeysSet = new Set(
      editableKeys.value?.map(key => key?.toString()) ?? [],
    )
    // 确保只保留编辑状态的，其它的都删除掉
    saveRefsMap.value.forEach((_, key) => {
      if (!editableKeysSet.has(key?.toString())) {
        saveRefsMap.value.delete(key)
      }
    })
  }, [editableKeys])

  /**
   * 获取保存引用
   */
  const getSaveRef = (recordKey: RecordKey) => {
    const relayKey = recordKeyToString(recordKey)
    return (
      saveRefsMap.value.get(relayKey!)
      || saveRefsMap.value.get(relayKey!.toString())
    )
  }

  /**
   * 保存编辑行
   *
   * @param recordKey
   * @param needReTry
   */
  const saveEditable = async (recordKey: RecordKey, needReTry?: boolean): Promise<boolean> => {
    const relayKey = recordKeyToString(recordKey)
    const relayKeyStr = relayKey?.toString()
    const mappedKey = dataSourceKeyIndexMapRef.value.get(relayKeyStr!)

    const isInEditableSet = editableKeys.value?.some(
      key => key?.toString() === relayKeyStr || key === relayKey,
    )

    if (
      !isInEditableSet
      && mappedKey
      && (needReTry ?? true)
      && props.tableName?.value
    ) {
      return await saveEditable(mappedKey, false)
    }

    const saveRef = getSaveRef(recordKey)
    if (!saveRef?.value) {
      return false
    }
    await saveRef.value.save()
    clearEditableState(recordKey)
    return true
  }

  /**
   * 验证是否可以新增记录
   */
  const validateCanAddRecord
    = (options?: AddLineOptions): boolean => {
      if (
        options?.parentKey
        && !dataSourceKeyIndexMapRef.value.has(
          recordKeyToString(typeof options?.parentKey === 'function' ? options?.parentKey() : options?.parentKey)!.toString(),
        )
      ) {
        console.warn('can\'t find record by key', options?.parentKey)
        return false
      }

      if (
        newLineRecordRef.value
        && props.onlyAddOneLineAlertMessage !== false
      ) {
        messageApi.warning(
          props.onlyAddOneLineAlertMessage
          || intl.value.getMessage({ id: 'editableTable.onlyAddOneLine', defaultMessage: '只能新增一行' }),
        )
        return false
      }

      if (!validateCanStartEdit()) {
        return false
      }

      return true
    }

  /**
   * 验证记录 key 是否有效
   */
  const validateRecordKey = (recordKey: Key): void => {
    if (recordKey == null && recordKey !== 0 && recordKey !== '') {
      noteOnce(
        false,
        '请设置 recordCreatorProps.record 并返回一个唯一的key  \n  https://procomponents.ant.design/components/editable-table#editable-%E6%96%B0%E5%BB%BA%E8%A1%8C',
      )
      throw new Error('请设置 recordCreatorProps.record 并返回一个唯一的key')
    }
  }

  /*
    * 同时只能支持一行,取消之后数据消息，不会触发 dataSource
   *
   * @param row
   * @param options
   * @name addEditRecord 增加新的行
   */
  const addEditRecord = async (row: RecordType, options?: AddLineOptions) => {
    if (!validateCanAddRecord(options)) {
      return false
    }
    const recordKey = props.getRowKey.value(row, -1)
    validateRecordKey(recordKey)
    const recordKeyStr = recordKeyToString(recordKey)?.toString()
    if (recordKeyStr) {
      // 新建行：用 null 作为快照标记，避免多行编辑取消时误删其他行
      preEditRows.value.set(recordKeyStr, null)
    }

    const isAlreadyEditable = editableKeys.value?.some(
      key => key === recordKey || key?.toString() === recordKey?.toString(),
    )
    if (!isAlreadyEditable) {
      const newKeys = editableKeys.value
        ? [...editableKeys.value, recordKey]
        : [recordKey]
      setEditableRowKeys(newKeys)
    }

    // 处理 parentKey：如果是函数，调用它
    const parentKeyValue
      = typeof options?.parentKey === 'function'
        ? options.parentKey()
        : options?.parentKey

    const isDataSourceMode
      = options?.newRecordType === 'dataSource'
        || (props.tableName?.value && options?.newRecordType !== 'cache')
    if (isDataSourceMode) {
      const actionProps = {
        data: props.dataSource.value,
        getRowKey: getBusinessRowKey,
        row: {
          ...row,
          map_row_parentKey: parentKeyValue
            ? recordKeyToString(parentKeyValue)?.toString()
            : undefined,
        },
        key: recordKey,
        childrenColumnName: props.childrenColumnName?.value || 'children',
      }
      props.setDataSource(
        editableRowByKey(
          actionProps,
          options?.position === 'top' ? 'top' : 'update',
        ),
      )
    }
    else {
      newLineRecordCache.value = {
        defaultValue: row,
        options: {
          ...options,
          parentKey: parentKeyValue,
          recordKey,
        },
      }
    }
    return true
  }

  const saveText
    = props?.saveText
      || intl.value.getMessage({ id: 'editableTable.action.save', defaultMessage: '保存' })
  const deleteText
    = props?.deleteText
      || intl.value.getMessage({ id: 'editableTable.action.delete', defaultMessage: '删除' })
  const cancelText
    = props?.cancelText
      || intl.value.getMessage({ id: 'editableTable.action.cancel', defaultMessage: '取消' })

  const actionSave = async (
    recordKey: RecordKey,
    editRow: RecordType & {
      index?: number
    },
    originRow: RecordType & {
      index?: number
    },
    newLine?: NewLineConfig<RecordType>,
  ) => {
    const res = await props?.onSave?.(recordKey, editRow, originRow, newLine)
    // 如果 onSave 返回 false，阻止保存：不更新 dataSource，不触发 onChange
    if (res === false) {
      return res
    }

    const { options } = newLine || newLineRecordRef.value || {}
    const isNewLine = !options?.parentKey && options?.recordKey === recordKey

    if (isNewLine) {
      if (options?.position === 'top') {
        props.setDataSource([editRow, ...props.dataSource.value])
      }
      else {
        props.setDataSource([...props.dataSource.value, editRow])
      }
    }
    else {
      const actionProps = {
        data: props.dataSource.value,
        getRowKey: getBusinessRowKey,
        row: options
          ? {
              ...editRow,
              map_row_parentKey: recordKeyToString(
                (typeof options?.parentKey === 'function' ? options.parentKey() : options?.parentKey) || '',
              )?.toString(),
            }
          : editRow,
        key: recordKey,
        childrenColumnName: props.childrenColumnName?.value || 'children',
      }
      props.setDataSource(
        editableRowByKey(
          actionProps,
          options?.position === 'top' ? 'top' : 'update',
        ),
      )
    }
    await finishEditable(recordKey)
    return res
  }

  const actionDelete = async (
    recordKey: RecordKey,
    editRow: RecordType & {
      index?: number
    },
  ) => {
    const actionProps = {
      data: props.dataSource.value,
      getRowKey: getBusinessRowKey,
      row: editRow,
      key: recordKey,
      childrenColumnName: props.childrenColumnName?.value || 'children',
    }
    const res = await props?.onDelete?.(recordKey, editRow)
    // 如果 onDelete 返回 false，阻止删除操作
    if (res === false) {
      return false
    }
    await finishEditable(recordKey)
    props.setDataSource(editableRowByKey(actionProps, 'delete'))
    return res
  }

  const actionCancel = async (
    recordKey: RecordKey,
    editRow: RecordType & { index?: number },
    originRow: RecordType & { index?: number },
    newLine?: NewLineConfig<RecordType>,
  ) => await props?.onCancel?.(recordKey, editRow, originRow, newLine)

  // 如果传入了自定义的actionRender，使用useRefFunction以确保内部的事件处理函数可以访问最新的state
  const existCustomActionRender
    = props.actionRender && typeof props.actionRender === 'function'

  const customActionRender = existCustomActionRender ? props.actionRender : () => {}
  const actionRender = (row: RecordType & { index: number }) => {
    const key = props.getRowKey.value(row, -1)
    const config: ActionRenderConfig<any, NewLineConfig<any>> = {
      saveText,
      cancelText,
      deleteText,
      addEditRecord,
      recordKey: key,
      formRecordKey: resolveFormRecordKey(key, row.index),
      cancelEditable,
      finishEditable,
      index: row.index,
      tableName: props.tableName?.value,
      newLineConfig: newLineRecordCache.value,
      onCancel: actionCancel,
      onDelete: actionDelete,
      onSave: actionSave,
      editableKeys: editableKeys.value,
      setEditableRowKeys,
      preEditRow: preEditRow.value,
      'onUpdate:preEditRow': _preEditRow => (preEditRow.value = _preEditRow),
      preEditRows: preEditRows.value,
      deletePopconfirmMessage:
        props.deletePopconfirmMessage
        || `${intl.value.getMessage({ id: 'deleteThisLine', defaultMessage: '删除此项' })}?`,
    }

    const renderResult = defaultActionRender<RecordType>(row, config)
    // 缓存一下saveRef
    if (props.tableName?.value) {
      saveRefsMap.value.set(
        dataSourceKeyIndexMapRef.value.get(recordKeyToString(key)!) || recordKeyToString(key)!,
        renderResult.saveRef,
      )
    }
    else {
      saveRefsMap.value.set(recordKeyToString(key)!, renderResult.saveRef)
    }
    if (existCustomActionRender) {
      return customActionRender?.(row, config, {
        save: renderResult.save,
        delete: renderResult.delete,
        cancel: renderResult.cancel,
      })
    }
    return [renderResult.save, renderResult.delete, renderResult.cancel]
  }
  return {
    messageContextHolder: ContextHolder,
    editableKeys,
    setEditableRowKeys,
    isEditable,
    actionRender,
    startEditable,
    cancelEditable,
    addEditRecord,
    saveEditable,
    newLineRecord: newLineRecordCache,
    preEditableKeys: editableKeysRef,
    onValuesChange,
    getRealIndex: props.getRealIndex,
  }
}

export type UseEditableType = typeof useEditableArray
export interface UseEditableUtilType<T> {
  messageContextHolder?: () => VNode
  editableKeys?: Ref<Key[] | undefined, Key[] | undefined>
  setEditableRowKeys?: (val: Key[] | undefined) => void
  isEditable?: (row: T & {
    index: number
  }) => {
    recordKey: string
    isEditable: boolean
    preIsEditable: boolean
  }
  actionRender?: (row: T & {
    index: number
  }) => void | VueNode[]
  startEditable?: (recordKey: Key, record?: T) => Promise<boolean>
  cancelEditable?: (recordKey: RecordKey, needReTry?: boolean) => Promise<boolean | undefined>
  addEditRecord?: (row: T, options?: AddLineOptions | undefined) => Promise<boolean>
  saveEditable?: (recordKey: RecordKey, needReTry?: boolean) => Promise<boolean>
  newLineRecord?: ShallowRef<NewLineConfig<T> | undefined>
  preEditableKeys?: Ref<Key[] | undefined>
  onValuesChange?: (value: T, values: T) => void
  getRealIndex: ((record: T) => number) | undefined
}
export * from './typing'
export { recordKeyToString }
