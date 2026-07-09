import type {
  FormListFieldData,
  FormListOperation,
  FormListProps,
  VueNode,
} from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ButtonProps, ColProps, FormItemSlots } from 'antdv-next'
import type { VueNode as AntdVueNode } from 'antdv-next/dist/_util/type'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { NamePath, StoreValue } from 'antdv-next/dist/form/types'
import type { CSSProperties, VNode } from 'vue'
import type { ProFormGridConfig, WithFalse } from '../../typing'
import type { FormListActionGuard, FormListMeta, ProFromListCommonProps } from './ListItem'
import { useIntl } from '@antdv-next1/pro-provider'
import {
  FormItem,
  FormList,
  useEffect,
  useProFormContextInject,
} from '@antdv-next1/pro-utils'
import { ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { noteOnce } from '@v-c/util/dist/warning'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import ErrorList from 'antdv-next/dist/form/ErrorList'
import { getNamePath } from 'antdv-next/dist/form/utils/valueUtil'
import { computed, defineComponent, ref } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import { useGridHelpers } from '../../helpers'
import { useFormListContextInject } from './context'
import ProFormListContainer from './ListContainer'
import useStyle from './style'

export type ProFormListProps = Omit<FormListProps, 'rules' | 'name'> & ProFromListCommonProps & {
  name?: NamePath<string | number | boolean>
  wrapperCol?: ColProps
  hidden?: boolean
  /**
   * @name label 列表的标签
   */
  label?: AntdVueNode
  /**
   * @name tooltip 标题旁边的？号提示展示的信息
   *
   * @example 自定义提示信息
   * <ProFormList title="标题"  tooltip="自定义提示信息">
   *  @example 自定义Icon
   * <ProFormList title="标题"  tooltip={{icon:<Info/>,title:自定义提示信息}}>
   */
  tooltip?: FormItemTooltipType
  rules?: (Required<FormListProps>['rules'][number] & {
    required?: boolean
  })[]
  /**
   * @name actionGuard 行操作的钩子配置
   *
   * @example 阻止删除 actionGuard={{beforeAddRow:()=> return false}}
   * @example 阻止新增 actionGuard={{beforeAddRow:()=> return false}}
   */
  actionGuard?: FormListActionGuard
  /**
   * 数据新增成功回调
   */
  onAfterAdd?: (...params: [...Parameters<FormListOperation['add']>, number]) => void
  /**
   * 数据移除成功回调
   */
  onAfterRemove?: (...params: [...Parameters<FormListOperation['remove']>, number]) => void
  /** 是否同时校验列表是否为空 */
  isValidateList?: boolean
  /** 当 isValidateList 为 true 时执行为空提示 */
  emptyListMessage?: string

  /**
   * @name containerStyle 盒子的样式
   */
  containerStyle?: CSSProperties
  /**
   * @name containerClassName 盒子的类名称
   */
  containerClassName?: string
  /**
   * @name creatorButtonProps 自定义新增按钮的配置
   * @example 设置按钮到顶部
   * creatorButtonProps={{position:"top"}}
   * @example 不显示按钮
   * creatorButtonProps={false}
   * @example 自定义按钮文案
   * creatorButtonProps={{creatorButtonText:"新增一行到底部"}}
   * @example 设置按钮类型
   * creatorButtonProps={{type:"primary"}}
   */
  creatorButtonProps?: WithFalse<(ButtonProps & {
    creatorButtonText?: VueNode
    position?: 'top' | 'bottom'
  })>
  fieldExtraRender?: (
    fieldAction: FormListOperation,
    meta: {
      errors?: VueNode[]
      warnings?: VueNode[]
    },
  ) => VueNode
  required?: boolean
  readonly?: boolean
} & Pick<ProFormGridConfig, 'colProps' | 'rowProps'>

export type ProFormListSlots = Omit<FormItemSlots, 'default'> & {
  default?: () => VueNode
  itemRender?: (
    dom: { listDom: VNode | null, action: VNode | null },
    listMeta: Partial<FormListMeta>,
  ) => VueNode
  fieldExtraRender?: (
    fieldAction: FormListOperation,
    meta: {
      errors?: VueNode[]
      warnings?: VueNode[]
    },
  ) => VueNode
  itemContainerRender?: (doms: VueNode, listMeta: FormListMeta) => VueNode
  actionRender?: (
    field: FormListFieldData,
    action: FormListOperation,
    defaultActionDom: VueNode,
    count: number,
  ) => VueNode[]
}

const ProFormList = defineComponent<ProFormListProps, {}, string, CustomSlotsType<ProFormListSlots>>((props, { attrs, slots, expose }) => {
  const config = useConfig()
  const actionRefs = ref<FormListOperation>()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-form-list`)
  const intl = useIntl()
  const formListContext = useFormListContextInject()
  const { formRef } = useProFormContextInject()
  const { setFieldValueType } = useFieldContextInject()
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const gridHelpersProps = computed(() => ({
    colProps: props.colProps,
    rowProps: props.rowProps,
  }))
  /**
   * 获取布局
   */
  const { ColWrapper, RowWrapper } = useGridHelpers(gridHelpersProps.value)

  // 处理 list 的嵌套
  const name = computed<NamePath<string | number | boolean>>(() => {
    if (formListContext.name?.value === undefined) {
      return getNamePath(props.name).flat(1)
    }
    return [formListContext.name.value, props.name].flat(1)
  })

  useEffect(() => {
    noteOnce(
      !!formRef?.value,
      `ProFormList 必须要放到 ProForm 中,否则会造成行为异常。`,
    )
    noteOnce(
      !!formRef?.value,
      `Proformlist must be placed in ProForm, otherwise it will cause abnormal behavior.`,
    )
  }, [() => formRef?.value])

  useEffect(() => {
    // 如果 setFieldValueType 和 props.name 不存在不存入
    if (!setFieldValueType || !props.name) {
      return
    }
    // Field.type === 'ProField' 时 props 里面是有 valueType 的，所以要设置一下
    // 写一个 ts 比较麻烦，用 any 顶一下
    setFieldValueType(
      [props.name].flat(1).filter(itemName => itemName !== undefined),
      {
        valueType: 'formList',
        transform: props.transform,
      },
    )
  }, [
  ])

  expose({
    add: (defaultValue?: StoreValue, insertIndex?: number) =>
      actionRefs.value?.add(defaultValue, insertIndex),
    move: (from: number, to: number) => actionRefs.value?.move(from, to),
    remove: (index: number | number[]) => actionRefs.value?.remove(index),
    get: (index: number) =>
      formRef?.value?.getFieldValue([...name.value as string[], index]),
    getList: () => formRef?.value?.getFieldValue([...name.value as string[]]),
  })
  return () => {
    const {
      transform,
      actionRender = slots.actionRender,
      creatorButtonProps,
      label,
      alwaysShowItemLabel,
      tooltip,
      creatorRecord,
      itemRender = slots.itemRender,
      rules,
      itemContainerRender = slots.itemContainerRender,
      fieldExtraRender = slots.fieldExtraRender,
      copyIconProps = {
        Icon: CopyOutlined,
        tooltipText: intl.value.getMessage({ id: 'copyThisLine', defaultMessage: '复制此项' }),
      },
      deleteIconProps = {
        Icon: DeleteOutlined,
        tooltipText: intl.value.getMessage({ id: 'deleteThisLine', defaultMessage: '删除此项' }),
      },
      upIconProps = {
        Icon: ArrowUpOutlined,
        tooltipText: intl.value.getMessage({ id: 'sortUpThisLine', defaultMessage: '向上排序' }),
      },
      downIconProps = {
        Icon: ArrowDownOutlined,
        tooltipText: intl.value.getMessage({ id: 'sortDownThisLine', defaultMessage: '向下排序' }),
      },
      arrowSort,
      prefixCls,
      actionGuard,
      min,
      max,
      colProps,
      wrapperCol,
      rowProps,
      onAfterAdd,
      onAfterRemove,
      isValidateList = false,
      emptyListMessage = intl.value.getMessage({
        id: 'emptyListValidateMessage',
        defaultMessage: '列表不能为空',
      }),
      containerClassName,
      containerStyle,
      readonly,
      ...rest
    } = props
    if (!formRef?.value)
      return null
    return (
      <ColWrapper>
        <div class={classNames(baseClassName.value, hashId.value, cssVarCls.value)} style={attrs.style}>
          <FormItem
            {...rest}
            label={label}
            tooltip={tooltip}
            prefixCls={prefixCls}
            wrapperCol={wrapperCol}
            required={(rules && Array.isArray(rules) ? rules : [rules])?.some(
              rule => rule?.required,
            )}
            class={attrs.class}
            name={isValidateList ? name.value : undefined}
            rules={
              isValidateList
                ? [
                    {
                      validator: (_, value) => {
                        if (!value || value.length === 0) {
                          return Promise.reject(new Error(emptyListMessage))
                        }
                        return Promise.resolve()
                      },
                      required: true,
                    },
                  ]
                : undefined
            }
            v-slots={
              {
                default: () => {
                  return (
                    <FormList
                      {...rest}
                      rules={rules}
                      name={name.value}
                      v-slots={{
                        default: (
                          fields: FormListFieldData[],
                          action: FormListOperation,
                          meta: { errors?: AntdVueNode[], warnings?: AntdVueNode[] },
                        ) => {
                          // 将 action 暴露给外部
                          actionRefs.value = action
                          return fields.length ? (
                            <RowWrapper>
                              <ProFormListContainer
                                name={name.value}
                                readonly={!!readonly}
                                originName={rest.name}
                                copyIconProps={copyIconProps}
                                deleteIconProps={deleteIconProps}
                                arrowSort={arrowSort}
                                upIconProps={upIconProps}
                                downIconProps={downIconProps}
                                formInstance={formRef.value!}
                                prefixCls={baseClassName.value}
                                meta={meta}
                                fields={fields}
                                itemContainerRender={itemContainerRender}
                                itemRender={itemRender}
                                fieldExtraRender={fieldExtraRender}
                                creatorButtonProps={creatorButtonProps}
                                creatorRecord={creatorRecord}
                                actionRender={actionRender}
                                action={action}
                                actionGuard={actionGuard}
                                alwaysShowItemLabel={alwaysShowItemLabel}
                                min={min}
                                max={max}
                                count={fields.length}
                                onAfterAdd={(defaultValue, insertIndex, count) => {
                                  if (isValidateList) {
                                    formRef?.value?.validateFields(name.value as string[])
                                  }
                                  onAfterAdd?.(defaultValue, insertIndex, count)
                                }}
                                onAfterRemove={(index, count) => {
                                  if (isValidateList) {
                                    if (count === 0) {
                                      formRef?.value?.validateFields(name.value as string[])
                                    }
                                  }
                                  onAfterRemove?.(index, count)
                                }}
                                containerClassName={containerClassName}
                                containerStyle={containerStyle}
                                v-slots={slots}
                              />
                              <ErrorList errors={meta.errors} warnings={meta.warnings} />
                            </RowWrapper>
                          ) : (
                            <>
                              <ProFormListContainer
                                name={name.value}
                                readonly={!!readonly}
                                originName={rest.name}
                                copyIconProps={copyIconProps}
                                deleteIconProps={deleteIconProps}
                                arrowSort={arrowSort}
                                upIconProps={upIconProps}
                                downIconProps={downIconProps}
                                formInstance={formRef.value!}
                                prefixCls={baseClassName.value}
                                meta={meta}
                                fields={fields}
                                itemContainerRender={itemContainerRender}
                                itemRender={itemRender}
                                fieldExtraRender={fieldExtraRender}
                                creatorButtonProps={creatorButtonProps}
                                creatorRecord={creatorRecord}
                                actionRender={actionRender}
                                action={action}
                                actionGuard={actionGuard}
                                alwaysShowItemLabel={alwaysShowItemLabel}
                                min={min}
                                max={max}
                                count={fields.length}
                                onAfterAdd={(defaultValue, insertIndex, count) => {
                                  if (isValidateList) {
                                    formRef?.value?.validateFields(name.value as string[])
                                  }
                                  onAfterAdd?.(defaultValue, insertIndex, count)
                                }}
                                onAfterRemove={(index, count) => {
                                  if (isValidateList) {
                                    if (count === 0) {
                                      formRef?.value?.validateFields(name.value as string[])
                                    }
                                  }
                                  onAfterRemove?.(index, count)
                                }}
                                containerClassName={containerClassName}
                                containerStyle={containerStyle}
                                v-slots={slots}
                              />
                              <ErrorList errors={meta.errors} warnings={meta.warnings} />
                            </>
                          )
                        },
                      }}
                    />
                  )
                },
              }
            }
          />
        </div>
      </ColWrapper>
    )
  }
}, {
  name: 'ProFormList',
  inheritAttrs: false,
})

export default ProFormList
