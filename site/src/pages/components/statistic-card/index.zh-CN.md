---
category: Components
title: StatisticCard
subtitle: 指标卡
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 布局
---

StatisticCard 基于 ProCard 和 Statistic 封装，用于展示核心指标、趋势、图表和底部说明区域。它适合仪表盘、概览页和指标监控场景。

## 何时使用 {#when-to-use}

- 需要在概览页展示核心业务指标时。
- 需要把统计数值和小图表组合展示时。
- 需要指标卡支持 ProCard 的标题、操作、栅格和切分能力时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本使用</demo>
</demo-group>

## API

### StatisticCard

StatisticCard 继承 ProCard 的大部分属性。

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| statistic | 指标数值配置 | `StatisticProps` | - | - |
| chart | 图表区域 | `VueNode` | - | - |
| chartPlacement | 图表相对指标的位置 | `'right' \| 'bottom' \| 'left'` | `'bottom'` | - |
| footer | 底部额外展示区域 | `VueNode` | - | - |

### Statistic

StatisticCard 暴露 `StatisticCard.Statistic`，也可以从包中直接导入 `Statistic`。

#### 属性 {#statistic-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 指标标题 | `VueNode` | - | - |
| value | 指标值 | `string \| number` | - | - |
| description | 描述信息 | `VueNode` | - | - |
| tooltip | 标题提示 | `TooltipProps & { icon?: VueNode } \| VueNode` | - | - |
| status | 状态点 | `BadgeProps['status']` | - | - |
| icon | 指标图标 | `VueNode` | - | - |
| layout | 布局方式 | `'horizontal' \| 'vertical' \| 'inline'` | `'inline'` | - |
| trend | 趋势方向 | `'up' \| 'down'` | - | - |

其余数值格式化属性继承 antdv-next Statistic。
