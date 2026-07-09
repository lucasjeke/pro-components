import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { MessageDescriptor } from '../../typing'
import { CloseOutlined, EllipsisOutlined, ReloadOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Dropdown, Tabs } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/index'
import { computed, defineComponent } from 'vue'
import { gLocaleObject } from '../../locales'
import useStyle from './style'

export interface MultiTabItem {
  key: string
  path?: string
  title: VueNode
  closable?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: VueNode
  meta?: Record<string, any>
}

export type MultiTabAction
  = | 'change'
    | 'close'
    | 'close-other'
    | 'close-left'
    | 'close-right'
    | 'refresh'

export interface MultiTabProps {
  prefixCls?: string
  items: MultiTabItem[]
  activeKey?: string
  hideWhenOnlyOne?: boolean
  showRefresh?: boolean
  showMore?: boolean
  formatMessage?: (message: MessageDescriptor) => string | undefined
  itemRender?: (options: { item: MultiTabItem, active: boolean, dom: VueNode }) => VueNode
  menuRender?: (options: { item?: MultiTabItem, actions: MultiTabAction[] }) => VueNode
}

export interface MultiTabEmits {
  change: (key: string, item: MultiTabItem) => void
  close: (key: string, item: MultiTabItem) => void
  'close-other': (key: string, item: MultiTabItem) => void
  'close-left': (key: string, item: MultiTabItem) => void
  'close-right': (key: string, item: MultiTabItem) => void
  refresh: (key: string, item: MultiTabItem) => void
  [key: string]: (...args: any[]) => void
}

export interface MultiTabSlots {
  item?: (options: { item: MultiTabItem, active: boolean }) => any
  menu?: (options: { item?: MultiTabItem, actions: MultiTabAction[] }) => any
}

const actionLocaleMap: Record<Exclude<MultiTabAction, 'change'>, string> = {
  close: 'app.multiTab.close',
  'close-other': 'app.multiTab.closeOther',
  'close-left': 'app.multiTab.closeLeft',
  'close-right': 'app.multiTab.closeRight',
  refresh: 'app.multiTab.refresh',
}

function getActionLabel(action: Exclude<MultiTabAction, 'change'>, formatMessage?: MultiTabProps['formatMessage']) {
  const defaultMessage = gLocaleObject()[actionLocaleMap[action]]
  if (formatMessage) {
    return formatMessage({
      id: actionLocaleMap[action],
      defaultMessage,
    })
  }
  return defaultMessage
}

const MultiTab = defineComponent<MultiTabProps, MultiTabEmits, string, CustomSlotsType<MultiTabSlots>>((props, { slots, emit, expose }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-multi-tab`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const mergedShowRefresh = computed(() => props.showRefresh !== false)
  const mergedShowMore = computed(() => props.showMore !== false)
  const mergedItems = computed(() => props.items || [])
  const activeItem = computed(() => {
    const items = mergedItems.value
    return items.find(item => item.key === props.activeKey) || items[0]
  })

  const getMoreActions = (item?: MultiTabItem): Exclude<MultiTabAction, 'change'>[] => {
    if (!item)
      return []
    const actions: Exclude<MultiTabAction, 'change'>[] = []
    actions.push('close-other')
    if (mergedShowRefresh.value)
      actions.push('refresh')
    return actions
  }

  const getTabActions = (item?: MultiTabItem): Exclude<MultiTabAction, 'change'>[] => {
    if (!item)
      return []
    return ['close', 'close-left', 'close-right', 'close-other', 'refresh']
  }

  const isActionDisabled = (action: Exclude<MultiTabAction, 'change'>, item?: MultiTabItem) => {
    if (!item)
      return true

    const items = mergedItems.value
    const itemIndex = items.findIndex(tab => tab.key === item.key)
    const isClosable = (tab: MultiTabItem) => tab.closable !== false

    if (action === 'close')
      return item.closable === false
    if (action === 'close-left')
      return !items.slice(0, itemIndex).some(isClosable)
    if (action === 'close-right')
      return !items.slice(itemIndex + 1).some(isClosable)
    if (action === 'close-other')
      return !items.some(tab => tab.key !== item.key && isClosable(tab))
    if (action === 'refresh')
      return !mergedShowRefresh.value || item.key !== props.activeKey

    return false
  }

  const emitAction = (action: Exclude<MultiTabAction, 'change'>, item?: MultiTabItem) => {
    if (!item)
      return
    emit(action, item.key, item)
  }

  const renderMenu = (item?: MultiTabItem, type: 'tab' | 'more' = 'tab') => {
    const actions = type === 'more' ? getMoreActions(item) : getTabActions(item)
    const customMenu = slots.menu?.({ item, actions }) || props.menuRender?.({ item, actions })
    if (customMenu)
      return customMenu
    return {
      items: actions.map(action => ({
        key: action,
        label: getActionLabel(action, props.formatMessage),
        disabled: isActionDisabled(action, item),
      })),
      onClick: ({ key }: { key: Exclude<MultiTabAction, 'change'> }) => emitAction(key, item),
    }
  }

  const renderItemLabel = (item: MultiTabItem) => {
    const active = item.key === props.activeKey
    const showRefreshAction = mergedShowRefresh.value && active
    const showCloseAction = item.closable !== false
    const actionIconFirstClassName = `${baseClassName.value}-action-icon-first`
    const defaultDom = (
      <span class={classNames(`${baseClassName.value}-title`, hashId?.value, cssVarCls?.value)}>
        {item.icon && <span class={classNames(`${baseClassName.value}-icon`, hashId?.value, cssVarCls?.value)}>{item.icon}</span>}
        <span class={classNames(`${baseClassName.value}-title-text`, hashId?.value, cssVarCls?.value)}>{item.title}</span>
        {showRefreshAction && (
          <ReloadOutlined
            class={classNames(
              `${baseClassName.value}-reload-btn`,
              actionIconFirstClassName,
              hashId?.value,
              cssVarCls?.value,
            )}
            spin={item.loading}
            onClick={(event: MouseEvent) => {
              event.stopPropagation()
              emitAction('refresh', item)
            }}
          />
        )}
        {showCloseAction && (
          <CloseOutlined
            data-action="close"
            data-key={item.key}
            class={classNames(`${baseClassName.value}-close-btn`, !showRefreshAction && actionIconFirstClassName, hashId?.value, cssVarCls?.value)}
            onClick={(event: MouseEvent) => {
              event.stopPropagation()
              emitAction('close', item)
            }}
          />
        )}
      </span>
    )
    const itemDom = slots.item?.({ item, active }) || props.itemRender?.({ item, active, dom: defaultDom }) || defaultDom
    const menu = renderMenu(item, 'tab')
    if (menu && typeof menu === 'object' && 'items' in menu) {
      return (
        <Dropdown trigger={['contextMenu']} menu={menu}>
          {itemDom}
        </Dropdown>
      )
    }
    return (
      <Dropdown trigger={['contextMenu']} popupRender={() => menu}>
        {itemDom}
      </Dropdown>
    )
  }

  expose({})
  return () => {
    if (!mergedItems.value.length || (props.hideWhenOnlyOne && mergedItems.value.length <= 1))
      return null

    const activeActions = getMoreActions(activeItem.value)
    const moreMenu = renderMenu(activeItem.value, 'more')
    return (
      <Tabs
        type="card"
        activeKey={props.activeKey}
        class={classNames(baseClassName.value, hashId?.value, cssVarCls?.value)}
        onChange={(key: string) => {
          const item = mergedItems.value.find(tab => tab.key === key)
          if (item)
            emit('change', key, item)
        }}
        tabBarExtraContent={{
          left: <div class={classNames(`${baseClassName.value}-extra-left`, hashId?.value, cssVarCls?.value)} />,
          right: mergedShowMore.value && activeActions.length
            ? (
                <Dropdown
                  menu={moreMenu && typeof moreMenu === 'object' && 'items' in moreMenu ? moreMenu : undefined}
                  popupRender={moreMenu && !(typeof moreMenu === 'object' && 'items' in moreMenu) ? () => moreMenu : undefined}
                >
                  <EllipsisOutlined rotate={90} class={classNames(`${baseClassName.value}-dropdown-menu-btn`, hashId?.value, cssVarCls?.value)} />
                </Dropdown>
              )
            : undefined,
        }}
        items={mergedItems.value.map(item => ({
          key: item.key,
          disabled: item.disabled,
          label: renderItemLabel(item),
        }))}
      />
    )
  }
}, {
  name: 'MultiTab',
  inheritAttrs: false,
  emits: ['change', 'close', 'close-other', 'close-left', 'close-right', 'refresh'],
})

export default MultiTab
