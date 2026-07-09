import type { Key, VueNode } from '@antdv-next1/pro-utils'
import { DownOutlined } from '@antdv-next/icons'
import { classNames, useMergedState } from '@v-c/util'
import { Dropdown, Space, Tabs } from 'antdv-next'
import { defineComponent, toRef } from 'vue'

export interface ToolBarMenuItem {
  key: Key
  label: VueNode
  disabled?: boolean
}

export interface ToolBarHeaderMenuProps {
  type?: 'inline' | 'dropdown' | 'tab'
  activeKey?: Key
  defaultActiveKey?: Key
  items?: ToolBarMenuItem[]
  onChange?: (activeKey?: Key) => void
  prefixCls?: string
  hashId?: string
  cssVarCls?: string
}
const HeaderMenu = defineComponent<ToolBarHeaderMenuProps>((props) => {
  const [activeKey, setActiveKey] = useMergedState<Key | undefined>(
    props.activeKey || (props.defaultActiveKey as Key),
    {
      value: toRef(() => props.activeKey),
      onChange: props.onChange,
    },
  )

  return () => {
    const { items = [], hashId, cssVarCls, type = 'inline', prefixCls } = props
    if (items.length < 1) {
      return null
    }
    const activeItem
      = items.find((item) => {
        return item.key === activeKey.value
      }) || items[0]
    if (type === 'inline') {
      return (
        <div
          class={classNames(
            `${prefixCls}-menu`,
            `${prefixCls}-inline-menu`,
            hashId,
            cssVarCls,
          )}
        >
          {items.map((item, index) => (
            <div
              key={item.key || index}
              onClick={() => setActiveKey(item.key)}
              class={classNames(
                `${prefixCls}-inline-menu-item`,
                activeItem?.key === item.key ? `${prefixCls}-inline-menu-item-active` : undefined,
                hashId,
                cssVarCls,
              )}
            >
              {item.label}
            </div>
          ))}
        </div>
      )
    }
    if (type === 'tab') {
      return (
        <Tabs
          activeKey={activeItem?.key as string}
          items={items.map(item => ({
            ...item,
            key: item.key?.toString(),
          }))}
          onTabClick={key => setActiveKey(key)}
        />

      )
    }
    return (
      <div class={classNames(`${prefixCls}-menu`, `${prefixCls}-dropdownmenu`, hashId, cssVarCls)}>
        <Dropdown
          trigger={['click']}
          menu={{
            selectedKeys: [activeItem?.key as string],
            onClick: (item) => {
              setActiveKey(item.key)
            },
            items: items.map((item, index) => ({
              key: item.key || index,
              disabled: item.disabled,
              label: item.label,
            })),
          }}
          v-slots={{
            default: () => (
              <Space class={classNames(`${prefixCls}-dropdownmenu-label`, hashId, cssVarCls)}>
                {activeItem?.label}
                <DownOutlined />
              </Space>
            ),
          }}
        />
      </div>
    )
  }
}, {
  name: 'ToolBarHeaderMenu',
  inheritAttrs: false,

})

export default HeaderMenu
