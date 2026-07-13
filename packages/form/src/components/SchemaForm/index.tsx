import type { ProFieldValueObjectType, ProFieldValueType, VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SetupContext } from 'vue'
import type { ProFormInstance } from '../../BaseForm'
import type {
  ItemType,
  ProFormColumnsType,
  ProFormRenderValueTypeHelpers,
  SchemaFormProps,
} from './typing'
import { ValueTypeToComponent } from '@antdv-next1/pro-field'
import { ProConfigProvider, useProConfig } from '@antdv-next1/pro-provider'
import { LabelIconTip, omitUndefined, runFunction } from '@antdv-next1/pro-utils'
import { computed, defineComponent, shallowRef } from 'vue'
import DrawerForm from '../../layouts/DrawerForm'
import LightFilter from '../../layouts/LightFilter'
import ModalForm from '../../layouts/ModalForm'
import ProForm from '../../layouts/ProForm'
import QueryFilter from '../../layouts/QueryFilter'
import ProStepForm from '../../layouts/StepsForm/StepForm'
import { useProFormInstanceExpose } from '../../utils'
import { Embed, StepsForm } from './layoutType'
import { renderValueType } from './valueType'

function formLayoutType(name: string) {
  const componentList = {
    QueryFilter,
    DrawerForm,
    LightFilter,
    StepForm: ProStepForm,
    StepsForm,
    ModalForm,
    Embed,
    Form: ProForm,
  }
  return componentList[name as keyof typeof componentList] as typeof ProForm
}

/**
 * 此组件可以根据 Json Schema 来生成相应的表单,大部分配置与 antd 的 table 列配置相同
 *
 */
const SchemaForm = defineComponent(<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(props: SchemaFormProps<T, U, ValueType>, { slots, attrs, expose }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const formRef = shallowRef<ProFormInstance<T>>()

  const proConfig = useProConfig()
  /**
   * 生成子项，方便被 table 接入
   *
   * @param items
   */
  const genItems: ProFormRenderValueTypeHelpers<T, ValueType>['genItems'] = items =>
    items
      .filter(originItem => !(originItem.hideInForm && props.type === 'form'))
      .sort((a, b) => {
        if (b.order || a.order) {
          return (b.order || 0) - (a.order || 0)
        }
        return (b.index || 0) - (a.index || 0)
      })
      .map((originItem, index) => {
        const title = runFunction(
          originItem.title,
          originItem,
          'form',
          <LabelIconTip label={originItem.title as string} tooltip={originItem.tooltip} />,
        )
        const item = omitUndefined({
          title,
          label: title,
          name: originItem.name,
          valueType: runFunction(originItem.valueType, {}),
          key: originItem.key || originItem.dataIndex || index,
          columns: originItem.columns,
          valueEnum: originItem.valueEnum,
          dataIndex: originItem.dataIndex || originItem.key,
          initialValue: originItem.initialValue,
          width: originItem.width,
          index: originItem.index,
          readonly: originItem.readonly,
          colSize: originItem.colSize,
          colProps: originItem.colProps,
          rowProps: originItem.rowProps,
          tooltip: originItem.tooltip,
          dependencies: originItem.dependencies,
          proFieldProps: originItem.proFieldProps,
          ignoreFormItem: originItem.ignoreFormItem,
          getFieldProps: originItem.fieldProps
            ? () => runFunction(originItem.fieldProps, formRef.value, originItem)
            : undefined,
          getFormItemProps: originItem.formItemProps
            ? () => runFunction(originItem.formItemProps, formRef.value, originItem)
            : undefined,
          render: originItem.render,
          formItemRender: originItem.formItemRender,
          renderText: originItem.renderText,
          request: originItem.request,
          params: originItem.params,
          transform: originItem.transform,
          convertValue: originItem.convertValue,
          debounceTime: originItem.debounceTime,
          defaultKeyWords: originItem.defaultKeyWords,
        }) as ItemType<T, ValueType>
        return renderValueType<T, ValueType>(item, {
          action: props.action,
          type: props.type,
          originItem,
          formRef,
          genItems,
        })
      })
      .filter(field => Boolean(field))

  const formChildrenDoms = computed(() => {
    if (!formRef.value)
      return
    if (props.columns?.length && Array.isArray(props.columns[0]))
      return
    return genItems(props.columns as ProFormColumnsType<T, ValueType>[])
  })
  expose(useProFormInstanceExpose(formRef))
  return () => {
    const { columns, onInit, layoutType = 'Form', type = 'form', action, ...restProps } = props
    const FormRenderComponent = formLayoutType(layoutType)
    return (
      <ProConfigProvider
        valueTypeMap={{ ...proConfig.value.valueTypeMap, ...ValueTypeToComponent }}
      >
        <FormRenderComponent<T, U>
          ref={formRef}
          {...attrs}
          {...restProps}
          {...(layoutType === 'StepsForm' ? { columns } : {})}
          onInit={(_, initForm) => {
            formRef.value = initForm
            onInit?.(_, initForm)
          }}
          v-slots={
            formChildrenDoms.value
              ? {
                  ...slots,
                  default: () => formChildrenDoms.value,
                }
              : slots
          }
        />
      </ProConfigProvider>
    )
  }
}, {
  name: 'SchemaForm',
  inheritAttrs: false,
  props: ['action', 'autoComplete', 'autoFocusFirstInput', 'classes', 'clearOnDestroy', 'colProps', 'colon', 'columns', 'dateFormatter', 'description', 'disabled', 'extraUrlParams', 'feedbackIcons', 'formKey', 'grid', 'isKeyPressSubmit', 'labelAlign', 'labelCol', 'labelWrap', 'formRef', 'layout', 'layoutType', 'loading', 'model', 'name', 'omitNil', 'onFieldsChange', 'onFinish', 'onFinishFailed', 'onInit', 'onLoadingChange', 'onReset', 'onSubmit', 'onValidate', 'onValuesChange', 'open', 'params', 'prefixCls', 'preserve', 'readonly', 'request', 'requiredMark', 'rootClass', 'rowProps', 'rules', 'scrollToFirstError', 'size', 'styles', 'submitter', 'syncToModel', 'syncToUrl', 'syncToUrlAsImportant', 'title', 'tooltip', 'type', 'validateMessages', 'validateOnRuleChange', 'validateTrigger', 'variant', 'wrapperCol'],

})
export * from './typing'
export default SchemaForm
