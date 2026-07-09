import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { FormInstance } from 'antdv-next'
import type { SetupContext } from 'vue'
import type { ActionRenderConfig } from '../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { LoadingOutlined } from '@antdv-next/icons'
import { get, set } from '@v-c/util'
import { Form } from 'antdv-next'
import { getValue } from 'antdv-next/dist/form/utils/valueUtil'
import { defineComponent } from 'vue'
import { useProFormContextInject } from '../../components/ProFormContext'
import { merge } from '../../merge'
import { useMountMergeState } from '../../useMountMergeState'
import { normalizeNamePath } from './CancelEditableAction'

export interface SaveEditableActionProps<T> {
  editableKeys?: ActionRenderConfig<T>['editableKeys']
  recordKey?: ActionRenderConfig<T>['recordKey']
  preEditRow?: ActionRenderConfig<T>['preEditRow']
  preEditRows?: ActionRenderConfig<T>['preEditRows']
  'onUpdate:preEditRow'?: ActionRenderConfig<T>['onUpdate:preEditRow']
  index?: ActionRenderConfig<T>['index']
  cancelEditable?: ActionRenderConfig<T>['cancelEditable']
  onSave?: ActionRenderConfig<T>['onSave']
  editorType?: ActionRenderConfig<T>['editorType']
  setEditableRowKeys?: ActionRenderConfig<T>['setEditableRowKeys']
  newLineConfig?: ActionRenderConfig<T>['newLineConfig']
  tableName?: ActionRenderConfig<T>['tableName']
  row: T
}

/**
 * 保存按钮的dom
 */
const SaveEditableAction = defineComponent(<T extends Record<string, any>>(props: SaveEditableActionProps<T>, { slots, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const intl = useIntl()
  const form = (Form as unknown as { useFormInstance: () => FormInstance }
  ).useFormInstance()
  const context = useProFormContextInject()
  const [loading, setLoading] = useMountMergeState<boolean>(false)
  const save = async () => {
    try {
      const isMapEditor = props.editorType === 'Map'
      // 为了兼容类型为 array 的 dataIndex,当 recordKey 是一个数组时，用于获取表单值的 key 只取第一项，
      // 从表单中获取回来之后，再根据 namepath 获取具体的某个字段并设置
      const namePath = normalizeNamePath(
        props.tableName,
        Array.isArray(props.recordKey) ? props.recordKey[0] : props.recordKey,
      ) as string[]

      setLoading(true)
      try {
        await form.validateFields(namePath, {
          recursive: true,
        })
      }
      catch (error: any) {
        setLoading(false)
        // 重新抛出验证错误，让表单显示错误信息
        // validateFields 抛出错误时，表单会自动设置错误状态并显示错误
        // 错误对象包含 errorFields，表单会根据这些字段显示错误
        // 确保错误被正确传播，这样表单可以正确显示验证错误
        throw error
      }
      const formattedObject = context?.getFieldFormatValueObject?.(namePath)
      const fields
        = formattedObject !== null ? get(formattedObject, namePath)
          : form.getFieldValue(namePath)

      // 处理 dataIndex 为数组的情况
      if (Array.isArray(props.recordKey) && props.recordKey.length > 1) {
        // 获取 namepath
        const [, ...recordKeyPath] = props.recordKey
        // 将目标值获取出来并设置到 fields 当中
        const curValue = getValue(fields, recordKeyPath as string[])
        set(fields, recordKeyPath as (number | string)[], curValue)
      }
      const data = isMapEditor ? set({}, namePath, fields) : fields
      // 获取数据并保存
      const res = await props.onSave?.(
        props.recordKey!,
        // 如果是 map 模式，fields 就是一个值，所以需要set 到对象中
        // 数据模式 fields 是一个对象，所以不需要
        merge({}, props.row, data),
        props.row,
        props.newLineConfig,
      )
      setLoading(false)
      return res
    }
    catch (error) {
      setLoading(false)
      throw error
    }
  }
  expose({
    save,
  })
  return () => (
    <a
      key="save"
      onClick={async (e) => {
        e.stopPropagation()
        e.preventDefault()
        await save()
      }}
    >
      {loading.value
        ? (
            <LoadingOutlined
              style={{
                marginInlineEnd: '8px',
              }}
            />
          )
        : null}
      {slots.default?.() || intl.value.getMessage({ id: 'editableTable.action.save', defaultMessage: '保存' })}
    </a>
  )
}, {
  name: 'SaveEditableAction',
  inheritAttrs: false,
  props: ['cancelEditable', 'editableKeys', 'editorType', 'index', 'newLineConfig', 'onSave', 'onUpdate:preEditRow', 'preEditRow', 'recordKey', 'row', 'setEditableRowKeys', 'tableName'],

})

export default SaveEditableAction
