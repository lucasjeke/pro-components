---
category: Components
title: ProCard
subtitle: Advanced Card
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Layout
---

ProCard is a content container for admin pages. It combines Card, Row, Col, Tabs, split layout, grid layout, loading, actions, and collapsible behavior so cards can be composed with less boilerplate.

## When To Use {#when-to-use}

- A standard card is needed to contain page content.
- Multiple cards should be arranged with grid and gutter.
- Card content needs split, tabs, actions, loading, or collapse behavior.
- Nested cards should share a consistent ProComponents style.

## Examples {#examples}

<demo-group>
  <demo src="./demo/enum-switch.vue">Enum switch</demo>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/colspan.vue">Grid layout</demo>
  <demo src="./demo/responsive.vue">Responsive</demo>
  <demo src="./demo/split2.vue">Split card</demo>
  <demo src="./demo/split23.vue">Left and right</demo>
  <demo src="./demo/split.vue">Complex split</demo>
  <demo src="./demo/gutter.vue">Gutter</demo>
  <demo src="./demo/multipleLine.vue">Multiple lines</demo>
  <demo src="./demo/divider.vue">Grouped content</demo>
  <demo src="./demo/headerBordered.vue">Header bordered</demo>
  <demo src="./demo/collapsible.vue">Collapsible</demo>
  <demo src="./demo/group.vue">Expandable group</demo>
  <demo src="./demo/layout.vue">Centered content</demo>
  <demo src="./demo/loading.vue">Loading</demo>
  <demo src="./demo/actions.vue">Actions</demo>
  <demo src="./demo/headless.vue">Headless</demo>
  <demo src="./demo/bordered.vue">Bordered</demo>
  <demo src="./demo/hoverable.vue">Hoverable</demo>
  <demo src="./demo/tabs.vue">Tabs</demo>
  <demo src="./demo/tabs-card.vue">Card tabs</demo>
  <demo src="./demo/inner.vue">Inner card</demo>
  <demo src="./demo/steps-v.vue">Vertical steps</demo>
</demo-group>

## API

### Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Title | `VueNode` | - | - |
| subTitle | Subtitle | `VueNode` | - | - |
| tooltip | Tooltip beside title | `string` | - | - |
| extra | Top-right extra area | `VueNode` | - | - |
| layout | Content layout | `'default' \| 'center'` | `'default'` | - |
| loading | Loading state or custom loading content | `boolean \| VueNode` | `false` | - |
| colSpan | Grid span for nested cards | `number \| string` | `24` | - |
| gutter | Horizontal and vertical gutter | `number \| [number, number]` | `0` | - |
| direction | Flex direction for nested cards | `'column' \| 'row'` | `'row'` | - |
| split | Split direction | `'vertical' \| 'horizontal'` | - | - |
| type | Card type | `'inner' \| 'default'` | - | - |
| size | Card size | `'default' \| 'small'` | - | - |
| actions | Footer actions | `VueNode[]` | - | - |
| wrap | Wrap nested cards | `boolean` | `false` | - |
| variant | Border style | `'borderless' \| 'outlined'` | `'outlined'` | - |
| ghost | Remove card background and content padding | `boolean` | `false` | - |
| headerBordered | Show divider under header | `boolean` | `false` | - |
| collapsed | Controlled collapsed state | `boolean` | `false` | - |
| collapsible | Enable collapse in uncontrolled mode | `boolean` | `false` | - |
| defaultCollapsed | Default collapsed state | `boolean` | `false` | - |
| tabs | Tabs config | `ProCardTabs` | - | - |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| collapse | Triggered when card collapses in uncontrolled mode | `(collapsed: boolean) => void` | - |
