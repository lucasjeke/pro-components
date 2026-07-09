import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SetupContext } from 'vue'
import type { ActionRenderConfig } from '../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { LoadingOutlined } from '@antdv-next/icons'
import { Popconfirm } from 'antdv-next'
import { defineComponent } from 'vue'
import { useMountMergeState } from '../../useMountMergeState'
import { recordKeyToString } from './CancelEditableAction'

export interface DeleteEditableActionProps<T> {
  editableKeys?: ActionRenderConfig<T>['editableKeys']
  recordKey?: ActionRenderConfig<T>['recordKey']
  preEditRow?: ActionRenderConfig<T>['preEditRow']
  preEditRows?: ActionRenderConfig<T>['preEditRows']
  'onUpdate:preEditRow'?: ActionRenderConfig<T>['onUpdate:preEditRow']
  index?: ActionRenderConfig<T>['index']
  cancelEditable?: ActionRenderConfig<T>['cancelEditable']
  editorType?: ActionRenderConfig<T>['editorType']
  onDelete?: ActionRenderConfig<T>['onDelete']
  deletePopconfirmMessage?: ActionRenderConfig<T>['deletePopconfirmMessage']
  setEditableRowKeys?: ActionRenderConfig<T>['setEditableRowKeys']
  newLineConfig?: ActionRenderConfig<T>['newLineConfig']
  tableName?: ActionRenderConfig<T>['tableName']
  row?: T
}

/**
 * 删除按钮的dom
 */
const DeleteEditableAction = defineComponent(<T extends Record<string, any>>(props: DeleteEditableActionProps<T>, { slots, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const intl = useIntl()
  const [loading, setLoading] = useMountMergeState<boolean>(false)
  const onConfirm = async () => {
    try {
      setLoading(true)
      const res = await props.onDelete?.(props.recordKey!, props.row)
      setLoading(false)
      // 如果返回 false，阻止删除操作
      if (res === false) {
        return false
      }
      return res
    }
    catch {
      setLoading(false)
      return null
    }
    finally {
      const recordKeyStr = recordKeyToString(props.recordKey)?.toString()
      if (recordKeyStr) {
        props.preEditRows?.delete(recordKeyStr)
      }
      if (props.preEditRow) {
        props['onUpdate:preEditRow']?.(null)
      }
    }
  }
  expose({})
  return () => {
    const { deletePopconfirmMessage } = props
    return slots.default?.()
      ? (
          <Popconfirm
            key="delete"
            title={deletePopconfirmMessage}
            onConfirm={onConfirm}
          >
            <a>
              {loading.value
                ? (
                    <LoadingOutlined
                      style={{
                        marginInlineEnd: '8px',
                      }}
                    />
                  )
                : null}
              {slots.default?.() || intl.value.getMessage({ id: 'editableTable.action.delete', defaultMessage: '删除' })}
            </a>
          </Popconfirm>
        )
      : null
  }
}, {
  name: 'DeleteEditableAction',
  inheritAttrs: false,
  props: ['cancelEditable', 'deletePopconfirmMessage', 'editableKeys', 'editorType', 'index', 'newLineConfig', 'onDelete', 'onUpdate:preEditRow', 'preEditRow', 'recordKey', 'row', 'setEditableRowKeys', 'tableName', 'preEditRows'],
})

export default DeleteEditableAction
