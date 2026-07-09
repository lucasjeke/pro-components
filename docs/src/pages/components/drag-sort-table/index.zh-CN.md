---
category: Components
title: DragSortTable
subtitle: 拖动排序表格
group: 数据展示
---

DragSortTable 在 ProTable 的基础上增加行拖拽排序能力。通过 `dragSortKey` 指定拖拽把手列，拖拽结束后通过事件把排序后的数据交给业务保存。

## 何时使用 {#when-to-use}

- 表格行顺序需要由用户手动调整时。
- 需要在拖拽完成后把新顺序同步到后端时。
- 需要自定义拖拽把手展示时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/drag-sort.vue">基础用法</demo>
</demo-group>

## API

### DragSortTable

DragSortTable 继承 ProTable 的大部分属性。

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| dragSortKey | 拖拽把手所在列的 `dataIndex` 或 `key` | `string` | - | - |
| dragSortHandlerRender | 自定义拖拽把手渲染 | `(rowData: Record<string, any>, index: number) => VueNode` | 默认把手图标 | - |

#### 事件 {#events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| dragSortEnd | 拖拽排序结束时触发 | `(beforeIndex?: number \| string, afterIndex?: number \| string, newDataSource?: Record<string, any>[]) => Promise<void> \| void` | - |

### 使用说明 {#notes}

- `dragSortKey` 对应列如果没有 `render`，组件会自动把该列渲染为空内容并放置拖拽把手。
- 排序后的数据通过 `dragSortEnd` 交给业务处理，组件不会自动提交到服务端。
