import type { ProFieldFCRenderProps, ProRenderFieldPropsType } from '@antdv-next1/pro-provider'
import type { ProFieldTextType, ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ProFieldProps } from './ProField'
import type { RenderProps } from './typing'
import { useProConfig } from '@antdv-next1/pro-provider'
import { normalizeProps, omitUndefined, pickProProps } from '@antdv-next1/pro-utils'
import { isEmptyElement } from '@v-c/util/dist/props-util/index'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { cloneVNode, defineComponent, isVNode, shallowRef } from 'vue'
import FieldText from './components/Text'
import ValueTypeToComponentMap from './ValueTypeToComponent'

dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)
dayjs.extend(weekday)
dayjs.extend(localizedFormat)

function pureRenderText(
  dataValue: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps,
  valueTypeMap: Record<string, ProRenderFieldPropsType>,
) {
  const { mode = 'read', emptyText = '-' } = props
  if (
    emptyText !== false
    && mode === 'read'
    && valueType !== 'option'
    && valueType !== 'switch'
  ) {
    if (
      typeof dataValue !== 'boolean'
      && typeof dataValue !== 'number'
      && !dataValue
    ) {
      const { fieldProps, render } = props
      if (render) {
        return <>{render(dataValue, { mode, ...fieldProps }, <>{emptyText}</>)}</>
      }
      return <>{emptyText}</>
    }
  }
  delete props.emptyText

  if (typeof valueType === 'object') {
    return pureRenderText(
      dataValue,
      valueType.type,
      {
        ...valueType,
        ...props,
      } as RenderProps,
      valueTypeMap,
    )
  }
  const customValueTypeConfig
    = valueTypeMap && valueTypeMap[valueType as string]
  if (customValueTypeConfig) {
    if (mode === 'read') {
      const readDom = (
        <>
          { customValueTypeConfig.render?.(
            dataValue,
            {
              text: dataValue,
              ...props,
              mode: mode || 'read',
            },
            <>{dataValue}</>,
          )}
        </>
      )
      if (props?.render) {
        return (
          <>
            {props.render?.(
              dataValue,
              {
                text: dataValue,
                ...props,
              },
              readDom,
            )}
          </>
        )
      }
      return readDom
    }
    if (mode === 'update' || mode === 'edit') {
      const dom = (
        <>
          {customValueTypeConfig.formItemRender?.(
            dataValue,
            {
              text: dataValue,
              ...props,
            },
            <>{dataValue}</>,
          )}
        </>
      )
      if (props?.formItemRender) {
        return (
          <>
            {props.formItemRender?.(
              dataValue,
              {
                text: dataValue,
                ...props,
              },
              dom,
            )}
          </>
        )
      }
      return dom
    }
  }

  return <FieldText text={dataValue as string} {...props} />
}

const ProPureField = defineComponent<ProFieldProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { attrs, expose }) => {
  const proProvide = useProConfig()
  const profieldRef = shallowRef<any | null>(null)
  const handleChange = (...restParams: any[]) => {
    props.fieldProps?.onChange?.(...restParams)
    props.onChange?.(...restParams)
  }
  expose({})
  return () => {
    const {
      text,
      valueType = 'text',
      mode = 'read',
      onChange,
      formItemRender,
      value,
      'onUpdate:text': onUpdateText,
      'onUpdate:value': onUpdateValue,
      readonly,
      fieldProps: restFieldProps,
      ...rest
    } = normalizeProps({ ...attrs, ...props }) as ProFieldProps
    const fieldProps = (value !== undefined || restFieldProps) && {
      value,
      'onUpdate:value': (value: any) => {
        onUpdateValue?.(value)
        onUpdateText?.(value)
      },
      // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
      ...omitUndefined(restFieldProps! || {}),
      onChange: handleChange,
    }
    return pureRenderText(
      mode === 'edit'
        ? (fieldProps?.value ?? text ?? '')
        : (text ?? fieldProps?.value ?? ''),
      valueType || 'text',
      omitUndefined({
        ref: profieldRef,
        ...rest,
        mode: readonly ? 'read' : mode,
        formItemRender: formItemRender ? (curText: any, props: ProFieldFCRenderProps, dom: VueNode) => {
          const { placeholder: _placeholder, ...restProps } = props
          const newDom = formItemRender(curText, restProps, dom)
          // formItemRender 之后的dom可能没有props，这里会帮忙注入一下
          if (isVNode(newDom) && !isEmptyElement(newDom)) {
            return cloneVNode(newDom, {
              ...fieldProps,
              ...(newDom.props || {}),
            })
          }
          return newDom
        } : undefined,
        placeholder: formItemRender
          ? undefined
          : (rest?.placeholder ?? fieldProps?.placeholder),
        fieldProps: pickProProps(
          omitUndefined({
            ...fieldProps,
            placeholder: formItemRender
              ? undefined
              : (rest?.placeholder ?? fieldProps?.placeholder),
          }),
        ),
      }),
      {
        ...ValueTypeToComponentMap,
        ...proProvide.value.valueTypeMap,
      },
    )
  }
}, {
  name: 'ProPureField',
  inheritAttrs: false,
})

export default ProPureField
