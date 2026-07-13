import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ButtonProps, FormInstance } from 'antdv-next'
import type { ClassValue, SetupContext, StyleValue } from 'vue'
import type { SubmitterRender } from '../../RenderTypings'
import type { WithFalse } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { omit } from '@v-c/util'
import { Button, Form, Space } from 'antdv-next'
import { defineComponent } from 'vue'

/** @name SearchConfig 用于配置操作栏 */
export interface SearchConfig {
  /** @name resetText 重置按钮的文本 */
  resetText?: VueNode
  /** @name submitText 提交按钮的文本 */
  submitText?: VueNode
}

export interface SubmitterProps<T extends Record<string, any> = Record<string, any>> {
  /** @name onSubmit 提交方法 */
  onSubmit?: (values?: T) => void
  /** @name onReset 重置方法 */
  onReset?: (values?: T) => void
  /** @name searchConfig 搜索的配置，一般用来配置文本 */
  searchConfig?: SearchConfig
  /** @name submitButtonProps 提交按钮的 props */
  submitButtonProps?: WithFalse<ButtonProps & { preventDefault?: boolean, class?: ClassValue, style?: StyleValue }>
  /** @name resetButtonProps 重置按钮的 props */
  resetButtonProps?: WithFalse<ButtonProps & { preventDefault?: boolean, class?: ClassValue, style?: StyleValue }>
  /** @name render 自定义操作的渲染 */
  render?: SubmitterRender<T>
  form?: FormInstance
}

const Submitter = defineComponent(
  <T extends Record<string, any>>(props: SubmitterProps<T>, { slots }: SetupContext<
    {},
    CustomSlotsType<{
      default?: () => VueNode
      render?: (
        props: SubmitterProps<T> & {
          submit: () => void
          reset: () => void
        },
        dom: VueNode[],
      ) => VueNode
    }>
  >) => {
    /**
     * 获取 form 实例
     */
    const form = (
      Form as unknown as { useFormInstance: () => FormInstance }
    ).useFormInstance()
    const intl = useIntl()
    const submit = () => {
      form?.submit()
      props.onSubmit?.(undefined)
    }
    const reset = () => {
      form?.resetFields()
      props.onReset?.()
    }
    return () => {
      const {
        render = slots.render,
        searchConfig = {},
        submitButtonProps,
        resetButtonProps,
      } = props
      if (render === false) {
        return null
      }
      const {
        submitText = intl.value.getMessage({ id: 'tableForm.submit', defaultMessage: '提交' }),
        resetText = intl.value.getMessage({ id: 'tableForm.reset', defaultMessage: '重置' }),
      } = searchConfig
      /** 默认的操作的逻辑 */
      const dom: VueNode[] = []
      if (resetButtonProps !== false) {
        dom.push(
          <Button
            {...omit(resetButtonProps ?? {}, ['preventDefault'])}
            key="rest"
            onClick={(e) => {
              if (!resetButtonProps?.preventDefault)
                reset()
              resetButtonProps?.onClick?.(
                e,
              )
            }}
          >
            {resetText}
          </Button>,
        )
      }
      if (submitButtonProps !== false) {
        dom.push(
          <Button
            type="primary"
            {...omit(submitButtonProps || {}, ['preventDefault'])}
            key="submit"
            onClick={(e) => {
              if (!submitButtonProps?.preventDefault)
                submit()
              submitButtonProps?.onClick?.(
                e,
              )
            }}
          >
            {submitText}
          </Button>,
        )
      }
      const renderDom = render ? render({ ...props, form, submit, reset }, dom) : dom
      if (!renderDom) {
        return null
      }
      if (Array.isArray(renderDom)) {
        if (renderDom?.length < 1) {
          return null
        }
        if (renderDom?.length === 1) {
          return <>{renderDom[0]}</>
        }
        return <Space align="center">{renderDom}</Space>
      }
      return <>{renderDom}</>
    }
  },
  {
    name: 'Submitter',
    inheritAttrs: false,
    props: ['onReset', 'onSubmit', 'render', 'resetButtonProps', 'searchConfig', 'submitButtonProps'],
  },
)
export default Submitter
