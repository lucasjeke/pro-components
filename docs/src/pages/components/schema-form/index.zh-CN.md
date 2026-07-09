---
category: Components
title: SchemaForm
subtitle: JSON 表单
group: 数据录入
---

SchemaForm 使用 `columns` 描述表单结构，并根据 `valueType` 自动生成 ProForm 表单项。它适合后端下发表单结构、配置化表单和需要在 Form、ModalForm、DrawerForm、QueryFilter、StepsForm 等布局之间切换的场景。

## 何时使用 {#when-to-use}

- 表单项来自配置或接口返回结构时。
- 希望复用 ProTable columns 风格来描述表单时。
- 需要通过 `layoutType` 在不同表单布局中复用同一份字段配置时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/schema.vue">基础用法</demo>
</demo-group>

## API

### SchemaForm

SchemaForm 继承对应 `layoutType` 的表单属性，并额外支持以下配置。

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| columns | 表单列配置 | `ProFormColumnsType[] \| ProFormColumnsType[][]` | `[]` | - |
| layoutType | 表单布局类型 | `'Form' \| 'ModalForm' \| 'DrawerForm' \| 'QueryFilter' \| 'LightFilter' \| 'StepForm' \| 'StepsForm' \| 'Embed'` | `'Form'` | - |
| type | 字段渲染场景 | `ProSchemaComponentTypes` | `'form'` | - |
| action | 操作实例，传给自定义渲染 | `ProCoreActionType` | - | - |
| title | 表单标题 | `VueNode \| ((schema, type, dom) => VueNode)` | - | - |
| description | 表单描述 | `VueNode` | - | - |
| steps | StepForm 配置列表 | `ProStepFormProps[]` | - | - |
| open | ModalForm / DrawerForm 打开状态 | `boolean` | - | - |

#### ProFormColumnsType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 字段标题 | `VueNode \| ((schema, type, dom) => VueNode)` | - | - |
| name | 表单字段名 | `NamePath \| NamePath[]` | - | - |
| key | 字段 key | `Key` | - | - |
| valueType | 字段类型 | `ProFieldValueType \| ProFieldValueObjectType \| FormFieldType` | `'text'` | - |
| valueEnum | 枚举值配置 | `Map \| Record` | - | - |
| fieldProps | 透传给表单控件的属性 | `Record<string, any> \| ((form, column) => Record<string, any>)` | - | - |
| formItemProps | 透传给 FormItem 的属性 | `Record<string, any> \| ((form, column) => Record<string, any>)` | - | - |
| initialValue | 初始值 | `any` | - | - |
| readonly | 是否只读 | `boolean` | `false` | - |
| colSize | 栅格占位大小 | `number` | `1` | - |
| colProps | Col 配置 | `ColProps` | - | - |
| rowProps | Row 配置 | `RowProps` | - | - |
| order | 表单排序，值越大越靠前 | `number` | - | - |
| columns | 嵌套字段 | `ProFormColumnsType[] \| ((values) => ProFormColumnsType[])` | - | - |
| dependencies | 依赖字段 | `NamePath[]` | - | - |
| convertValue | 读取时转换值 | `SearchConvertKeyFn` | - | - |
| transform | 提交时转换值 | `SearchTransformKeyFn` | - | - |
| render | 自定义只读渲染 | `(...args) => VueNode` | - | - |
| formItemRender | 自定义表单项渲染 | `(...args) => VueNode` | - | - |
| request | 远程获取选项 | `ProFieldRequestData` | - | - |
| params | 远程请求参数 | `Record<string, any>` | - | - |
| debounceTime | 远程请求防抖时间 | `number` | - | - |

#### 事件 {#events}

SchemaForm 事件来自对应的表单布局，例如 `finish`、`submit`、`reset`、`valuesChange`、`fieldsChange`、`loadingChange`、`openChange` 等。
