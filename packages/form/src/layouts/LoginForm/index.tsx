import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { CSSProperties, SetupContext } from 'vue'
import type { ProFormRef, SubmitterProps } from '../../BaseForm'
import type { WithFalse } from '../../typing'
import type { ProFormProps } from '../ProForm'
import { useIntl } from '@antdv-next1/pro-provider'
import { transformBooleanProps } from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { useProFormInstanceExpose } from '../../utils'
import ProForm from '../ProForm'
import useStyle from './style'

export type ProLoginFormProps<T, U> = {
  /**
   * @name message form 顶部的一个提示配置，可以配置一些错误的提示信息
   * @example <caption>提示登录异常</caption>
   * message={<Alert message="登录异常，请重试！"/>}
   */
  message?: WithFalse<VueNode>
  /**
   * @name title 标题，可以配置为空
   */
  title?: WithFalse<VueNode>
  /**
   * @name subTitle 二级标题，可以配置为空
   */
  subTitle?: WithFalse<VueNode>
  /**
   * @name actions 自定义额外的登录功能
   *
   * @example <caption>配置支付宝登录</caption>
   * actions={<a>跳转支付宝登录</a>}
   *
   * @example <caption>使用图标</caption>
   * actions={<a><Icon type="alipay" />跳转支付宝登录</a>}
   */
  actions?: VueNode
  /**
   * @name logo 的配置，支持 ReactNode 和 url
   *
   * @example 配置为一个图标
   * logo={<Icon type="alipay" />}
   * @example 配置为一个路径
   * logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
   */
  logo?: VueNode
  /**
   * @name contentStyle 登录框主表格的样式
   */
  contentStyle?: CSSProperties
  /**
   * @name containerStyle 登录框容器的样式
   */
  containerStyle?: CSSProperties
  otherStyle?: CSSProperties
} & Omit<ProFormProps<T, U>, 'title'>

const ProLoginForm = defineComponent(<T extends Record<string, any>, U extends Record<string, any>>(props: ProLoginFormProps<T, U>, { expose, slots, attrs }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const config = useConfig()
  const formRef = shallowRef<ProFormRef<T>>()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-form-login`)
  const [hashId, cssVarCls] = useStyle(baseClassName)

  const intl = useIntl()
  /** 生成logo 的dom，如果是string 设置为图片 如果是个 dom 就原样保留 */
  const logoDom = computed(() => {
    if (!props.logo)
      return null
    if (typeof props.logo === 'string') {
      return <img src={props.logo} alt="logo" />
    }
    return props.logo
  })
  expose(useProFormInstanceExpose(formRef))
  return () => {
    const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'readonly'], props)
    const {
      logo,
      message,
      contentStyle,
      title,
      subTitle,
      actions,
      containerStyle,
      otherStyle,
      ...proFormProps
    } = { ...props, ...transformedProps }
    const { class: className, ...restAttrs } = attrs

    const submitter
      = proFormProps.submitter === false
        ? false
        : ({
            searchConfig: {
              submitText: intl.value.getMessage({ id: 'loginForm.submitText', defaultMessage: '登录' }),
            },
            ...proFormProps.submitter,
            submitButtonProps: {
              size: 'large',
              style: {
                width: '100%',
              },
              ...proFormProps.submitter?.submitButtonProps,
            },
            render: (_, dom) => {
              const loginButton = dom.pop()
              if (
                typeof (proFormProps?.submitter as SubmitterProps)?.render
                === 'function'
              ) {
                return (
                  proFormProps?.submitter as {
                    render: Exclude<SubmitterProps['render'], false>
                  }
                )?.render?.(_, dom)
              }
              return loginButton
            },
          } as ProFormProps<T, U>['submitter'])

    return (
      <div class={classNames(`${baseClassName.value}-container`, className, hashId.value, cssVarCls.value)} style={containerStyle}>
        <div class={classNames(`${baseClassName.value}-top`, hashId.value, cssVarCls.value)}>
          {title || logoDom.value ? (
            <div class={classNames(`${baseClassName.value}-header`, hashId.value, cssVarCls.value)}>
              {logoDom.value ? (
                <span class={classNames(`${baseClassName.value}-logo`, hashId.value, cssVarCls.value)}>{logoDom.value}</span>
              ) : null}
              {title ? (
                <span class={classNames(`${baseClassName.value}-title`, hashId.value, cssVarCls.value)}>{title}</span>
              ) : null}
            </div>
          ) : null}
          {subTitle ? (
            <div class={classNames(`${baseClassName.value}-desc`, hashId.value, cssVarCls.value)}>{subTitle}</div>
          ) : null}
        </div>
        <div
          class={classNames(`${baseClassName.value}-main`, hashId.value, cssVarCls.value)}
          style={{
            width: unit(328),
            ...contentStyle,
          }}
        >
          <ProForm
            {...restAttrs}
            isKeyPressSubmit
            ref={formRef}
            {...proFormProps}
            name={proFormProps.name || 'login-form'}
            submitter={submitter}
            v-slots={
              {
                ...slots,
                default: () => (
                  <>
                    {message}
                    {slots.default?.()}
                  </>
                ),
              }
            }
          />
          {actions ? (
            <div class={classNames(`${baseClassName.value}-main-other`, hashId.value, cssVarCls.value)} style={otherStyle}>
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}, {
  name: 'ProLoginForm',
  inheritAttrs: false,
  props: [
    'actions',
    'autoComplete',
    'autoFocusFirstInput',
    'autocomplete',
    'classes',
    'clearOnDestroy',
    'colProps',
    'colon',
    'containerStyle',
    'contentStyle',
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
    'logo',
    'message',
    'model',
    'name',
    'omitNil',
    'onFieldsChange',
    'onFinish',
    'onFinishFailed',
    'onInit',
    'onLoadingChange',
    'onReset',
    'onSubmit',
    'onValidate',
    'onValuesChange',
    'otherStyle',
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
    'subTitle',
    'submitter',
    'syncToModel',
    'syncToUrl',
    'syncToUrlAsImportant',
    'title',
    'tooltip',
    'validateMessages',
    'validateOnRuleChange',
    'validateTrigger',
    'variant',
    'wrapperCol',
  ],
})

export default ProLoginForm
