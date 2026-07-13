import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SelectProps } from 'antdv-next'
import type { SetupContext } from 'vue'
import type {
  ProFormFieldItemProps,
  ProFormFieldRemoteProps,
} from '../../typing'
import { FieldSelect } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { runFunction } from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import ProFormField from '../Field'
import ProFormSearchSelect from './Search'

export type ProFormSelectProps<
  ValueType = any,
> = Omit<ProFormFieldItemProps<
  SelectProps & {
    /**
     * 是否在输入框聚焦时触发搜索
     *
     * @default false
     */
    searchOnFocus?: boolean
    /**
     * 选择完一个之后是否清空搜索项重新搜索
     *
     * @default false
     */
    resetAfterSelect?: boolean
    /**
     * 当搜索关键词发生变化时是否请求远程数据
     *
     * @default true
     */
    fetchDataOnSearch?: boolean
    /** 自定义选项渲染 */
    optionItemRender?: (item: ValueType) => VueNode
  }
>, 'mode'> & {
  options?: SelectProps['options'] | string[]
  mode?: SelectProps['mode'] | 'single'
  showSearch?: SelectProps['showSearch']
  readonly?: boolean
  onChange?: SelectProps['onChange']
} & ProFormFieldRemoteProps

const _ProFormSelect = defineComponent(
  <T extends Record<string, any>>(props: ProFormSelectProps<T>, { slots, attrs }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const { getPopupContainer } = useFieldContextInject()
    return () => {
      const {
        fieldProps,
        params,
        proFieldProps,
        mode,
        valueEnum,
        request,
        showSearch,
        options,
        ...rest
      } = props
      return (
        <ProConfigProvider
          valueTypeMap={{
            select: {
              render: (text, restProps) => <FieldSelect {...restProps} text={text} />,
              formItemRender: (text, restProps) => (
                <FieldSelect {...restProps} text={text} />
              ),
            },
          }}
        >
          <ProFormField
            {...attrs}
            {...rest}
            valueEnum={runFunction(valueEnum)}
            request={request}
            params={params}
            valueType="select"
            fieldConfig={rest.fieldConfig || { customLightMode: true }}
            fieldProps={{
              options,
              mode,
              showSearch,
              getPopupContainer: getPopupContainer?.value,
              ...fieldProps,
            }}
            proFieldProps={proFieldProps}
            v-slots={slots}
          />
        </ProConfigProvider>
      )
    }
  },
  {
    name: 'ProFormSelect',
    inheritAttrs: false,
    props: ['_internalItemRender', 'addonAfter', 'addonBefore', 'addonWarpStyle', 'allowClear', 'bordered', 'colProps', 'colSize', 'colon', 'convertValue', 'dataFormat', 'debounceTime', 'dependencies', 'disabled', 'emptyText', 'extra', 'fieldConfig', 'fieldId', 'fieldProps', 'footerRender', 'formItemProps', 'hasFeedback', 'help', 'hidden', 'htmlFor', 'id', 'ignoreFormItem', 'initialValue', 'isListField', 'label', 'labelAlign', 'labelCol', 'layout', 'lightProps', 'messageVariables', 'mode', 'name', 'noStyle', 'onChange', 'options', 'params', 'placeholder', 'prefixCls', 'proFieldProps', 'proFormFieldKey', 'readonly', 'request', 'required', 'rootClass', 'rules', 'secondary', 'showSearch', 'status', 'tooltip', 'transform', 'trigger', 'validateDebounce', 'validateFirst', 'validateStatus', 'validateTrigger', 'valueEnum', 'valuePropName', 'vertical', 'width', 'wrapperCol'],
  },
)

const ProFormSelect = _ProFormSelect as typeof _ProFormSelect & {
  __PRO_FORM_COMPONENT?: boolean
  SearchSelect: typeof ProFormSearchSelect
}

// 标记是否是 ProForm 的组件
ProFormSelect.__PRO_FORM_COMPONENT = true

ProFormSelect.SearchSelect = ProFormSearchSelect
export default ProFormSelect
