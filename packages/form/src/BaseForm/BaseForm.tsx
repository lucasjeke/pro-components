import type { CommomProFieldProps, FormItemProps, ProFormInstanceType, ProRequestData } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { FormInstance, FormProps } from 'antdv-next'
import type { Dayjs } from 'dayjs'
import type { SetupContext, ShallowRef } from 'vue'
import type { ProFormGroupProps } from '../components'
import type { ContentRender } from '../RenderTypings'
import type { FieldProps, ProFormGridConfig, WithFalse } from '../typing'
import type { SubmitterProps } from './Submitter'
import ProConfigProvider from '@antdv-next1/pro-provider'
import {

  useEffect,
} from '@antdv-next1/pro-utils'
import { ConfigProvider, useConfig } from 'antdv-next'

import { defineComponent, shallowRef } from 'vue'
import { useProFormInstanceExpose } from '../utils'
import BaseFormComponents from './BaseFormComponents'

export type ProFormInstance<T = any> = FormInstance & ProFormInstanceType<T>
export type ProFormRef<T> = ProFormInstance<T> & {
  /** 聚焦方法 */
  focus?: () => void
}
export type CommonFormProps<
  T = Record<string, any>,
  U = Record<string, any>,
> = ProFormGridConfig & {
  /**
   * @name submitter 自定义提交的配置
   *
   * @example 不展示提交按钮和重置按钮
   * submitter={false}
   * @example 修改重置按钮的样式，并且隐藏提交按钮
   * submitter={{resetButtonProps: { type: 'dashed'},submitButtonProps: { style: { display: 'none', }}}}
   *
   * @example 修改提交按钮和重置按钮的顺序
   * submitter={{ render:(props,dom)=> [...dom]}}
   *
   * @example 修改提交和重置按钮文字
   * submitter={{ searchConfig: { submitText: '提交2',resetText: '重置2'}}}
   */
  submitter?: WithFalse<
    SubmitterProps<{
      form?: FormInstance
    }>
  >
  /**
   * @name onFinish 表单结束后调用
   * @description 支持异步操作，更加方便
   *
   * @example onFinish={async (values) => { await save(values); return true }}
   */
  onFinish?: (formData: T) => Promise<boolean | void> | void

  /**
   * @name loading 表单按钮的 loading 状态
   */
  loading?: boolean

  /**
   * @name onLoadingChange 这是一个可选的属性(onLoadingChange)，它接受一个名为loading的参数，类型为boolean，表示加载状态是否改变。
   * 当loading状态发生变化时，将会调用一个函数，这个函数接受这个loading状态作为参数，并且没有返回值(void)。
   */
  onLoadingChange?: (loading: boolean) => void
  /**
   * @name formRef 获取 ProFormInstance
   *
   * ProFormInstance 可以用来获取当前表单的一些信息
   *
   * @example 获取 name 的值 formRef.value.getFieldValue("name");
   * @example 获取所有的表单值 formRef.value.getFieldsValue(true);
   *
   * - formRef.value.nativeElement => `2.29.1+`
   */
  formRef?: ShallowRef<ProFormRef<T> | null>
  /**
   * @name syncToUrl 同步结果到 url 中
   */
  syncToUrl?: boolean | ((values: T & Record<string, any>, type: 'get' | 'set') => T)

  /**
   * @name syncToUrlAsImportant 当 syncToUrl 为 true，在页面回显示时，以url上的参数为主，默认为false
   */
  syncToUrlAsImportant?: boolean

  /**
   * @name extraUrlParams 额外的 url 参数 中
   */
  extraUrlParams?: Record<string, any>

  /**
   * 同步结果到 model,默认为true如果为false，reset的时将会忽略从url上获取的数据
   *
   * @name syncToModel 是否将 url 参数写入 model
   */
  syncToModel?: boolean
  /**
   * 如果为 false,会原样保存。
   *
   * @default true
   * @param 要不要值中的 Null 和 undefined
   */
  omitNil?: boolean

  /**
   * 格式化 Date 的方式，默认转化为 string
   *
   * @example  dateFormatter="string" : Moment -> YYYY-MM-DD
   * @example  dateFormatter="YYYY-MM-DD  HH:mm:SS" Moment -> YYYY-MM-DD  HH:mm:SS
   * @example  dateFormatter="HH:mm:SS" Moment -> HH:mm:SS
   * @example  dateFormatter="number" Moment -> timestamp
   * @example  dateFormatter=false Moment -> Moment
   * @example  dateFormatter={(value)=>value.format("YYYY-MM-DD")}
   */
  dateFormatter?: WithFalse<
    (string & {}) | 'string' | 'number' | ((value: Dayjs, valueType: string) => string | number)
  >

  /**
   * @name onInit 表单初始化成功，比如布局，label等计算完成
   * @example  (values)=>{ console.log(values) }
   */
  onInit?: (values: T, form: ProFormInstance<T>) => void

  /**
   * @name params 发起网络请求的参数
   *
   * @example  params={{productId: 1}}
   */
  params?: U
  /**
   * @name request 发起网络请求的参数,返回值会覆盖给 model
   *
   * @example async (params)=>{ return model }
   */
  request?: ProRequestData<T, U>

  /** 是否回车提交 */
  isKeyPressSubmit?: boolean

  /** 用于控制form 是否相同的key，高阶用法 */
  formKey?: string | number

  /**
   * @name autoFocusFirstInput 自动选中第一项
   * @description 只对有input的类型有效
   */
  autoFocusFirstInput?: boolean

  /**
   *  @name readonly 是否只读模式，对所有表单项生效
   *  @description 优先低于表单项的 readonly
   */
  readonly?: boolean
}

export type BaseFormProps<T extends Record<string, any>, U extends Record<string, any>> = {
  contentRender?: ContentRender<T>
  fieldProps?: FieldProps
  proFieldProps?: CommomProFieldProps
  /** 表单初始化完成，form已经存在，可以进行赋值的操作了 */
  onInit?: (values: T, form: ProFormInstance<T>) => void
  formItemProps?: FormItemProps
  groupProps?: ProFormGroupProps
  /** 是否回车提交 */
  isKeyPressSubmit?: boolean
  form?: FormInstance
  /** Form 组件的类型，内部使用 */
  formComponentType?: 'DrawerForm' | 'ModalForm' | 'QueryFilter'
} & Omit<FormProps, 'onFinish'>
& CommonFormProps<T, U>
/** 自动的formKey 防止重复 */
let requestFormCacheId = 0
const BaseForm = defineComponent(
  <T extends Record<string, any>, U extends Record<string, any>>(
    props: BaseFormProps<T, U>,
    {
      expose,
      attrs,
      slots,
    }: SetupContext<
      {},
      CustomSlotsType<{
        default?: () => VueNode
      }>
    >,
  ) => {
    const { componentSize } = useConfig()
    const formRef = shallowRef<ProFormRef<T> | null>(null)
    useEffect(() => {
      requestFormCacheId += 0
    }, [])
    expose(useProFormInstanceExpose(formRef))
    return () => {
      const {
        syncToModel = true,
        dateFormatter = 'string',
        syncToUrlAsImportant = false,
        formKey = requestFormCacheId,
        ...rest
      } = props
      return (
        <ConfigProvider componentSize={props.size || componentSize.value || 'middle'}>
          <ProConfigProvider needDeps>
            {/* // 增加国际化的能力，与 table 组件可以统一 */}
            <BaseFormComponents
              {...attrs}
              {...rest}
              formKey={formKey}
              syncToModel={syncToModel}
              dateFormatter={dateFormatter}
              syncToUrlAsImportant={syncToUrlAsImportant}
              ref={formRef}
              autoComplete="off"
              v-slots={slots}
            />
          </ProConfigProvider>
        </ConfigProvider>
      )
    }
  },
  {
    name: 'BaseForm',
    inheritAttrs: false,
    props: [
      'autoComplete',
      'autocomplete',
      'autoFocusFirstInput',
      'classes',
      'clearOnDestroy',
      'colProps',
      'colon',
      'contentRender',
      'dateFormatter',
      'disabled',
      'extraUrlParams',
      'feedbackIcons',
      'fieldProps',
      'formComponentType',
      'formItemProps',
      'formKey',
      'grid',
      'groupProps',
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
      'onReset',
      'onSubmit',
      'onValidate',
      'onValuesChange',
      'formRef',
      'form',
      'params',
      'prefixCls',
      'preserve',
      'proFieldProps',
      'readonly',
      'request',
      'requiredMark',
      'rootClass',
      'rowProps',
      'rules',
      'scrollToFirstError',
      'size',
      'styles',
      'submitter',
      'syncToModel',
      'syncToUrl',
      'syncToUrlAsImportant',
      'tooltip',
      'validateMessages',
      'validateOnRuleChange',
      'validateTrigger',
      'variant',
      'wrapperCol',
    ],
  },
)

export default BaseForm
