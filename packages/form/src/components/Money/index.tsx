import type { FieldMoneyProps } from '@antdv-next1/pro-field'
import type { InputNumberProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldMoney } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormMoneyProps = ProFormFieldItemProps<
  Omit<FieldMoneyProps, 'valueType' | 'text'> & InputNumberProps
> & {
  customSymbol?: string // 自定义货币符号
  locale?: string // 单独设置国际化，设置之后优先级高于全局国际化
  min?: InputNumberProps['min']
  max?: InputNumberProps['min']
  placeholder?: string
}
const ProFormMoney = defineComponent<ProFormMoneyProps>((props, { attrs, expose }) => {
  expose({})
  return () => {
    const { fieldProps, proFieldProps, locale, min, max, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          money: {
            render: (text, restProps) => (
              <FieldMoney
                {...restProps}
                placeholder={restProps.placeholder as string}
                text={text}
              />
            ),
            formItemRender: (text, restProps) => (
              <FieldMoney
                {...restProps}
                placeholder={restProps.placeholder as string}
                text={text}
              />
            ),
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType={{
            type: 'money',
            locale,
          }}
          fieldProps={{
            min,
            max,
            ...fieldProps,
          }}
          fieldConfig={rest.fieldConfig || {
            defaultProps: {
              width: '100%',
            },
          }}
          proFieldProps={proFieldProps}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormMoney',
  inheritAttrs: false,
})

export default ProFormMoney
