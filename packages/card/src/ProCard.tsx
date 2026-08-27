import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { BorderBeamProps, CardProps, ColProps, RowProps } from 'antdv-next'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { Gutter } from 'antdv-next/dist/grid/row'
import type { App, CSSProperties, Plugin } from 'vue'
import type { Breakpoint, CollapsibleType } from './typing'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { CardGrid, CardMeta } from 'antdv-next'
import { defineComponent } from 'vue'
import InternalProCard from './Card'
import ProCardDivider from './Divider'
import ProCardGroup from './Group'

export type ProCardColSpan = number | string | Partial<Record<Breakpoint, number | string>>

export type ProCardProps = Omit<CardProps, 'loading' | 'onTabChange' | 'onUpdate:activeTabKey'> & RowProps & {
  /** 标题说明 */
  tooltip?: FormItemTooltipType
  /** 副标题 */
  subTitle?: VueNode
  loading?: boolean | VueNode
  /** 拆分卡片方式 */
  split?: 'vertical' | 'horizontal'
  /** 指定 Flex 方向，仅在嵌套子卡片时有效 */
  direction?: 'column' | 'row'
  /** 栅格间距 */
  gutter?: Gutter | [Gutter, Gutter]
  colStyle?: CSSProperties
  /** 边框流光 */
  borderBeam?: BorderBeamProps | boolean
  /** 布局，center 代表垂直居中 */
  layout?: 'default' | 'center'
  /** 是否有卡片阴影 */
  boxShadow?: boolean
  disabled?: boolean
  /** 头部是否有分割线 */
  headerBordered?: boolean
  /** 幽灵模式，即是否取消卡片内容区域的 padding 和 背景颜色。 */
  ghost?: boolean
  collapsible?: CollapsibleType
  /** 受控 collapsed 属性 */
  collapsed?: boolean
  /** 折叠按钮自定义节点 */
  collapsibleIconRender?: ({ collapsed }: { collapsed: boolean }) => VueNode
  /** 配置默认是否折叠 */
  defaultCollapsed?: boolean
  /** 是否展示选中样式 */
  checked?: boolean
  /** 栅格占位格数，24 栅格，colSpan={6} */
  colSpan?: ProCardColSpan
  /** 栅格左侧的间隔格数，间隔内不可以有栅格 */
  colOffset?: ColProps['offset']
  /** flex 布局填充 */
  colFlex?: ColProps['flex']
  /** 栅格顺序，flex 布局模式下有效 */
  colOrder?: ColProps['order']
  /** 栅格向左移动格数 */
  colPull?: ColProps['pull']
  colPush?: ColProps['push']
  /** <576px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  colXs?: ColProps['xs']
  /**  ≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  colSm?: ColProps['sm']
  /** ≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  colMd?: ColProps['md']
  /** ≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  colLg?: ColProps['lg']
  /** ≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  colXl?: ColProps['xl']
  /** ≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象 */
  colXxl?: ColProps['xxl']
}

export interface ProCardEmits {
  'checked': (e: MouseEvent) => void
  'click': (e: MouseEvent) => void
  'collapse': (collapsed: boolean) => void
  'tabChange': (key: string) => void
  'update:activeTabKey': (key: string) => void
  'update:collapsed': (collapsed: boolean) => void
  [key: string]: (...args: any[]) => void
}

export interface ProCardSlots {
  default?: () => VueNode
  actions?: () => VueNode
  cover?: () => VueNode
  extra?: () => VueNode
  subTitle?: () => VueNode
  title?: () => VueNode
  tabContentRender?: (args: { item: Record<string, any>, index: number }) => VueNode
  tabLabelRender?: (args: { item: Record<string, any>, index: number }) => VueNode
  tabBarExtraContent?: () => VueNode
}

const _ProCard = defineComponent<ProCardProps, ProCardEmits, string, CustomSlotsType<ProCardSlots>>((props, { slots, expose, attrs, emit }) => {
  expose({})
  return () => (
    <ProConfigProvider needDeps>
      <InternalProCard
        {...attrs}
        {...props}
        onChecked={e => emit('checked', e)}
        onClick={e => emit('click', e)}
        onCollapse={(value) => {
          emit('collapse', value)
        }}
        onTabChange={key => emit('tabChange', key)}
        onUpdate:activeTabKey={key => emit('update:activeTabKey', key)}
        onUpdate:collapsed={value => emit('update:collapsed', value)}
        v-slots={slots}
      />
    </ProConfigProvider>
  )
}, {
  name: 'ProCard',
  inheritAttrs: false,
})

const ProCard = _ProCard as typeof _ProCard & Plugin & {
  isProCard?: boolean
  CardGrid: typeof CardGrid
  CardMeta: typeof CardMeta
  Group: typeof ProCardGroup
  Divider: typeof ProCardDivider
}
ProCard.isProCard = true
ProCard.CardGrid = CardGrid
ProCard.CardMeta = CardMeta
ProCard.Group = ProCardGroup
ProCard.Divider = ProCardDivider

ProCard.install = (app: App) => {
  app.component(ProCard.name, ProCard)
  app.component(ProCard.CardGrid.name, CardGrid)
  app.component(ProCard.CardMeta.name, CardMeta)
  app.component(ProCard.Group.name, ProCardGroup)
  app.component(ProCard.Divider.name, ProCardDivider)
  return app
}

export default ProCard
