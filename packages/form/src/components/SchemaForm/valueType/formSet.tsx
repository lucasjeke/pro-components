import type { ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { ItemType, ProFormColumnsType, ProFormRenderValueTypeHelpers } from '../typing'
import ProFormFieldSet from '../../FieldSet'

function formSet<T extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(item: ItemType<T, ValueType>, { genItems }: ProFormRenderValueTypeHelpers<T, ValueType>) {
  if (item.valueType === 'formSet' && item.dataIndex) {
    if (!item.columns || !Array.isArray(item.columns))
      return null
    return (
      <ProFormFieldSet
        {...item.getFormItemProps?.()}
        key={item.key}
        initialValue={item.initialValue}
        name={item.dataIndex}
        label={item.label}
        readonly={item.readonly}
        colProps={item.colProps}
        rowProps={item.rowProps}
        {...item.getFieldProps?.()}
        v-slots={
          {
            default: () => genItems(((item.columns || []) as ProFormColumnsType<T, ValueType>[]).map(column => ({
              ...column,
              readonly: item.readonly || column.readonly,
            }))),
          }
        }
      />
    )
  }
  return true
}
export default formSet
