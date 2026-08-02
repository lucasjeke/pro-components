---
category: Components
title: DragSortTable
subtitle: Drag Sort Table
group: Data Display
---

DragSortTable adds row drag sorting on top of ProTable. Use `dragSortKey` to specify the handle column, then persist the sorted data in the drag end event.

## When To Use {#when-to-use}

- Users need to manually reorder table rows.
- The new order should be synchronized to a backend after dragging.
- The drag handle needs custom rendering.

## Examples {#examples}

<demo-group>
  <demo src="./demo/drag-sort.vue">Basic</demo>
</demo-group>

## API

### DragSortTable

DragSortTable inherits most ProTable props.

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dragSortKey | `dataIndex` or `key` of the drag handle column | `string` | - | - |
| dragSortHandlerRender | Custom drag handle renderer | `(rowData: Record<string, any>, index: number) => VueNode` | Default handle icon | - |

#### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| dragSortEnd | Triggered when row drag sorting ends | `(beforeIndex?: number \| string, afterIndex?: number \| string, newDataSource?: Record<string, any>[]) => Promise<void> \| void` | - |

### Notes {#notes}

- If the `dragSortKey` column has no `render`, DragSortTable renders that cell as an empty handle cell.
- Sorted data is emitted through `dragSortEnd`; the component does not submit it to the server automatically.
