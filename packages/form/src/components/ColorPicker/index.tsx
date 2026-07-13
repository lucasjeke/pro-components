import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ColorPickerProps, PopoverProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldColorPicker } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormColorPickerProps = ProFormFieldItemProps<ColorPickerProps> & {
  popoverProps?: PopoverProps
  colors?: string[]
}

const ProFormColorPicker = defineComponent<ProFormColorPickerProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { slots, attrs }) => {
    return () => {
      const { fieldProps, popoverProps, fieldConfig, proFieldProps, colors, ...rest } = props
      return (
        <ProConfigProvider
          valueTypeMap={{
            color: {
              render: (text, restProps) => <FieldColorPicker {...restProps} text={text} />,
              formItemRender: (text, restProps) => (
                <FieldColorPicker {...restProps} text={text} />
              ),
            },
          }}
        >
          <ProFormField
            {...attrs}
            {...rest}
            valueType="color"
            fieldProps={{
              popoverProps,
              colors,
              ...fieldProps,
            }}
            fieldConfig={
              fieldConfig || {
                defaultProps: {
                  width: '100%',
                },
              }
            }
            proFieldProps={proFieldProps}
            v-slots={slots}
          />
        </ProConfigProvider>

      )
    }
  },
  {
    name: 'ProFormColorPicker',
    inheritAttrs: false,
  },
)
export default ProFormColorPicker
