---
category: Components
title: ProForm
subtitle: Advanced Form
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group:
  title: Data Entry
  order: 1
---

ProForm extends antdv-next Form with submitter, request-driven initial values, readonly mode, grid layout, URL synchronization, and common Pro field conventions. ModalForm, DrawerForm, QueryFilter, LightFilter, and StepsForm share the same base form capabilities.

## When To Use {#when-to-use}

- Build business forms quickly without writing repetitive layout and submitter code.
- Load initial form values from an async request.
- Reuse ProForm fields and ProField value types.
- Switch between standard, modal, drawer, query, light-filter, and step forms with consistent APIs.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/layout-change.vue">Layout switch</demo>
  <demo src="./demo/form-layout.vue">Label and item layout</demo>
  <demo src="./demo/form-layout-grid.vue">Grid layout</demo>
  <demo src="./demo/dependency.vue">Dependency</demo>
  <demo src="./demo/formRef.vue">Form methods</demo>
  <demo src="./demo/sync-to-url.vue">Sync to URL</demo>
  <demo src="./demo/money.vue">Money</demo>
</demo-group>

## API

### ProForm

ProForm passes through most antdv-next Form props.

#### Props {#form-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| submitter | Submitter config. Set to `false` to hide | `SubmitterProps \| false` | `true` | - |
| loading | Submit button loading state | `boolean` | - | - |
| request | Async request for initial values | `ProRequestData` | - | - |
| params | Params for `request` | `Record<string, any>` | - | - |
| readonly | Readonly mode for all fields | `boolean` | `false` | - |
| grid | Enable grid layout | `boolean` | `false` | - |
| rowProps | Row props when grid is enabled | `RowProps` | `{ gutter: 8 }` | - |
| colProps | Col props when grid is enabled | `ColProps` | `{ xs: 24 }` | - |
| omitNil | Remove `null` and `undefined` values before submit | `boolean` | `true` | - |
| dateFormatter | Date submit formatter | `'string' \| 'number' \| false \| ((value, valueType) => string \| number)` | `'string'` | - |
| syncToUrl | Sync form values to URL | `boolean \| ((values, type) => any)` | `false` | - |
| syncToUrlAsImportant | Prefer URL values when restoring form state | `boolean` | `false` | - |
| syncToModel | Sync result to model | `boolean` | `true` | - |
| extraUrlParams | Extra URL params | `Record<string, any>` | - | - |
| isKeyPressSubmit | Submit by Enter key | `boolean` | - | - |
| autoFocusFirstInput | Auto focus first input | `boolean` | `true` | - |
| formKey | Key used to distinguish forms | `string` | - | - |

#### Events {#form-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| finish | Triggered when form submits successfully | `(values) => boolean \| void \| Promise<boolean \| void>` | - |
| submit | Triggered when submitter submits | `(values) => void` | - |
| reset | Triggered when form resets | `(values) => void` | - |
| valuesChange | Triggered when form values change | `(changedValues, values) => void` | - |
| fieldsChange | Triggered when form fields change | `(changedFields, allFields) => void` | - |
| loadingChange | Triggered when loading changes | `(loading: boolean) => void` | - |
| init | Triggered when form instance is initialized | `(values, form) => void` | - |

#### Methods {#form-methods}

The component instance exposes antdv-next Form methods such as `submit`, `resetFields`, `validateFields`, `setFieldsValue`, and `getFieldsValue`.
