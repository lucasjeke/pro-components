import type { FormItemProps, ProFieldValueType, SearchTransformKeyFn } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { FormInstance } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { FunctionalComponent, VNode } from 'vue'
import type { LightWrapperProps } from '../../BaseForm/LightWrapper'
import type { WrapFormItemProps } from './WrapFormItem'
import { childrenToArray, isDropdownValueType, isSpecialNode, normalizeProps, omitUndefined, useEffect } from '@antdv-next1/pro-utils'
import { omit } from '@v-c/util'
import { useConfig } from 'antdv-next'
import { cloneVNode, computed, defineComponent, isVNode } from 'vue'
import LightWrapper from '../../BaseForm/LightWrapper'
import { useFieldContextInject } from '../../FieldContext'
import { useFormListContextInject } from '../List/context'
import WrapFormItem from './WrapFormItem'

export type ProFormItemProps = Omit<FormItemProps, 'name'> & {
  name?: NamePath<string | number | boolean>
  dependencies?: NamePath<string | number | boolean>[]
  ignoreFormItem?: boolean
  valuePropName?: 'value' | 'checked' | 'fileList'
  isRenderProps?: boolean
  valueType?: ProFieldValueType
  /**
   * @name 提交时转化值，一般用于将值转化为提交的数据
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
  dataFormat?: string
  lightProps?: LightWrapperProps
  proFormFieldKey?: any
  fieldProps?: Record<string, any>
  initialValue?: any
} & Omit<WrapFormItemProps, keyof Omit<FormItemProps, 'help'>>

const WithValueFomFieldProps: FunctionalComponent<{
  valuePropName?: 'value' | 'checked' | 'fileList'
  variant?: 'borderless' | 'outlined' | 'filled' | 'underlined'
  onChange?: (...args: any[]) => void
  onBlur?: (...args: any[]) => void
  onFocus?: (...args: any[]) => void
  fieldProps?: any
  [key: string]: any
}> = (props, { slots, attrs }) => {
  const {
    onChange,
    onBlur,
    onFocus,
    ignoreFormItem,
    valuePropName = 'value',
    ...restProps
  } = { ...attrs, ...props }
  return childrenToArray(slots.default?.()).map((node: Omit<VNode<any, any, {
    fieldProps?: {
      onBlur?: (...args: any[]) => void
      onChange?: (...args: any[]) => void
      [key: string]: any
    }
    lightProps?: any
    onBlur?: (...args: any[]) => void
    onChange?: (...args: any[]) => void
  }>, 'type'> & { type: VNode<any, any, {
    fieldProps?: {
      onBlur?: (...args: any[]) => void
      onChange?: (...args: any[]) => void
      [key: string]: any
    }
    lightProps?: any
    onBlur?: (...args: any[]) => void
    onChange?: (...args: any[]) => void
  }>['type'] & { __PRO_FORM_COMPONENT?: boolean } }) => {
    if (isVNode(node) && !isSpecialNode(node)) {
      const isProFormComponent = node.type?.__PRO_FORM_COMPONENT || false
      const propsValuePropName = props[valuePropName]
      // restProps 可能来自 LightWrapper 的 cloneVNode（light 模式下传入 variant/fieldProps），需保留以覆盖 node.props，避免内层控件线框双线
      node.props = normalizeProps(node.props || {})
      const fieldPropsFromRest = restProps.fieldProps
      return cloneVNode(node, omitUndefined({
        ...restProps,
        ...(omit(node.props || {}, ['onChange', 'lightProps', 'onBlur'])),
        [valuePropName]: propsValuePropName,
        [`onUpdate:${valuePropName}`]: props[`onUpdate:${valuePropName}`],
        // 只有当子组件是 ProFormComponent 时才传递 fieldProps，避免传递给原生 DOM 元素
        ...(isProFormComponent
          ? {
              fieldProps: {
                ...omit(node.props?.fieldProps || {}, ['onBlur', 'lightProps', 'onChange']),
                ...omit(fieldPropsFromRest, ['onBlur', 'onChange', 'lightProps']),
                // 优先使用 node.props.fieldProps，
                // 比如 LightFilter 中可能需要通过 fieldProps 覆盖 FormItem 默认的 onChange
                [valuePropName]: node.props.fieldProps?.[valuePropName] || propsValuePropName,
                [`onUpdate:${valuePropName}`]: (...args: any[]) => {
                  props[`onUpdate:${valuePropName}`]?.(...args)
                  node.props?.fieldProps?.[`onUpdate:${valuePropName}`]?.(...args)
                },
                id: restProps.id,
                onBlur: (...args: any[]) => {
                  if (!isProFormComponent)
                    return
                  node.props?.onBlur?.(...args)
                  node.props?.fieldProps?.onBlur?.(
                    ...args,
                  )
                },
                // 这个 onChange 是 FormItem 添加上的，
                // 要通过 fieldProps 透传给 ProField 调用
                onChange: (...args: any[]) => {
                  if (!isProFormComponent)
                    return
                  node?.props?.onChange?.(...args)
                  node.props?.fieldProps?.onChange?.(
                    ...args,
                  )
                },
              },
            }
          : {}),
        onChange: (...args: any[]) => {
          onChange?.(...args)
          fieldPropsFromRest?.onChange?.(...args)
          // node.props?.fieldProps?.onChange?.(...args)
          node.props?.onChange?.(...args)
        },
        onBlur:
       !isProFormComponent && typeof onBlur === 'function'
         ? (...args: any[]) => {
             onBlur(...args)
             fieldPropsFromRest?.onBlur?.(...args)
             node.props?.onBlur?.(...args)
             //  node.props?.fieldProps?.onBlur?.(...args)
           }
         : undefined,
      }))
    }
    return node
  })
}

const ProFormItem = defineComponent<ProFormItemProps, {}, string, CustomSlotsType<{
  default?: (form?: FormInstance | null) => VNode[]
}>>(
  (props, { slots }) => {
    const { componentSize } = useConfig()
    const { formItemProps, setFieldValueType } = useFieldContextInject()
    const formListContextProvide = useFormListContextInject()
    // ProFromList 的 filed，里面有name和key
    const name = computed(() => {
      if (props.name === undefined)
        return props.name
      if (formListContextProvide.name?.value !== undefined) {
        return [formListContextProvide.name.value, props.name].flat(1) as string[]
      }
      // 确保返回的是数组格式
      return Array.isArray(props.name) ? props.name : [props.name]
    })
    useEffect(() => {
      // 如果 setFieldValueType 和 props.name 不存在不存入
      if (!setFieldValueType || !props.name) {
        return
      }
      // Field.type === 'ProField' 时 props 里面是有 valueType 的，所以要设置一下
      // 写一个 ts 比较麻烦，用 any 顶一下
      setFieldValueType(
        name.value,
        {
          valueType: props.valueType || 'text',
          dateFormat: props.dataFormat,
          transform: props.transform,
        },
      )
    }, [
    ])
    return () => {
      const {
        valueType,
        valuePropName,
        transform,
        dataFormat,
        ignoreFormItem,
        lightProps,
        ...rest
      } = props
      const size = componentSize ? componentSize.value : 'middle'
      let isDropdown = false
      if (!rest.isRenderProps) {
        const childrens: VNode<any, any, { valueType: ProFieldValueType }>[] = childrenToArray(slots.default?.())
        childrens.forEach((child) => {
          if (isVNode(child) && !isSpecialNode(child)) {
            if (isDropdownValueType(valueType || child.props?.valueType!)) {
              isDropdown = true
            }
          }
        })
      }
      const noLightFormItem = !lightProps?.light || lightProps?.customLightMode || isDropdown
      const children = (
        <WithValueFomFieldProps
          valuePropName={valuePropName}
          v-slots={slots}
        />
      )
      const lightDom = noLightFormItem ? (
        children
      ) : (
        <LightWrapper
          {...omitUndefined(lightProps || {})}
          size={size}
          v-slots={slots}
        />
      )
      if (ignoreFormItem) {
        return lightDom
      }
      return rest.isRenderProps ? (
        <WrapFormItem
          {...rest}
          {...omitUndefined((formItemProps || {}))}
          valuePropName={formItemProps?.valuePropName || valuePropName}
          name={name.value}
          isListField={formListContextProvide.name?.value !== undefined}
          v-slots={slots}
        />
      ) : (
        <WrapFormItem
          {...rest}
          {...omitUndefined((formItemProps || {}))}
          valuePropName={formItemProps?.valuePropName || valuePropName}
          name={name.value}
          isListField={formListContextProvide.name?.value !== undefined}

        >
          {lightDom}
        </WrapFormItem>
      )
    }
  },
  {
    name: 'ProFormItem',
    inheritAttrs: false,
  },
)

export default ProFormItem
