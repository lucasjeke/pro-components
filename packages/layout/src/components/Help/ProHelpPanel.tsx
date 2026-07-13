import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { InjectionKey, Ref } from 'vue'
import type { ProHelpDataSource } from './HelpProvide'
import { isNeedOpenHash, useProConfig } from '@antdv-next1/pro-provider'
import { useMountMergeState, useState } from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { CloseOutlined, ProfileOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Card, ConfigProvider, Menu } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, h, inject, provide, ref } from 'vue'
import { gLocaleObject } from '../../locales'
import { useProHelpContext } from './HelpProvide'
import ProHelpContentPanel from './ProHelpContentPanel'
import ProHelpSearch from './ProHelpSearch'
import useStyle from './style'

export const selectKeyContextKey: InjectionKey<Ref<{
  selectedKey?: string
  setSelectedKey?: (key: string) => void
}>> = Symbol('selectKeyContext')

export function useSelectKeyProvider(props: Ref<{
  selectedKey?: string
  setSelectedKey?: (key: string) => void
}>) {
  return provide(selectKeyContextKey, props)
}

export function useSelectKeyContext() {
  return inject(selectKeyContextKey, ref({
  } as {
    selectedKey?: string
    setSelectedKey?: (key?: string) => void
  }))
}

export interface ProHelpPanelProps {
  /**
   * 帮助面板的标题
   */
  title?: string
  /**
   * 帮助面板首次打开时的默认选中文档的键名
   */
  defaultSelectedKey?: string
  /**
   * 当前选中的帮助文档的键名。如果提供了这个 prop，那么该组件将是一个受控组件，其状态将由父组件管理。如果未提供，那么该组件将是一个非受控组件，其状态将在组件内部管理。
   */
  selectedKey?: string
  'onUpdate:selectedKey'?: (selectedKey?: string) => void
  /**
   * 当选中的文档键名发生变化时调用的回调函数。新的键名将作为参数传递给该函数。
   */
  onSelectedKeyChange?: (key: string | undefined) => void
  /**
   *控制左侧面板是否能够打开
   */
  showLeftPanel?: boolean
  /**
   * 当左侧面板打开状态发生变化时调用的回调函数。新的打开状态将作为参数传递给该函数。
   */
  'onUpdate:showLeftPanel'?: (showLeftPanel?: boolean) => void
  /**
   * 当左侧面板打开状态发生变化时调用的回调函数。新的打开状态将作为参数传递给该函数。
   */
  onShowLeftPanelChange?: (show: boolean) => void
  /**
   * 卡片的变体类型
   */
  variant?: 'outlined' | 'borderless'
  /**
   * 当帮助面板关闭时调用的回调函数。
   */
  onClose?: () => void
  /**
   * 帮助面板的高度，可以是数字或字符串类型。
   */
  height?: number | string
  /**
   * 帮助面板的页脚
   */
  footer?: VueNode
  /**
   * 在一页内加载所有的 children 内容
   */
  infiniteScrollFull?: boolean
  /**
   * 自定义渲染 extra 部分的内容
   *
   * @param {VueNode} collapsePannelAction - 折叠收起的左侧按钮
   * @param {VueNode} helpSelectAction - 默认的帮助筛选按钮
   * @param {VueNode} closeAction - 关闭操作按钮
   * @returns {VueNode} - 返回自定义渲染的 extra 操作按钮
   *
   */
  extraRender?: (
    collapsePannelAction: VueNode,
    helpSelectAction: VueNode,
    closeAction: VueNode,
  ) => VueNode
}
function getFormatMessage(): ((data: { id: string, defaultMessage?: string }) => string) {
  return ({ id }: { id: string, defaultMessage?: string }): string => {
    const locales = gLocaleObject()
    return locales[id]!
  }
}

const ProHelpPanel = defineComponent<ProHelpPanelProps, {
  'onUpdate:selectedKey': any
  'onUpdate:showLeftPanel': any
}, string, CustomSlotsType<{
  extraRender?: (
    collapsePannelAction: VueNode,
    helpSearchAction: VueNode,
    closeAction: VueNode,
  ) => VueNode
  footer?: () => VueNode
  default?: () => VueNode
}>>((props, { emit, slots }) => {
  const config = useConfig()
  const prefixCls = computed(() => config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-help`)
  const proConfig = useProConfig()
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const proHelpContextProvide = useProHelpContext()
  const [openKey, setOpenKey] = useState('')
  const formatMessage = getFormatMessage()
  const [selectedKey, setSelectedKey] = useMountMergeState(() => {
    if (props.selectedKey) {
      return props.selectedKey
    }
    return props.defaultSelectedKey
  }, {
    defaultValue: props.defaultSelectedKey,
    value: computed(() => props.selectedKey),
    onChange: (value) => {
      emit('onUpdate:selectedKey', value)
      props['onUpdate:selectedKey']?.(value)
      props.onSelectedKeyChange?.(value)
    },
  })

  const [showLeftPanel, setShowLeftPanel] = useMountMergeState(() => {
    if (props.showLeftPanel) {
      return props.showLeftPanel
    }
    return true
  }, {
    defaultValue: true,
    value: computed(() => props.showLeftPanel),
    onChange: (show) => {
      emit('onUpdate:showLeftPanel', show)
      props['onUpdate:showLeftPanel']?.(show)
      props.onShowLeftPanelChange?.(show!)
    },
  })

  const dataSourceKeyMap = computed(() => {
    const map = new Map<
        string | undefined,
        ProHelpDataSource<any> & {
          parentKey?: string
        }
    >()
    proHelpContextProvide.value.dataSource.forEach((page) => {
      map.set(page.key, page)
      page.children?.forEach((item) => {
        map.set(item.key || item.title, {
          parentKey: page.key,
          ...item,
        } as unknown as ProHelpDataSource<any>)
      })
    })
    return map
  })
  const parentKey = computed(
    () => dataSourceKeyMap.value.get(selectedKey.value!)?.parentKey || '',
  )
  useSelectKeyProvider(computed(() => ({
    selectedKey: selectedKey.value,
    setSelectedKey,
  })))

  return () => {
    const {
      title = formatMessage({ id: 'app.help.title', defaultMessage: '帮助中心' }),
      variant = 'outlined',
      onClose,
      footer = slots.footer,
      extraRender = slots.extraRender,
      height,
    } = props
    const defaultExtraActions = {
      collapsePanelAction: (
        <div class={classNames(`${baseClassName.value}-actions-item`, hashId?.value, cssVarCls?.value)}>
          <ProfileOutlined
            {...{ title: 'collapse panel' }}
            onClick={() => setShowLeftPanel(!showLeftPanel.value)}
          />
        </div>
      ),
      helpSearchAction: (
        <ProHelpSearch
          iconClassName={classNames(`${baseClassName.value}-actions-item`, hashId?.value, cssVarCls?.value)}
          class={classNames(`${baseClassName.value}-actions-input`, hashId?.value, cssVarCls?.value)}
          value={selectedKey.value}
          basePrefixCls={baseClassName.value}
          onChange={(value, item) => {
            setSelectedKey(value)
            setOpenKey(item.dataItemKey)
          }}
        />
      ),
      closeAction: (
        <div class={classNames(`${baseClassName.value}-actions-item`, hashId?.value, cssVarCls?.value)}>
          <CloseOutlined
            onClick={() => onClose?.()}
          />
        </div>
      ),
    }

    return (
      <>
        <Card
          variant={variant}
          title={title}
          styles={{
            body: {
              display: 'flex',
              padding: 0,
              margin: 0,
              height: '100%',
              width: '100%',
            },
          }}
          size="small"
          extra={(
            <div class={classNames(`${baseClassName.value}-actions`, hashId?.value, cssVarCls?.value)}>
              {extraRender ? (
                extraRender(
                  defaultExtraActions.collapsePanelAction,
                  defaultExtraActions.helpSearchAction,
                  defaultExtraActions.closeAction,
                )
              ) : (
                <>
                  {defaultExtraActions.collapsePanelAction}
                  {defaultExtraActions.helpSearchAction}
                  {onClose ? defaultExtraActions.closeAction : null}
                </>
              )}
            </div>
          )}
        >

          {showLeftPanel.value ? (
            <div
              class={classNames(hashId?.value, cssVarCls?.value, `${baseClassName.value}-left-panel`)}
              style={{
                height: unit(height!),
              }}
            >
              <ConfigProvider
                theme={{
                  hashed: isNeedOpenHash(),
                  token: {
                    lineHeight: 1.2,
                    fontSize: 12,
                    controlHeightLG: 26,
                  },
                  components: {
                    Menu: {
                      itemBorderRadius: proConfig.value.token.borderRadius,
                      activeBarWidth: 0,
                      activeBarBorderWidth: 0,
                      itemSelectedBg:
                      proConfig.value.token.layout?.sider?.colorBgMenuItemSelected
                      || 'rgba(0, 0, 0, 0.04)',
                      itemActiveBg:
                      proConfig.value.token.layout?.sider?.colorBgMenuItemHover
                      || 'rgba(0, 0, 0, 0.04)',
                      itemColor:
                      proConfig.value.token.layout?.sider?.colorTextMenu
                      || 'rgba(0, 0, 0, 0.65)',
                      itemHoverColor:
                      proConfig.value.token.layout?.sider?.colorTextMenuActive
                      || 'rgba(0, 0, 0, 0.85)',
                      itemSelectedColor:
                      proConfig.value.token.layout?.sider?.colorTextMenuSelected
                      || 'rgba(0, 0, 0, 1)',
                      itemBg: 'transparent',
                      subMenuItemBg: 'transparent',
                      popupBg: proConfig.value.token?.colorBgElevated,
                      darkPopupBg: proConfig.value.token?.colorBgElevated,
                    },
                  },
                }}
              >
                <Menu
                  class={classNames(hashId?.value, cssVarCls?.value, `${baseClassName.value}-left-panel-menu`)}
                  openKeys={[parentKey.value, openKey.value]}
                  onOpenChange={(keys) => {
                    setOpenKey(keys.at(-1) || '')
                  }}
                  selectedKeys={selectedKey.value ? [selectedKey.value] : []}
                  onSelect={({ selectedKeys }) => {
                    setSelectedKey(selectedKeys.at(-1) || '')
                  }}
                  mode="inline"
                  items={proHelpContextProvide.value.dataSource.map((item) => {
                    return {
                      key: item.key,
                      label: item.title,
                      children: item.children.map((child) => {
                        return {
                          key: child.key,
                          label: child.title,
                        }
                      }),
                    }
                  })}
                />
              </ConfigProvider>
            </div>
          ) : null}
          <div
            class={classNames(hashId?.value, cssVarCls?.value, `${baseClassName.value}-content-panel`)}
            style={{
              height: unit(height!),
            }}
          >
            {selectedKey.value ? (
              <ProHelpContentPanel
                parentItem={dataSourceKeyMap.value.get(parentKey.value)}
                class={classNames(`${baseClassName.value}-content-render`, hashId?.value, cssVarCls?.value)}
                selectedKey={selectedKey.value}
                onScroll={key => setSelectedKey(key!)}
              />
            ) : null}
            {footer ? (
              <div class={classNames(`${baseClassName.value}-footer`, hashId?.value, cssVarCls?.value)}>{ Array.isArray(footer) || typeof footer === 'boolean' || typeof footer === 'number' || typeof footer === 'string' ? footer : h(footer)}</div>
            ) : null}
          </div>
        </Card>
      </>
    )
  }
}, {
  name: 'ProHelpPanel',
  inheritAttrs: false,
})

export default ProHelpPanel
