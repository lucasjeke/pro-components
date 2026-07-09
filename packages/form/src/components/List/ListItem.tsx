import type {
  FormListFieldData,
  FormListOperation,
  FormListProps,
  SearchTransformKeyFn,
  VueNode,
} from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ButtonProps, FormInstance } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { CSSProperties, DefineSetupFnComponent, PublicProps, VNode } from 'vue'
import type { WithFalse } from '../../typing'
import { useProConfig } from '@antdv-next1/pro-provider'
import { childrenToArray, isSpecialNode, normalizeProps, useState } from '@antdv-next1/pro-utils'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@antdv-next/icons'
import { classNames, get, set } from '@v-c/util'
import { Row, Tooltip, useConfig } from 'antdv-next'
import {
  cloneVNode,
  computed,
  defineComponent,
  isVNode,
  onUnmounted,
  ref,
  shallowReactive,
  shallowRef,
  toRefs,
} from 'vue'
import { useEditOrReadOnlyContextInject } from '../../BaseForm'
import { useGridHelpers } from '../../helpers'
import { useFormListContextInject, useFormListContextProvider } from './context'

export interface IconConfig {
  /**
   * 新的icon的组件，我们会将其实例化
   * Icon: ()=> <div/>
   */
  Icon?: DefineSetupFnComponent<any, {}, {}, any, PublicProps>
  /**
   * tooltip 的提示文案
   */
  tooltipText?: string
}

export interface FormListMeta {
  name: NamePath<string | number | boolean>
  field: FormListFieldData
  fields: FormListFieldData[]
  index: number
  operation: FormListOperation
  record: Record<string, any>
  meta: {
    errors?: VueNode[]
    warnings?: VueNode[]
  }
}

export interface FormListActionGuard {
  /**
   * @name beforeAddRow 添加行之前的钩子，返回false，会阻止这个行为
   *
   * @example 阻止新增 beforeAddRow={()=> return false}
   */
  beforeAddRow?: (
    ...params: [...Parameters<FormListOperation['add']>, number]
  ) => boolean | Promise<boolean>
  /**
   * @name beforeRemoveRow 删除行之前的钩子，返回false，会阻止这个行为
   *
   * @example 阻止删除 beforeAddRow={()=> return false}
   */
  beforeRemoveRow?: (
    ...params: [...Parameters<FormListOperation['remove']>, number]
  ) => boolean | Promise<boolean>
}

export interface ProFromListCommonProps {
  /**
   * @name transform 提交时转化值，一般用于将值转化为提交的数据
   * @param value 字段的值
   * @param namePath 字段的name
   * @param allValues 所有的字段
   * @returns 字段新的值，如果返回对象，会和所有值 merge 一次
   *
   * @example {name:[a,b] => {name:a,b }    transform: (value,namePath,allValues)=> value.join(",")
   * @example {name: string => { newName:string }    transform: (value,namePath,allValues)=> { newName:value }
   * @example {name:dayjs} => {name:string transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
   * @example {name:dayjs}=> {name:时间戳} transform: (value,namePath,allValues)=> value.valueOf()
   * @example {name:{value,label}} => { name:string} transform: (value,namePath,allValues)=> value.value
   * @example {name:{value,label}} => { valueName,labelName  } transform: (value,namePath,allValues)=> { valueName:value.value, labelName:value.name }
   */
  transform?: SearchTransformKeyFn
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
  creatorButtonProps?: WithFalse<
    ButtonProps & {
      creatorButtonText?: VueNode
      position?: 'top' | 'bottom'
      style?: CSSProperties
      class?: string
    }
  >
  /**
   * @name copyIconProps 复制按钮的配置
   * @description 可以自定义复制按钮的文案，图标，tooltip，设置为 false 就会消失
   * @type {IconConfig|false}
   */
  copyIconProps?: IconConfig | false
  /**
   * @name deleteIconProps 删除按钮的配置
   * @description 可以自定义删除按钮的文案，图标，tooltip，设置为 false 就会消失
   * @type {IconConfig|false}
   */
  deleteIconProps?: IconConfig | false
  /**
   * @name 向上排序按钮的配置
   * @description 可以自定义向上排序按钮的文案，图标，tooltip，设置为 false 就会消失
   * @type {IconConfig|false}
   */
  upIconProps?: IconConfig | false
  /**
   * @name 向下排序按钮的配置
   * @description 可以自定义向下排序按钮的文案，图标，tooltip，设置为 false 就会消失
   * @type {IconConfig|false}
   */
  downIconProps?: IconConfig | false
  /**
   * @name 箭头排序是否开启开关
   * @description 是否开启箭头排序 默认关闭
   * @type {boolean}
   */
  arrowSort?: boolean
  /**
   * @name creatorRecord 新建增加的默认数据
   * @description 如果是个每次新增数据都会调用这个函数，返回一个默认的数据
   *
   * @example 新建的时候自动生成默认值
   * creatorRecord={{ age: 18}}
   * @example 每次生成新的数据都会生成 id
   * creatorRecord={()=>{ id: crypto.randomUUID()}}
   */
  creatorRecord?: Record<string, any> | (() => Record<string, any>)
  /**
   * @name actionRender 自定义操作按钮
   *
   * @example 删除按钮
   * actionRender:(field,action)=><a onClick={()=>action.remove(field.name)}>删除</a>
   * @example 最多只能新增三行
   * actionRender:(f,action,_,count)=><a onClick={()=>
   *   count>2?alert("最多三行！"):action.add({id:"xx"})}>删除
   * </a>
   */
  actionRender?: (
    field: FormListFieldData,
    /**
     * @name action 操作能力
     * @example  action.add(data) 新增一行
     * @example  action.remove(index) 删除一行
     * @example  action.move(formIndex,targetIndex) 移动一行
     */
    action: FormListOperation,
    /**
     * 默认的操作dom
     * [复制，删除]
     */
    defaultActionDom: VueNode,
    /**
     * @name count 当前共有几个列表项
     */
    count: number,
  ) => VueNode[]
  /**
   * @name list 的内容的渲染函数
   *
   * @example 全部包再一个卡片里面
   * itemContainerRender: (doms,listMeta) => <Card title={listMeta.field.name}>{doms}</Card>
   */
  itemContainerRender?: (doms: VueNode, listMeta: FormListMeta) => VueNode
  /**
   * @name itemRender 自定义Item，可以用来将 action 放到别的地方
   *
   * @example 将每个item放到一个卡片里
   * itemRender: (dom,listMeta) => <Card extra={dom.action}  title={listMeta?.record?.name}>{dom.listDom}</Card>
   */
  itemRender?: (
    dom: { listDom: VNode | null, action: VNode | null },
    /**
     * list 的基本信息
     */
    listMeta: Partial<FormListMeta>,
  ) => VueNode
  /**
   * @name alwaysShowItemLabel 总是展示每一行的label
   * @default:false
   */
  alwaysShowItemLabel?: boolean
  /**
   * @name max 允许增加的最大条数
   */
  max?: number
  /**
   * @name min 允许增加的最少条数，删除时校验
   */
  min?: number
  /**
   * @name containerStyle 盒子的类名称
   */
  containerClassName?: string
  /**
   * @name containerStyle 盒子的样式
   */
  containerStyle?: CSSProperties
}

export type ProFormListItemProps = ProFromListCommonProps & {
  formInstance?: FormInstance
  action?: FormListOperation
  actionGuard?: FormListActionGuard
  prefixCls?: string
  fields?: FormListFieldData[]
  meta?: {
    errors?: VueNode[]
  }
  name?: FormListProps['name']
  originName?: FormListProps['name']
  /**
   * 数据新增成功回调
   */
  onAfterAdd?: (...params: [...Parameters<FormListOperation['add']>, number]) => void
  /**
   * 数据移除成功回调
   */
  onAfterRemove?: (...params: [...Parameters<FormListOperation['remove']>, number]) => void

  /** 是否只读模式 */
  readonly?: boolean
  /** 列表当前条目数量 */
  count?: number
  field?: FormListFieldData
  index?: number
}

export interface ProFormListItemSlots {
  default?: (options: {
    field?: FormListFieldData
    index?: number
    action?: Partial<FormListOperation> & {
      getCurrentRowData: () => any
      setCurrentRowData: (data: Record<string, any>) => void
    }
    count?: number
  }) => VueNode
  itemRender?: (
    dom: { listDom: VNode | null, action: VNode | null },
    listMeta: Partial<FormListMeta>,
  ) => VueNode
  itemContainerRender?: (doms: VueNode, listMeta: FormListMeta) => VueNode
  actionRender?: (
    field: FormListFieldData,
    action: FormListOperation,
    defaultActionDom: VueNode[],
    count: number,
  ) => VueNode[]
}

const ProFormListItem = defineComponent<
  ProFormListItemProps,
  {},
  string,
  CustomSlotsType<ProFormListItemSlots>
>(
  (props, { slots }) => {
    const { componentSize } = useConfig()
    const proProvide = useProConfig()
    const unmountedRef = ref(false)
    const formListPorvide = useFormListContextInject()
    const { grid } = useGridHelpers()
    const hasProFormGroup = shallowRef(false)
    const { mode } = useEditOrReadOnlyContextInject()
    const [loadingRemove, setLoadingRemove] = useState(false)
    const [loadingCopy, setLoadingCopy] = useState(false)
    onUnmounted(() => {
      unmountedRef.value = true
    })
    const copyIcon = computed(() => {
      if (mode.value === 'read')
        return null
      /** 复制按钮的配置 */
      if (props.copyIconProps === false || props.max === props.count)
        return null
      const { Icon = CopyOutlined, tooltipText } = (props.copyIconProps || {}) as IconConfig
      return (
        <Tooltip title={tooltipText} key="copy">
          {loadingCopy.value ? (
            <LoadingOutlined />
          ) : (
            <Icon
              class={classNames(
                `${props.prefixCls}-action-icon action-copy`,
                proProvide.value.hashId,
              )}
              onClick={async () => {
                setLoadingCopy(true)
                const fieldsValue = props.formInstance?.getFieldsValue(true)
                const row = get(
                  fieldsValue,
                  [formListPorvide.listName?.value, props.originName, props.field?.name]
                    .filter(item => item !== undefined)
                    .flat(1),
                )
                props.action?.add(row, props.count)
                setLoadingCopy(false)
              }}
            />
          )}
        </Tooltip>
      )
    })
    const deleteIcon = computed(() => {
      if (mode.value === 'read')
        return null
      if (props.deleteIconProps === false || props.min === props.count)
        return null
      const { Icon = DeleteOutlined, tooltipText } = props.deleteIconProps || {}
      return (
        <Tooltip title={tooltipText} key="delete">
          {loadingRemove.value ? (
            <LoadingOutlined />
          ) : (
            <Icon
              class={classNames(
                `${props.prefixCls}-action-icon action-remove`,
                proProvide.value.hashId,
              )}
              onClick={() => {
                setLoadingRemove(true)
                props.action?.remove(props.field!.name!)
                if (!unmountedRef.value) {
                  setLoadingRemove(false)
                }
              }}
            />
          )}
        </Tooltip>
      )
    })
    const upIcon = computed(() => {
      if (!props.arrowSort) {
        return null
      }
      if (mode.value === 'read')
        return null
      if (props.upIconProps === false)
        return null
      const toIndex = (props.index || 0) - 1
      if (toIndex < 0) {
        return null
      }
      const { Icon = ArrowUpOutlined, tooltipText } = props.upIconProps!
      return (
        <Tooltip title={tooltipText} key="up">
          <Icon
            class={classNames(`${props.prefixCls}-action-icon action-up`, proProvide.value.hashId)}
            onClick={async () => {
              await props.action?.move(props.index || 0, toIndex)
            }}
          />
        </Tooltip>
      )
    })

    const downIcon = computed(() => {
      if (!props.arrowSort) {
        return null
      }
      if (mode.value === 'read')
        return null
      if (props.downIconProps === false)
        return null
      const toIndex = (props.index || 0) + 1
      if (toIndex >= (props.count || 0)) {
        return null
      }
      const { Icon = ArrowDownOutlined, tooltipText } = props.downIconProps!
      return (
        <Tooltip title={tooltipText} key="down">
          <Icon
            class={classNames(
              `${props.prefixCls}-action-icon action-down`,
              proProvide.value.hashId,
            )}
            onClick={async () => {
              await props.action?.move(props.index || 0, toIndex)
            }}
          />
        </Tooltip>
      )
    })
    const defaultActionDom = computed(() =>
      [copyIcon.value, deleteIcon.value, upIcon.value, downIcon.value].filter(
        item => item !== null && item !== undefined,
      ),
    )
    const getCurrentRowData = () => {
      return props.formInstance?.getFieldValue(
        [formListPorvide.listName?.value, props.originName, props.index?.toString()]
          .flat(1)
          .filter(item => item !== null && item !== undefined),
      )
    }
    useFormListContextProvider({
      ...toRefs(shallowReactive(props.field || {})),
      listName: computed(() =>
        [formListPorvide.listName?.value, props.originName, props.field?.name]
          .filter(item => item !== undefined)
          .flat(1),
      ),
    })
    return () => {
      const {
        creatorButtonProps,
        deleteIconProps,
        copyIconProps,
        arrowSort,
        upIconProps,
        downIconProps,
        itemContainerRender = slots.itemContainerRender,
        itemRender = slots.itemRender,
        alwaysShowItemLabel,
        prefixCls,
        creatorRecord,
        action,
        actionGuard,
        actionRender = slots.actionRender,
        fields,
        meta,
        field,
        index,
        formInstance,
        originName,
        containerClassName,
        containerStyle,
        min,
        max,
        count,
        ...rest
      } = props
      let childrenArray: VueNode = []
      if (typeof slots.default === 'function') {
        childrenArray = childrenToArray(
          slots.default?.({
            field,
            index,
            action: {
              ...action,
              getCurrentRowData,
              setCurrentRowData: (data: Record<string, any>) => {
                const oldTableDate = formInstance?.getFieldsValue?.() || {}
                const rowKeyName = [formListPorvide.listName?.value, originName, index?.toString()]
                  .flat(1)
                  .filter(item => item !== null && item !== undefined)
                const updateValues = set(oldTableDate, rowKeyName, {
                  // 只是简单的覆盖，如果很复杂的话，需要自己处理
                  ...getCurrentRowData(),
                  ...(data || {}),
                })
                return formInstance?.setFieldsValue(updateValues)
              },
            },
            count,
          }) as VNode[],
          true,
        ).map((childrenItem: VNode) => {
          if (isVNode(childrenItem) && !isSpecialNode(childrenItem)) {
            childrenItem.props = normalizeProps(childrenItem.props || {})
            if ((childrenItem.type as { name: string }).name === 'ProFormGroup') {
              hasProFormGroup.value = true
              childrenItem.props.colProps = {
                span: 24,
              }
            }
            return cloneVNode(childrenItem, {
              ...(childrenItem?.props || {}),
            })
          }
          return childrenItem
        })
      }
      const actions
        = actionRender?.(field!, action!, defaultActionDom.value, count!) || defaultActionDom.value
      const dom
        = actions.length > 0 && mode.value !== 'read' ? (
          <div
            class={classNames(
              `${prefixCls}-action`,
              {
                [`${prefixCls}-action-small`]: (componentSize?.value || 'middle') === 'small',
              },
              proProvide.value.hashId,
            )}
          >
            {actions}
          </div>
        ) : null

      const options = {
        name: rest.name!,
        field: field!,
        index: index!,
        record: formInstance?.getFieldValue(
          [formListPorvide.listName?.value, originName, field?.name]
            .filter(item => item !== undefined)
            .flat(1),
        ),
        fields: fields!,
        operation: action!,
        meta: meta!,
      }
      const itemContainer = itemContainerRender?.(childrenArray, options) || childrenArray
      return (
        <>
          {itemRender?.(
            {
              listDom: (
                <div
                  class={classNames(
                    `${prefixCls}-container`,
                    containerClassName,
                    proProvide.value.hashId,
                  )}
                  style={{
                    width: grid.value ? '100%' : undefined,
                    ...containerStyle,
                  }}
                >
                  {itemContainer}
                </div>
              ),
              action: dom,
            },
            options,
          ) || (
            <div
              class={classNames(`${prefixCls}-item`, proProvide.value.hashId, {
                [`${prefixCls}-item-default`]: alwaysShowItemLabel === undefined,
                [`${prefixCls}-item-show-label`]: alwaysShowItemLabel,
              })}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <div
                class={classNames(
                  `${prefixCls}-container`,
                  containerClassName,
                  proProvide.value.hashId,
                )}
                style={{
                  width: grid.value ? '100%' : undefined,
                  ...containerStyle,
                }}
              >
                {hasProFormGroup.value && grid.value ? <Row>{itemContainer}</Row> : itemContainer}
              </div>
              {dom}
            </div>
          )}
        </>
      )
    }
  },
  {
    name: 'ProFormListItem',
    inheritAttrs: false,
  },
)

export default ProFormListItem
