---
category: Components
title: ProFormList
subtitle: Structured Data
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Data Entry
---

ProFormList is used to edit structured array data. It supports add, remove, copy, sort, nested lists, and custom action buttons. It must be used inside ProForm and submits list data as a form field.

## When To Use {#when-to-use}

- A form contains repeatable arrays such as contacts, detail rows, or rules.
- Items need copy, delete, sort, or custom rendering.
- ProForm fields need to be nested inside a list item.

## Examples {#examples}

<demo-group>
  <demo src="./demo/list-arrowsort.vue">Arrow sort</demo>
  <demo src="./demo/horizontal-layout.vue">Horizontal layout</demo>
</demo-group>

## API

### ProFormList

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | List field name | `NamePath` | - | - |
| label | Label | `VueNode` | - | - |
| tooltip | Label tooltip | `FormItemTooltipType` | - | - |
| rules | Validation rules | `Rule[]` | - | - |
| wrapperCol | FormItem wrapperCol | `ColProps` | - | - |
| hidden | Hide the list | `boolean` | `false` | - |
| required | Required state | `boolean` | `false` | - |
| readonly | Readonly state | `boolean` | `false` | - |
| creatorButtonProps | Creator button config. Set to `false` to hide | `false \| ButtonProps & { creatorButtonText?: VueNode; position?: 'top' \| 'bottom' }` | - | - |
| actionGuard | Guards before add/remove actions | `FormListActionGuard` | - | - |
| isValidateList | Validate list is not empty | `boolean` | `false` | - |
| emptyListMessage | Empty list validation message | `string` | - | - |
| containerStyle | List container style | `CSSProperties` | - | - |
| containerClassName | List container class name | `string` | - | - |
| colProps | Grid Col props | `ColProps` | - | - |
| rowProps | Grid Row props | `RowProps` | - | - |
| itemRender | Custom item renderer | `(dom, listMeta) => VueNode` | - | - |
| itemContainerRender | Custom item container renderer | `(doms, listMeta) => VueNode` | - | - |
| actionRender | Custom item actions | `(field, action, defaultActionDom, count) => VueNode[]` | - | - |
| fieldExtraRender | Custom field extra renderer | `(fieldAction, meta) => VueNode` | - | - |

#### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| afterAdd | Triggered after an item is added | `(...params) => void` | - |
| afterRemove | Triggered after an item is removed | `(...params) => void` | - |

#### Methods {#methods}

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| add | Add an item | `(defaultValue?: StoreValue, insertIndex?: number) => void` | - |
| remove | Remove one or more items | `(index: number \| number[]) => void` | - |
| move | Move item position | `(from: number, to: number) => void` | - |
| get | Get an item | `(index: number) => StoreValue` | - |
| getList | Get the whole list | `() => StoreValue[]` | - |
