import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { FormProps, ModalProps } from 'antdv-next'
import type { SetupContext, VNode } from 'vue'
import type { CommonFormProps, ProFormRef, SubmitterProps } from '../../BaseForm'
import { useIntl } from '@antdv-next1/pro-provider'
import { Draggable, transformBooleanProps, useEffect, useState } from '@antdv-next1/pro-utils'
import { FullscreenExitOutlined, FullscreenOutlined } from '@antdv-next/icons'
import { classNames, merge, useMergedState } from '@v-c/util'
import { Button, Modal } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { cloneVNode, computed, defineComponent, shallowRef, Teleport } from 'vue'
import { BaseForm } from '../../BaseForm'
import { useProFormInstanceExpose } from '../../utils'
import useStyle from './style'

export type ProModalFormProps<T = Record<string, any>, U = Record<string, any>> = Omit<
  FormProps,
  'onFinish' | 'title' | 'onReset'
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
  onReset?: (values?: T) => void

  /** @name submitTimeout 提交数据时，禁用取消按钮的超时时间（毫秒）。 */
  submitTimeout?: number

  /** @name trigger 用于触发抽屉打开的 dom */
  trigger?: VNode<unknown, unknown, { onClick?: (e: MouseEvent) => void }>

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
  /** @name fullscreenable 是否显示全屏按钮  */
  fullscreenable?: boolean
  /** @name draggable 是否允许拖拽 */
  draggable?: boolean | { bounds?: 'none' }
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
        title?: () => VueNode
        okText?: () => VueNode
        cancelText?: () => VueNode
        closeIcon?: () => VueNode
        modalRender?: (node: VueNode) => VueNode
        footer?: (params: {
          originNode: VueNode
          extra: {
            OkBtn: VueNode
            CancelBtn: VueNode
          }
        }) => VueNode
      }>
    >,
  ) => {
    const formRef = shallowRef<ProFormRef<T>>()
    const intl = useIntl()
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-modal-form`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const footerDomRef = shallowRef<HTMLDivElement | null>(null)
    const draggleRef = shallowRef<HTMLDivElement | null>(null)
    const [loading, setLoading] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
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
      const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'fullscreenable', 'draggable', 'readonly', 'open'], props)
      const {
        trigger,
        onOpenChange,
        modalProps,
        onFinish,
        onInit,
        submitTimeout,
        title: propsTitle,
        width: propsWidth,
        open: propsOpen,
        fullscreenable: propsFullScreenable,
        draggable,
        ...rest
      } = { ...props, ...transformedProps }
      const {
        title: modalPropsTitle,
        width: modalPropsWidth,
        modalRender: modalPropsRender,
        footer: modalPropsFooter,
        okText: modalPropsOkText,
        cancelText: modalPropsCancelText,
        ...restModalProps
      } = modalProps || {}
      const {
        default: slotDefault,
        title: slotTitle,
        modalRender: slotModalRender,
        footer: slotFooter,
        okText: slotOkText,
        cancelText: slotCancelText,
        ...restSlots
      } = slots
      const title = slotTitle ? slotTitle() : (propsTitle ?? modalPropsTitle)
      const width = propsWidth ?? modalPropsWidth ?? 800
      const hasCustomFooter = Boolean(slotFooter) || modalPropsFooter !== undefined
      const customFooter = slotFooter || modalPropsFooter
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
        = rest.submitter === false || hasCustomFooter
          ? false
          : merge(
              {
                searchConfig: {
                  submitText: slotOkText?.() ?? modalPropsOkText ?? config.value.locale?.Modal?.okText ?? intl.value.getMessage({ id: 'form.modal.okText', defaultMessage: '确认' }),
                  resetText:
                    slotCancelText?.() ?? modalPropsCancelText ?? config.value.locale?.Modal?.cancelText ?? intl.value.getMessage({ id: 'form.modal.cancelText', defaultMessage: '取消' }),
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
      const modalRender = slotModalRender || modalPropsRender
      const renderModal = (modal: VNode<unknown, unknown, ModalProps>) => {
        return modalRender ? modalRender(modal) : modal
      }
      const titleDom = draggable || propsFullScreenable ? (
        <div
          class={classNames(`${baseClassName.value}-title-text`, cssVarCls.value, hashId.value)}
        >
          {title}
        </div>
      ) : title
      return (
        <>
          <Modal
            class={classNames(baseClassName.value, {
              [`${baseClassName.value}-fullscreenable`]: propsFullScreenable,
              [`${baseClassName.value}-draggable`]: draggable,
              [`${baseClassName.value}-is-fullscreen`]: propsFullScreenable && fullScreen.value,
            }, cssVarCls.value, hashId.value)}
            {...(modalRender || draggable ? {
              modalRender: (modal: VNode<unknown, unknown, ModalProps>) => {
                return (
                  <>
                    {draggable && !fullScreen.value ? (
                      <Draggable
                        bounds={typeof draggable !== 'boolean' && draggable.bounds === 'none' ? undefined : bounds.value}
                        cancel={`.${baseClassName.value}-fullscreen`}
                        handle={`.${baseClassName.value}-title-text`}
                        nodeRef={draggleRef}
                        onStart={(_, uiData) => {
                          const { clientWidth, clientHeight } = window.document.documentElement
                          const targetRect = draggleRef.value?.getBoundingClientRect()
                          if (!targetRect) {
                            return
                          }
                          setBounds({
                            left: -targetRect.left + uiData.x,
                            right: clientWidth - (targetRect.right - uiData.x),
                            top: -targetRect.top + uiData.y,
                            bottom: clientHeight - (targetRect.bottom - uiData.y),
                          })
                        }}
                      >
                        <div ref={draggleRef}>{renderModal(modal)}</div>
                      </Draggable>
                    ) : renderModal(modal)}
                  </>
                )
              },
            } : {})}
            title={propsFullScreenable ? (
              <div class={classNames(`${baseClassName.value}-title`, cssVarCls.value, hashId.value)}>
                {titleDom}
                <Button
                  class={classNames(`${baseClassName.value}-fullscreen`, cssVarCls.value, hashId.value)}
                  type="text"
                  aria-label={fullScreen.value ? 'Exit fullscreen' : 'Enter fullscreen'}
                  onClick={() => setFullScreen(!fullScreen.value)}
                >
                  {!fullScreen.value ? <FullscreenOutlined /> : <FullscreenExitOutlined /> }
                </Button>
              </div>
            ) : <>{titleDom}</>}
            {...restModalProps}
            {...(propsFullScreenable ? {
              width: fullScreen.value ? '100vw' : width,
            } : { width })}
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
              setFullScreen(false)
              modalProps?.afterClose?.()
            }}
            footer={
              hasCustomFooter
                ? customFooter
                : rest.submitter !== false
                  ? (
                      <div
                        ref={footerDomRef}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      />
                    )
                  : null
            }
            v-slots={{
              ...restSlots,
            }}
          >
            <BaseForm<T, U>
              ref={formRef}
              {...attrs}
              {...rest}
              formComponentType="ModalForm"
              layout={rest.layout ?? 'vertical'}
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
              v-slots={{
                default: slotDefault,
              }}
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
      'autocomplete',
      'classes',
      'clearOnDestroy',
      'colProps',
      'colon',
      'dateFormatter',
      'disabled',
      'extraUrlParams',
      'feedbackIcons',
      'formKey',
      'formRef',
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
      'onOpenChange',
      'onReset',
      'onSubmit',
      'onUpdate:open',
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
      'fullscreenable',
      'draggable',
    ],
  },
)

export default ProModalForm
