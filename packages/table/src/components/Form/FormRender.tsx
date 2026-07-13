import type { BaseProQueryFilterProps, ProFormProps, ProFormRef } from '@antdv-next1/pro-form'
import type { FormItemProps, ProFieldValueObjectType, ProFieldValueType, ProSchemaComponentTypes } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SetupContext } from 'vue'
import type { ActionType, ProColumns, ProTableProps } from '../../typing'
import ProCard from '@antdv-next1/pro-card'
import { SchemaForm, useProFormInstanceExpose } from '@antdv-next1/pro-form'
import { useProConfig } from '@antdv-next1/pro-provider'
import { classNames, omit } from '@v-c/util'
import { Table } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'

function toLowerLine(str: string) {
  let temp = str.replace(/[A-Z]/g, (match) => {
    return `-${match.toLowerCase()}`
  })

  if (temp.startsWith('-')) {
    // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
    temp = temp.slice(1)
  }
  return temp
}

export type SearchConfig = BaseProQueryFilterProps & {
  filterType?: 'query' | 'light'
}

/**
 * 获取当前选择的 Form Layout 配置
 *
 * @param isForm
 * @param searchConfig
 * @returns LightFilter | QueryFilter | ProForm
 */
function getFormCompetent(isForm: boolean, searchConfig?: SearchConfig | false): 'Form' | 'LightFilter' | 'QueryFilter' {
  if (!isForm && searchConfig !== false) {
    if (searchConfig?.filterType === 'light') {
      return 'LightFilter'
    }
    return 'QueryFilter'
  }
  return 'Form'
}

/**
 * 获取需要传给相应表单的props
 *
 * @param isForm
 * @param searchConfig
 * @param name
 */
function getFromProps(isForm: boolean, searchConfig: any, name: string) {
  if (!isForm && name === 'LightFilter') {
    // 传给 lightFilter 的问题
    return omit(
      {
        ...searchConfig,
      },
      ['labelWidth', 'defaultCollapsed', 'filterType'],
    )
  }

  if (!isForm) {
    // 传给 QueryFilter 的配置
    return omit(
      {
        labelWidth: searchConfig ? searchConfig?.labelWidth : undefined,
        defaultCollapsed: true,
        ...searchConfig,
      },
      ['filterType'],
    )
  }
  return {}
}

/**
 * 从formConfig中获取传给相应表单的配置
 *
 * @param isForm
 * @param formConfig
 */
function getFormConfigs(isForm: boolean, formConfig: any) {
  if (isForm) {
    // 传给Form的配置
    return omit(formConfig, ['ignoreRules'])
  }
  // 传给Filter的配置
  return { ignoreRules: true, ...formConfig }
}

export type FormRenderProps<T, U, ValueType> = {
  onSubmit?: (value: U, firstLoad: boolean) => void
  onReset?: (value: U) => void
  form?: Omit<ProFormProps<T, U>, 'form'>
  type?: ProSchemaComponentTypes
  dateFormatter?: ProTableProps<T, U, ValueType>['dateFormatter']
  search?: SearchConfig | false
  columns: ProColumns<T, ValueType>[]
  submitButtonLoading?: boolean
  manualRequest?: boolean
  bordered?: boolean
  action?: ActionType<Record<string, any>, T>
  ghost?: boolean
} & Omit<FormItemProps, 'onReset'>

const FormRender = defineComponent(
  <T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(props: FormRenderProps<T, U, ValueType>, { expose }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const config = useConfig()
    const proProvide = useProConfig()
    const formRef = shallowRef<ProFormRef<U>>()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-table-search`)
    const isForm = computed(() => props.type === 'form')
    const competentName = computed(
      () => getFormCompetent(isForm.value, props.search),
    )
    /** 提交表单，根据两种模式不同，方法不相同 */
    const submit = (values: U, firstLoad: boolean) => {
      if (props.onSubmit) {
        props.onSubmit(values, firstLoad)
      }
    }
    const columnsList = computed(
      () =>
        props.columns
          ?.filter((item) => {
            if (item === Table.EXPAND_COLUMN || item === Table.SELECTION_COLUMN) {
              return false
            }
            if (item.search === false && props.type !== 'form') {
              return false
            }
            return !(props.type === 'form' && item.hideInForm)
          })
          .map((item) => {
            const finalValueType
              = !item.valueType
                || (['textarea', 'jsonCode', 'code'].includes(item?.valueType as ProFieldValueType)
                  && props.type === 'table')
                ? 'text'
                : (item?.valueType as 'text')
            const columnKey = item?.key || item?.dataIndex?.toString()
            return {
              ...item,
              width: undefined,
              ...(item.search && typeof item.search === 'object' ? item.search : {}),
              valueType: finalValueType,
              proFieldProps: {
                ...item.proFieldProps,
                proFieldKey: columnKey ? `table-field-${columnKey}` : undefined,
              },
            }
          }),

    )
    expose(useProFormInstanceExpose(formRef))
    return () => {
      const {
        type,
        dateFormatter = 'string',
        submitButtonLoading,
        action,
        ghost,
        manualRequest,
        onReset,
        search: searchConfig,
        form: formConfig,
        bordered,
      } = props
      return (
        <ProCard
          ghost={ghost}
          class={classNames(baseClassName.value, proProvide.value.hashId, {
            [`${baseClassName.value}-${toLowerLine(competentName.value)}`]: true,
            [`${prefixCls.value}-table-form`]: isForm.value,
            [(searchConfig as { class: string })?.class]:
              searchConfig !== false && (searchConfig as { class: string })?.class,
          })}
          variant={!bordered ? 'borderless' : 'outlined'}
          styles={{
            body: {
              padding: 0,
              borderRadius: 0,
            },
          }}
        >
          <SchemaForm
            ref={formRef}
            layoutType={competentName.value}
            columns={columnsList.value}
            type={type}
            // 传给每个表单的配置，理论上大家都需要
            submitter={{
              submitButtonProps: {
                loading: submitButtonLoading,
              },
            }}
            {...getFromProps(isForm.value, searchConfig, competentName.value)}
            {...getFormConfigs(isForm.value, formConfig || {})}
            action={action}
            dateFormatter={dateFormatter}
            onInit={async (values: U, form) => {
              formRef.value = form
              if (type !== 'form') {
                const pageInfo = action?.pageInfo
                const { current = pageInfo?.value.current, pageSize = pageInfo?.value.pageSize }
                  = values
                await action?.setPageInfo?.({
                  ...pageInfo?.value,
                  current: Number.parseInt(current, 10),
                  pageSize: Number.parseInt(pageSize, 10),
                })
                if (manualRequest)
                  return
                submit(values, true)
              }
            }}
            onReset={onReset}
            onFinish={(values: U) => submit(values, false)}
            model={formConfig?.model}
          />
        </ProCard>
      )
    }
  },
  {
    name: 'FormRender',
    inheritAttrs: false,
    props: ['action', 'bordered', 'colon', 'columns', 'dateFormatter', 'dependencies', 'extra', 'fieldId', 'form', 'ghost', 'hasFeedback', 'help', 'hidden', 'htmlFor', 'id', 'initialValue', 'isListField', 'label', 'labelAlign', 'labelCol', 'layout', 'manualRequest', 'messageVariables', 'name', 'noStyle', 'onReset', 'onSubmit', 'prefixCls', 'required', 'rootClass', 'rules', 'search', 'status', 'submitButtonLoading', 'tooltip', 'trigger', 'type', 'validateDebounce', 'validateFirst', 'validateStatus', 'validateTrigger', 'valuePropName', 'vertical', 'wrapperCol'],
  },
)

export default FormRender
