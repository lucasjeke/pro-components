import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { CSSProperties, SetupContext } from 'vue'
import type { ProFormRef } from '../../BaseForm'
import type { WithFalse } from '../../typing'
import type { ProFormProps } from '../ProForm'
import { useIntl } from '@antdv-next1/pro-provider'
import { transformBooleanProps } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { useProFormInstanceExpose } from '../../utils'
import ProForm from '../ProForm'
import useStyle from './style'

export type ProLoginFormPageProps<T extends Record<string, any>, U extends Record<string, any>> = {
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
   * @name logo 的配置，支持node 和 string
   */
  logo?: VueNode | string
  /**
   * @name activityConfig 活动信息的配置，一个页面应该只有一个。
   * @example <caption>配置一个简单的活动。</caption>
   * activityConfig={{title:"这里有个大活动",description:"这里有个大活动的描述",action:<a>点我去看看</a>}}
   */
  activityConfig?: {
    title?: VueNode
    subTitle?: VueNode
    action?: VueNode
    style?: CSSProperties
  }
  /**
   * @name backgroundImageUrl 登录页面的背景图片，可以用它来设置一个背景
   *
   * @example  backgroundImageUrl="xxx.svg"
   */
  backgroundImageUrl?: string
  /**
   * @name 登录页面的背景视频，可以用它来设置一个背景，优先级高于 backgroundImageUrl
   *
   * @example  backgroundImageUrl="xxx.svg"
   */
  backgroundVideoUrl?: string

  containerStyle?: CSSProperties
  mainStyle?: CSSProperties
  otherStyle?: CSSProperties
} & Omit<ProFormProps<T, U>, 'title'>

const ProLoginFormPage = defineComponent(<T extends Record<string, any>, U extends Record<string, any>>(props: ProLoginFormPageProps<T, U>, { expose, slots, attrs }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-form-login-page`)
  const formRef = shallowRef<ProFormRef<T>>()
  const intl = useIntl()
  const [hashId, cssVarCls] = useStyle(baseClassName)
  /** 生成logo 的dom，如果是string 设置为图片 如果是个 dom 就原样保留 */
  const logoDom = computed(() => {
    if (!props.logo)
      return null
    if (typeof props.logo === 'string') {
      return <img src={props.logo} alt="logo" />
    }
    return props.logo
  })
  const genSubmitButtonProps = () => {
    if (props.submitter === false)
      return false
    if (props.submitter?.submitButtonProps === false)
      return false
    return {
      size: 'large',
      style: {
        width: '100%',
      },
      ...props.submitter?.submitButtonProps,
    }
  }
  expose(useProFormInstanceExpose(formRef))
  return () => {
    const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'readonly'], props)
    const {
      logo,
      message,
      activityConfig,
      backgroundImageUrl,
      backgroundVideoUrl,
      title,
      subTitle,
      actions,
      containerStyle,
      otherStyle,
      mainStyle,
      ...proFormProps
    } = { ...props, ...transformedProps }
    const { style, ...restAttrs } = attrs
    const submitter = {
      searchConfig: {
        submitText: intl.value.getMessage({ id: 'loginForm.submitText', defaultMessage: '登录' }),
      },
      render: (_, dom) => dom.pop(),
      ...proFormProps.submitter,
      submitButtonProps: genSubmitButtonProps(),
    } as ProFormProps<T, U>['submitter']

    return (
      <div
        class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}
        style={{
          ...((style || {}) as CSSProperties),
          position: 'relative',
          backgroundImage: backgroundImageUrl
            ? `url("${backgroundImageUrl}")`
            : undefined,
        }}
      >
        {backgroundVideoUrl ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              overflow: 'hidden',
              height: '100%',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <video
              src={backgroundVideoUrl}
              controls={false}
              autoplay
              playsinline
              loop
              muted={true}
              crossorigin="anonymous"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ) : null}
        <div class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}>
          <div class={classNames(`${baseClassName.value}-notice`, hashId.value, cssVarCls.value)}>
            {activityConfig && (
              <div
                class={classNames(`${baseClassName.value}-notice-activity`, hashId.value, cssVarCls.value)}
                style={activityConfig.style}
              >
                {activityConfig.title && (
                  <div class={classNames(`${baseClassName.value}-notice-activity-title`, hashId.value, cssVarCls.value)}>
                    {activityConfig.title}
                  </div>
                )}
                {activityConfig.subTitle && (
                  <div
                    class={classNames(
                      `${baseClassName.value}-notice-activity-subTitle`,
                      hashId.value,
                      cssVarCls.value,
                    )}
                  >
                    {activityConfig.subTitle}
                  </div>
                )}
                {activityConfig.action && (
                  <div
                    class={classNames(`${baseClassName.value}-notice-activity-action`, hashId.value, cssVarCls.value)}
                  >
                    {activityConfig.action}
                  </div>
                )}
              </div>
            )}
          </div>
          <div class={classNames(`${baseClassName.value}-left`, hashId.value, cssVarCls.value)}>
            <div
              class={classNames(`${baseClassName.value}-container`, hashId.value, cssVarCls.value)}
              style={containerStyle}
            >
              <div class={classNames(`${baseClassName.value}-top`, hashId.value, cssVarCls.value)}>
                {title || logoDom.value ? (
                  <div class={classNames(`${baseClassName.value}-header`, hashId.value, cssVarCls.value)}>
                    {logoDom.value ? (
                      <span class={classNames(`${baseClassName.value}-logo`, hashId.value, cssVarCls.value)}>
                        {logoDom.value}
                      </span>
                    ) : null}
                    {title ? (
                      <span class={classNames(`${baseClassName.value}-title`, hashId.value, cssVarCls.value)}>
                        {title}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {subTitle ? (
                  <div class={classNames(`${baseClassName.value}-desc`, hashId.value, cssVarCls.value)}>
                    {subTitle}
                  </div>
                ) : null}
              </div>
              <div class={classNames(`${baseClassName.value}-main`, hashId.value, cssVarCls.value)} style={mainStyle}>
                <ProForm
                  {...restAttrs}
                  isKeyPressSubmit
                  {...proFormProps}
                  name={proFormProps.name || 'login-form-page'}
                  submitter={submitter}
                  v-slots={{
                    ...slots,
                    default: () => (
                      <>
                        {message}
                        {slots.default?.()}
                      </>
                    ),
                  }}
                />
                {actions ? (
                  <div
                    class={classNames(`${baseClassName.value}-other`, hashId.value, cssVarCls.value)}
                    style={otherStyle}
                  >
                    {actions}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}, {
  name: 'ProLoginFormPage',
  inheritAttrs: false,
  props: [
    'actions',
    'activityConfig',
    'autoComplete',
    'autoFocusFirstInput',
    'autocomplete',
    'backgroundImageUrl',
    'backgroundVideoUrl',
    'classes',
    'clearOnDestroy',
    'colProps',
    'colon',
    'containerStyle',
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
    'mainStyle',
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

export default ProLoginFormPage
