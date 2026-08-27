import type { ProFormProps } from '@antdv-next1/pro-form'
import type { ActionTypeText, ProCoreActionType, ProFieldValueObjectType, ProFieldValueType, RecordKey, RowEditableConfig, UseEditableMapUtilType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, Key } from '@v-c/util/dist/type'
import type { DescriptionsItemType, DescriptionsProps } from 'antdv-next'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { App, FunctionalComponent, Plugin, Ref, SetupContext, VNode } from 'vue'
import type { ProDescriptionsItemProps } from './Item'
import type { RequestData } from './useFetchData'
import ProForm from '@antdv-next1/pro-form'
import ProSkeleton from '@antdv-next1/pro-skeleton'
import { childrenToArray, ErrorBoundary, genCopyable, isSpecialNode, LabelIconTip, normalizeProps, stringify, useEditableMap } from '@antdv-next1/pro-utils'
import { EditOutlined } from '@antdv-next/icons'
import { classNames, get } from '@v-c/util'
import { Descriptions, Space } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, Fragment, h, isVNode } from 'vue'
import FieldRender from './FieldRender'
import ProDescriptionsItem from './Item'
import useStyle from './style'
import useFetchData from './useFetchData'

export interface ProDescriptionsInstance<RecordType> {
  reload?: () => Promise<void>
  editableKeys: Ref<Key[]>
  setEditableRowKeys: (val: Key[]) => void
  isEditable: (recordKey: RecordKey) => boolean
  actionRender: (key: RecordKey, config?: ActionTypeText<RecordType>) => VueNode[]
  startEditable: (recordKey: RecordKey, recordValue?: any) => boolean
  cancelEditable: (recordKey: RecordKey) => Promise<boolean>
}

/**
 * 定义列表属性的类型定义，用于定义列表的一列
 * @typedef {object} ProDescriptionsItemProps
 * @property {ProSchema} schema - 用于生成表格项的 schema 配置对象
 * @property {boolean} [hide] - 是否隐藏该列，可用于权限控制
 * @property {boolean} [plain] - 是否只展示文本，不展示标签
 * @property {boolean} [copyable] - 是否可以拷贝该列的内容
 * @property {boolean | { showTitle?: boolean }} [ellipsis] - 是否展示省略号，如果是一个对象，可以设置鼠标悬浮时是否展示完整的内容
 * @property {ProFieldFCMode} [mode] - ProField 组件的模式
 * @property {React.ReactNode} [children] - 表格项的子组件
 * @property {number} [order] - 表格项的排序
 * @property {number} [index] - 表格项的索引
 * @template T - 表格数据的类型
 * @template ValueType - 表格项的值类型
 */

export type ProDescriptionsProps<RecordType = any, ValueType = 'text'> = Omit<DescriptionsProps, 'items'> & {
  /** params 参数 params 改变的时候会触发 reload */
  params?: Record<string, any>
  /** 网络请求报错 */
  onRequestError?: (e: Error) => void
  /** 获取数据的方法 */
  request?: (params: Record<string, any> | undefined) => Promise<RequestData>
  /** 描述项配置，使用 items 作为主入口 */
  columns?: ProDescriptionsItemProps<RecordType, ValueType>[]
  loading?: boolean
  onLoadingChange?: (loading?: boolean) => void
  tooltip?: FormItemTooltipType
  /** Form props 的相关配置 */
  formProps?: ProFormProps<RecordType, Record<string, any>>
  /** @name editable 编辑相关的配置 */
  editable?: RowEditableConfig<RecordType>
  /** 默认的数据源 */
  dataSource?: RecordType
  /** 受控数据源改变 */
  onDataSourceChange?: (value?: RecordType) => void
  /**
   *为空时候的默认值
   */
  emptyText?: VueNode
}

/**
 * 根据 dataIndex 获取值，支持 dataIndex 为数组
 *
 */
function getDataFromConfig<T, ValueType>(item: ProDescriptionsItemProps<T, ValueType>, entity: any) {
  const { dataIndex } = item
  if (dataIndex !== undefined && dataIndex !== null) {
    const data = Array.isArray(dataIndex)
      ? get(entity, dataIndex as string[])
      : entity[dataIndex as string]

    if (data !== undefined && data !== null) {
      return data as VueNode
    }
  }
  return item.content
}
const RenderComponent: FunctionalComponent<{ showEditIcon?: boolean }> = ({ showEditIcon }, { slots }) => {
  return showEditIcon ? <Space>{ slots.default?.()}</Space> : slots.default?.()
}

function schemaToDescriptionsItem<T extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(items: ProDescriptionsItemProps<T, ValueType>[], entity: T, action: ProCoreActionType<any, any>, editableUtils?: UseEditableMapUtilType, emptyText?: VueNode) {
  const options: VueNode[] = []
  const children = items
    ?.map?.<DescriptionsItemType | null>((item, index) => {
      if (isVNode(item)) {
        return {
          content: item,
        }
      }
      const {
        valueEnum,
        render,
        renderText,
        mode,
        plain,
        dataIndex,
        request,
        params,
        editable,
        ...restItem
      } = item as ProDescriptionsItemProps<T, ValueType>
      const defaultData = getDataFromConfig(item, entity) ?? restItem.content
      const text = renderText
        ? renderText(defaultData, entity, index, action)
        : defaultData
      const title
        = typeof restItem.title === 'function'
          ? restItem.title({ ...item, content: item.content as VueNode }, 'descriptions', null)
          : restItem.title
      //  dataIndex 无所谓是否存在
      // 有些时候不需要 dataIndex 可以直接 render
      const valueType = typeof restItem.valueType === 'function'
        ? (restItem.valueType(
            entity || {},
            'descriptions',
          ) as ProFieldValueType)
        : (restItem.valueType as ProFieldValueType)
      const fieldKey = (dataIndex ?? index) as Key
      const isEditable = editableUtils?.isEditable(fieldKey)
      const fieldMode = mode || (isEditable ? 'edit' : 'read')
      const showEditIcon = editableUtils
        && fieldMode === 'read'
        && editable !== false
        && editable?.(text, entity, index) !== false
      const key = restItem.key || restItem.label?.toString() || index
      const label = (title || restItem.label || restItem.tooltip) && (
        <LabelIconTip
          label={title || restItem.label}
          tooltip={restItem.tooltip}
          ellipsis={item.ellipsis}
        />
      )
      const fieldDom = (
        <FieldRender
          {...item}
          key={item?.key}
          dataIndex={item.dataIndex || index}
          mode={fieldMode}
          text={text}
          valueType={valueType}
          entity={entity}
          index={index}
          emptyText={emptyText}
          action={action}
          editableUtils={editableUtils}
        />
      )
      const field
        = valueType !== 'option'
          ? ({
              ...restItem,
              key,
              label,
              content: (
                <RenderComponent showEditIcon={showEditIcon}>
                  {fieldMode === 'edit' ? fieldDom : genCopyable(fieldDom, item, text)}
                  {showEditIcon && (
                    <EditOutlined
                      onClick={() => {
                        editableUtils?.startEditable(
                          fieldKey,
                        )
                      }}
                    />
                  )}
                </RenderComponent>
              ),
            } as DescriptionsItemType)
          : (
              <>
                {fieldDom}
              </>
            )
      // 如果类型是 option 自动放到右上角
      if (valueType === 'option') {
        options.push(field as VueNode)
        return null
      }
      return field as DescriptionsItemType
    })
    .filter((item): item is DescriptionsItemType => item !== null)
  return {
    // 空数组传递还是会被判定为有值
    options: options?.length ? options : null,
    children,
  }
}

const DefaultProDescriptionsDom: FunctionalComponent<{}> = (_, { slots }) => <>{slots.default?.()}</>

function getVNodeSlotContent(vnode: VNode, slotName: 'default' | 'content' | 'label'): VueNode | undefined {
  if (!vnode.children || typeof vnode.children !== 'object' || Array.isArray(vnode.children))
    return undefined

  const slot = (vnode.children as Record<string, (() => VueNode) | undefined>)[slotName]
  if (typeof slot !== 'function')
    return undefined

  const slotChildren = childrenToArray(slot() as unknown as VNode[], true) as VNode[]
  if (slotChildren.length === 0)
    return undefined
  const firstSlotChild = slotChildren[0]!
  if (slotChildren.length === 1 && isSpecialNode(firstSlotChild))
    return firstSlotChild.children as VueNode
  return slotChildren.length === 1
    ? firstSlotChild
    : h(Fragment, null, slotChildren)
}

function vnodeToDescriptionsItem<RecordType, ValueType>(
  vnode: VNode,
): ProDescriptionsItemProps<RecordType, ValueType> {
  const normalizedProps = normalizeProps(vnode.props || {}) as ProDescriptionsItemProps<RecordType, ValueType>
  const slotLabel = getVNodeSlotContent(vnode, 'label')
  const slotContent
    = getVNodeSlotContent(vnode, 'content')
      ?? getVNodeSlotContent(vnode, 'default')

  const vnodeKey = typeof vnode.key === 'string' || typeof vnode.key === 'number'
    ? vnode.key
    : undefined

  return {
    ...normalizedProps,
    key: normalizedProps.key ?? vnodeKey,
    label: slotLabel ?? normalizedProps.label,
    content: slotContent ?? normalizedProps.content,
  }
}

const _ProDescriptions = defineComponent(<
  RecordType extends Record<string, any>,
  ValueType extends (ProFieldValueType | ProFieldValueObjectType),
>(props: ProDescriptionsProps<RecordType, ValueType>,
  { slots, expose }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>,
) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-descriptions`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const action = useFetchData<RecordType>(
    async () => {
      const data = props.request ? await props.request(props.params || {}) : { data: {} }
      return data
    },
    {
      onRequestError: props.onRequestError,
      effects: [() => stringify(props.params)],
      manual: computed(() => props.request === undefined),
      dataSource: computed(() => props.dataSource!),
      loading: computed(() => props.loading),
      onLoadingChange: props.onLoadingChange,
      onDataSourceChange: props.onDataSourceChange,
    },
  )
  /*
   * 可编辑行的相关配置
   */
  const editableUtils = useEditableMap<RecordType>({
    ...props.editable,
    editableKeys: computed(() => props.editable?.editableKeys),
    type: computed(() => props.editable?.type),
    childrenColumnName: undefined,
    dataSource: action.dataSource,
    setDataSource: action.setDataSource,
  })
  const getColumns = (children: VueNode): ProDescriptionsItemProps<RecordType, ValueType>[] => {
    const childrenItems = childrenToArray(children as VNode)
      .filter((item: VNode<any, any, ProDescriptionsItemProps<RecordType, ValueType>>) => isVNode(item) && !isSpecialNode(item))
      .filter(Boolean)
      .map((item: VNode<any, any, ProDescriptionsItemProps<RecordType, ValueType>>) => {
        const itemProps = (item.props ?? {}) as ProDescriptionsItemProps<RecordType, ValueType>
        const {
          valueEnum,
          valueType,
          dataIndex,
          ellipsis,
          copyable,
          request: itemRequest,
        } = normalizeProps(itemProps)
        const componentName
          = typeof item.type === 'object' && 'name' in item.type
            ? item.type.name
            : undefined
        if (
          !valueType
          && !valueEnum
          && !dataIndex
          && !itemRequest
          && !ellipsis
          && !copyable
          && item.type !== ProDescriptionsItem
          && componentName !== 'ProDescriptionsItem'
        ) {
          return { content: item }
        }
        return vnodeToDescriptionsItem<RecordType, ValueType>(item)
      }) as ProDescriptionsItemProps<RecordType, ValueType>[]

    return [...(props.columns || []), ...childrenItems]
      .filter((item) => {
        if (!item)
          return false
        if (
          item?.valueType
          && ['index', 'indexBorder'].includes(item?.valueType as string)
        ) {
          return false
        }
        return !item?.hide && !item?.hideInDescriptions
      })
      .sort((a, b) => {
        if (b.order || a.order) {
          return (b.order || 0) - (a.order || 0)
        }
        return (b.index || 0) - (a.index || 0)
      })
  }
  expose({
    reload: async () => await action.reload(),
    editableKeys: editableUtils.editableKeys,
    setEditableRowKeys: editableUtils.setEditableRowKeys,
    isEditable: editableUtils.isEditable,
    actionRender: editableUtils.actionRender,
    startEditable: editableUtils.startEditable,
    cancelEditable: editableUtils.cancelEditable,
  })
  return () => {
    const { default: slotDefault, ...restSlots } = slots
    const {
      request,
      columns,
      params,
      dataSource,
      onDataSourceChange,
      formProps,
      editable,
      loading,
      onLoadingChange,
      onRequestError,
      emptyText,
      tooltip,
      ...rest
    } = props
    const { messageContextHolder: EditableMessageContextHolder } = editableUtils
    // loading 时展示
    // loading =  undefined 但是 request 存在时也应该展示
    if (action.loading?.value || (action.loading?.value === undefined && request)) {
      return <ProSkeleton type="descriptions" list={false} pageHeader={false} />
    }
    const mergedColumns = getColumns(slotDefault?.())
    const hasEllipsis = mergedColumns.some(item => !!item.ellipsis)
    const { options, children } = schemaToDescriptionsItem<RecordType, ValueType>(
      mergedColumns,
      action.dataSource?.value || {} as RecordType,
      action,
      editable ? editableUtils : undefined,
      props.emptyText,
    )
    /** 即使组件返回null了, 在传递的过程中还是会被Description检测到为有值 */
    let title = null
    if (rest.title || tooltip) {
      title = (
        <LabelIconTip label={rest.title} tooltip={tooltip} />
      )
    }
    /** 如果不是可编辑模式，没必要注入 ProForm */
    const FormComponent = editable ? ProForm : DefaultProDescriptionsDom
    const formComponentProps = editable
      ? {
          ...formProps,
          model: formProps?.model ?? action.dataSource?.value,
        }
      : formProps
    return (
      <ErrorBoundary>
        <FormComponent
          key="form"
          {...formComponentProps}
          submitter={false}
          onFinish={undefined}
        >
          <Descriptions
            {...rest}
            class={classNames(
              baseClassName.value,
              hashId.value,
              cssVarCls.value,
              {
                [`${baseClassName.value}-ellipsis`]: hasEllipsis,
              },
            )}
            styles={{
              content: {
                minWidth: 0,
              },
            }}
            extra={
              rest.extra ? (
                <Space>
                  {options}
                  {rest.extra}
                </Space>
              ) : <>{options}</>
            }
            title={title}
            items={children}
            v-slots={restSlots}
          />
          {EditableMessageContextHolder ? <EditableMessageContextHolder /> : null}
        </FormComponent>
      </ErrorBoundary>
    )
  }
}, {
  name: 'ProDescriptions',
  inheritAttrs: false,
  props: ['bordered', 'classes', 'colon', 'column', 'columns', 'contentRender', 'dataSource', 'editable', 'emptyText', 'extra', 'formProps', 'id', 'labelRender', 'layout', 'loading', 'onDataSourceChange', 'onLoadingChange', 'onRequestError', 'params', 'prefixCls', 'request', 'rootClass', 'size', 'styles', 'title', 'tooltip'],
})

const ProDescriptions = _ProDescriptions as typeof _ProDescriptions
  & Plugin & {
    Item: typeof ProDescriptionsItem
  }
ProDescriptions.Item = ProDescriptionsItem
ProDescriptions.install = (app: App) => {
  app.component(ProDescriptions.name!, ProDescriptions)
  app.component(ProDescriptionsItem.name!, ProDescriptionsItem)
}

export default ProDescriptions
