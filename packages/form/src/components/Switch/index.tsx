import type { SwitchProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldSwitch } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormSwitchProps = Omit<
  ProFormFieldItemProps<SwitchProps>,
  'emptyText'
> & {
  checkedChildren?: SwitchProps['checkedChildren']
  unCheckedChildren?: SwitchProps['unCheckedChildren']
}

const ProFormSwitch = defineComponent<ProFormSwitchProps>((props, { attrs, expose }) => {
  expose({})
  return () => {
    const { fieldProps, unCheckedChildren, checkedChildren, proFieldProps, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          switch: {
            render: (text, restProps) => <FieldSwitch {...restProps} text={text} />,
            formItemRender: (text, restProps) => (
              <FieldSwitch {...restProps} text={text} />
            ),
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType="switch"
          fieldProps={{
            unCheckedChildren,
            checkedChildren,
            ...fieldProps,
          }}
          valuePropName="checked"
          proFieldProps={proFieldProps}
          fieldConfig={rest.fieldConfig || {
            valuePropName: 'checked',
            ignoreWidth: true,
            customLightMode: true,
          }}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormSwitch',
  inheritAttrs: false,
})

export default ProFormSwitch
