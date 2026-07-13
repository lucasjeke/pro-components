import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { BorderBeamProps, CardProps, ColProps, RowProps } from 'antdv-next'
import type { FormItemTooltipType } from 'antdv-next/dist/form/FormItemLabel'
import type { Gutter } from 'antdv-next/dist/grid/row'
import type { App, CSSProperties, Plugin } from 'vue'
import type { CollapsibleType } from './typing'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { CardGrid, CardMeta } from 'antdv-next'
import { defineComponent } from 'vue'
import InternalProCard from './Card'

export type ProCardProps = CardProps & RowProps & {
  /** 标题说明 */
  tooltip?: FormItemTooltipType
  // subTitle?: VueNode
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
  // collapsed?: boolean
  // 'onUpdate:collapsed'?: (collapsed: boolean) => void
  /** 折叠按钮自定义节点 */
  collapsibleIconRender?: ({ collapsed }: { collapsed: boolean }) => VueNode
  /** 配置默认是否折叠 */
  defaultCollapsed?: boolean
  /** 收起卡片的事件 */
  onCollapse?: (collapsed: boolean) => void
  /** 是否展示选中样式 */
  checked?: boolean
  /** 选中改变 */
  onChecked?: (e: MouseEvent) => void
  /** 栅格占位格数，24 栅格，colSpan={6} */
  colSpan?: ColProps['span']
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
  onClick?: (e: MouseEvent) => void
}

const _ProCard = defineComponent<ProCardProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
  extra?: () => VueNode
  title?: () => VueNode
}>>((props, { slots, expose, attrs }) => {
  expose({})
  return () => (
    <ProConfigProvider needDeps>
      <InternalProCard {...attrs} {...props} v-slots={slots} />
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
}
ProCard.isProCard = true
ProCard.CardGrid = CardGrid
ProCard.CardMeta = CardMeta
ProCard.install = (app: App) => {
  app.component(ProCard.name, ProCard)
  app.component(ProCard.CardGrid.name, CardGrid)
  app.component(ProCard.CardMeta.name, CardMeta)
  return app
}

export default ProCard
