import type { PopoverProps } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { CSSProperties, FunctionalComponent } from 'vue'
import type { FormItemProps } from '../FormItem'
import { unit } from '@antdv-next/cssinjs'
import FormItem from '../FormItem'
import InlineErrorFormItemPopover from './InlineErrorFormItemPopover'

type InlineErrorFormItemProps = FormItemProps & {
  errorType?: 'popover' | 'default'
  popoverProps?: PopoverProps
  style?: CSSProperties
  class?: string
}

type InternalProps = InlineErrorFormItemProps & {
  name: NamePath<string | number | boolean>
  rules: FormItemProps['rules']
}

const FIX_INLINE_STYLE = {
  marginBlockStart: unit(-5),
  marginBlockEnd: unit(-5),
  marginInlineStart: 0,
  marginInlineEnd: 0,
}

const InternalFormItemFunction: FunctionalComponent<InternalProps & FormItemProps> = (
  { rules, name, popoverProps, style, ...rest },
  { slots },
) => (
  <FormItem
    {...rest}
    name={name}
    _internalItemRender={{
      mark: 'pro_table_render',
      render: (inputProps, doms) => (<InlineErrorFormItemPopover inputProps={inputProps} popoverProps={popoverProps} {...doms} />),
    }}
    rules={rules}
    hasFeedback={false}
    style={{
      ...FIX_INLINE_STYLE,
      ...style,
    }}
    v-slots={slots}
  />
)

const InlineErrorFormItem: FunctionalComponent<InlineErrorFormItemProps> = (
  { errorType, rules = [], name, popoverProps, style, ...rest },
  { slots },
) => {
  if (name && Array.isArray(rules) && rules?.length && errorType === 'popover') {
    return (
      <InternalFormItemFunction
        name={name}
        rules={rules!}
        popoverProps={popoverProps}
        {...rest}
        v-slots={slots}
      />
    )
  }
  return (
    <FormItem
      {...rest}
      rules={rules}
      name={name}
      style={{ ...FIX_INLINE_STYLE, ...style }}
      v-slots={slots}
    />
  )
}

export default InlineErrorFormItem
