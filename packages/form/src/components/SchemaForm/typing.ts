import type {
  Key,
  ProCoreActionType,
  ProFieldValueObjectType,
  ProFieldValueType,
  ProSchema,
  ProSchemaComponentTypes,
  SearchConvertKeyFn,
  SearchTransformKeyFn,
  VueNode,
} from '@antdv-next1/pro-utils'
import type { FormProps } from 'antdv-next'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { ShallowRef } from 'vue'
import type { CommonFormProps, ProFormInstance } from '../../BaseForm'
import type { ProDrawerFormProps, ProFormProps, ProLightFilterProps, ProModalFormProps, ProQueryFilterProps, ProStepFormProps, ProStepsFormProps } from '../../layouts'
import type { ProFormGridConfig } from '../../typing'

export type ExtraProColumnType = {
  tooltip?: FormItemTooltipType

  key?: Key
  /**
   * @type auto 使用组件默认的宽度
   * @type xs=104px 适用于短数字、短文本或选项。
   * @type sm=216px 适用于较短字段录入、如姓名、电话、ID 等。
   * @type md=328px 标准宽度，适用于大部分字段长度。
   * @type lg=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
   * @type xl=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
   */
  width?: string | number

  name?: NamePath<string | number | boolean> | NamePath<string | number | boolean>[]
  defaultKeyWords?: string
} & Pick<ProFormGridConfig, 'rowProps' | 'colProps'>

/**
 * ProForm 支持的相关类型
 */
export type ProFormPropsType<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)> = ((
  | ({ layoutType?: 'Form' } & ProFormProps<T, U>)
  | ({ layoutType: 'DrawerForm' } & ProDrawerFormProps<T, U>)
  | ({ layoutType: 'ModalForm' } & ProModalFormProps<T, U>)
  | ({ layoutType: 'QueryFilter' } & ProQueryFilterProps<T, U>)
  | ({ layoutType: 'LightFilter' } & ProLightFilterProps<T, U>)
  | ({ layoutType: 'StepForm' } & ProStepFormProps<T, U>)
  | { layoutType: 'Embed' }
) & {
  columns: ProFormColumnsType<T, ValueType>[]
})
| ({
  layoutType?: 'StepsForm'
  columns: ProFormColumnsType<T, ValueType>[][]
} & ProStepsFormProps<T, U>)

/** ProForm 的特色 layout */
export type ProFormLayoutType<T extends Record<string, any> = Record<string, any>, U extends Record<string, any> = Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'> = ProFormPropsType<T, U, ValueType>['layoutType']

export type FormFieldType = 'group' | 'formList' | 'formSet' | 'divider' | 'dependency'

export type ProFormColumnsType<T extends Record<string, any> = Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'> = ProSchema<
  T,
  ExtraProColumnType & {
    index?: number
    /**
     * 每个表单占据的格子大小
     *
     * @param 总宽度 = span* colSize
     * @param 默认为 1
     */
    colSize?: number
    /** 是否只读模式 */
    readonly?: boolean
    /** 搜索表单的默认值 */
    initialValue?: any

    /**
     * @name convertValue 获取时转化值，一般用于将数据格式化为组件接收的格式
     * @param value 字段的值
     * @param namePath 字段的name
     * @returns 字段新的值
     *
     *
     * @example a,b => [a,b]     convertValue: (value,namePath)=> value.split(",")
     * @example string => json   convertValue: (value,namePath)=> JSON.parse(value)
     * @example number => date   convertValue: (value,namePath)=> Dayjs(value)
     * @example YYYY-MM-DD => date   convertValue: (value,namePath)=> Dayjs(value,"YYYY-MM-DD")
     * @example  string => object   convertValue: (value,namePath)=> { return {value,label:value} }
     */
    convertValue?: SearchConvertKeyFn
    /**
     * @name transform 提交时转化值，一般用于将值转化为提交的数据
     * @param value 字段的值
     * @param namePath 字段的name
     * @param allValues 所有的字段
     * @returns 字段新的值，如果返回对象，会和所有值 merge 一次
     *
     * @example {name:[a,b] => {name:a,b }    transform: (value,namePath,allValues)=> value.join(",")
     * @example {name: string => { newName:string }    transform: (value,namePath,allValues)=> { newName:value }
     * @example {name:dayjs} => {name:string transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
     * @example {name:dayjs}=> {name:时间戳} transform: (value,namePath,allValues)=> value.valueOf()
     * @example {name:{value,label}} => { name:string} transform: (value,namePath,allValues)=> value.value
     * @example {name:{value,label}} => { valueName,labelName  } transform: (value,namePath,allValues)=> { valueName:value.value, labelName:value.name }
     */
    transform?: SearchTransformKeyFn
    /** Form 的排序 */
    order?: number
    /** 嵌套子项 */
    columns?:
      | ProFormColumnsType<T, ValueType | FormFieldType>[]
      | ((values: any) => ProFormColumnsType<T, ValueType | FormFieldType>[])
  },
  ProSchemaComponentTypes,
  ValueType | FormFieldType
>

export type SchemaFormProps<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)> = {
  title?:
    | VueNode
    | ((
      schema: ProFormColumnsType<T, ValueType>,
      type: 'form',
      dom: VueNode,
    ) => VueNode)
  description?: VueNode
  steps?: ProStepFormProps<T, U>[]
  type?: ProSchemaComponentTypes
  onReset?: (values?: T) => void
  action?: ProCoreActionType<Record<string, any>, T>
} & Omit<FormProps, 'onFinish' | 'onReset'>
& ProFormPropsType<T, U, ValueType>
& CommonFormProps<T, U> & {
  open?: boolean
}

export type ProFormRenderValueTypeItem<T extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)> = {
  label: any
  getFieldProps?: () => any
  getFormItemProps?: () => any
} & ProFormColumnsType<T, ValueType>

export type ProFormRenderValueTypeHelpers<T extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)> = {
  originItem: ProFormColumnsType<T, ValueType>
  type: ProSchemaComponentTypes
  formRef: ShallowRef<ProFormInstance | undefined>
  genItems: (items: ProFormColumnsType<T, ValueType>[]) => VueNode[]
} & {
  action?: ProCoreActionType<Record<string, any>, T>
}

export type ItemType<T extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)> = Omit<ProFormRenderValueTypeItem<T, ValueType>, 'key'> & {
  key?: Key | Key[]
}
