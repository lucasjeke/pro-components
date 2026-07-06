import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { FormInstance } from 'antdv-next'
import type { SetupContext, VNode } from 'vue'
import type { ProStepFormProps } from './StepForm'
import type { ProStepsFormProps } from './typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { childrenToArray, useMountMergeState, useState } from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { classNames, merge } from '@v-c/util'
import { Button, Col, Row, Space, Steps } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { cloneVNode, computed, defineComponent, shallowRef } from 'vue'
import { useProFormInstanceExpose } from '../../utils'
import { useProStepsFormContextProvider } from './context'
import { useStyle } from './style'

interface LayoutRenderDom {
  stepsDom: VNode
  formDom: VNode
}
const StepsLayoutStrategy: Record<
  string,
  (dom: LayoutRenderDom) => VueNode
> = {
  horizontal({ stepsDom, formDom }) {
    return (
      <>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={24}>{stepsDom}</Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col span={24}>{formDom}</Col>
        </Row>
      </>
    )
  },
  vertical({ stepsDom, formDom }) {
    return (
      <Row align="stretch" wrap={true} gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col xxl={4} xl={6} lg={7} md={8} sm={10} xs={12}>
          { cloneVNode(
            stepsDom,
            {
              style: {
                height: '100%',
              },
            },
          )}
        </Col>
        <Col>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            {formDom}
          </div>
        </Col>
      </Row>
    )
  },
}

const InternalProStepsForm = defineComponent(<T extends Record<string, any>, U extends Record<string, any>>(props: ProStepsFormProps<T, U>, { slots, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-steps-form`)
  const { wrapSSR, hashId } = useStyle(baseClassName)
  const formDataRef = shallowRef(new Map<string, Record<string, any>>())
  const stepFormPropsMap = shallowRef(new Map<string, ProStepFormProps<T, U>>())
  const [formArray, setFormArray] = useMountMergeState<
    FormInstance[]
  >(props.formMap || [], {
    value: computed(() => props.formMap || []),
    defaultValue: [],
    onChange: _formArray => props['onUpdate:formMap']?.(_formArray),
  })
  const [formIndexArray, setFormIndexArray] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const intl = useIntl()
  /**
   * 受控的方式来操作表单
   */
  const [step, setStep] = useState<number>(props.current || 0)
  const layoutRender = computed(() => StepsLayoutStrategy[props.stepsProps?.orientation || 'horizontal'])
  const lastStep = computed(
    () => step.value === formIndexArray.value.length - 1,
  )
  /**
   * 注册一个form进入，方便进行 props 的修改
   */
  const regForm = (name: string, childrenFormProps: ProStepFormProps<T, U>) => {
    if (!stepFormPropsMap.value.has(name)) {
      setFormIndexArray([...formIndexArray.value, name])
    }
    stepFormPropsMap.value.set(name, childrenFormProps)
  }
  /**
   * 解除挂载掉这个 form，同时步数 -1
   */
  const unRegForm = (name: string) => {
    setFormIndexArray(formIndexArray.value.filter(n => n !== name))
    stepFormPropsMap.value.delete(name)
    formDataRef.value.delete(name)
  }

  const stepsDom = computed(() => {
    const itemsProps = {
      items: formIndexArray.value.map((item) => {
        const itemProps = stepFormPropsMap.value.get(item)
        const stepItemProps = {
          key: item,
          title: itemProps?.title,
          ...itemProps?.stepProps,
        }
        // Convert deprecated description to content
        if (stepItemProps.description) {
          stepItemProps.content = stepItemProps.description
          delete stepItemProps.description
        }
        return stepItemProps
      }),
    }
    return (
      <div
        class={classNames(`${baseClassName.value}-steps-container`, hashId.value)}
        style={{
          maxWidth: unit(Math.min(formIndexArray.value.length * 320, 1160)),
        }}
      >
        <Steps
          {...props.stepsProps}
          {...itemsProps}
          current={step.value}
          onChange={undefined}
        />
      </div>
    )
  })
  const onSubmit = () => {
    const from = formArray.value[step.value]
    from?.submit()
  }
  /** 上一页功能 */
  const prePage = () => {
    if (step.value < 1)
      return
    setStep(step.value - 1)
  }
  const next = computed(() => (
    props.submitter !== false && (
      <Button
        key="next"
        type="primary"
        {...props.submitter?.submitButtonProps}
        loading={loading.value}
        onClick={() => {
          if (props.submitter !== false) {
            props.submitter?.onSubmit?.()
          }
          onSubmit()
        }}
      >
        {intl.value.getMessage({ id: 'stepsForm.next', defaultMessage: '下一步' })}
      </Button>
    )
  ))
  const pre = computed(() => (
    props.submitter !== false && (
      <Button
        key="pre"
        {...props.submitter?.resetButtonProps}
        onClick={() => {
          prePage()
          if (props.submitter !== false) {
            props.submitter?.onReset?.()
          }
        }}
      >
        {intl.value.getMessage({ id: 'stepsForm.prev', defaultMessage: '上一步' })}
      </Button>
    )
  ))
  const submit = computed(() => {
    return (
      props.submitter !== false && (
        <Button
          key="submit"
          type="primary"
          loading={loading.value}
          {...props.submitter?.submitButtonProps}
          onClick={() => {
            if (props.submitter !== false) {
              props.submitter?.onSubmit?.()
            }
            onSubmit()
          }}
        >
          {intl.value.getMessage({ id: 'stepsForm.submit', defaultMessage: '提交' })}
        </Button>
      )
    )
  })
  const nextPage = () => {
    // Ensure we have forms registered before checking step bounds
    if (formIndexArray.value.length === 0)
      return
    if (step.value > formIndexArray.value.length - 2)
      return
    setStep(step.value + 1)
  }
  const submitterDom = computed(() => {
    let buttons: (VNode | false)[] = []
    const index = step.value || 0
    if (index < 1) {
      // 如果有且只有一个 StepForm 第一步就应该是提交按钮
      if (formIndexArray.value.length === 1) {
        buttons.push(submit.value)
      }
      else {
        buttons.push(next.value)
      }
    }
    else if (index + 1 === formIndexArray.value.length) {
      buttons.push(pre.value, submit.value)
    }
    else {
      buttons.push(pre.value, next.value)
    }
    buttons = childrenToArray(buttons, true)
    if (props.submitter && props.submitter.render) {
      const submitterProps = {
        form: formArray.value[step.value],
        onSubmit,
        step: step.value,
        onPre: prePage,
      }

      return props.submitter.render(
        submitterProps,
        buttons,
      )
    }
    if (props.submitter && props.submitter?.render === false) {
      return null
    }
    return buttons
  })

  const formDom = computed(() => childrenToArray(slots.default?.() as VNode[]).map((item: VNode<any, any, ProStepFormProps<T, U>>, index) => {
    const itemProps = item.props
    const name = itemProps?.name || `${index}`
    /** 是否是当前的表单 */
    const isShow = step.value === index
    const config = isShow
      ? {
          contentRender: props.stepFormRender,
          submitter: false,
        }
      : {}
    return (
      <div
        class={classNames(`${baseClassName.value}-step`, hashId.value, {
          [`${baseClassName.value}-step-active`]: isShow,
        })}
        key={name}
      >
        {cloneVNode(item, {
          ...config,
          ...props.formProps,
          ...itemProps,
          name,
          step: index,
        })}
      </div>
    )
  }))

  const finalStepsDom = computed(() => {
    if (props.stepsRender) {
      return props.stepsRender(
        formIndexArray.value.map(item => ({
          key: item,
          title: stepFormPropsMap.value.get(item)?.title,
        })),
        stepsDom.value,
      ) as VNode
    }
    return stepsDom.value
  })
  const formContainer = computed(
    () => (
      <div
        class={classNames(`${baseClassName.value}-container`, hashId.value)}
        style={props.containerStyle}
      >
        {formDom.value}
        {props.stepsFormRender ? null : <Space>{submitterDom.value}</Space>}
      </div>
    ),
  )
  const stepsFormDom = computed(() => {
    const doms = {
      stepsDom: finalStepsDom.value,
      formDom: formContainer.value,
    }
    if (props.stepsFormRender) {
      if (props.layoutRender) {
        return props.stepsFormRender(props.layoutRender(doms), submitterDom)
      }
      else {
        return props.stepsFormRender(layoutRender.value?.(doms), submitterDom)
      }
    }

    if (props.layoutRender) {
      return props.layoutRender(doms)
    }

    return layoutRender.value?.(doms)
  })
  /**
   * ProForm处理了一下 from 的数据，在其中做了一些操作 如果使用 Provider 自带的，自带的数据处理就无法生效了
   */
  const onFormFinish = async (name: string, formData: any) => {
    formDataRef.value.set(name, formData)
    // 如果不是最后一步
    if (!lastStep.value || !props.onFinish) {
      return
    }
    setLoading(true)
    const values = merge(
      {},
      ...Array.from(formDataRef.value.values()),
    ) as T
    try {
      const success = await props.onFinish(values)
      if (success) {
        setStep(0)
        formArray.value.forEach(form => form?.resetFields())
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }
  useProStepsFormContextProvider({
    loading,
    setLoading,
    regForm,
    keyArray: formIndexArray,
    next: nextPage,
    formArray,
    setFormArray,
    stepFormPropsMap,
    lastStep,
    unRegForm,
    onFormFinish,
  })
  const currentStepFormRef = computed(() => formArray.value[step.value || 0])
  expose(useProFormInstanceExpose(currentStepFormRef))
  return () => {
    return wrapSSR(
      <div class={classNames(baseClassName.value, hashId.value)}>
        {stepsFormDom.value}
      </div>,
    )
  }
}, {
  name: 'InternalProStepsForm',
  inheritAttrs: false,
  props: ['containerStyle', 'current', 'formMap', 'formProps', 'layoutRender', 'onCurrentChange', 'onFinish', 'onUpdate:formMap', 'prefixCls', 'stepFormRender', 'stepsProps', 'stepsRender', 'submitter'],
})

export default InternalProStepsForm
