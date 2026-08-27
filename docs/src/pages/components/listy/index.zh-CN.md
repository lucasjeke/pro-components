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
  <demo src="./demo/shared-columns.vue">表格/列表一键切换</demo>
  <demo src="./demo/search-columns.vue"> 搜索列表（columns + request）</demo>
  <demo src="./demo/editable-columns.vue"> 可编辑列表（columns）</demo>
  <demo src="./demo/editable.vue"> 编辑列表</demo>
  <demo src="./demo/toolbar.vue"> 带工具栏的列表</demo>
  <demo src="./demo/expand.vue"> 支持展开的列表</demo>
  <demo src="./demo/selection.vue"> 支持选中的列表</demo>
  <demo src="./demo/search.vue"> 查询列表</demo>
  <demo src="./demo/filter.vue">带筛选和异步请求的列表</demo>
  <demo src="./demo/size.vue"> 大小和分割线</demo>
  <demo src="./demo/layout.vue">竖排样式</demo>
  <demo src="./demo/special.vue">一些预设的模式</demo>
  <demo src="./demo/pagination.vue">翻页</demo>
  <demo src="./demo/custom-render.vue">自定义列表项（itemRender）</demo>
</demo-group>

## API

### ProListy

ProListy 继承 ProTable 的数据请求、查询表单、分页、工具栏和列配置能力。

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
| virtual | 是否启用虚拟滚动；卡片模式需要同时设置 `height` | `boolean` | `false` | - |
| height | 虚拟滚动可视区域高度 | `number` | - | - |
| itemLayout | 列表项布局 | `'horizontal' \| 'vertical'` | - | - |
| variant | 列表项外观 | `'outlined' \| 'borderless' \| 'filled'` | - | - |
| itemCardProps | 卡片列表项配置 | `ProCheckCardProps` | - | - |
| rowClassName | 列表项类名 | `string \| ((item, index) => string)` | - | - |
| itemRender | 自定义列表项渲染 | `(item, index, dom) => VueNode` | - | - |

### listSlot

| 值 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 映射到列表项标题 | `VueNode` | - |
| `subTitle` | 映射到列表项副标题 | `VueNode` | - |
| `avatar` | 映射到头像区域 | `VueNode` | - |
| `description` | 映射到描述区域 | `VueNode` | - |
| `content` | 映射到主体内容 | `VueNode` | - |
| `actions` | 映射到操作区 | `VueNode` | - |
| `aside` | 映射到侧边内容 | `VueNode` | - |
| `type` | 映射到类型标识 | `VueNode` | - |

。
