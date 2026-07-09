import type { CustomSlotsType, Key, VueNode } from '@v-c/util/dist/type'
import type { FormInstance } from 'antdv-next'
import type { SetupContext } from 'vue'
import type { ActionRenderConfig, RecordKey } from '../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { get, set } from '@v-c/util'
import { Form } from 'antdv-next'
import { defineComponent } from 'vue'
import { useProFormContextInject } from '../../components/ProFormContext'

export interface CancelEditableActionProps<T> {
  editableKeys?: ActionRenderConfig<T>['editableKeys']
  editorType?: ActionRenderConfig<T>['editorType']
  recordKey?: ActionRenderConfig<T>['recordKey']
  preEditRow?: ActionRenderConfig<T>['preEditRow']
  preEditRows?: ActionRenderConfig<T>['preEditRows']
  'onUpdate:preEditRow'?: ActionRenderConfig<T>['onUpdate:preEditRow']
  index?: ActionRenderConfig<T>['index']
  cancelEditable?: ActionRenderConfig<T>['cancelEditable']
  onSave?: ActionRenderConfig<T>['onSave']
  onCancel?: ActionRenderConfig<T>['onCancel']
  onDelete?: ActionRenderConfig<T>['onDelete']
  deletePopconfirmMessage: ActionRenderConfig<T>['deletePopconfirmMessage']
  setEditableRowKeys?: ActionRenderConfig<T>['setEditableRowKeys']
  newLineConfig?: ActionRenderConfig<T>['newLineConfig']
  tableName?: ActionRenderConfig<T>['tableName']
  row?: T
}

export function recordKeyToString(rowKey?: RecordKey): Key | undefined {
  if (Array.isArray(rowKey))
    return rowKey.join(',')
  return rowKey
}
/**
 * Normalize antd Form `NamePath` segments.
 *
 * - Preserve `0` (number) and other falsy-but-valid segments
 * - Flatten nested arrays (e.g. `name={['a','b']}`)
 * - Convert number segments to string to align with `spellNamePath` behavior
 */
export function normalizeNamePath(...segments: any[]): (string | number)[] {
  return segments
    .flat(1)
    .filter(key => key !== undefined && key !== null)
    .map(key => (typeof key === 'number' ? key.toString() : key))
}
/**
 * 保存按钮的dom
 */
const CancelEditableAction = defineComponent(
  <T extends Record<string, any>>(props: CancelEditableActionProps<T>, { slots }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const intl = useIntl()
    const context = useProFormContextInject()
    const form = (Form as unknown as { useFormInstance: () => FormInstance }
    ).useFormInstance()
    const cancel = async () => {
      const isMapEditor = props.editorType === 'Map'
      const recordKeyStr = recordKeyToString(props.recordKey)?.toString()
      const namePath = normalizeNamePath(props.tableName, props.recordKey) as string[]
      const formattedObject = context?.getFieldFormatValueObject?.(namePath) as T
      const fields: T
        = formattedObject != null ? get(formattedObject, namePath)
          : form?.getFieldValue(namePath)

      const record = isMapEditor ? set({} as T, namePath, fields) : fields

      // 在清理编辑态前，先捕获“编辑前快照”（多行编辑时必须按 key 取值）
      const cachedPreEditRow
        = recordKeyStr !== null
          ? props.preEditRows?.get(recordKeyStr!)
          : undefined
      const isNewLineKeyMatch = () => {
        const newLineKey = props.newLineConfig?.options?.recordKey
        if (newLineKey == null || props.recordKey == null)
          return false
        const newLineKeyStr = recordKeyToString(newLineKey)?.toString()
        const currentKeyStr = recordKeyToString(props.recordKey)?.toString()
        if (!newLineKeyStr || !currentKeyStr)
          return false
        return newLineKeyStr === currentKeyStr
      }

      const res = await props.onCancel?.(props.recordKey!, record, props.row, props.newLineConfig)
      await props.cancelEditable?.(props.recordKey!)
      /** 重置为默认值，不然编辑的行会丢掉 */
      const restoreRow = cachedPreEditRow ?? props.preEditRow ?? props.row
      const shouldDeleteNewRow
        = cachedPreEditRow === null
          || (cachedPreEditRow === undefined
            && props.preEditRow === null
            && isNewLineKeyMatch())

      if (shouldDeleteNewRow) {
        // 如果不存在历史值，说明是新的行，干掉他
        await props.onDelete?.(props.recordKey!, props.row)
      }
      else if (restoreRow != null) {
        form.setFieldsValue(set({}, namePath, restoreRow))
      }
      if (recordKeyStr) {
        props.preEditRows?.delete(recordKeyStr)
      }
      if (props.preEditRow)
        props['onUpdate:preEditRow']?.(null)
      return res
    }
    return () => (
      <a
        key="cancel"
        onClick={async (e) => {
          e.stopPropagation()
          e.preventDefault()
          await cancel()
        }}
      >
        {slots.default?.() || intl.value.getMessage({ id: 'editableTable.action.cancel', defaultMessage: '取消' })}
      </a>
    )
  },
  {
    name: 'CancelEditableAction',
    inheritAttrs: false,
    props: ['cancelEditable', 'deletePopconfirmMessage', 'editableKeys', 'editorType', 'index', 'newLineConfig', 'onCancel', 'onDelete', 'onSave', 'onUpdate:preEditRow', 'preEditRow', 'recordKey', 'row', 'setEditableRowKeys', 'tableName', 'preEditRows'],

  },
)

export default CancelEditableAction
