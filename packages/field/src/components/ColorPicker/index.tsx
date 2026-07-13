import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ColorPickerProps } from 'antdv-next'
import type { ProFieldFC } from '../../typing'
import { ColorPicker } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'

export type FieldColorPickerProps = ProFieldFC<{
  text: string
  mode?: 'read' | 'edit' | 'update'
}, ColorPickerProps> & Partial<Omit<ColorPickerProps, 'value' | 'mode'>>

const DEFAULT_PRESETS = {
  label: 'Recommended',
  colors: [
    '#F5222D',
    '#FA8C16',
    '#FADB14',
    '#8BBB11',
    '#52C41A',
    '#13A8A8',
    '#1677FF',
    '#2F54EB',
    '#722ED1',
    '#EB2F96',
    '#F5222D4D',
    '#FA8C164D',
    '#FADB144D',
    '#8BBB114D',
    '#52C41A4D',
    '#13A8A84D',
    '#1677FF4D',
    '#2F54EB4D',
    '#722ED14D',
    '#EB2F964D',
  ],
}

const FieldColorPicker = defineComponent<FieldColorPickerProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { slots }) => {
    const config = useConfig()
    const className = computed(() => config.value.getPrefixCls('field-color-picker'))
    return () => {
      const { text, mode: type, render, formItemRender, fieldProps, ...rest } = props
      if (type === 'read') {
        const dom = (
          <ColorPicker
            value={text}
            class={className.value}
            open={false}
            v-slots={slots}
          />
        )
        if (render) {
          return <>{render(text, { mode: type, ...rest, fieldProps }, dom)}</>
        }
        return dom
      }
      if (type === 'edit' || type === 'update') {
        // 解决 默认的 width 100% 问题
        const style = {
          display: 'table-cell',
          ...fieldProps?.style,
        }
        const dom = (
          <ColorPicker
            presets={[DEFAULT_PRESETS]}
            {...fieldProps}
            style={style}
            class={className.value}
            v-slots={slots}
          />
        )
        if (formItemRender) {
          return <>{formItemRender(text, { mode: type, ...rest, fieldProps, style }, dom)}</>
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldColorPicker',
    inheritAttrs: false,
  },
)
export default FieldColorPicker
