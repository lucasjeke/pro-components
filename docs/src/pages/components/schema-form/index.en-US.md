---
category: Components
title: SchemaForm
subtitle: JSON Form
group: Data Entry
---

SchemaForm uses `columns` to describe form structure and generates ProForm fields by `valueType`. It is useful for backend-driven forms, configurable forms, and reusing one field definition across Form, ModalForm, DrawerForm, QueryFilter, StepsForm, and other layouts.

## When To Use {#when-to-use}

- Form fields come from configuration or an API.
- You want to describe forms with ProTable-style columns.
- The same field definition should be reused across different form layouts through `layoutType`.

## Examples {#examples}

<demo-group>
  <demo src="./demo/schema.vue">Basic</demo>
</demo-group>

## API

### SchemaForm

SchemaForm inherits props from the selected `layoutType` and adds the following configs.

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| columns | Form column definitions | `ProFormColumnsType[] \| ProFormColumnsType[][]` | `[]` | - |
| layoutType | Form layout type | `'Form' \| 'ModalForm' \| 'DrawerForm' \| 'QueryFilter' \| 'LightFilter' \| 'StepForm' \| 'StepsForm' \| 'Embed'` | `'Form'` | - |
| type | Field render scene | `ProSchemaComponentTypes` | `'form'` | - |
| action | Action instance passed to custom renderers | `ProCoreActionType` | - | - |
| title | Form title | `VueNode \| ((schema, type, dom) => VueNode)` | - | - |
| description | Form description | `VueNode` | - | - |
| steps | StepForm configs | `ProStepFormProps[]` | - | - |
| open | ModalForm / DrawerForm open state | `boolean` | - | - |

#### ProFormColumnsType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Field title | `VueNode \| ((schema, type, dom) => VueNode)` | - | - |
| name | Form field name | `NamePath \| NamePath[]` | - | - |
| key | Field key | `Key` | - | - |
| valueType | Field type | `ProFieldValueType \| ProFieldValueObjectType \| FormFieldType` | `'text'` | - |
| valueEnum | Enum config | `Map \| Record` | - | - |
| fieldProps | Props passed to form control | `Record<string, any> \| ((form, column) => Record<string, any>)` | - | - |
| formItemProps | Props passed to FormItem | `Record<string, any> \| ((form, column) => Record<string, any>)` | - | - |
| initialValue | Initial value | `any` | - | - |
| readonly | Readonly state | `boolean` | `false` | - |
| colSize | Grid span size | `number` | `1` | - |
| colProps | Col config | `ColProps` | - | - |
| rowProps | Row config | `RowProps` | - | - |
| order | Form order. Larger value comes first | `number` | - | - |
| columns | Nested fields | `ProFormColumnsType[] \| ((values) => ProFormColumnsType[])` | - | - |
| dependencies | Dependency fields | `NamePath[]` | - | - |
| convertValue | Transform value when reading | `SearchConvertKeyFn` | - | - |
| transform | Transform value before submit | `SearchTransformKeyFn` | - | - |
| render | Custom read renderer | `(...args) => VueNode` | - | - |
| formItemRender | Custom form item renderer | `(...args) => VueNode` | - | - |
| request | Load options remotely | `ProFieldRequestData` | - | - |
| params | Remote request params | `Record<string, any>` | - | - |
| debounceTime | Remote request debounce time | `number` | - | - |

#### Events {#events}

SchemaForm events come from the selected form layout, such as `finish`, `submit`, `reset`, `valuesChange`, `fieldsChange`, `loadingChange`, and `openChange`.
