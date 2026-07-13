import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { TextAreaProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldTextArea } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormTextAreaProps = ProFormFieldItemProps<TextAreaProps>

const ProFormTextArea = defineComponent<ProFormTextAreaProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { slots, attrs }) => {
    return () => {
      const { fieldProps, proFieldProps, ...rest } = props
      return (
        <ProConfigProvider
          valueTypeMap={{
            textarea: {
              render: (text, restProps) => <FieldTextArea {...restProps} text={text} />,
              formItemRender: (text, restProps) => (
                <FieldTextArea {...restProps} text={text} />
              ),
            },
          }}
        >
          <ProFormField
            {...attrs}
            {...rest}
            valueType="textarea"
            fieldProps={fieldProps}
            proFieldProps={proFieldProps}
            v-slots={slots}
          />
        </ProConfigProvider>

      )
    }
  },
  {
    name: 'ProFormTextArea',
    inheritAttrs: false,
  },
)
export default ProFormTextArea
