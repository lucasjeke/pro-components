import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { App, Plugin, SetupContext } from 'vue'
import type { ProFormRef } from '../../BaseForm'
import type { ProStepsFormProps } from './typing'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { useForm } from 'antdv-next'
import { defineComponent, shallowRef } from 'vue'
import { useProFormInstanceExpose } from '../../utils'
import InternalStepsForm from './InternalStepsForm'
import ProStepForm from './StepForm'

const _ProStepsForm = defineComponent(<T extends Record<string, any>, U extends Record<string, any>>(props: ProStepsFormProps<T, U>, { slots, expose, attrs }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const formRef = shallowRef<ProFormRef<T>>()
  expose(useProFormInstanceExpose(formRef))
  return () => {
    return (
      <ProConfigProvider needDeps>
        <InternalStepsForm ref={formRef} {...attrs} {...props} v-slots={slots} />
      </ProConfigProvider>
    )
  }
}, {
  name: 'ProStepsForm',
  inheritAttrs: false,
  props: ['containerStyle', 'current', 'formMap', 'formProps', 'layoutRender', 'onCurrentChange', 'onFinish', 'onUpdate:formMap', 'prefixCls', 'stepFormRender', 'stepsFormRender', 'stepsProps', 'stepsRender', 'submitter'],
})

const ProStepsForm = _ProStepsForm as typeof _ProStepsForm & Plugin & {
  StepForm: typeof ProStepForm
  useForm: typeof useForm
}
ProStepsForm.StepForm = ProStepForm
ProStepsForm.useForm = useForm
ProStepsForm.install = (app: App) => {
  app.component(ProStepsForm.name, ProStepsForm)
  app.component(ProStepsForm.StepForm.name, ProStepForm)
}
export type { ProStepsFormProps }

export default ProStepsForm
