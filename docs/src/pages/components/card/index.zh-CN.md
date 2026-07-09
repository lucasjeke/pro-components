---
category: Components
title: ProCard
subtitle: 高级卡片
description:
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
demo:
group: 布局
---

页内容器卡片，提供标准卡片样式，卡片切分以及栅格布局能力。ProCard 创造性地将 Col, Row, Card, Tabs 等组件实现结合在一起，让你仅用一个组件就能够完成卡片相关的各种布局。

## 何时使用 {#when-to-use}

- 需要一个标准卡片容纳内容时。
- 需要多个卡片栅格，gutter 布局时。
- 需要进行卡片内切分布局时。
- 需要卡片可折叠时。

## 代码演示 {#examples}

<demo-group>
    <demo src="./demo/enum-switch.vue">枚举属性切换</demo>
    <demo src="./demo/basic.vue">基础卡片</demo>
    <demo src="./demo/colspan.vue">栅格布局</demo>
    <demo src="./demo/responsive.vue">响应式</demo>
    <demo src="./demo/split2.vue">卡片切分</demo>
    <demo src="./demo/split23.vue">左右分栏</demo>
    <demo src="./demo/split.vue">复杂切分</demo>
    <demo src="./demo/gutter.vue">栅格间隔</demo>
    <demo src="./demo/multipleLine.vue">多行卡片</demo>
    <demo src="./demo/divider.vue">分组展示</demo>
    <demo src="./demo/headerBordered.vue">标题带分割线</demo>
    <demo src="./demo/collapsible.vue">可折叠</demo>
    <demo src="./demo/group.vue">卡片组展开</demo>
    <demo src="./demo/layout.vue">内容居中</demo>
    <demo src="./demo/loading.vue">加载中</demo>
    <demo src="./demo/actions.vue">操作项</demo>
    <demo src="./demo/headless.vue">无标题</demo>
    <demo src="./demo/bordered.vue">带边框</demo>
    <demo src="./demo/hoverable.vue">浮出效果</demo>
    <demo src="./demo/tabs.vue">页签</demo>
    <demo src="./demo/tabs-card.vue">卡片式页签</demo>
    <demo src="./demo/inner.vue">内部卡片</demo>
    <demo src="./demo/steps-v.vue">竖向步骤示例</demo>
</demo-group>

## API

### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 标题 | `VueNode` | - | - |
| subTitle | 副标题 | `VueNode` | - | - |
| tooltip | 标题右侧图标 hover 提示信息 | `string` | - | - |
| extra | 右上角自定义区域 | `VueNode` | - | - |
| layout | 内容布局，支持垂直居中 | `default` \| `center` | default | - |
| loading | 加载中，支持自定义 loading 样式 | `boolean` \| `VueNode` | `false` | - |
| colSpan | 栅格布局宽度，24 栅格，支持指定宽度 px 或百分比，支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}`, 仅在嵌套的子卡片上设置有效。 | `number` \| `string` | `24` | - |
| gutter | 数字或使用数组形式同时设置 \[水平间距，垂直间距], 支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}` | `number` \| `array` | `0` | - |
| direction | 指定 Flex 方向，仅在嵌套子卡片时有效，默认方向为 row 横向 | `column` | - | - |
| split | 拆分卡片的方向 | `vertical` \| `horizontal` | - | - |
| type | 卡片类型 | `inner` \| `default` | - | - |
| size | 卡片尺寸 | `default` \| `small` | - | - |
| actions | 卡片操作组，位置在卡片底部 | `Array&lt;VueNode>` | - | - |
| direction | 指定 Flex 方向，仅在嵌套子卡片时有效，默认方向为 row 横向 | `column` \| `row` | `row` | - |
| wrap | 是否支持换行，仅在嵌套子卡片时有效 | `boolean` | `false` | - |
| variant | 是否有边框 | `borderless` \| `outlined` | `outlined` | - |
| ghost | 幽灵模式，即是否取消卡片内容区域的 padding 和 卡片的背景颜色。 | `boolean` | `false` | - |
| headerBordered | 页头是否有分割线 | `boolean` | `false` | - |
| collapsed | 受控属性，是否折叠 | `boolean` | `false` | - |
| collapsible | 配置是否可折叠，受控时无效 | `boolean` | `false` | - |
| defaultCollapsed | 默认折叠，受控时无效 | `boolean` | `false` | - |
| tabs | 标签页配置 | 见下面 ProCardTabs | - | - |

### 事件 {#events}

| 事件名 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| collapse | 收起卡片时触发，受控时无效 | `(collapsed: boolean) => void` | - |

### 方法 {#methods}

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
