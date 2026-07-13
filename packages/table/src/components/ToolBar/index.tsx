import type { IntlType } from '@antdv-next1/pro-provider'
import type { ProFieldValueObjectType, ProFieldValueType, ProSchemaComponentTypes, VueNode, WithFalse } from '@antdv-next1/pro-utils'
import type { ChangeEvent } from '@v-c/util/dist/EventInterface'
import type { CustomSlotsType, Key } from '@v-c/util/dist/type'
import type { TabPaneProps as AntdTabPaneProps } from 'antdv-next'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { FunctionalComponent, SetupContext, VNode } from 'vue'
import type { OptionsRender, ToolBarRender } from '../../RenderTypings'
import type { ActionType, OptionSearchProps, ProColumns, SearchProps } from '../../typing'
import type { ColumnSettingProps } from '../ColumnSetting'
import type { ToolBarHeaderMenuProps } from './HeaderMenu'
import { proTheme, useIntl } from '@antdv-next1/pro-provider'
import { isSpecialNode, LabelIconTip, omitUndefined, useEffect, useState } from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { ReloadOutlined } from '@antdv-next/icons'
import ResizeObserver from '@v-c/resize-observer'
import { classNames } from '@v-c/util'
import { InputSearch, Tabs, Tooltip } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { cloneVNode, computed, defineComponent, Fragment, isVNode } from 'vue'
import { useTableContextInject } from '../../Store/Provide'
import ColumnSetting from '../ColumnSetting'
import DensityIcon from './DensityIcon'
import FullScreenIcon from './FullScreenIcon'
import HeaderMenu from './HeaderMenu'
import useStyle from './style'

export type OptionsFunctionType<T> = (e: MouseEvent, action?: ActionType<any, T>) => void

export type OptionsType<T> = OptionsFunctionType<T> | boolean

export interface ToolBarSetting {
  icon: VueNode
  tooltip?: FormItemTooltipType | string
  key?: string
  onClick?: (key?: string) => void
}
/** Antd 默认直接导出了 vc 组件中的 Tab.Pane 组件。 */
type TabPaneProps = AntdTabPaneProps & {
  key?: string
}

export interface ToolBarTabs {
  activeKey?: string
  defaultActiveKey?: string
  onChange?: (activeKey: Key) => void
  items?: TabPaneProps[]
}

export type ToolBarMenu = ToolBarHeaderMenuProps

export type SearchPropType
  = WithFalse<(SearchProps & {
    onSearch: (
      searchValue: string,
      event?: Event | MouseEvent | KeyboardEvent,
      info?: {
        source?: 'clear' | 'input'
      },
    ) => Promise<false | void> | false | void
  })
  | VNode>

type SettingPropType = VNode | ToolBarSetting

// export interface ListToolBarProps {
//   prefixCls?: string
//   /** 标题 */
//   title?: VueNode
//   /** 副标题 */
//   subTitle?: VueNode
//   /** 标题提示 */
//   tooltip?: string | FormItemTooltipType
//   /** 搜索输入栏相关配置 */
//   search?: SearchPropType
//   /** 搜索回调 */
//   onSearch?: (keyWords: string) => void
//   /** 工具栏右侧操作区 */
//   actions?: VueNode[]
//   /** 工作栏右侧设置区 */
//   settings?: SettingPropType[]
//   /** 是否多行展示 */
//   multipleLine?: boolean
//   /** 过滤区，通常配合 LightFilter 使用 */
//   filter?: VueNode
//   /** 标签页配置，仅当 `multipleLine` 为 true 时有效 */
//   tabs?: ListToolBarTabs
//   /** 菜单配置 */
//   menu?: ListToolBarMenu
// }

/**
 * 获取配置区域 DOM Item
 *
 * @param setting 配置项
 */
function getSettingItem(setting: VNode | {
  icon: VueNode
  tooltip?: FormItemTooltipType | string
  key?: string
  onClick?: (key?: string) => void
}) {
  if (isVNode(setting)) {
    return setting
  }
  if (setting) {
    const { icon, tooltip, onClick, key } = setting
    if (icon && tooltip) {
      if (!(isVNode(tooltip) || typeof tooltip === 'string' || typeof tooltip === 'number' || typeof tooltip === 'boolean' || typeof tooltip === 'function')) {
        return tooltip
      }
      return (
        <Tooltip title={tooltip}>
          <span
            key={key}
            onClick={() => {
              if (onClick) {
                onClick(key)
              }
            }}
          >
            {icon}
          </span>
        </Tooltip>
      )
    }
    return (
      <span
        key={key}
        onClick={() => {
          if (onClick) {
            onClick(key)
          }
        }}
      >
        {icon}
      </span>
    )
  }
  return null
}

export interface OptionConfig<T, ValueType> {
  density?: boolean
  fullScreen?: OptionsType<T>
  reload?: OptionsType<T>
  setting?: boolean | ColumnSettingProps<T, ValueType>
  search?: (OptionSearchProps & { name?: string }) | boolean
  reloadIcon?: VNode | string | number | boolean | VNode[] | (() => VNode | VNode[])
  densityIcon?: VNode | string | number | boolean | VNode[] | (() => VNode | VNode[])
}

export interface BaseToolbarProps {
  prefixCls?: string
  /** 标题 */
  title?: VueNode
  /** 副标题 */
  subTitle?: VueNode
  /** 标题提示 */
  tooltip?: string | FormItemTooltipType
  /** 搜索输入栏相关配置 */
  search?: SearchPropType
  /** 搜索回调 */
  onSearch?: (keyWords: string) => void
  /** 工具栏右侧操作区 */
  actions?: VueNode[]
  /** 工作栏右侧设置区 */
  settings?: SettingPropType[]
  /** 是否多行展示 */
  multipleLine?: boolean
  /** 过滤区，通常配合 LightFilter 使用 */
  filter?: VueNode
  /** 标签页配置，仅当 `multipleLine` 为 true 时有效 */
  tabs?: ToolBarTabs
  /** 菜单配置 */
  menu?: ToolBarMenu
}

export interface ToolBarProps<T, ValueType> {
  prefixCls?: string
  headerTitle?: VueNode
  tooltip?: string | FormItemTooltipType
  toolbar?: BaseToolbarProps
  toolBarRender?: ToolBarRender<T>
  action?: ActionType<Record<string, any>, T>
  options?: OptionConfig<T, ValueType> | false
  optionsRender?: OptionsRender<T, ValueType>
  loading?: boolean
  type?: ProSchemaComponentTypes
  selectedRowKeys?: (string | number)[]
  selectedRows?: (T | undefined)[]
  onSearch?: (keyWords: string) => void
  columns?: ProColumns<T, ValueType>[]
  onFormSearchSubmit?: (params: Record<string, any>) => void
  searchNode?: VueNode
  hideToolbar?: boolean
}

const ToolBarTabBar: FunctionalComponent<{
  prefixCls: string
  hashId?: string
  filtersNode: VueNode
  multipleLine: boolean
  /** 标签页配置，仅当 `multipleLine` 为 true 时有效 */
  tabs: ToolBarTabs
}> = ({ prefixCls, hashId, tabs, multipleLine, filtersNode }) => {
  if (!multipleLine)
    return null
  return (
    <div class={classNames(`${prefixCls}-extra-line`, hashId)}>
      {tabs?.items && tabs?.items.length ? (
        <Tabs
          style={{
            width: '100%',
          }}
          defaultActiveKey={tabs.defaultActiveKey}
          activeKey={tabs.activeKey}
          items={tabs.items?.map((item, index) => (
            {
              label: item.tab,
              ...item,
              key: item.key?.toString() || index?.toString(),
            }
          ))}
          onChange={tabs.onChange}
          tabBarExtraContent={filtersNode}
        />

      ) : (
        filtersNode
      )}
    </div>
  )
}

function getButtonText<T extends Record<string, any>, U extends (ProFieldValueType | ProFieldValueObjectType)>({
  intl,
}: OptionConfig<T, U> & {
  intl: IntlType
}, options: OptionConfig<T, U>) {
  return {
    reload: {
      text: intl.getMessage({ id: 'tableToolBar.reload', defaultMessage: '刷新' }),
      icon: options.reloadIcon ?? <ReloadOutlined />,
    },
    density: {
      text: intl.getMessage({ id: 'tableToolBar.density', defaultMessage: '表格密度' }),
      icon: <DensityIcon icon={options.densityIcon} />,
    },
    fullScreen: {
      text: intl.getMessage({ id: 'tableToolBar.fullScreen', defaultMessage: '全屏' }),
      icon: <FullScreenIcon />,
    },
  }
}

/**
 * 渲染默认的 工具栏
 *
 * @param options
 * @param defaultOptions
 * @param actions
 * @param columns
 */
function renderDefaultOption<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType)>(options: OptionConfig<T, ValueType>, defaultOptions: OptionConfig<T, ValueType> & {
  intl: IntlType
}, actions: ActionType<Record<string, any>, T>, columns: ProColumns<T, ValueType>[], loading?: boolean) {
  return Object.keys(options)
    .filter(item => item)
    .map((key) => {
      const value = options[key as 'fullScreen']
      if (!value) {
        return null
      }

      let onClick
        = value === true
          ? defaultOptions[key as keyof OptionConfig<T, ValueType>]
          : (event: MouseEvent) => value?.(event, actions)

      if (typeof onClick !== 'function') {
        onClick = () => {}
      }

      if (key === 'setting') {
        return (
          <ColumnSetting<T, U, ValueType> {...(options[key] as ColumnSettingProps<T, ValueType>)} columns={columns} key={key} />
        )
      }
      if (key === 'fullScreen') {
        return (
          <span key={key} onClick={onClick}>
            <FullScreenIcon />
          </span>
        )
      }
      const optionItem = getButtonText(defaultOptions, options)[key as 'fullScreen']
      if (optionItem) {
        return (
          <span key={key} onClick={onClick}>
            <Tooltip title={optionItem.text}>
              { key === 'reload' ? cloneVNode(optionItem.icon, {
                ...optionItem.icon.props,
                spin: loading,
              }) : optionItem.icon}
            </Tooltip>
          </span>
        )
      }
      return null
    })
    .filter(item => item)
}

const Toolbar = defineComponent(<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'>(props: ToolBarProps<T, ValueType>, { expose, attrs }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const counter = useTableContextInject<T, U, ValueType>()
  const intl = useIntl()
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-table-list-toolbar`)
  const { token } = proTheme.useToken()
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const [isMobile, setIsMobile] = useState(false)

  const searchConfig = computed(() => {
    if (!props.options) {
      return false
    }
    if (!props.options.search)
      return false
      /** 受控的value 和 onChange */
    const defaultSearchConfig = {
      value: counter.keyWords?.value,
      onChange: (e: ChangeEvent) => counter.setKeyWords?.(e.target.value),
    }
    if (props.options.search === true)
      return defaultSearchConfig as SearchPropType
    return {
      ...defaultSearchConfig,
      ...props.options.search,
    } as SearchPropType
  })

  /**
   * 获取搜索栏 DOM
   *
   */
  const searchNode = computed(() => {
    if (!searchConfig.value) {
      return null
    }
    if (isVNode(searchConfig.value)) {
      return searchConfig.value
    }
    return (
      <InputSearch
        {...searchConfig.value}
        style={{ width: unit(200) }}
        placeholder={intl.value.getMessage({
          id: 'tableForm.inputPlaceholder',
          defaultMessage: '请输入',
        })}
        onSearch={async (...restParams) => {
          if (searchConfig.value && !isVNode(searchConfig.value)) {
            const success = await searchConfig.value?.onSearch(...restParams)
            if (success !== false) {
              props.onSearch?.(restParams?.[0])
            }
          }
        }}
      />
    )
  })

  /** 轻量筛选组件 */
  const filtersNode = computed(() => {
    if (searchNode.value) {
      return (
        <div class={classNames(`${baseClassName.value}-filter`, hashId.value, cssVarCls.value)}>
          {searchNode.value}
        </div>
      )
    }
    return null
  })

  /** 有没有 title，需要结合多个场景判断 */
  const hasTitle = computed(
    () => props.toolbar?.menu || (props.headerTitle || props.toolbar?.title) || props.toolbar?.subTitle || props.toolbar?.tooltip,
  )
  // 操作列表
  const actions = computed(() => props.toolBarRender ? props.toolBarRender(props.action, { selectedRowKeys: props.selectedRowKeys, selectedRows: props.selectedRows! }) : [])

  const actionDom = computed(() => {
    if (!Array.isArray(actions.value)) {
      return actions.value
    }
    if (actions.value.length < 1) {
      return null
    }
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${token.value.marginXS}px`,
        }}
      >
        {actions.value.map((action, index) => {
          if (!isVNode(action) || (isVNode(action) && isSpecialNode(action))) {
            return <Fragment key={index}>{action}</Fragment>
          }
          return cloneVNode(action, {
            // key: index,
            ...action?.props,
          })
        })}
      </div>
    )
  })

  const onSearch = async (keyword: string) => {
    const { options, onFormSearchSubmit, action } = props
    if (!options || !options.search) {
      return
    }
    const { name = 'keyword' } = options.search === true ? {} : options.search
    /** 如果传入的 onSearch 返回值为 false，应该直接拦截请求 */
    const success = await (options.search as OptionSearchProps)?.onSearch?.(keyword)
    if (success === false)
      return
      // 查询的时候的回到第一页
    action?.setPageInfo?.({
      current: 1,
    })
    onFormSearchSubmit?.(
      omitUndefined({
        _timestamp: Date.now(),
        [name]: keyword,
      }),
    )
  }

  useEffect(() => {
    if (counter.keyWords?.value === undefined) {
      onSearch?.('')
    }
  }, [() => counter.keyWords?.value])

  const optionDom = computed(() => {
    const defaultOptions = {
      reload: () => props.action?.reload?.(),
      density: true,
      setting: true,
      search: false,
      fullScreen: () => props.action?.fullScreen?.(),
    }
    if (props.options === false) {
      return []
    }
    const options = {
      ...defaultOptions,
      fullScreen: false,
      ...props.options,
    }
    const settings = renderDefaultOption<T, U, ValueType>(
      options,
      {
        ...defaultOptions,
        intl: intl.value,
      },
      props.action!,
      props.columns!,
      props.loading,
    )
    if (props.optionsRender) {
      return props.optionsRender(
        {
          headerTitle: props.headerTitle,
          tooltip: props.tooltip,
          toolBarRender: props.toolBarRender,
          action: props.action,
          options: props.options,
          selectedRowKeys: props.selectedRowKeys,
          selectedRows: props.selectedRows,
          toolbar: {
            filter: props.searchNode,
            ...props.toolbar,
          },
          onSearch,
          columns: props.columns,
          optionsRender: props.optionsRender,
        },
        settings,
      )
    }
    return settings
  })
  const hasEnd = computed(() => !!(
    (hasTitle.value && searchNode.value)
    || (!props.toolbar?.multipleLine && filtersNode.value)
    || actionDom.value
    || optionDom.value?.length
  ))

  const hasStart = computed(
    () =>
      props.tooltip
      || (props.headerTitle || props.toolbar?.title)
      || props.toolbar?.subTitle
      || props.toolbar?.menu
      || (!hasTitle.value && searchNode.value),
  )
  const startTitleDom = computed(() => {
    // 保留dom是为了占位，不然 right 就变到左边了
    if (!hasStart.value && hasEnd.value) {
      return <div class={classNames(`${baseClassName.value}-left`, hashId.value, cssVarCls.value)} />
    }
    // 减少 space 的dom，渲染的时候能节省点性能
    if (!props.toolbar?.menu && (hasTitle.value || !searchNode.value)) {
      return (
        <div class={classNames(`${baseClassName.value}-left`, hashId.value, cssVarCls.value)}>
          <div class={classNames(`${baseClassName.value}-title`, hashId.value, cssVarCls.value)}>
            <LabelIconTip tooltip={props.tooltip} label={props.headerTitle || props.toolbar?.title} subTitle={props.toolbar?.subTitle} />
          </div>
        </div>
      )
    }
    return (
      <div
        class={classNames(`${baseClassName.value}-left`, hashId.value, cssVarCls.value, {
          [`${baseClassName.value}-left-has-tabs`]: props.toolbar?.menu?.type === 'tab',
          [`${baseClassName.value}-left-has-dropdown`]: props.toolbar?.menu?.type === 'dropdown',
          [`${baseClassName.value}-left-has-inline-menu`]: props.toolbar?.menu?.type === 'inline',
        })}
      >
        {hasTitle.value && !props.toolbar?.menu && (
          <div class={classNames(`${baseClassName.value}-title`, hashId.value, cssVarCls.value)}>
            <LabelIconTip tooltip={props.tooltip} label={props.toolbar?.title} subTitle={props.toolbar?.subTitle} />
          </div>
        )}
        {props.toolbar?.menu && (
        // 这里面实现了 tabs 的逻辑
          <HeaderMenu {...props.toolbar?.menu} prefixCls={prefixCls.value} hashId={hashId.value} cssVarCls={cssVarCls.value} />
        )}
        {!hasTitle.value && searchNode.value ? (
          <div class={classNames(`${prefixCls.value}-search`, hashId.value, cssVarCls.value)}>{searchNode.value}</div>
        ) : null}
      </div>
    )
  })
  const endTitleDom = computed(() => {
    if (!hasEnd.value)
      return null
    return (
      <div
        class={classNames(`${baseClassName.value}-right`, hashId.value)}
        style={isMobile.value ? {} : { alignItems: 'center' }}
      >
        {!props.toolbar?.multipleLine ? filtersNode.value : null}
        {hasTitle.value && searchNode.value ? (
          <div class={classNames(`${baseClassName.value}-search`, hashId.value)}>
            {searchNode.value}
          </div>
        ) : null}
        {actionDom.value}
        {optionDom.value?.length ? (
          <div class={classNames(`${baseClassName.value}-setting-items`, hashId.value)}>
            {optionDom.value.map((setting, index) => {
              const settingItem = getSettingItem(setting as VNode)
              return (
                <div
                  key={index}
                  class={classNames(`${baseClassName.value}-setting-item`, hashId.value)}
                >
                  {settingItem}
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  })
  const titleNode = computed(() => {
    if (!hasEnd.value && !hasStart.value)
      return null
    const containerClassName = classNames(`${baseClassName.value}-container`, hashId.value, {
      [`${baseClassName.value}-container-mobile`]: isMobile.value,
    })
    return (
      <div class={containerClassName}>
        {startTitleDom.value}
        {endTitleDom.value}
      </div>
    )
  })

  expose({})
  return () => {
    const {
      hideToolbar,
      toolbar,
    } = props
    if (hideToolbar) {
      return null
    }
    return (
      <ResizeObserver
        onResize={({ width }) => {
          if ((width < 375) !== isMobile.value) {
            setIsMobile(width < 375)
          }
        }}
      >
        <div
          class={classNames(baseClassName.value, hashId.value, attrs.class)}
          style={attrs.style}
        >
          {titleNode.value}
          <ToolBarTabBar
            filtersNode={filtersNode.value}
            hashId={hashId.value}
            prefixCls={prefixCls.value}
            tabs={toolbar?.tabs!}
            multipleLine={toolbar?.multipleLine!}
          />
        </div>
      </ResizeObserver>
    )
  }
}, {
  name: 'Toolbar',
  inheritAttrs: false,
  props: ['action', 'type', 'columns', 'headerTitle', 'onSearch', 'options', 'optionsRender', 'selectedRowKeys', 'selectedRows', 'toolBarRender', 'toolbar', 'tooltip', 'searchNode', 'hideToolbar', 'loading'],

})

export default Toolbar
