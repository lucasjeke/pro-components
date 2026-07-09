import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VNode } from 'vue'
import type { ProCardProps } from '../../ProCard'
import type { StatisticProps } from '../Statistic'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent } from 'vue'
import ProCard from '../../ProCard'
import Statistic from '../Statistic'
import useStyle from './style'

export type StatisticCardProps = ProCardProps & {
  /** 图表配置 */
  chart?: VueNode
  /** 数值统计配置 */
  statistic?: StatisticProps
  /** Chart 相对于 statistic 的位置 */
  chartPlacement?: 'right' | 'bottom' | 'left'
  /** 底部额外展示区域 */
  footer?: VueNode
}

const _StatisticCard = defineComponent<
  StatisticCardProps,
  {},
  string,
  CustomSlotsType<{
    default?: () => VNode[]
  }>
>(
  (props, { attrs, slots }) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-statistic-card`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    return () => {
      const {
        statistic,
        chart,
        chartPlacement,
        footer,
        ...restProps
      } = props
      // 在 StatisticCard 中时默认为 vertical。
      const statisticDom = statistic && <Statistic layout="vertical" {...statistic} />
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
    name: 'StatisticCard',
    inheritAttrs: false,
  },
)

const StatisticCard = _StatisticCard as typeof _StatisticCard & {
  isProCard?: boolean
  Statistic?: typeof Statistic
}

StatisticCard.isProCard = true
StatisticCard.Statistic = Statistic
export default StatisticCard
