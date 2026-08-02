---
category: Components
title: StatisticCard
subtitle: Statistic Card
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Layout
---

StatisticCard is built with ProCard and Statistic for displaying key metrics, trends, charts, and footer descriptions. It is suitable for dashboards, overview pages, and monitoring views.

## When To Use {#when-to-use}

- Display key business metrics on an overview page.
- Combine statistic values with small charts.
- Use ProCard title, actions, grid, and split layout capabilities for metric cards.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
</demo-group>

## API

### StatisticCard

StatisticCard inherits most ProCard props.

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| statistic | Statistic value config | `StatisticProps` | - | - |
| chart | Chart area | `VueNode` | - | - |
| chartPlacement | Chart placement relative to statistic | `'right' \| 'bottom' \| 'left'` | `'bottom'` | - |
| footer | Extra footer area | `VueNode` | - | - |

### Statistic

StatisticCard exposes `StatisticCard.Statistic`; `Statistic` can also be imported directly from the package.

#### Props {#statistic-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Statistic title | `VueNode` | - | - |
| value | Statistic value | `string \| number` | - | - |
| description | Description | `VueNode` | - | - |
| tooltip | Title tooltip | `TooltipProps & { icon?: VueNode } \| VueNode` | - | - |
| status | Status dot | `BadgeProps['status']` | - | - |
| icon | Statistic icon | `VueNode` | - | - |
| layout | Layout mode | `'horizontal' \| 'vertical' \| 'inline'` | `'inline'` | - |
| trend | Trend direction | `'up' \| 'down'` | - | - |

Other number-formatting props are inherited from antdv-next Statistic.
