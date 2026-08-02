---
category: Components
title: ProField
subtitle: Atomic Field
group: General
---

ProField is the atomic field renderer of ProComponents. It selects a display component or form control by `valueType` across read, edit, and update modes. ProTable, ProForm, and SchemaForm all reuse this capability.

## When To Use {#when-to-use}

- Switch a field between display and edit mode with the same field definition.
- Reuse Pro field capabilities such as `valueEnum`, `request`, and `fieldProps`.
- Render formatted values such as money, date, progress, or enum directly in business components.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
</demo-group>

## API

### ProField

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| valueType | Field type. Object configs are supported | `ProFieldValueType \| ProFieldValueObjectType` | `'text'` | - |
| text | Field value | `ProFieldTextType` | - | - |
| mode | Render mode | `'read' \| 'edit' \| 'update'` | `'read'` | - |
| placeholder | Placeholder in edit mode | `string \| string[]` | - | - |
| fieldProps | Props passed to the underlying form control | `Record<string, any>` | - | - |
| proFieldProps | Extra ProField config | `Record<string, any>` | - | - |
| valueEnum | Enum config | `Map \| Record` | - | - |
| request | Load enum data remotely | `ProFieldRequestData` | - | - |
| params | Extra params for `request` | `Record<string, any>` | - | - |
| debounceTime | Remote request debounce time | `number` | - | - |
| emptyText | Empty placeholder in read mode. Set to `false` to disable | `VueNode \| false` | `-` | - |
| render | Custom read-mode renderer | `(text, props, dom) => VueNode` | - | - |
| renderFormItem | Custom edit-mode form item renderer | `(text, props, dom) => VueNode` | - | - |
| light | Enable light filter mode | `boolean` | `false` | - |
| readonly | Readonly state | `boolean` | `false` | - |

### Common valueType {#value-type}

| Type | Description |
| --- | --- |
| `text` / `textarea` / `password` / `code` | Text fields |
| `money` / `percent` / `digit` / `digitRange` / `second` | Number fields |
| `date` / `dateTime` / `dateRange` / `dateTimeRange` / `time` / `timeRange` / `fromNow` | Date and time fields |
| `select` / `checkbox` / `radio` / `segmented` / `switch` / `treeSelect` / `cascader` | Selection fields |
| `progress` / `rate` / `slider` / `color` / `image` / `avatar` | Enhanced display fields |

### Exported Field Components {#exports}

`FieldText`, `FieldMoney`, `FieldPercent`, `FieldDatePicker`, `FieldDateRangePicker`, `FieldTimePicker`, `FieldTimeRangePicker`, `FieldSelect`, `FieldCheckbox`, `FieldRadio`, `FieldSwitch`, `FieldSlider`, `FieldRate`, `FieldProgress`, `FieldImage`, `FieldColorPicker`, and other field components can also be imported directly.
