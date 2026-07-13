import type { MenuInfo } from '@v-c/menu'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { DefineSetupFnComponent, VNode } from 'vue'
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
  icon?: VueNode | DefineSetupFnComponent<any>
  meta?: Record<string, any>
}

export interface MultiTabProps {
  prefixCls?: string
  items?: MultiTabItem[]
  activeKey?: string
  onChange?: (key: string, item: MultiTabItem) => void
  onClose?: (key: string, item: MultiTabItem) => void
  onCloseOther?: (key: string, item: MultiTabItem) => void
  onCloseLeft?: (key: string, item: MultiTabItem) => void
  onCloseRight?: (key: string, item: MultiTabItem) => void
  onRefresh?: (key: string, item: MultiTabItem) => void
  itemRender?: (options: { item: MultiTabItem, active: boolean, dom: VueNode }) => VueNode
  menuRender?: (options: { item?: MultiTabItem, actions: MultiTabAction[] }) => VueNode
}

export function getFormatMessage(): (data: MessageDescriptor) => string | undefined {
  return ({ id, defaultMessage }: MessageDescriptor): string | undefined => {
    const locales = gLocaleObject()
    return locales[id] || defaultMessage
  }
}

export type MultiTabAction = 'change' | 'close' | 'closeOther' | 'closeLeft' | 'closeRight' | 'refresh'

export interface MultiTabActionItem {
  key: string
  title: VueNode
  closable?: boolean
}

export interface MultiTabActionDisabledOptions {
  items?: MultiTabActionItem[]
  item?: MultiTabActionItem
  activeKey?: string
}

export function multiTabActionDisabled(
  action: Exclude<MultiTabAction, 'change'>,
  options: MultiTabActionDisabledOptions,
) {
  const { items = [], activeKey } = options
  const item = options.item || items.find(tab => tab.key === activeKey)

  if (!item)
    return true

  const itemIndex = items.findIndex(tab => tab.key === item.key)
  if (itemIndex < 0)
    return true
  if (action === 'close')
    return options.item?.closable === false
  if (action === 'closeLeft')
    return itemIndex <= 0
  if (action === 'closeRight')
    return itemIndex >= items.length - 1
  if (action === 'closeOther')
    return items.length <= 1
  if (action === 'refresh')
    return item.key !== activeKey

  return false
}

const actionLocaleMap: Record<
  Exclude<MultiTabAction, 'change'>,
  {
    id: string
    defaultMessage: string
  }
> = {
  close: {
    id: 'app.multiTab.close',
    defaultMessage: '关闭当前',
  },
  closeOther: {
    id: 'app.multiTab.closeOther',
    defaultMessage: '关闭其他',
  },
  closeLeft: {
    id: 'app.multiTab.closeLeft',
    defaultMessage: '关闭到左侧',
  },
  closeRight: {
    id: 'app.multiTab.closeRight',
    defaultMessage: '关闭到右侧',
  },
  refresh: {
    id: 'app.multiTab.refresh',
    defaultMessage: '刷新当前页',
  },
}
function capitalize(str: string) {
  if (!str)
    return ''

  return str[0]?.toUpperCase() + str.slice(1)
}
function getMoreActions(item?: MultiTabItem): Exclude<MultiTabAction, 'change'>[] {
  if (!item)
    return []
  return ['closeOther', 'close', 'refresh']
}
function getTabActions(item?: MultiTabItem): Exclude<MultiTabAction, 'change'>[] {
  if (!item)
    return []
  return ['closeOther', 'closeLeft', 'closeRight', 'refresh']
}
const MultiTab = defineComponent<
  MultiTabProps,
  {},
  string,
  CustomSlotsType<{
    itemRender?: (options: { item: MultiTabItem, active: boolean }) => VueNode
    menuRender?: (options: { item?: MultiTabItem, actions: MultiTabAction[] }) => VueNode
  }>
>(
  (props, { expose, slots }) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-multi-tab`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const formatMessage = getFormatMessage()
    const activeItem = computed(() => {
      const items = props.items || []
      return items.find(item => item.key === props.activeKey) || items[0]
    })

    const handleAction = (action: MultiTabAction, item?: MultiTabItem) => {
      if (!item)
        return
      props[`on${capitalize(action)}` as 'onChange']!(item.key, item)
    }

    const renderMenu = (item?: MultiTabItem, type: 'tab' | 'more' = 'tab') => {
      const { menuRender = slots.menuRender } = props
      const actions = type === 'more' ? getMoreActions(item) : getTabActions(item)

      const customMenu = menuRender?.({ item, actions }) as VNode
      if (customMenu)
        return customMenu
      return {
        items: actions.map(action => ({
          key: action,
          label: formatMessage(actionLocaleMap[action as Exclude<MultiTabAction, 'change' | 'close'>]),
          disabled: multiTabActionDisabled(action, {
            items: props.items,
            item,
            activeKey: props.activeKey,
          }),
        })),
        onClick: ({ key }: MenuInfo) => handleAction(key as Exclude<MultiTabAction, 'change' | 'close'>, item),
      }
    }
    const renderItemLabel = (item: MultiTabItem) => {
      const { itemRender = slots.itemRender, items = [] } = props
      const active = item.key === props.activeKey
      const showCloseAction = item.closable !== false
      const actionIconFirstClassName = `${baseClassName.value}-action-icon-first`
      const defaultDom = (
        <span class={classNames(`${baseClassName.value}-title`, hashId?.value, cssVarCls?.value)}>
          {item.icon && (
            <span
              class={classNames(`${baseClassName.value}-icon`, hashId?.value, cssVarCls?.value)}
            >
              {item.icon}
            </span>
          )}
          <span
            class={classNames(`${baseClassName.value}-title-text`, hashId?.value, cssVarCls?.value)}
          >
            { item.title}
          </span>
          {active && (
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
                handleAction('refresh', item)
              }}
            />
          )}
          {showCloseAction && (
            <>
              {items.length > 1 ? (
                <CloseOutlined
                  data-action="close"
                  data-key={item.key}
                  class={classNames(
                    `${baseClassName.value}-close-btn`,
                    !active && actionIconFirstClassName,
                    hashId?.value,
                    cssVarCls?.value,
                  )}
                  onClick={(event: MouseEvent) => {
                    event.stopPropagation()
                    handleAction('close', item)
                  }}
                />
              ) : undefined}
            </>

          )}
        </span>
      )
      const itemDom = itemRender?.({ item, active, dom: defaultDom }) || defaultDom

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
      const { items = [] } = props
      if (!items.length || (items.length < 1))
        return null

      const activeActions = getMoreActions(activeItem.value)
      const moreMenu = renderMenu(activeItem.value, 'more')
      return (
        <Tabs
          type="card"
          activeKey={props.activeKey}
          class={classNames(baseClassName.value, hashId?.value, cssVarCls?.value)}
          onChange={(key: string) => {
            const item = items.find(tab => tab.key === key)
            if (item) {
              props.onChange?.(key, item)
            }
          }}
          tabBarExtraContent={{
            left: (
              <div
                class={classNames(
                  `${baseClassName.value}-extra-left`,
                  hashId?.value,
                  cssVarCls?.value,
                )}
              />
            ),
            right: activeActions.length
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
          items={items.map(item => ({
            key: item.key,
            disabled: item.disabled,
            label: renderItemLabel(item),
          }))}
        />
      )
    }
  },
  {
    name: 'MultiTab',
    inheritAttrs: false,
    emits: ['change', 'close', 'closeOther', 'closeLeft', 'closeRight', 'refresh'],
  },
)
export default MultiTab
