import type { AnyObject } from 'antdv-next/dist/_util/type'
import type { ComputedRef, Ref } from 'vue'
import type { Key } from '../typing'
import type {
  ActionRenderConfig,
  ActionTypeText,
  NewLineConfig,
  RecordKey,
  RowEditableConfig,
} from '../useEditableArray'
import { useIntl } from '@antdv-next1/pro-provider'
import { get, useMergedState } from '@v-c/util'
import { message } from 'antdv-next'
import { computed, shallowRef } from 'vue'
import { useMemo } from '../hooks'
import {
  defaultActionRender,
  recordKeyToString,
} from '../useEditableArray'

/**
 * 使用map 来删除数据，性能一般 但是准确率比较高
 *
 */
function editableRowByKey<RecordType>({
  data,
  row,
}: {
  data: RecordType
  row: RecordType
}) {
  return { ...data, ...row }
}

/**
 * 一个方便的hooks 用于维护编辑的状态
 *
 * @param props
 */
export function useEditableMap<RecordType extends AnyObject>(
  props: Omit<RowEditableConfig<RecordType>, 'editableKeys' | 'type'> & {
    type?: ComputedRef<RowEditableConfig<RecordType>['type']>
    editableKeys: ComputedRef<RowEditableConfig<RecordType>['editableKeys']>
    dataSource?: Ref<RecordType | undefined>
    childrenColumnName?: string
    setDataSource: (dataSource?: RecordType) => void
  },
) {
  /**
   * 点击开始编辑之前的保存数据用的
   */
  const preEditRow = shallowRef<RecordType | null>(null)

  const editableType = computed(() => props.type?.value || 'single')

  // Internationalization
  const intl = useIntl()
  const [messageApi, ContextHolder] = message.useMessage()

  const [editableKeys, setEditableRowKeys] = useMergedState<Key[]>([], {
    value: computed(() => props.editableKeys.value!),
    onChange: props.onChange
      ? (keys) => {
          props?.onChange?.(
            // 计算编辑的key
            keys,
            props.dataSource?.value,
          )
        }
      : undefined,
  })
  /** 一个用来标志的set 提供了方便的 api 来去重什么的 */
  const editableKeysSet = useMemo(() => {
    const keys
      = editableType.value === 'single' ? editableKeys.value?.slice(0, 1) : editableKeys.value
    return new Set(keys)
  }, [() => (editableKeys.value || []).join(','), () => editableType.value])

  /** 这行是不是编辑状态 */
  const isEditable = (recordKey: RecordKey) => {
    if (editableKeys.value?.includes(recordKeyToString(recordKey)!))
      return true
    return false
  }

  /**
   * 进入编辑状态
   *
   * @param recordKey
   */
  const startEditable = (recordKey: RecordKey, recordValue?: any) => {
    // 如果是单行的话，不允许多行编辑
    if (editableKeysSet.value.size > 0 && editableType.value === 'single') {
      messageApi.warning(
        props.onlyOneLineEditorAlertMessage
        || intl.value.getMessage(
          { id: 'editableTable.onlyOneLineEditor', defaultMessage: '只能同时编辑一行' },
        ),
      )
      return false
    }
    preEditRow.value
      = recordValue
        ?? get(
          props.dataSource?.value,
          Array.isArray(recordKey)
            ? (recordKey as string[])
            : [recordKey as string],
        )
        ?? null
    editableKeysSet.value.add(recordKeyToString(recordKey)!)
    setEditableRowKeys(Array.from(editableKeysSet.value))
    return true
  }

  /**
   * 退出编辑状态
   *
   * @param recordKey
   */
  const cancelEditable = async (recordKey: RecordKey) => {
    // 防止多次渲染
    editableKeysSet.value.delete(recordKeyToString(recordKey)!)
    setEditableRowKeys(Array.from(editableKeysSet.value))
    return true
  }

  const onCancel = async (
    recordKey: RecordKey,
    editRow: RecordType & {
      index?: number
    },
    originRow: RecordType & { index?: number } | undefined,
    newLine?: NewLineConfig<any>,
  ) => {
    const success = await props?.onCancel?.(
      recordKey,
      editRow,
      originRow,
      newLine,
    )
    if (success === false) {
      return false
    }
    return true
  }

  const onSave = async (
    recordKey: RecordKey,
    editRow: RecordType & {
      index?: number
    },
    originRow: RecordType & {
      index?: number
    },
  ) => {
    const success = await props?.onSave?.(recordKey, editRow, originRow)
    if (success === false) {
      return false
    }
    await cancelEditable(recordKey)
    const actionProps = {
      data: props.dataSource?.value,
      row: editRow,
      key: recordKey,
      childrenColumnName: props.childrenColumnName || 'children',
    }
    props.setDataSource(editableRowByKey(actionProps))
    return true
  }
  const saveText = intl.value.getMessage({ id: 'editableTable.action.save', defaultMessage: '保存' })
  const deleteText = intl.value.getMessage({ id: 'editableTable.action.delete', defaultMessage: '删除' })
  const cancelText = intl.value.getMessage({ id: 'editableTable.action.cancel', defaultMessage: '取消' })

  const actionRender = (key: RecordKey, config?: ActionTypeText<RecordType>) => {
    const renderConfig: ActionRenderConfig<
      RecordType,
      NewLineConfig<RecordType>
    > = {
      recordKey: key,
      cancelEditable,
      onCancel,
      onSave,
      editableKeys: editableKeys.value,
      setEditableRowKeys,
      saveText,
      cancelText,
      preEditRow: preEditRow.value,
      'onUpdate:preEditRow': _preEditRow => (preEditRow.value = _preEditRow),
      deleteText,
      deletePopconfirmMessage: `${intl.value.getMessage(
        { id: 'deleteThisLine', defaultMessage: '删除此项' },
      )}?`,
      editorType: 'Map',
      ...config,
    }
    const renderResult = defaultActionRender(props.dataSource?.value!, renderConfig)
    if (props.actionRender) {
      return props.actionRender(props.dataSource?.value, renderConfig, {
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
  }
}

export type UseEditableMapType = typeof useEditableMap

export type UseEditableMapUtilType = ReturnType<UseEditableMapType>
