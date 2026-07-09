import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { DrawerProps, FormProps } from 'antdv-next'
import type { SetupContext, VNode } from 'vue'
import type { CommonFormProps, ProFormRef, SubmitterProps } from '../../BaseForm'
import { useIntl } from '@antdv-next1/pro-provider'
import { isBrowser, omitUndefined, transformBooleanProps, useEffect, useState } from '@antdv-next1/pro-utils'
import { classNames, merge } from '@v-c/util'
// import { noteOnce } from '@v-c/util/dist/warning'
import { Drawer } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { cloneVNode, computed, defineComponent, shallowRef, Teleport } from 'vue'
import { BaseForm } from '../../BaseForm'
import { useProFormInstanceExpose } from '../../utils'
import useStyle from './style'

export interface CustomizeResizeType {
  onResize?: () => void
  maxWidth?: DrawerProps['size']
  minWidth?: DrawerProps['size']
}

export type ProDrawerFormProps<
  T = Record<string, any>,
  U = Record<string, any>,
> = Omit<FormProps, 'onFinish' | 'title'>
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

    /** @name trigger 用于触发抽屉打开的 dom ，只能设置一个 */
    trigger?: VNode<any, any, { onClick?: (e: MouseEvent) => void }>

    /** @name open 受控的打开关闭 */
    open?: DrawerProps['open']

    /** @name onOpenChange 打开关闭的事件 */
    onOpenChange?: (open: boolean) => void

    /** @name drawerProps 抽屉的配置 */
    drawerProps?: Omit<DrawerProps, 'open'>

    /** @name title 抽屉的标题 */
    title?: DrawerProps['title']

    /** @name width 抽屉的宽度 */
    width?: DrawerProps['size']

    /**
     *
     * @name resize  draggableDrawer
     */
    resize?: CustomizeResizeType | boolean
  }

const ProDrawerForm = defineComponent(<T extends Record<string, any>, U extends Record<string, any>>(props:
ProDrawerFormProps<T, U>, { expose, attrs, slots }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
  const intl = useIntl()
  const config = useConfig()
  const footerDomRef = shallowRef<HTMLDivElement | null>(null)
  const formRef = shallowRef<ProFormRef<T>>()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-form-drawer`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const proFormInstanceExpose = useProFormInstanceExpose(formRef)
  const [open, setOpen] = useState<boolean>(props.open)
  const [loading, setLoading] = useState(false)
  const [resizableDrawer, setResizableDrawer] = useState(false)

  const resizeInfo = computed<CustomizeResizeType>(() => {
    const defaultResize: CustomizeResizeType = {
      onResize: () => {},
      maxWidth: isBrowser() ? window.innerWidth * 0.8 : undefined,
      minWidth: 300,
    }
    if (typeof props.resize === 'boolean') {
      if (props.resize) {
        return defaultResize
      }
      else {
        return {}
      }
    }
    return omitUndefined({
      onResize: props.resize?.onResize ?? defaultResize.onResize,
      maxWidth: props.resize?.maxWidth ?? defaultResize.maxWidth,
      minWidth: props.resize?.minWidth ?? defaultResize.minWidth,
    })
  })
  const [drawerWidth, setDrawerWidth] = useState<DrawerProps['size']>(
    props.width || (props.resize ? resizeInfo.value?.minWidth : 800),
  )
  useEffect(() => {
    if (open.value) {
      props.onOpenChange?.(true)
    }
    if (resizableDrawer.value) {
      setDrawerWidth(resizeInfo.value?.minWidth)
    }
  }, [open, resizableDrawer])
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
  const handleMouseMove = (e: MouseEvent) => {
    const offsetRight: number | string = ((document.body.offsetWidth
      || 1000)
    - (e.clientX - document.body.offsetLeft)) as number | string
    const minWidth = resizeInfo.value?.minWidth ?? (props.width || 800)
    const maxWidth = resizeInfo.value?.maxWidth ?? window.innerWidth * 0.8

    if (offsetRight < minWidth) {
      setDrawerWidth(minWidth)
      return
    }
    if (offsetRight > maxWidth) {
      setDrawerWidth(maxWidth)
      return
    }

    setDrawerWidth(offsetRight)
  }
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  expose(proFormInstanceExpose)
  return () => {
    const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'open', 'resize', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'readonly'], props)
    const { trigger, drawerProps, onFinish, onInit, submitTimeout, title, width, resize, onOpenChange, open: propsOpen, ...rest } = { ...props, ...transformedProps }
    const triggerDom = !trigger ? null : cloneVNode(trigger, {
      ...trigger.props,
      onClick: async () => {
        setOpen(!open.value)
        setResizableDrawer(!Object.keys(resizeInfo.value))
      },
    })
    const submitterConfig = rest.submitter === false ? false : merge(
      {
        searchConfig: {
          submitText: config.value.locale?.Modal?.okText ?? intl.value.getMessage({ id: 'form.modal.okText', defaultMessage: '确认' }),
          resetText: config.value.locale?.Modal?.cancelText ?? intl.value.getMessage({ id: 'form.modal.cancelText', defaultMessage: '取消' }),
        },
        resetButtonProps: {
          preventDefault: true,
          disabled: submitTimeout && loading.value,
          onClick: (e) => {
            setOpen(false)
            drawerProps?.onClose?.(e)
          },
        },
      } as SubmitterProps,
      rest.submitter ?? {},
    )
    return (
      <>
        <Drawer
          {...drawerProps}
          destroyOnHidden={drawerProps?.destroyOnHidden}
          title={title}
          size={drawerWidth.value}
          open={open.value}
          afterOpenChange={(open) => {
            if (!open && drawerProps?.destroyOnHidden) {
              formRef.value?.resetFields()
            }
            drawerProps?.afterOpenChange?.(open)
            onOpenChange?.(open)
          }}
          onClose={(e) => {
          // 提交表单loading时，阻止弹框关闭
            if (submitTimeout && loading.value)
              return
            setOpen(false)
            drawerProps?.onClose?.(e)
          }}
          footer={
            rest.submitter !== false && (
              <div
                ref={footerDomRef}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
            )
          }
        >
          {resize ? (
            <div
              class={classNames(`${baseClassName.value}-sidebar-dragger`, hashId.value, cssVarCls.value, {
                [`${baseClassName.value}sidebar-dragger-min-disabled`]:
                drawerWidth.value === resizeInfo.value?.minWidth,
                [`${baseClassName.value}-sidebar-dragger-max-disabled`]:
                drawerWidth.value === resizeInfo.value?.maxWidth,
              })}
              onMousedown={(e) => {
                resizeInfo.value?.onResize?.()
                e.stopPropagation()
                e.preventDefault()
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
                setResizableDrawer(true)
              }}
            />
          ) : null}
          <BaseForm<T, U>
            ref={formRef}
            {...attrs}
            {...rest}
            formComponentType="DrawerForm"
            layout="vertical"
            name={rest.name || 'drawer-form'}
            onInit={(_, form) => {
              onInit?.(_, form)
              formRef.value = form
            }}
            submitter={submitterConfig}
            onFinish={async (values) => {
              const result = await handleFinish(values)
              return result
            }}
            contentRender={(items, submitter) => (
              <>
                {items}
                {footerDomRef.value && submitter ? (
                  <Teleport to={footerDomRef.value}>
                    {submitter}
                  </Teleport>
                ) : (
                  submitter
                )}
              </>
            )}
            v-slots={slots}
          />
        </Drawer>
        {triggerDom}
      </>
    )
  }
}, {
  name: 'ProDrawerForm',
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
    'drawerProps',
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
    'onValidate',
    'onValuesChange',
    'open',
    'params',
    'prefixCls',
    'preserve',
    'readonly',
    'request',
    'requiredMark',
    'resize',
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
})

export default ProDrawerForm
