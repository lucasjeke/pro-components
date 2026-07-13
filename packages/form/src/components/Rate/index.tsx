import type { RateProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldRate } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormRateProps = ProFormFieldItemProps<RateProps>

const ProFormRate = defineComponent<ProFormRateProps>((props, { attrs, expose }) => {
  expose({})
  return () => {
    const { fieldProps, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          rate: {
            render: (text, restProps) => <FieldRate {...restProps} text={text} />,
            formItemRender: (text, restProps) => <FieldRate {...restProps} text={text} />,
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType="rate"
          fieldProps={fieldProps}
          proFieldProps={proFieldProps}
          fieldConfig={rest.fieldConfig || {
            ignoreWidth: true,
          }}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormRate',
  inheritAttrs: false,
})

export default ProFormRate
