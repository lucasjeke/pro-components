import type { GenerateStyle } from '@antdv-next1/pro-provider'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { CSSProperties } from 'vue'
import type { HeaderRender, MenuItemRender, SlotsRenderType } from '../../RenderTypings'
import type { GlobalHeaderProps } from '../GlobalHeader'
import type { PrivateSiderMenuProps } from '../SiderMenu/SiderMenu'
import type { ProLayoutHeaderToken } from './style/header'
import { useProConfig } from '@antdv-next1/pro-provider'
import { getSlot } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { LayoutHeader } from 'antdv-next'
import { computed, defineComponent } from 'vue'
import { clearMenuItem } from '../../utils'
import GlobalHeader from '../GlobalHeader'
import TopNavHeader from '../TopNavHeader'
import useStyle from './style/header'
import { useStylish } from './style/stylish'

export type HeaderViewProps = {
  headerRender?: HeaderRender | false
  selectedKeys?: string[]
  openKeys?: string[] | false
  collapsedWidth?: number
  /**
   * @name location 当前应用会话的位置信息。如果你的应用创建了自定义的 history，则需要显示指定 location 属性
   */
  location?: {
    path?: string
  }
  menuItemRender?: MenuItemRender | false
  siderWidth?: number
  firstMenuWidth?: number
} & GlobalHeaderProps

const HeaderView = defineComponent<HeaderViewProps & PrivateSiderMenuProps & {
  hasSiderMenu?: boolean
}, {}, string, CustomSlotsType<
  Pick<
    SlotsRenderType,
    'headerRender' | 'menuRender' | 'menuHeaderRender' | 'actionsRender' | 'appListRender' | 'menuItemRender' | 'headerTitleRender' | 'headerContentRender'
  > & {
    default: () => VueNode[]
  }
>>((props, { slots, attrs }) => {
  const proProvide = useProConfig()
  const baseClassName = computed(() => `${props.prefixCls}-layout-header`)
  const needFixedHeader = computed(() => props.fixedHeader || props.layout === 'mix')
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const collapsedWidth = computed(() => props.collapsedWidth || 64)
  const isTop = computed(() => props.layout === 'top')
  useStylish(
    computed(() => `${baseClassName.value}.${baseClassName.value}-stylish`),
    {
      proLayoutCollapsedWidth: collapsedWidth,
      stylish: computed(() => props.stylish as GenerateStyle<ProLayoutHeaderToken>),
    },
  )
  const renderContent = () => {
    const { onCollapse, menuData = [], isMobile } = props
    const clearMenuData = clearMenuItem(menuData || [])
    const headerContentRender = getSlot(slots, props, 'headerContentRender')
    const headerRender = getSlot(slots, props, 'headerRender')
    const headerTitleRender = getSlot(slots, props, 'headerTitleRender')
    const menuRender = getSlot(slots, props, 'menuRender')
    const menuHeaderRender = getSlot(slots, props, 'menuHeaderRender')
    const actionsRender = getSlot(slots, props, 'actionsRender')
    const appListRender = getSlot(slots, props, 'appListRender')
    let defaultDom = (
      <GlobalHeader
        {...props}
        headerContentRender={headerContentRender}
        menuRender={menuRender}
        menuHeaderRender={menuHeaderRender}
        actionsRender={actionsRender}
        appListRender={appListRender}
        headerTitleRender={headerTitleRender}
        onCollapse={props.onCollapse}
        menuData={clearMenuData}
      >
        {headerContentRender && headerContentRender({ props, dom: null })}
      </GlobalHeader>
    )
    if (isTop.value && !isMobile) {
      defaultDom = (
        <TopNavHeader
          {...props}
          headerContentRender={headerContentRender}
          menuRender={menuRender}
          menuHeaderRender={menuHeaderRender}
          actionsRender={actionsRender}
          appListRender={appListRender}
          headerTitleRender={headerTitleRender}
          mode="horizontal"
          onCollapse={onCollapse}
          menuData={clearMenuData}
        />
      )
    }
    if (headerRender && typeof headerRender === 'function') {
      return headerRender({ props: { ...props, headerContentRender, menuRender, menuHeaderRender, actionsRender, appListRender }, dom: defaultDom })
    }
    return defaultDom
  }
  return () => {
    const { layout, headerRender, hasSiderMenu, firstMenuWidth = 80, isMobile, collapsed, siderWidth = 256 } = props

    if (layout === 'side' && headerRender === false)
      return null
    return (
      <>
        {needFixedHeader.value && (
          <LayoutHeader
            style={{
              ...(attrs.style || {}) as CSSProperties,
              height: `${proProvide.value.token.layout?.header?.heightLayoutHeader || 56}px`,
              lineHeight: `${proProvide.value.token.layout?.header?.heightLayoutHeader || 56}px`,
              background: 'transparent',
            }}
          />
        )}
        <LayoutHeader
          class={classNames(baseClassName.value, attrs.class, hashId?.value, cssVarCls?.value, {
            [`${baseClassName.value}-fixed`]: needFixedHeader.value,
            [`${baseClassName.value}-stylish`]: !!props.stylish,
          })}
          style={{
            ...(attrs.style || {}) as CSSProperties,
            width:
                  !needFixedHeader.value || !['side', 'left'].includes(layout!) || isMobile || !hasSiderMenu
                    ? '100%'
                    : `calc(100% - ${collapsed ? (layout === 'left' ? siderWidth < (collapsedWidth.value + firstMenuWidth) ? siderWidth : (collapsedWidth.value + firstMenuWidth) : collapsedWidth.value) : siderWidth}px)`,
          }}
        >
          {renderContent()}
        </LayoutHeader>
      </>
    )
  }
}, {
  name: 'HeaderView',
  inheritAttrs: false,
})

export default HeaderView
