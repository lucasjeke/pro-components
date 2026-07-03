import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { FormProps, ModalProps } from 'antdv-next'
import type { SetupContext, VNode } from 'vue'
import type { CommonFormProps, ProFormRef, SubmitterProps } from '../../BaseForm'
import { transformBooleanProps, useEffect, useState } from '@antdv-next1/pro-utils'
import { merge, useMergedState } from '@v-c/util'
import { Modal } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { cloneVNode, computed, defineComponent, shallowRef, Teleport } from 'vue'
import { BaseForm } from '../../BaseForm'
import { useProFormInstanceExpose } from '../../utils'

export type ProModalFormProps<T = Record<string, any>, U = Record<string, any>> = Omit<
  FormProps,
  'onFinish' | 'title'
>
& CommonFormProps<T, U> & {
  /**
   * 接收任意值，返回 真值 会关掉这个抽屉
   *
   * @name onFinish 表单结束后调用
   *
   * @example 结束后关闭抽屉
   * onFinish: async ()=> {await save(); return true}
   *
   * @example 结束后不关闭抽屉
   * onFinish: async ()=> {await save(); return false}
   */
  onFinish?: (formData: T) => Promise<any>

  /** @name submitTimeout 提交数据时，禁用取消按钮的超时时间（毫秒）。 */
  submitTimeout?: number

  /** @name trigger 用于触发抽屉打开的 dom */
  trigger?: VNode<any, any, { onClick?: (e: MouseEvent) => void }>

  /** @name open 受控的打开关闭 */
  open?: ModalProps['open']

  /** @name onUpdate:open 受控的打开关闭事件 */
  'onUpdate:open'?: ModalProps['onUpdate:open']

  /** @name onOpenChange 打开关闭的事件 */
  onOpenChange?: (open: boolean) => void

  /** @name modalProps 弹框的属性 */
  modalProps?: Omit<ModalProps, 'open'>

  /** @name title 弹框的标题 */
  title?: ModalProps['title']

  /** @name width 弹框的宽度 */
  width?: ModalProps['width']
}

const ProModalForm = defineComponent(
  <T extends Record<string, any>, U extends Record<string, any>>(
    props: ProModalFormProps<T, U>,
    {
      expose,
      slots,
      attrs,
    }: SetupContext<
      {},
      CustomSlotsType<{
        default?: () => VueNode
      }>
    >,
  ) => {
    const formRef = shallowRef<ProFormRef<T>>()
    const config = useConfig()
    const footerDomRef = shallowRef<HTMLDivElement | null>(null)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useMergedState(() => props.open || false, {
      defaultValue: false,
      value: computed(() => props.open),
      onChange: (_open) => {
        props.onOpenChange?.(_open!)
        props['onUpdate:open']?.(_open!)
      },
    })
    useEffect(() => {
      if (props.open) {
        props.onOpenChange?.(true)
      }
    }, [() => props.open])
    const proFormInstanceExpose = useProFormInstanceExpose(formRef)
    const handleFinish = async (values: T) => {
      const response = props.onFinish?.(values)
      if (props.submitTimeout && response instanceof Promise) {
        setLoading(true)
        const timer = setTimeout(() => setLoading(false), props.submitTimeout)
        try {
          const result = await response
          clearTimeout(timer)
          setLoading(false)
          // 返回真值，关闭弹框
          if (result) {
            setOpen(false)
          }
          return result
        }
        catch (error) {
          clearTimeout(timer)
          setLoading(false)
          throw error
        }
      }
      else if (props.submitTimeout) {
        // 如果 submitTimeout 存在但 response 不是 Promise，也要设置 loading
        setLoading(true)
        const timer = setTimeout(() => setLoading(false), props.submitTimeout)
        try {
          const result = await response
          clearTimeout(timer)
          setLoading(false)
          // 返回真值，关闭弹框
          if (result) {
            setOpen(false)
          }
          return result
        }
        catch (error) {
          clearTimeout(timer)
          setLoading(false)
          throw error
        }
      }
      const result = await response
      // 返回真值，关闭弹框
      if (result) {
        setOpen(false)
      }
      return result
    }
    expose(proFormInstanceExpose)
    return () => {
      const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'readonly', 'open'], props)
      const {
        trigger,
        onOpenChange,
        modalProps,
        onFinish,
        onInit,
        submitTimeout,
        title,
        width,
        open: propsOpen,
        ...rest
      } = { ...props, ...transformedProps }
      const triggerDom = !trigger
        ? null
        : cloneVNode(trigger, {
            ...trigger.props,
            onClick: async () => {
              if (!props.open) {
                setOpen(!open.value)
              }
            },
          })
      const submitterConfig
        = rest.submitter === false
          ? false
          : merge(
              {
                searchConfig: {
                  submitText: modalProps?.okText ?? config.value.locale?.Modal?.okText ?? '确认',
                  resetText:
                    modalProps?.cancelText ?? config.value.locale?.Modal?.cancelText ?? '取消',
                },
                resetButtonProps: {
                  preventDefault: true,
                  disabled: submitTimeout && loading.value,
                  onClick: (e: MouseEvent) => {
                    setOpen(false)
                    modalProps?.onCancel?.(e)
                  },
                },
              } as SubmitterProps,
              rest.submitter ?? {},
            )
      return (
        <>
          <Modal
            title={title}
            width={width || 800}
            {...modalProps}
            open={open.value}
            onCancel={(e) => {
              // 提交表单loading时，阻止弹框关闭
              if (submitTimeout && loading.value)
                return
              setOpen(false)
              modalProps?.onCancel?.(e)
            }}
            afterClose={() => {
              // 确保在关闭时立即重置表单
              if (modalProps?.destroyOnHidden) {
                formRef.value?.resetFields()
              }
              if (open.value) {
                setOpen(false)
              }
              modalProps?.afterClose?.()
            }}
            footer={
              rest.submitter !== false ? (
                <div
                  ref={footerDomRef}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                />
              ) : null
            }
          >
            <BaseForm<T, U>
              ref={formRef}
              {...attrs}
              {...rest}
              formComponentType="ModalForm"
              layout="vertical"
              name={rest.name || 'modal-form'}
              onInit={(_, form) => {
                onInit?.(_, form)
                formRef.value = form
              }}
              submitter={submitterConfig}
              onFinish={async (values) => {
                const result = await handleFinish(values)
                // fix: #6006 如果 result 为 true,那么必然会触发弹窗关闭，我们无需在 此处重置表单，只需在弹窗关闭时重置即可
                return result
              }}
              contentRender={(items, submitter) => (
                <>
                  {items}
                  {footerDomRef.value && submitter ? (
                    <Teleport to={footerDomRef.value}>{submitter}</Teleport>
                  ) : (
                    submitter
                  )}
                </>
              )}
              v-slots={slots}
            />
          </Modal>
          {triggerDom}
        </>
      )
    }
  },
  {
    name: 'ProModalForm',
    inheritAttrs: false,
    props: [
      'autoComplete',
      'autoFocusFirstInput',
      'classes',
      'clearOnDestroy',
      'colProps',
      'colon',
      'dateFormatter',
      'disabled',
      'extraUrlParams',
      'feedbackIcons',
      'formKey',
      'grid',
      'isKeyPressSubmit',
      'labelAlign',
      'labelCol',
      'labelWrap',
      'layout',
      'loading',
      'modalProps',
      'model',
      'name',
      'omitNil',
      'onFieldsChange',
      'onFinish',
      'onFinishFailed',
      'onInit',
      'onLoadingChange',
      'formRef',
      'onUpdate:open',
      'onOpenChange',
      'onReset',
      'onSubmit',
      'onValidate',
      'onValuesChange',
      'open',
      'params',
      'prefixCls',
      'preserve',
      'readonly',
      'request',
      'requiredMark',
      'rootClass',
      'rowProps',
      'rules',
      'scrollToFirstError',
      'size',
      'styles',
      'submitTimeout',
      'submitter',
      'syncToModel',
      'syncToUrl',
      'syncToUrlAsImportant',
      'title',
      'tooltip',
      'trigger',
      'validateMessages',
      'validateOnRuleChange',
      'validateTrigger',
      'variant',
      'width',
      'wrapperCol',
    ],
  },
)

export default ProModalForm
