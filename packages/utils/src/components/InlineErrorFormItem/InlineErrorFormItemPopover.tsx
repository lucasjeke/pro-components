import type { VueNode } from '@v-c/util'
import type { PopoverProps } from 'antdv-next'
import type { VNode } from 'vue'
import type { FormItemProps } from '../FormItem'
import { LoadingOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Popover } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import { useEffect } from '../../hooks/useEffect'
import { useState } from '../../hooks/useState'
import useStyle from './style'

export interface InlineErrorFormItemPopoverProps {
  prefixCls?: string
  inputProps: FormItemProps & {
    errors?: VueNode[]
    warnings?: VueNode[]
  }
  input?: VNode | null
  errorList?: VNode | null
  extra?: VNode | null
  popoverProps?: PopoverProps
}

const InlineErrorFormItemPopover = defineComponent<InlineErrorFormItemPopoverProps>((props) => {
  const [open, setOpen] = useState<boolean | undefined>(false)

  const [messages, setMessages] = useState<{
    errors: VueNode[]
    warnings: VueNode[]
  }>({ errors: [], warnings: [] })
  // popoverProps?.open ||
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls())

  useEffect(() => {
    if (props.inputProps.validateStatus !== 'validating') {
      setMessages({
        errors: props.inputProps.errors ?? [],
        warnings: props.inputProps.warnings ?? [],
      })
    }
  }, [() => props.inputProps.errors, () => props.inputProps.warnings, () => props.inputProps.validateStatus])

  const baseClassName = computed(() => `${prefixCls.value}-form-item`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  return () => {
    const { popoverProps, inputProps, input, extra, errorList } = props
    const loading = inputProps.validateStatus === 'validating'
    const hasMessages
      = (messages.value.errors?.length ?? 0) + (messages.value.warnings?.length ?? 0) >= 1
    setOpen(!hasMessages ? false : open.value)
    return (
      <Popover
        key="popover"
        {...popoverProps}
        open={open.value}
        onUpdate:open={(_open) => {
          popoverProps?.['onUpdate:open']?.(_open)
          setOpen(_open)
        }}
        onOpenChange={(changeOpen: boolean) => {
          popoverProps?.onOpenChange?.(changeOpen)
          setOpen(changeOpen)
        }}
        trigger={popoverProps?.trigger || ['click']}
        placement={popoverProps?.placement || 'topLeft'}
        getPopupContainer={popoverProps?.getPopupContainer}
        getTooltipContainer={popoverProps?.getTooltipContainer}
        content={(
          <div
            class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}
            style={{
              margin: 0,
              padding: 0,
            }}
          >
            <div
              class={classNames(`${baseClassName.value}-with-help`, hashId.value, cssVarCls.value)}
            >
              {loading ? <LoadingOutlined /> : null}
              {hasMessages ? (
                <>
                  {messages.value.errors?.map((error, index) => (
                    <div
                      key={`error-${index}`}
                      class={classNames(`${baseClassName.value}-explain-error`, hashId.value, cssVarCls.value)}
                    >
                      {error}
                    </div>
                  ))}
                  {messages.value.warnings?.map((warning, index) => (
                    <div
                      key={`warning-${index}`}
                      class={classNames(`${baseClassName.value}-explain-warning`, hashId.value, cssVarCls.value)}
                    >
                      {warning}
                    </div>
                  ))}
                </>
              ) : errorList}
            </div>
          </div>
        )}
      >
        <>
          {input}
          {extra}
        </>
      </Popover>
    )
  }
}, {
  name: 'InlineErrorFormItemPopover',
  inheritAttrs: false,
})

export default InlineErrorFormItemPopover
