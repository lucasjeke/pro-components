import type { SegmentedProps } from 'antdv-next'
import type { ProFormFieldItemProps, ProFormFieldRemoteProps } from '../../typing'
import { FieldSegmented } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormSegmentedProps = ProFormFieldItemProps<SegmentedProps> & {
  debounceTime?: ProFormFieldRemoteProps['debounceTime']
  request?: ProFormFieldRemoteProps['request']
  valueEnum?: ProFormFieldRemoteProps['valueEnum']
  params?: ProFormFieldRemoteProps['params']
  options?: SegmentedProps['options']
}

const ProFormSegmented = defineComponent<ProFormSegmentedProps>((props, { attrs, expose }) => {
  expose({})
  return () => {
    const { fieldProps, request, params, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          segmented: {
            render: (text, restProps) => <FieldSegmented {...restProps} text={text} />,
            formItemRender: (text, restProps) => (
              <FieldSegmented {...restProps} text={text} />
            ),
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType="segmented"
          fieldProps={fieldProps}
          request={request}
          params={params}
          fieldConfig={rest.fieldConfig || { customLightMode: true }}
          proFieldProps={proFieldProps}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormSegmented',
  inheritAttrs: false,
})

export default ProFormSegmented
