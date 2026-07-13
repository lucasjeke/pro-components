import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { FormProps, PopoverProps, TooltipPlacement } from 'antdv-next'
import type { SetupContext, VNode } from 'vue'
import type { CommonFormProps, ProFormRef } from '../../BaseForm'
import type { LightFilterFooterRender } from '../../RenderTypings'
import { transformBooleanProps, useState } from '@antdv-next1/pro-utils'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { BaseForm } from '../../BaseForm'
import { useProFormInstanceExpose } from '../../utils'
import ProLightFilterContainer from './LightFilterContainer'

export type ProLightFilterProps<T, U = Record<string, any>> = {
  onReset?: (values?: T) => void
  collapse?: boolean
  /**
   * @name collapseLabel 收起的label dom
   *
   * @example collapseLabel={"收起"}
   */
  collapseLabel?: VueNode
  /**
   * @name variant 组件样式变体
   */
  variant?: 'outlined' | 'filled' | 'borderless'
  /**
   * @name ignoreRules 忽略rules，一般而言 LightFilter 应该不支持rules，默认是 false。
   */
  ignoreRules?: boolean

  /**
   * @name footerRender 自定义 footerRender
   *
   * @example 自定义清除
   * footerRender={(onConfirm,onClear)=>{  return <a onClick={onClear}>清除</a> })}
   */
  footerRender?: LightFilterFooterRender

  /**
   * @name placement 支持配置弹出的位置
   * @default bottomLeft
   */
  placement?: TooltipPlacement
  /**
   * @name  popoverProps 透传给内部 Popover 的属性（折叠态弹层）
   *
   * @description
   * LightFilter 在折叠态会使用 Popover 将筛选项渲染到 body 下；
   * 可通过该属性为弹层根节点添加自定义类名（如 classNames.root）以便做样式覆盖。
   *
   * @example
   * popoverProps={{ classNames: { root: 'my-lightfilter-popover' } } }
   */
  popoverProps?: Omit<
    PopoverProps,
    'children' | 'content' | 'trigger' | 'open' | 'onOpenChange' | 'placement'
  >
} & Omit<FormProps, 'onFinish' | 'onReset'>
& CommonFormProps<T, U>

const ProLightFilter = defineComponent(<T extends Record<string, any>, U extends Record<string, any>>(props: ProLightFilterProps<T, U>, { slots, attrs, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const config = useConfig()
  const formRef = shallowRef<ProFormRef<T>>()
  const proFormInstanceExpose = useProFormInstanceExpose(formRef)
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const [values, setValues] = useState<Record<string, any>>(() => {
    return { ...props.model }
  })
  expose(proFormInstanceExpose)
  return () => {
    const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'syncToModel', 'syncToUrlAsImportant', 'readonly'], props)
    const {
      size,
      collapse,
      collapseLabel,
      model,
      onValuesChange,
      placement,
      variant,
      ignoreRules,
      footerRender,
      popoverProps,
      ...reset
    } = { ...props, ...transformedProps }
    return (
      <BaseForm
        {...attrs}
        {...reset}
        ref={formRef}
        size={size}
        model={model}
        name={props.name || 'light-filter-form'}
        contentRender={(items, _, form) => (
          <ProLightFilterContainer
            prefixCls={prefixCls.value}
            items={(items as VNode[])?.flatMap((item) => {
              if (!item || !item?.type)
                return item
              /** 如果是 ProFormGroup，直接拼接dom */
              if ((item?.type as { name: string })?.name === 'ProFormGroup') {
                return (item.children as { default: () => VNode[] })?.default?.()
              }
              return item
            })}
            size={size}
            popoverProps={popoverProps}
            variant={variant}
            collapse={collapse}
            collapseLabel={collapseLabel}
            placement={placement}
            values={values.value || {}}
            footerRender={footerRender}
            onValuesChange={(newValues: any) => {
              const newAllValues = {
                ...values.value,
                ...newValues,
              }
              setValues(newAllValues)
              form?.setFieldsValue(newAllValues)
              form?.submit()
              if (onValuesChange) {
                onValuesChange(newValues, newAllValues)
              }
            }}
          />
        )}
        formItemProps={{
          colon: false,
          labelAlign: 'left',
        }}
        fieldProps={{
          style: {
            width: undefined,
          },
        }}
        onValuesChange={(_, allValues) => {
          setValues(allValues)
          onValuesChange?.(_, allValues)
          formRef.value?.submit()
        }}
        v-slots={slots}
      />
    )
  }
}, {
  name: 'ProLightFilter',
  inheritAttrs: false,
  props: [
    'autoComplete',
    'autoFocusFirstInput',
    'autocomplete',
    'classes',
    'clearOnDestroy',
    'colProps',
    'collapse',
    'collapseLabel',
    'colon',
    'dateFormatter',
    'disabled',
    'extraUrlParams',
    'feedbackIcons',
    'footerRender',
    'formKey',
    'formRef',
    'grid',
    'ignoreRules',
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
    'params',
    'placement',
    'popoverProps',
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

})

export default ProLightFilter
