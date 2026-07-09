---
category: Components
group: Data Display
title: ProListy
subtitle: Advanced List
cover: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
coverDark: https://gw.alipayobjects.com/zos/antfincdn/4n5H%24UX%24j/bianzu%2525204.svg
---

ProListy is an advanced list built with ProTable data flow and Listy item rendering. It reuses `request`, `columns`, `search`, `pagination`, `toolbar`, and other ProTable capabilities, and maps columns into list item areas through `listSlot`.

## When To Use {#when-to-use}

- Data should be displayed as a list or card list while keeping search, pagination, and toolbar capabilities.
- List item structure should be described with ProTable-style `columns`.
- Grid lists, card lists, or custom item rendering are needed.

## Examples {#examples}

<demo-group>
  <demo src="./demo/enum-switch.vue">Enum switch</demo>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/columns-api.vue">columns + listSlot</demo>
  <demo src="./demo/card-columns.vue">Card list</demo>
  <demo src="./demo/grid.vue">Grid</demo>
</demo-group>

## API

### ProListy

ProListy inherits ProTable data request, search form, pagination, toolbar, and column capabilities.

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| request | Async list data request | `ProTableProps['request']` | - | - |
| dataSource | Controlled list data | `RecordType[]` | - | - |
| columns | Column definitions. Use `listSlot` to map columns to item areas | `ProColumns<RecordType>[]` | `[]` | - |
| rowKey | Unique item key | `string \| ((record) => Key)` | - | - |
| search | Search form config. Set to `false` to disable | `false \| SearchConfig` | - | - |
| pagination | Pagination config | `TablePaginationConfig \| false` | - | - |
| toolbar | Toolbar config | `BaseToolbarProps` | - | - |
| toolBarRender | Custom toolbar actions | `false \| ToolBarRender` | - | - |
| grid | Grid layout config | `ProListyGridType` | - | - |
| itemLayout | Item layout | `'horizontal' \| 'vertical'` | - | - |
| variant | Item appearance | `'outlined' \| 'borderless' \| 'filled'` | - | - |
| itemCardProps | Card item config | `ProCheckCardProps` | - | - |
| rowClassName | Item class name | `string \| ((item, index) => string)` | - | - |
| itemRender | Custom item renderer | `(item, index, dom) => VueNode` | - | - |

#### ProColumns listSlot

| Value | Description |
| --- | --- |
| `title` | Maps to item title |
| `subTitle` | Maps to item subtitle |
| `avatar` | Maps to avatar area |
| `description` | Maps to description area |
| `content` | Maps to main content |
| `actions` | Maps to actions |
| `aside` | Maps to aside content |
| `type` | Maps to type marker |

#### Events {#events}

ProListy inherits ProTable events such as `load`, `loadingChange`, `requestError`, `submit`, `reset`, and `dataSourceChange`.

#### Methods {#methods}

The component instance inherits ProTable methods and includes methods exposed by the underlying Listy.
