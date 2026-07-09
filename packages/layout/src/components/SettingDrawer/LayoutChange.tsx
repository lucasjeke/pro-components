import type { DefaultOptionType } from '@v-c/select'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { SelectValue } from 'antdv-next/dist/select/index'
import type { FunctionalComponent } from 'vue'
import type { PureSettings } from '../../defaultSettings'
import type { MessageDescriptor } from '../../typing'
import { Listy, ListyItem } from '@antdv-next1/pro-listy'
import { classNames } from '@v-c/util'
import { Select, Switch, Tooltip } from 'antdv-next'
import { cloneVNode, isVNode } from 'vue'
import defaultSettings from '../../defaultSettings'
import { gLocaleObject } from '../../locales'

export interface SettingItemProps {
  title: VueNode
  action: VueNode
  disabled?: boolean
  disabledReason?: VueNode
}
export function getFormatMessage(): ((data: { id: string, defaultMessage?: string }) => string) {
  return ({ id }: { id: string, defaultMessage?: string }): string => {
    const locales = gLocaleObject()
    return locales[id]!
  }
}

export function renderLayoutSettingItem(item: SettingItemProps) {
  let action: VueNode = ''
  if (isVNode(item.action)) {
    action = cloneVNode(item.action, {
      disabled: item.disabled,
    })
  }
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <ListyItem actions={[action]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </ListyItem>
    </Tooltip>
  )
}

export const LayoutSetting: FunctionalComponent<{
  settings: Partial<PureSettings>
  changeSetting: (key: string, value: any) => void
  hashId: string
  cssVarCls: string
  prefixCls: string
  formatMessage: (data: MessageDescriptor) => string
}> = ({ settings = {}, prefixCls, formatMessage, changeSetting, cssVarCls, hashId }) => {
  const { compact, contentWidth, splitMenus, fixedHeader, layout, fixedSiderbar } = settings || defaultSettings
  return (
    <Listy
      class={classNames(`${prefixCls}-list`, hashId, cssVarCls)}
      split={false}
      rowKey="title"
      variant="borderless"
      itemRender={item => renderLayoutSettingItem(item)}
      items={[
        {
          title: formatMessage({
            id: 'app.setting.content-width',
            defaultMessage: '内容区域宽度',
          }),
          action: (
            <Select
              value={contentWidth || 'Fixed'}
              size="small"
              class={classNames(`content-width`, hashId, cssVarCls)}
              onSelect={(value: SelectValue) => changeSetting('contentWidth', value)}
              style={{ width: 80 }}
              options={
                [
                  layout !== 'top'
                    ? undefined
                    : {
                        value: 'Fixed',
                        label: formatMessage({
                          id: 'app.setting.content-width.fixed',
                          defaultMessage: '固定',
                        }),
                      },
                  {
                    value: 'Fluid',
                    label: formatMessage({
                      id: 'app.setting.content-width.fluid',
                      defaultMessage: '流式',
                    }),
                  },
                ].filter(Boolean) as DefaultOptionType[]
              }
            />
          ),
        },
        {
          title: formatMessage({
            id: 'app.setting.theme.mode.compact',
            defaultMessage: '紧凑模式',
          }),
          action: <Switch size="small" class="compact-mode" checked={!!compact} onChange={checked => changeSetting('compact', checked)} />,
        },
        {
          title: formatMessage({
            id: 'app.setting.fixedheader',
            defaultMessage: '固定头部',
          }),
          disabled: layout === 'mix',
          disabledReason: formatMessage({
            id: 'app.setting.fixedheader.hint',
            defaultMessage: '混合模式必须开启固定 Header',
          }),
          action: <Switch size="small" class="fixed-header" checked={!!fixedHeader} onChange={checked => changeSetting('fixedHeader', checked)} />,
        },
        {
          title: formatMessage({
            id: 'app.setting.fixedsidebar',
            defaultMessage: '固定侧边菜单',
          }),
          disabled: layout === 'top',
          disabledReason: formatMessage({
            id: 'app.setting.fixedsidebar.hint',
            defaultMessage: '侧边菜单布局时可配置',
          }),
          action: <Switch size="small" class="fix-sidebar" checked={!!fixedSiderbar} onChange={checked => changeSetting('fixedSiderbar', checked)} />,
        },
        {
          title: formatMessage({ id: 'app.setting.splitMenus' }),
          disabled: layout !== 'mix',
          disabledReason: formatMessage({
            id: 'app.setting.layout.mix.hint',
            defaultMessage: '将菜单分割成Header和Side',
          }),
          action: <Switch size="small" checked={!!splitMenus} class="split-menus" onChange={checked => changeSetting('splitMenus', checked)} />,
        },
      ]}
    />
  )
}
