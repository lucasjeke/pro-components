---
category: Components
group: 数据展示
title: ProListy
subtitle: 高级列表
cover: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
coverDark: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
---

ProListy 是基于 ProTable 数据流和 Listy 展示结构封装的高级列表。它可以复用 `request`、`columns`、`search`、`pagination`、`toolbar` 等 ProTable 能力，并通过 `listSlot` 把列映射到列表项的标题、头像、描述、内容和操作区。

## 何时使用 {#when-to-use}

- 数据需要以列表或卡片列表展示，但仍然需要查询、分页和工具栏能力时。
- 希望使用 ProTable 的 `columns` 描述列表项结构时。
- 需要网格列表、卡片列表或自定义列表项渲染时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/enum-switch.vue">枚举属性切换</demo>
  <demo src="./demo/basic.vue">基础使用</demo>
  <demo src="./demo/columns-api.vue">使用 columns + listSlot</demo>
  <demo src="./demo/card-columns.vue">卡片列表</demo>
  <demo src="./demo/grid.vue">网格配置</demo>
</demo-group>

## API

### ProListy

ProListy 继承 ProTable 的数据请求、查询表单、分页、工具栏和列配置能力。

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| request | 异步请求列表数据 | `ProTableProps['request']` | - | - |
| dataSource | 受控列表数据 | `RecordType[]` | - | - |
| columns | 列配置，可通过 `listSlot` 映射到列表项区域 | `ProColumns<RecordType>[]` | `[]` | - |
| rowKey | 列表项唯一标识 | `string \| ((record) => Key)` | - | - |
| search | 查询表单配置，设置为 `false` 可关闭 | `false \| SearchConfig` | - | - |
| pagination | 分页配置 | `TablePaginationConfig \| false` | - | - |
| toolbar | 工具栏配置 | `BaseToolbarProps` | - | - |
| toolBarRender | 自定义工具栏操作 | `false \| ToolBarRender` | - | - |
| grid | 网格布局配置 | `ProListyGridType` | - | - |
| itemLayout | 列表项布局 | `'horizontal' \| 'vertical'` | - | - |
| variant | 列表项外观 | `'outlined' \| 'borderless' \| 'filled'` | - | - |
| itemCardProps | 卡片列表项配置 | `ProCheckCardProps` | - | - |
| rowClassName | 列表项类名 | `string \| ((item, index) => string)` | - | - |
| itemRender | 自定义列表项渲染 | `(item, index, dom) => VueNode` | - | - |

#### ProColumns listSlot

| 值 | 说明 |
| --- | --- |
| `title` | 映射到列表项标题 |
| `subTitle` | 映射到列表项副标题 |
| `avatar` | 映射到头像区域 |
| `description` | 映射到描述区域 |
| `content` | 映射到主体内容 |
| `actions` | 映射到操作区 |
| `aside` | 映射到侧边内容 |
| `type` | 映射到类型标识 |

#### 事件 {#events}

ProListy 继承 ProTable 的 `load`、`loadingChange`、`requestError`、`submit`、`reset`、`dataSourceChange` 等事件。

#### 方法 {#methods}

组件实例继承 ProTable 实例方法，并额外包含底层 Listy 暴露的方法。
