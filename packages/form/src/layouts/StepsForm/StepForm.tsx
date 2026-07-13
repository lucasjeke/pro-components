import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { FormProps, StepsProps } from 'antdv-next'
import type { SetupContext } from 'vue'
import type { CommonFormProps, ProFormRef } from '../../BaseForm'
import { transformBooleanProps, useEffect } from '@antdv-next1/pro-utils'
import { computed, defineComponent, shallowRef, toRaw } from 'vue'
import { BaseForm } from '../../BaseForm'
import { useProFormInstanceExpose } from '../../utils'
import { useProStepsFormContextInject } from './context'

export type ProStepFormProps<T extends Record<string, any>, U extends Record<string, any>> = {
  step?: number
  stepProps?: NonNullable<StepsProps['items']>[number]
  index?: number
  onReset?: (values?: T) => void
  title?: string
} & Omit<FormProps, 'onFinish' | 'form' | 'onReset'>
& Omit<CommonFormProps<T, U>, 'submitter' | 'form'>

export const stepFormContextKey = Symbol('stepformContext')

const ProStepForm = defineComponent(<T extends Record<string, any>, U extends Record<string, any>>(props: ProStepFormProps<T, U>, { expose, slots, attrs }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const formRef = shallowRef<ProFormRef<T>>()
  const { onFormFinish, setLoading, regForm, unRegForm, next, formArray, setFormArray, lastStep } = useProStepsFormContextInject<T, U>()
  const mergepProps = computed(() => ({ ...attrs, ...props } as ProStepFormProps<T, U>))
  /** Dom 不存在的时候解除挂载 */
  useEffect(() => {
    if (!(mergepProps.value.name || mergepProps.value.step))
      return
    const name = (mergepProps.value.name || mergepProps.value.step)!.toString()
    regForm?.(name, mergepProps.value)
    return () => {
      unRegForm?.(name)
    }
  }, [])
  useEffect(() => {
    if (formArray?.value) {
      const newFormArray = toRaw(formArray.value)
      newFormArray[props.step || 0] = formRef.value!
      setFormArray(newFormArray)
    }
  }, [() => formArray?.value])

  expose(useProFormInstanceExpose(formRef))
  return () => {
    const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'readonly'], props)
    const {
      onFinish,
      step,
      title,
      stepProps,
      onInit,
      layout,
      ...restProps
    } = { ...props, ...transformedProps }
    return (
      <BaseForm<T, U>
        {...restProps}
        name={`step-form-${restProps.name}`}
        onFinish={async (values) => {
          if (restProps.name) {
            onFormFinish?.(restProps.name, values)
          }
          if (onFinish) {
            setLoading?.(true)
            try {
            // 如果报错，直接抛出
              const success = await onFinish?.(values)
              if (success) {
                next()
              }
            }
            finally {
              setLoading?.(false)
            }
            return
          }
          if (!lastStep?.value)
            next()
        }}
        onInit={(_, form) => {
          formRef.value = form
          if (formArray?.value) {
            const newFormArray = toRaw(formArray.value)
            newFormArray[step || 0] = formRef.value
            setFormArray(newFormArray)
          }
          onInit?.(_, form)
        }}
        layout={layout || 'vertical'}
        v-slots={slots}
      />
    )
  }
}, {
  name: 'ProStepForm',
  inheritAttrs: false,
  props: ['autoComplete', 'autoFocusFirstInput', 'autocomplete', 'classes', 'clearOnDestroy', 'colProps', 'colon', 'dateFormatter', 'disabled', 'extraUrlParams', 'feedbackIcons', 'formKey', 'formRef', 'grid', 'index', 'isKeyPressSubmit', 'labelAlign', 'labelCol', 'labelWrap', 'layout', 'loading', 'model', 'name', 'omitNil', 'onFieldsChange', 'onFinish', 'onFinishFailed', 'onInit', 'onLoadingChange', 'onReset', 'onSubmit', 'onValidate', 'onValuesChange', 'params', 'prefixCls', 'preserve', 'readonly', 'request', 'requiredMark', 'rootClass', 'rowProps', 'rules', 'scrollToFirstError', 'size', 'step', 'stepProps', 'styles', 'syncToModel', 'syncToUrl', 'syncToUrlAsImportant', 'title', 'tooltip', 'validateMessages', 'validateOnRuleChange', 'validateTrigger', 'variant', 'wrapperCol'],
})

export default ProStepForm
