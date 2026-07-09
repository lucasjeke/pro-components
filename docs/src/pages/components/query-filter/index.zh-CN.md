---
category: Components
title: Query/LightFilter
subtitle: 筛选表单
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 数据录入
---

QueryFilter 和 LightFilter 是用于筛选场景的 ProForm 布局。QueryFilter 适合表格、列表顶部的多条件查询；LightFilter 适合工具栏、卡片头部等紧凑区域的行内筛选。

## 何时使用 {#when-to-use}

- 需要和 ProTable、ProListy 等数据展示组件组合使用筛选表单时。
- 查询项较多，需要自动响应式折叠和展开时。
- 需要轻量、行内、弹层式筛选时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">查询筛选</demo>
  <demo src="./demo/default-collapsed.vue">默认收起</demo>
  <demo src="./demo/vertical.vue">垂直布局</demo>
  <demo src="./demo/search.vue">搜索</demo>
  <demo src="./demo/defaultFormItemsNumber.vue">自定义默认显示数量</demo>
  <demo src="./demo/light-filter.vue">轻量筛选</demo>
  <demo src="./demo/footer.vue">自定义 footer</demo>
  <demo src="./demo/bordered.vue">轻量筛选边框模式</demo>
  <demo src="./demo/collapse.vue">轻量筛选折叠模式</demo>
  <demo src="./demo/placement.vue">弹出框对齐方式</demo>
</demo-group>

## API

### QueryFilter

QueryFilter 继承 ProForm 的大部分属性。

#### 属性 {#query-filter-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultCollapsed | 默认是否收起 | `boolean` | `true` | - |
| layout | 表单布局 | `'horizontal' \| 'inline' \| 'vertical'` | - | - |
| defaultColsNumber | 默认每行展示表单项数量 | `number` | - | - |
| defaultFormItemsNumber | 默认展示表单项数量 | `number` | - | - |
| labelWidth | 标签宽度 | `number \| 'auto'` | - | - |
| split | 垂直布局下是否显示分割线 | `boolean` | `false` | - |
| span | 栅格列数配置 | `number \| { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number }` | - | - |
| searchText | 查询按钮文案 | `string` | - | - |
| resetText | 重置按钮文案 | `string` | - | - |
| searchGutter | 查询表单栅格间隔 | `RowProps['gutter']` | - | - |
| optionRender | 自定义底部操作区 | `OptionRender` | - | - |
| ignoreRules | 是否忽略 Form.Item rules | `boolean` | `false` | - |
| showHiddenNum | 是否显示折叠隐藏数量 | `boolean` | `false` | - |
| submitterColSpanProps | 操作按钮 Col 配置 | `ColProps & { span?: number }` | - | - |
| containerStyle | 容器样式 | `CSSProperties` | - | - |

#### 事件 {#query-filter-events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| reset | 重置时触发 | `(values) => void` | - |
| finish | 提交时触发 | `(values) => void \| Promise<void>` | - |
| valuesChange | 值变化时触发 | `(changedValues, values) => void` | - |

### LightFilter

#### 属性 {#light-filter-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| collapse | 是否折叠为弹层筛选 | `boolean` | `false` | - |
| collapseLabel | 折叠态标签内容 | `VueNode` | - | - |
| variant | 样式变体 | `'outlined' \| 'filled' \| 'borderless'` | - | - |
| ignoreRules | 是否忽略 rules | `boolean` | `false` | - |
| footerRender | 自定义弹层底部 | `LightFilterFooterRender` | - | - |
| placement | 弹出位置 | `TooltipPlacement` | `'bottomLeft'` | - |
| popoverProps | 折叠态 Popover 属性 | `PopoverProps` | - | - |
