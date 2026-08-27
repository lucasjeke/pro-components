import type { ProFieldFCRenderProps, ProRenderFieldPropsType } from '@antdv-next1/pro-provider'
import type { ProFieldTextType, ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { App, Plugin } from 'vue'
import type { RenderProps } from './typing'
import { useProConfig } from '@antdv-next1/pro-provider'
import { omitUndefined, pickProProps } from '@antdv-next1/pro-utils'
import { isEmptyElement } from '@v-c/util/dist/props-util/index'
import { Avatar } from 'antdv-next'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { cloneVNode, defineComponent, isVNode, shallowRef } from 'vue'
import FieldCascader from './components/Cascader'
import FieldCheckbox from './components/Checkbox'
import FieldCode from './components/Code'
import FieldColorPicker from './components/ColorPicker'
import FieldDatePicker from './components/DatePicker'
import FieldDigit from './components/Digit'
import FieldDigitRange from './components/DigitRange'
import FieldFromNow from './components/FromNow'
import FieldImage from './components/Image'
import FieldIndexColumn from './components/IndexColumn'
import FieldMoney from './components/Money'
import FieldOptions from './components/Options'
import FieldPassword from './components/Password'
import FieldPercent from './components/Percent'
import FieldProgress from './components/Progress'
import FieldRadio from './components/Radio'
import { FieldDateRangePicker, FieldTimeRangePicker } from './components/RangePicker'
import FieldRate from './components/Rate'
import FieldSecond from './components/Second'
import FieldSegmented from './components/Segmented'
import FieldSelect from './components/Select'
import FieldSlider from './components/Slider'
import FieldSwitch from './components/Switch'
import FieldText from './components/Text'
import FieldTextArea from './components/TextArea'
import FieldTimePicker from './components/TimePicker'
import FieldTreeSelect from './components/TreeSelect'
import FieldHOC from './FieldHOC'
import { useFieldExpose } from './utils/useFieldExpose'

dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(weekday)
dayjs.extend(localizedFormat)

export type ProFieldProps = RenderProps & {
  valueType?: ProFieldValueType | ProFieldValueObjectType
  text?: ProFieldTextType
  placeholder?: string | string[]
}
/**
 * Render valueType object
 *
 * @param text String | number
 * @param valueType ProColumnsValueObjectType
 * @param props
 */
function defaultRenderTextByObject(text: ProFieldTextType, valueType: ProFieldValueObjectType, props: RenderProps) {
  const pickFormItemProps = pickProProps(props.fieldProps!)
  if (valueType.type === 'progress') {
    return (
      <FieldProgress
        {...props}
        text={text as number}
        fieldProps={{
          ...pickFormItemProps,
          status: valueType.status ? valueType.status : undefined,
        }}
      />
    )
  }
  if (valueType.type === 'money') {
    return (
      <FieldMoney
        {...props}
        locale={valueType.locale}
        fieldProps={pickFormItemProps}
        text={text as number}
        moneySymbol={valueType.moneySymbol}
      />
    )
  }
  if (valueType.type === 'percent') {
    return (
      <FieldPercent
        {...props}
        text={text as number}
        showSymbol={valueType.showSymbol}
        precision={valueType.precision}
        fieldProps={pickFormItemProps}
        showColor={valueType.showColor}
      />
    )
  }

  if (valueType.type === 'image') {
    return <FieldImage {...props} text={text as string} width={valueType.width} />
  }

  return text
}

/**
 * 根据不同的类型来转化数值
 *
 */
function defaultRenderText(
  dataValue: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps,
  valueTypeMap: Record<string, ProRenderFieldPropsType>,
) {
  const { mode = 'read', render, emptyText = '-' } = props
  if (emptyText !== false && mode === 'read' && valueType !== 'option' && valueType !== 'switch') {
    if (typeof dataValue !== 'boolean' && typeof dataValue !== 'number' && !dataValue) {
      if (render) {
        return <>{render(dataValue, { mode }, <>{emptyText}</>)}</>
      }
      return <>{emptyText}</>
    }
  }
  delete props.emptyText
  if (typeof valueType === 'object') {
    return <>{defaultRenderTextByObject(dataValue, valueType, props)}</>
  }
  const customValueTypeConfig = valueTypeMap && valueTypeMap[valueType]
  if (customValueTypeConfig) {
    if (mode === 'read') {
      return (
        <>
          {customValueTypeConfig.render?.(
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
    }
    if (mode === 'update' || mode === 'edit') {
      return (
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
    }
  }

  /** 如果是金额的值 */
  if (valueType === 'money') {
    return <FieldMoney {...props} text={dataValue as number} />
  }

  /** 如果是日期的值 */
  if (valueType === 'date') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          {...props}
          text={dataValue as string}
          format="YYYY-MM-DD"
        />
      </FieldHOC>
    )
  }

  /** 如果是周的值 */
  if (valueType === 'dateWeek') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          {...props}
          text={dataValue as string}
          format="YYYY-wo"
          picker="week"
        />
      </FieldHOC>
    )
  }

  /** 如果是周范围的值 */
  if (valueType === 'dateWeekRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldDateRangePicker
          {...otherProps}
          text={(dataValue || []) as string[]}
          format="YYYY-wo"
          showTime
          fieldProps={{
            picker: 'week',
            ...fieldProps,
          }}
        />
      </FieldHOC>
    )
  }

  /** 如果是月范围的值 */
  if (valueType === 'dateMonthRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldDateRangePicker
          {...otherProps}
          text={(dataValue || []) as string[]}
          format="YYYY-MM"
          showTime
          fieldProps={{
            picker: 'month',
            ...fieldProps,
          }}
        />
      </FieldHOC>
    )
  }

  /** 如果是季范围的值 */
  if (valueType === 'dateQuarterRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldDateRangePicker
          {...otherProps}
          text={(dataValue || []) as string[]}
          format="YYYY-[Q]Q"
          showTime
          fieldProps={{
            picker: 'quarter',
            ...fieldProps,
          }}
        />
      </FieldHOC>
    )
  }

  /** 如果是年范围的值 */
  if (valueType === 'dateYearRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldDateRangePicker
          {...otherProps}
          text={(dataValue || []) as string[]}
          format="YYYY"
          showTime
          fieldProps={{
            picker: 'year',
            ...fieldProps,
          }}
        />
      </FieldHOC>
    )
  }

  /** 如果是月的值 */
  if (valueType === 'dateMonth') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          {...props}
          text={dataValue as string}
          format="YYYY-MM"
          picker="month"
        />
      </FieldHOC>
    )
  }

  /** 如果是季度的值 */
  if (valueType === 'dateQuarter') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          {...props}
          text={dataValue as string}
          format="YYYY-[Q]Q"
          picker="quarter"
        />
      </FieldHOC>
    )
  }

  /** 如果是年的值 */
  if (valueType === 'dateYear') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          {...props}
          text={dataValue as string}
          format="YYYY"
          picker="year"
        />
      </FieldHOC>
    )
  }

  /** 如果是日期范围的值 */
  if (valueType === 'dateRange') {
    return (
      <FieldDateRangePicker
        {...props}
        text={(dataValue || []) as string[]}
        format="YYYY-MM-DD"
      />
    )
  }

  /** 如果是日期加时间类型的值 */
  if (valueType === 'dateTime') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          {...props}
          text={dataValue as string}
          format="YYYY-MM-DD HH:mm:ss"
          showTime
        />
      </FieldHOC>
    )
  }

  /** 如果是日期加时间类型的值的值 */
  if (valueType === 'dateTimeRange') {
    // 值不存在的时候显示 "-"
    return (
      <FieldHOC isLight={props.light}>
        <FieldDateRangePicker
          {...props}
          text={(dataValue || []) as string[]}
          format="YYYY-MM-DD HH:mm:ss"
          showTime
        />
      </FieldHOC>
    )
  }

  /** 如果是时间类型的值 */
  if (valueType === 'time') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldTimePicker {...props} text={dataValue as string} format="HH:mm:ss" />
      </FieldHOC>
    )
  }

  /** 如果是时间类型的值 */
  if (valueType === 'timeRange') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldTimeRangePicker
          {...props}
          text={(dataValue || []) as string[]}
          format="HH:mm:ss"
        />
      </FieldHOC>
    )
  }

  if (valueType === 'fromNow') {
    return <FieldFromNow {...props} text={dataValue as string} />
  }

  if (valueType === 'index') {
    return <FieldIndexColumn children={(dataValue as number) + 1} />
  }

  if (valueType === 'indexBorder') {
    return <FieldIndexColumn border children={(dataValue as number) + 1} />
  }

  if (valueType === 'progress') {
    return <FieldProgress {...props} text={dataValue as number} />
  }

  //   /** 百分比, 默认展示符号, 不展示小数位 */
  if (valueType === 'percent') {
    return <FieldPercent {...props} text={dataValue as number} />
  }

  if (valueType === 'avatar' && typeof dataValue === 'string' && props.mode === 'read') {
    return <Avatar src={dataValue as string} size={22} shape="circle" />
  }

  if (valueType === 'code') {
    return <FieldCode {...props} text={dataValue as string} />
  }

  if (valueType === 'jsonCode') {
    return <FieldCode {...props} text={dataValue as string} language="json" />
  }

  if (valueType === 'textarea') {
    return <FieldTextArea {...props} text={dataValue as string} />
  }

  if (valueType === 'digit') {
    return <FieldDigit {...props} text={dataValue as number} />
  }

  if (valueType === 'digitRange') {
    return <FieldDigitRange {...props} text={(dataValue || []) as number[]} />
  }

  if (valueType === 'second') {
    return <FieldSecond {...props} text={dataValue as number} />
  }

  if (valueType === 'select' || (valueType === 'text' && (props.valueEnum || props.request))) {
    return (
      <FieldHOC isLight={props.light}>
        <FieldSelect {...props} text={dataValue as string} />
      </FieldHOC>
    )
  }

  if (valueType === 'checkbox') {
    return <FieldCheckbox {...props} text={dataValue as string} />
  }

  if (valueType === 'radio') {
    return <FieldRadio {...props} text={dataValue as string} />
  }

  if (valueType === 'radioButton') {
    return <FieldRadio radioType="button" {...props} text={dataValue as string} />
  }

  if (valueType === 'rate') {
    return <FieldRate {...props}text={dataValue as number} />
  }

  if (valueType === 'slider') {
    return <FieldSlider {...props} text={dataValue as string} />
  }

  if (valueType === 'switch') {
    return <FieldSwitch {...props} text={dataValue as boolean} />
  }

  if (valueType === 'option') {
    return <FieldOptions {...props} text={dataValue} />
  }

  if (valueType === 'password') {
    return <FieldPassword {...props} text={dataValue} />
  }

  if (valueType === 'image') {
    return <FieldImage {...props} text={dataValue as string} />
  }

  if (valueType === 'cascader') {
    return <FieldCascader {...props} text={(dataValue || []) as string[]} />
  }

  if (valueType === 'treeSelect') {
    return <FieldTreeSelect {...props} text={(dataValue || []) as string[]} />
  }

  if (valueType === 'color') {
    return <FieldColorPicker {...props} text={dataValue as string} />
  }

  if (valueType === 'segmented') {
    return <FieldSegmented {...props} emptyText={undefined} text={dataValue as string} />
  }
  return <FieldText {...props} text={dataValue} />
}

const _ProField = defineComponent<ProFieldProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { expose }) => {
  const proProvide = useProConfig()
  const profieldRef = shallowRef<any | null>(null)
  const handleChange = (...restParams: any[]) => {
    props.fieldProps?.onChange?.(...restParams)
    props.onChange?.(...restParams)
  }
  expose(useFieldExpose(profieldRef, props.valueType))
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
    } = props
    const fieldProps = (value !== undefined || restFieldProps) && {
      value,
      'onUpdate:value': (_value: any) => {
        onUpdateValue?.(_value)
        onUpdateText?.(_value)
      },
      // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
      ...omitUndefined(restFieldProps! || {}),
      onChange: handleChange,
    }
    return defaultRenderText(
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
          Object.keys(proProvide.value.valueTypeMap || {})?.includes(valueType as string),
        ),
      }),
      proProvide.value.valueTypeMap || {},
    )
  }
}, {
  name: 'ProField',
  inheritAttrs: false,
})

const ProField = _ProField as typeof _ProField
  & Plugin

ProField.install = (app: App) => {
  app.component(ProField.name, ProField)
  return app
}

export default ProField
