import type { ProFormRef } from '@antdv-next1/pro-form'
import type { ProFieldValueObjectType, ProFieldValueType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { TablePaginationConfig } from 'antdv-next'
import type { SetupContext } from 'vue'
import type { ActionType, ProTableProps } from '../../typing'
import { useProFormInstanceExpose } from '@antdv-next1/pro-form'
import { omitUndefined } from '@antdv-next1/pro-utils'
import { omit } from '@v-c/util'
import { computed, defineComponent, shallowRef } from 'vue'
import { isBordered } from '../../utils'
import FormRender from './FormRender'

export interface FormSearchProps<T, U, ValueType> {
  pagination?: TablePaginationConfig | false
  beforeSearchSubmit?: (params: Partial<U>) => any
  action?: ActionType<Record<string, any>, T>
  onSubmit?: (params?: U) => void
  onReset?: (values?: U) => void
  loading?: boolean
  onFormSearchSubmit?: (params: U) => void
  columns?: ProTableProps<T, U, ValueType>['columns']
  dateFormatter?: ProTableProps<T, U, ValueType>['dateFormatter']
  ghost?: ProTableProps<T, U, ValueType>['ghost']
  type?: ProTableProps<T, U, ValueType>['type']
  cardBordered?: ProTableProps<T, U, ValueType>['cardBordered']
  form?: ProTableProps<T, U, ValueType>['form']
  search?: ProTableProps<T, U, ValueType>['search']
  manualRequest?: ProTableProps<T, U, ValueType>['manualRequest']
}

const FormSearch = defineComponent(
  <T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(props: FormSearchProps<T, U, ValueType>, { expose }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const formRef = shallowRef<ProFormRef<T>>()
    // 只传入 pagination 中的 current 和 pageSize 参数
    const pageInfo = computed(() => props.pagination
      ? omitUndefined({
          current: props.pagination.current,
          pageSize: props.pagination.pageSize,
        })
      : {},
    )
    const onSubmit = async (value: U, firstLoad: boolean) => {
      const {
        action,
        onFormSearchSubmit,
        onSubmit: propsOnSubmit,
        beforeSearchSubmit = (searchParams: Partial<U>) => searchParams,
      } = props
      // 检查是否需要验证
      if (props.form?.ignoreRules === false && firstLoad) {
        await formRef?.value?.validateFields()
      }
      const submitParams = {
        ...value,
        _timestamp: Date.now(),
        ...pageInfo.value,
      }
      const omitParams = omit(beforeSearchSubmit(submitParams), Object.keys(pageInfo.value!)) as U
      onFormSearchSubmit?.(omitParams)
      if (!firstLoad) {
      // back first page
        action?.setPageInfo?.({
          current: 1,
        })
      }
      if (propsOnSubmit && !firstLoad) {
        propsOnSubmit?.(value)
      }
    }

    const onReset = async (value: Partial<U>) => {
      const {
        action,
        onReset: propsOnReset,
        onFormSearchSubmit,
        beforeSearchSubmit = (searchParams: Partial<U>) => searchParams,
      } = props
      const resetLogic = () => {
        const omitParams = omit(
          beforeSearchSubmit({ ...value, ...pageInfo.value }),
          Object.keys(pageInfo.value!),
        ) as U
        onFormSearchSubmit?.(omitParams)
        // back first page
        action?.setPageInfo?.({
          current: 1,
        })
        propsOnReset?.()
      }
      if (props.form?.ignoreRules === false) {
        await formRef?.value?.validateFields()
      }
      resetLogic()
    }
    expose(useProFormInstanceExpose(formRef))
    return () => {
      const {
        action,
        columns,
        loading,
        type,
        ghost,
        pagination,
        form,
        manualRequest,
        search,
        cardBordered,
        dateFormatter,
      } = props
      const pageInfo = pagination
        ? omitUndefined({
            current: pagination.current,
            pageSize: pagination.pageSize,
          })
        : {}
      return (
        <FormRender
          ref={formRef}
          submitButtonLoading={loading}
          columns={columns!}
          type={type}
          ghost={ghost}
          onSubmit={onSubmit}
          manualRequest={manualRequest}
          onReset={onReset}
          dateFormatter={dateFormatter}
          search={search}
          form={{
            autoFocusFirstInput: false,
            ...form,
            extraUrlParams: {
              ...pageInfo,
              ...form?.extraUrlParams,
            },
          }}
          action={action}
          bordered={isBordered('search', cardBordered)}
        />
      )
    }
  },
  {
    name: 'FormSearch',
    inheritAttrs: false,
    props: ['action', 'beforeSearchSubmit', 'cardBordered', 'columns', 'dateFormatter', 'form', 'loading', 'manualRequest', 'onFormSearchSubmit', 'onReset', 'onSubmit', 'pagination', 'search', 'type'],

  },
)
export default FormSearch
