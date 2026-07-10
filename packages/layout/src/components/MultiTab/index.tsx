import type { MenuInfo } from '@v-c/menu'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { VNode } from 'vue'
import type { MultiTabRender } from '../../RenderTypings'
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
    | 'closeOther'
    | 'closeLeft'
    | 'closeRight'
    | 'refresh'

export interface MultiTabProps {
  prefixCls?: string
  items?: MultiTabItem[]
  activeKey?: string
  hideWhenOnlyOne?: boolean
  showRefresh?: boolean
  showMore?: boolean
  itemRender?: (options: { item: MultiTabItem, active: boolean, dom: VueNode }) => VueNode
  menuRender?: (options: { item?: MultiTabItem, actions: MultiTabAction[] }) => VueNode
  multiTabRender?: MultiTabRender | false
}

export interface MultiTabEmits extends Record<string, (...args: any[]) => any> {
  change: (key: string, item: MultiTabItem) => void
  close: (key: string, item: MultiTabItem) => void
  closeOther: (key: string, item: MultiTabItem) => void
  closeLeft: (key: string, item: MultiTabItem) => void
  closeRight: (key: string, item: MultiTabItem) => void
  refresh: (key: string, item: MultiTabItem) => void
}

export interface MultiTabSlots {
  itemRender?: (options: { item: MultiTabItem, active: boolean }) => VueNode
  menuRender?: (options: { item?: MultiTabItem, actions: MultiTabAction[] }) => VueNode
  multiTabRender: MultiTabRender
}

export function getFormatMessage(): (data: MessageDescriptor) => string | undefined {
  return ({ id, defaultMessage }: MessageDescriptor): string | undefined => {
    const locales = gLocaleObject()
    return locales[id] || defaultMessage
  }
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
    defaultMessage: '关闭',
  },
  'closeOther': {
    id: 'app.multiTab.closeOther',
    defaultMessage: '关闭其他',
  },
  'closeLeft': {
    id: 'app.multiTab.closeLeft',
    defaultMessage: '关闭到左侧',
  },
  'closeRight': {
    id: 'app.multiTab.closeRight',
    defaultMessage: '关闭到右侧',
  },
  refresh: {
    id: 'app.multiTab.refresh',
    defaultMessage: '刷新当前页',
  },
}

const MultiTab = defineComponent<
  MultiTabProps,
  MultiTabEmits,
  string,
  CustomSlotsType<MultiTabSlots>
>(
  (props, { expose, slots, emit }) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-multi-tab`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const formatMessage = getFormatMessage()
    const mergedShowMore = computed(() => props.showMore !== false)
    const mergedShowRefresh = computed(() => props.showRefresh !== false)
    const activeItem = computed(() => {
      const items = props.items || []
      return items.find(item => item.key === props.activeKey) || items[0]
    })
    const isActionDisabled = (action: Exclude<MultiTabAction, 'change'>, item?: MultiTabItem) => {
      if (!item)
        return true
      const items = props.items || []
      const itemIndex = items.findIndex(tab => tab.key === item.key)
      const isClosable = (tab: MultiTabItem) => tab.closable !== false
      if (action === 'close')
        return item.closable === false
      if (action === 'closeLeft')
        return !items.slice(0, itemIndex).some(isClosable)
      if (action === 'closeRight')
        return !items.slice(itemIndex + 1).some(isClosable)
      if (action === 'closeOther')
        return !items.some(tab => tab.key !== item.key && isClosable(tab))
      if (action === 'refresh')
        return !mergedShowRefresh.value || item.key !== props.activeKey

      return false
    }
    const getMoreActions = (item?: MultiTabItem): Exclude<MultiTabAction, 'change'>[] => {
      if (!item)
        return []
      const actions: Exclude<MultiTabAction, 'change'>[] = []
      actions.push('closeOther')
      if (mergedShowRefresh.value)
        actions.push('refresh')
      return actions
    }
    const getTabActions = (item?: MultiTabItem): Exclude<MultiTabAction, 'change'>[] => {
      if (!item)
        return []
      return ['close', 'closeLeft', 'closeRight', 'closeOther', 'refresh']
    }
    const emitAction = (action: MultiTabAction, item?: MultiTabItem) => {
      if (!item)
        return
      emit(action, item.key, item)
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
          label: formatMessage?.(actionLocaleMap[action]),
          disabled: isActionDisabled(action, item),
        })),
        onClick: ({ key }: MenuInfo) => emitAction(key as Exclude<MultiTabAction, 'change'>, item),
      }
    }
    const renderItemLabel = (item: MultiTabItem) => {
      const { itemRender = slots.itemRender } = props
      const active = item.key === props.activeKey
      const showRefreshAction = mergedShowRefresh.value && active
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
            {item.title}
          </span>
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
              class={classNames(
                `${baseClassName.value}-close-btn`,
                !showRefreshAction && actionIconFirstClassName,
                hashId?.value,
                cssVarCls?.value,
              )}
              onClick={(event: MouseEvent) => {
                event.stopPropagation()
                emitAction('close', item)
              }}
            />
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
      if (!items.length || (props.hideWhenOnlyOne && items.length <= 1))
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
              emit('change', key, item)
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
