import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { FormProps } from 'antdv-next'
import type { App, Plugin, SetupContext } from 'vue'
import type { CommonFormProps, ProFormRef } from '../../BaseForm'
import { transformBooleanProps } from '@antdv-next1/pro-utils'
import { useForm, useFormInstance } from 'antdv-next'
import { defineComponent, shallowRef } from 'vue'
import { BaseForm } from '../../BaseForm'
import { ProFormGroup, ProFormItem } from '../../components'
import { useProFormInstanceExpose } from '../../utils'

export type ProFormProps<T, U> = Omit<FormProps, 'onFinish'> & CommonFormProps<T, U>

const _ProForm = defineComponent(
  <T extends Record<string, any>, U extends Record<string, any>>(props: ProFormProps<T, U>, { slots, attrs, expose }: SetupContext<
    {},
    CustomSlotsType<{
      default?: () => VueNode
    }>
  >) => {
    const formRef = shallowRef<ProFormRef<T>>()
    expose(useProFormInstanceExpose(formRef))

    return () => {
      const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'readonly'], props)
      return (
        <BaseForm
          {...attrs}
          {...props}
          {...transformedProps}
          ref={formRef}
          name={props.name || 'pro-form'}
          layout={props.layout || 'vertical'}
          contentRender={(items, submitter) => (
            <>
              {items}
              {submitter}
            </>
          )}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'ProForm',
    inheritAttrs: false,
    props: [
      'autoComplete',
      'autoFocusFirstInput',
      'classes',
      'clearOnDestroy',
      'colProps',
      'colon',
      'formRef',
      'disabled',
      'omitNil',
      'dateFormatter',
      'feedbackIcons',
      'formKey',
      'grid',
      'isKeyPressSubmit',
      'labelAlign',
      'labelCol',
      'labelWrap',
      'layout',
      'model',
      'name',
      'onFieldsChange',
      'onFinish',
      'onFinishFailed',
      'onReset',
      'onSubmit',
      'onValidate',
      'onValuesChange',
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
      'submitter',
      'tooltip',
      'validateMessages',
      'validateOnRuleChange',
      'validateTrigger',
      'variant',
      'wrapperCol',
    ],
  },
)

const ProForm = _ProForm as typeof _ProForm & Plugin & {
  Group: typeof ProFormGroup
  Item: typeof ProFormItem
  useForm: typeof useForm
  useFormInstance: typeof useFormInstance
}

ProForm.useForm = useForm
ProForm.useFormInstance = useFormInstance

ProForm.install = (app: App) => {
  app.component(ProForm.name as string, ProForm)
  app.component(ProForm.Group.name as string, ProFormGroup)
  app.component(ProForm.Item.name as string, ProFormItem)
  return app
}

export default ProForm
