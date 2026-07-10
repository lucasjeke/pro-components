import type { VueNode } from '@antdv-next1/pro-utils'
import type { AppListProps } from './components/AppsLogoComponents/typing'
import type { FooterToolbarProps } from './components/FooterToolbar'
import type { HeaderViewProps } from './components/Header'
import type { MultiTabProps } from './components/MultiTab'
import type { PageContainerProps } from './components/PageContainer'
import type { PageHeaderProps } from './components/PageHeader'
import type { BaseMenuProps } from './components/SiderMenu/BaseMenu'
import type { PrivateSiderMenuProps, SiderMenuProps } from './components/SiderMenu/SiderMenu'
import type { RouteContextType } from './context/RouteContext'
import type { ProLayoutProps } from './ProLayout'
import type { MenuDataItem } from './typing'

export type MenuHeaderRender = (options: { logo: VueNode, title: VueNode, props?: SiderMenuProps }) => VueNode

export type HeaderContentRender = (options: { props: HeaderViewProps | (PrivateSiderMenuProps & SiderMenuProps), dom: VueNode }) => VueNode
export type MenuRender = (options: { props: HeaderViewProps, dom: VueNode }) => VueNode
export type HeaderRender = (options: { props: HeaderViewProps, dom: VueNode }) => VueNode
export type HeaderTitleRender = (options: { logo: VueNode, title: VueNode, props: HeaderViewProps }) => VueNode
export type MenuItemRender = (options: {
  item: MenuDataItem & {
    isUrl: boolean
    onClick: () => void
  }
  dom: VueNode
  props: BaseMenuProps & Partial<PrivateSiderMenuProps>
}) => VueNode
export type MenuContentRender = (options: { props: SiderMenuProps, dom: VueNode }) => VueNode
export type MenuFooterRender = (options: { props?: SiderMenuProps }) => VueNode
export type MenuExtraRender = (options: { props: SiderMenuProps }) => VueNode
export type SubMenuItemRender = (options: { item: MenuDataItem, dom: VueNode, props: BaseMenuProps }) => VueNode
export type ErrorBoundaryRender = (options: { error: Error, info: string }) => VueNode
export type AppListRender = (options: { props: AppListProps, dom: VueNode }) => VueNode
export type ActionsRender = (options: { props: HeaderViewProps | (PrivateSiderMenuProps & SiderMenuProps) }) => VueNode
export type CollapsedButtonRender = (options: { collapsed?: boolean, dom?: VueNode }) => VueNode

export type MultiTabRender = (options: { props: MultiTabProps, dom: VueNode }) => VueNode

export type PageHeaderRender = (options: { props: PageContainerProps }) => VueNode
export type BreadcrumbRender = (props: PageHeaderProps, defaultDom: VueNode) => VueNode

export type FooterRender = (options: {
  props: ProLayoutProps & {
    hasSiderMenu?: boolean
  }
  dom: VueNode
}) => VueNode

export type FooterToolbarContentRender = (options: { props: FooterToolbarProps & RouteContextType & { leftWidth?: string }, dom: VueNode }) => VueNode

export interface SlotsRenderType {
  multiTabRender?: MultiTabRender
  footerRender?: FooterRender
  footerToolbarContentRender?: FooterToolbarContentRender
  collapsedButtonRender?: CollapsedButtonRender
  actionsRender?: ActionsRender
  errorBoundaryRender?: ErrorBoundaryRender
  appListRender?: AppListRender
  menuHeaderRender?: MenuHeaderRender
  headerRender?: HeaderRender
  headerTitleRender?: HeaderTitleRender
  headerContentRender?: HeaderContentRender
  menuRender?: MenuRender
  menuItemRender?: MenuItemRender
  subMenuItemRender?: SubMenuItemRender
  menuContentRender?: MenuContentRender
  menuFooterRender?: MenuFooterRender
  menuExtraRender?: MenuExtraRender
  pageHeaderRender?: PageHeaderRender
}
