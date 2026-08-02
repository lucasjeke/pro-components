---
category: Components
title: ProField
subtitle: 原子字段
group: 通用
---

ProField 是 ProComponents 的原子字段渲染器。它根据 `valueType` 在只读、编辑、更新等模式下选择合适的展示组件或表单控件，ProTable、ProForm 和 SchemaForm 都会复用这套能力。

## 何时使用 {#when-to-use}

- 需要根据同一份字段类型在展示态和编辑态之间切换时。
- 需要复用 `valueEnum`、`request`、`fieldProps` 等 Pro 字段能力时。
- 需要在业务组件中直接渲染金额、日期、进度、枚举等格式化字段时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
</demo-group>

## API

### ProField

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| valueType | 字段类型，也支持对象类型配置 | `ProFieldValueType \| ProFieldValueObjectType` | `'text'` | - |
| text | 当前字段值 | `ProFieldTextType` | - | - |
| mode | 渲染模式 | `'read' \| 'edit' \| 'update'` | `'read'` | - |
| placeholder | 编辑态占位文案 | `string \| string[]` | - | - |
| fieldProps | 透传给底层表单控件的属性 | `Record<string, any>` | - | - |
| proFieldProps | 透传给 ProField 的扩展配置 | `Record<string, any>` | - | - |
| valueEnum | 枚举值配置 | `Map \| Record` | - | - |
| request | 远程获取枚举数据 | `ProFieldRequestData` | - | - |
| params | `request` 的额外参数 | `Record<string, any>` | - | - |
| debounceTime | 远程请求防抖时间 | `number` | - | - |
| emptyText | 只读态空值占位，设置为 `false` 可关闭 | `VueNode \| false` | `-` | - |
| render | 自定义只读态渲染 | `(text, props, dom) => VueNode` | - | - |
| renderFormItem | 自定义编辑态表单项渲染 | `(text, props, dom) => VueNode` | - | - |
| light | 是否轻量筛选模式 | `boolean` | `false` | - |
| readonly | 是否只读 | `boolean` | `false` | - |

### 常用 valueType {#value-type}

| 类型 | 说明 |
| --- | --- |
| `text` / `textarea` / `password` / `code` | 文本类字段 |
| `money` / `percent` / `digit` / `digitRange` / `second` | 数值类字段 |
| `date` / `dateTime` / `dateRange` / `dateTimeRange` / `time` / `timeRange` / `fromNow` | 日期时间类字段 |
| `select` / `checkbox` / `radio` / `segmented` / `switch` / `treeSelect` / `cascader` | 选择类字段 |
| `progress` / `rate` / `slider` / `color` / `image` / `avatar` | 展示增强类字段 |

### 导出的字段组件 {#exports}

`FieldText`、`FieldMoney`、`FieldPercent`、`FieldDatePicker`、`FieldDateRangePicker`、`FieldTimePicker`、`FieldTimeRangePicker`、`FieldSelect`、`FieldCheckbox`、`FieldRadio`、`FieldSwitch`、`FieldSlider`、`FieldRate`、`FieldProgress`、`FieldImage`、`FieldColorPicker` 等组件也可以按需直接使用。
