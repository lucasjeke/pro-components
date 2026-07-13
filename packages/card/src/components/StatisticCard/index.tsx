import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VNode } from 'vue'
import type { ProCardProps } from '../../ProCard'
import type { ProStatisticProps } from '../Statistic'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import ProCard from '../../ProCard'
import ProStatistic from '../Statistic'
import useStyle from './style'

export type ProStatisticCardProps = ProCardProps & {
  /** 图表配置 */
  chart?: VueNode
  /** 数值统计配置 */
  statistic?: ProStatisticProps
  /** Chart 相对于 statistic 的位置 */
  chartPlacement?: 'right' | 'bottom' | 'left'
  /** 底部额外展示区域 */
  footer?: VueNode
}

const _ProStatisticCard = defineComponent<
  ProStatisticCardProps,
  {},
  string,
  CustomSlotsType<{
    default?: () => VNode[]
  }>
>(
  (props, { attrs, slots, expose }) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-statistic-card`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    expose({})
    return () => {
      const {
        statistic,
        chart,
        chartPlacement,
        footer,
        ...restProps
      } = props
      // 在 StatisticCard 中时默认为 vertical。
      const statisticDom = statistic && <ProStatistic layout="vertical" {...statistic} />
      const chartDom = chart && (
        <div
          class={classNames(`${baseClassName.value}-chart`, hashId.value, cssVarCls.value, {
            [`${baseClassName.value}-chart-left`]: chartPlacement === 'left' && chart && statistic,
            [`${baseClassName.value}-chart-right`]:
              chartPlacement === 'right' && chart && statistic,
          })}
        >
          {chart}
        </div>
      )
      const contentCls = classNames(`${baseClassName.value}-content `, hashId.value, cssVarCls.value, {
        [`${baseClassName.value}-content-horizontal`]:
          chartPlacement === 'left' || chartPlacement === 'right',
      })
      // 默认上下结构
      const contentDom
        = (chartDom || statisticDom)
          && (chartPlacement === 'left' ? (
            <div class={contentCls}>
              {chartDom}
              {statisticDom}
            </div>
          ) : (
            <div class={contentCls}>
              {statisticDom}
              {chartDom}
            </div>
          ))
      return (
        <>
          <ProCard
            {...attrs}
            style={attrs.style}
            class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value)}
            {...restProps}
          >
            {contentDom}
            {slots.default?.()}
            {footer && (
              <div class={classNames(`${baseClassName.value}-footer`, hashId.value, cssVarCls.value)}>{footer}</div>
            )}
          </ProCard>
        </>
      )
    }
  },
  {
    name: 'ProStatisticCard',
    inheritAttrs: false,
  },
)

const ProStatisticCard = _ProStatisticCard as typeof _ProStatisticCard & {
  isProCard?: boolean
  Statistic?: typeof ProStatistic
}

ProStatisticCard.isProCard = true
ProStatisticCard.Statistic = ProStatistic
export default ProStatisticCard
