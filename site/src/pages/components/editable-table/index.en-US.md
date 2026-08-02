---
category: Components
title: EditableProTable
subtitle: Editable Table
group: Data Display
---

EditableProTable is an editable table built on ProTable. It is useful when users need to add, edit, and save row data directly in a table. It inherits most ProTable, column, search, toolbar, and Table capabilities, and adds controlled value, row creation, and editable form instance APIs.

## When To Use {#when-to-use}

- Maintain structured data directly inside a table.
- Use a table as a form field together with ProForm.
- Add rows, cache new rows, limit row count, or operate on single-row data.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
</demo-group>

## API

### EditableProTable

EditableProTable inherits most ProTable props in addition to the following props.

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | Controlled table data | `T[]` | - | - |
| defaultValue | Default table data | `T[]` | - | - |
| editable | Editable row config | `RowEditableConfig<T>` | - | - |
| editableFormRef | Editable table form instance | `EditableFormInstance<T>` | - | - |
| recordCreatorProps | New-row button config. Set to `false` to hide | `false \| RecordCreatorProps<T> & ButtonProps & { creatorButtonText?: VueNode }` | - | - |
| maxLength | Maximum row count. Hides creator button when reached | `number` | - | - |
| controlled | Fully controlled mode. Resets inner form when `value` changes | `boolean` | `false` | - |
| formItemProps | FormItem config when used as a form field | `Omit<FormItemProps, 'name'>` | - | - |

#### RecordCreatorProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| record | Default value for the new row | `T \| ((index: number, dataSource: T[]) => T)` | - | - |
| position | Insert position | `'top' \| 'bottom'` | `'bottom'` | - |
| newRecordType | New-row type. `cache` can be canceled, `dataSource` writes directly | `'dataSource' \| 'cache'` | `'dataSource'` | - |
| parentKey | Parent row for tree tables | `Key \| ((index: number, dataSource: T[]) => Key)` | - | - |
| creatorButtonText | Creator button text | `VueNode` | Locale default | - |

#### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| update:value | Triggered when controlled data changes | `(value?: T[]) => void` | - |
| change | Triggered when table data changes | `(value?: T[]) => void` | - |
| tableChange | Original Table change event | `ProTableProps['change']` | - |
| valuesChange | Triggered when form values change | `(values: T[], record: T) => void` | - |

#### EditableFormInstance

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| getRowData | Get row data by row index or rowKey | `(rowIndex: string \| number) => T \| undefined` | - |
| getRowsData | Get all table data | `() => T[] \| undefined` | - |
| setRowData | Merge data into a row | `(rowIndex: string \| number, data: Partial<T>) => void` | - |
