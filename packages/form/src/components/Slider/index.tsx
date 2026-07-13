import type { SliderProps } from 'antdv-next'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldSlider } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { defineComponent } from 'vue'
import ProFormField from '../Field'

export type ProFormSliderProps = ProFormFieldItemProps<
  SliderProps
> & {
  range?: boolean
  min?: SliderProps['min']
  max?: SliderProps['max']
  step?: SliderProps['step']
  marks?: SliderProps['marks']
  vertical?: SliderProps['vertical']
}

const ProFormSlider = defineComponent<ProFormSliderProps>((props, { attrs, expose }) => {
  expose({})
  return () => {
    const { fieldProps, proFieldProps, min, max, step, marks, vertical, range, ...rest } = props
    return (
      <ProConfigProvider
        valueTypeMap={{
          slider: {
            render: (text, restProps) => <FieldSlider {...restProps} text={text} />,
            formItemRender: (text, restProps) => (<FieldSlider {...restProps} text={text} />),
          },
        }}
      >
        <ProFormField
          {...attrs}
          {...rest}
          valueType="slider"
          fieldProps={{
            ...fieldProps,
            min,
            max,
            step,
            marks,
            vertical,
            range,
            style: fieldProps?.style,
          }}
          proFieldProps={proFieldProps}
          fieldConfig={rest.fieldConfig || {
            ignoreWidth: true,
          }}
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProFormSlider',
  inheritAttrs: false,
})

export default ProFormSlider
