import type { VueNode } from '@v-c/util'
import type { DropdownProps, MenuItemProps } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Button, Dropdown } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'

type MenuItems = MenuItemProps & {
  name: VueNode
  key: string
  title?: string
}

export type TableDropdownButtonProps = DropdownProps & {
  menus?: MenuItems[]
  onSelect?: (key: string) => void
}

const TableDropdownButton = defineComponent<TableDropdownButtonProps>((props, { slots, attrs }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-table-dropdown-button`)
  return () => {
    const { menus = [], onSelect, ...dropdownProps } = props
    return (
      <Dropdown
        {...dropdownProps}
        class={classNames(baseClassName.value, attrs.class)}
        menu={{
          onClick: (params) => {
            onSelect?.(params.key)
          },
          items: menus.map(({ key, name, ...rest }) => ({
            ...rest,
            key,
            title: rest.title as string,
            label: name,
          })),
        }}
        v-slots={{
          ...slots,
          default: () => (
            <Button
              icon-placement="end"
              style={attrs.style}
              v-slots={{
                icon: () => <DownOutlined />,
              }}
            >
              {slots.default?.()}
            </Button>
          ),
        }}
      />
    )
  }
}, {
  name: 'TableDropdownButton',
  inheritAttrs: false,
})

export default TableDropdownButton
