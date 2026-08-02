---
category: Components
title: ProFormFields
subtitle: Form Fields
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Data Entry
---

ProFormFields are built-in field components for ProForm. They combine `Form.Item` with specific input controls and share common field capabilities such as `name`, `label`, `rules`, `fieldProps`, `readonly`, and `placeholder`.

## When To Use {#when-to-use}

- Build business forms without repetitive FormItem boilerplate.
- Use the same field definition for edit and readonly modes.
- Use common fields such as money, date, select, upload, and captcha.

## Examples {#examples}

<demo-group>
  <demo src="./demo/components-other.vue">Fields</demo>
</demo-group>

## API

### Common Props {#common-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | Form field name | `NamePath` | - | - |
| label | Label | `VueNode` | - | - |
| tooltip | Label tooltip | `FormItemTooltipType` | - | - |
| rules | Validation rules | `Rule[]` | - | - |
| width | Field width. Supports `xs`, `sm`, `md`, `lg`, `xl` | `number \| string` | - | - |
| fieldProps | Props passed to the underlying input component | `Record<string, any>` | - | - |
| formItemProps | Props passed to FormItem | `Record<string, any>` | - | - |
| placeholder | Placeholder | `string \| string[]` | - | - |
| readonly | Readonly state | `boolean` | `false` | - |
| disabled | Disabled state | `boolean` | `false` | - |
| initialValue | Initial value | `any` | - | - |
| transform | Transform value before submit | `(value, namePath, allValues) => any` | - | - |
| convertValue | Transform value when reading | `(value, namePath) => any` | - | - |

### Exports {#exports}

Common exports include `ProFormText`, `ProFormTextArea`, `ProFormPassword`, `ProFormDigit`, `ProFormMoney`, `ProFormSelect`, `ProFormTreeSelect`, `ProFormCascader`, `ProFormCheckbox`, `ProFormRadio`, `ProFormSwitch`, `ProFormSlider`, `ProFormRate`, `ProFormDatePicker`, `ProFormDateRangePicker`, `ProFormTimePicker`, `ProFormUploadButton`, `ProFormUploadDragger`, and `ProFormCaptcha`.
