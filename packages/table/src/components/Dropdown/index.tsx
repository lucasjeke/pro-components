import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { DropdownProps, MenuItemProps } from 'antdv-next'
import { EllipsisOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Dropdown } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import DropdownButton from './Button'

type MenuItems = MenuItemProps & {
  name: VueNode
  key: string
  title?: string
}

export type TableDropdownProps = DropdownProps & {
  menus?: MenuItems[]
  onSelect?: (key: string) => void
}

const _TableDropdown = defineComponent<TableDropdownProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-table-dropdown`)
  return () => {
    const { menus = [], onSelect, ...dropdownProps } = props
    return (
      <Dropdown
        {...dropdownProps}
        class={classNames(baseClassName.value, attrs.class)}
        menu={{
          onClick: params => onSelect?.(params.key),
          items: menus.map(({ key, name, ...rest }) => ({
            key,
            ...rest,
            title: rest.title as string,
            label: name,
          })),
        }}
        v-slots={{
          ...slots,
          default: () => <a style={attrs.style}>{slots.default?.() || <EllipsisOutlined />}</a>,
        }}
      />
    )
  }
}, {
  name: 'TableDropdown',
  inheritAttrs: false,
})

const TableDropdown = _TableDropdown as typeof _TableDropdown & {
  Button?: typeof DropdownButton
}

TableDropdown.Button = DropdownButton

export default TableDropdown
