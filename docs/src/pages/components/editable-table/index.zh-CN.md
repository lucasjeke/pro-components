---
category: Components
title: EditableProTable
subtitle: 编辑表格
group: 数据展示
---

EditableProTable 是基于 ProTable 的可编辑表格，适合需要在表格中直接新增、编辑、保存行数据的场景。它继承 ProTable 的列配置、查询、工具栏和 Table 能力，并额外提供受控值、行创建按钮和可编辑表单实例。

## 何时使用 {#when-to-use}

- 需要在表格内直接维护一组结构化数据时。
- 需要与 ProForm 结合，把表格作为表单字段提交时。
- 需要新增行、缓存行、限制最大行数或操作单行数据时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
</demo-group>

## API

### EditableProTable

除下列属性外，EditableProTable 继承 ProTable 的大部分属性。

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 受控表格数据 | `T[]` | - | - |
| defaultValue | 默认表格数据 | `T[]` | - | - |
| editable | 可编辑行配置 | `RowEditableConfig<T>` | - | - |
| editableFormRef | 可编辑表格内部表单实例 | `EditableFormInstance<T>` | - | - |
| recordCreatorProps | 新建行按钮配置，设置为 `false` 可隐藏 | `false \| RecordCreatorProps<T> & ButtonProps & { creatorButtonText?: VueNode }` | - | - |
| maxLength | 最大行数，达到后隐藏新建按钮 | `number` | - | - |
| controlled | 是否完全受控，`value` 更新时会重置内部表单 | `boolean` | `false` | - |
| formItemProps | 作为 FormItem 使用时的配置 | `Omit<FormItemProps, 'name'>` | - | - |

#### RecordCreatorProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| record | 新增行默认值 | `T \| ((index: number, dataSource: T[]) => T)` | - | - |
| position | 新增行位置 | `'top' \| 'bottom'` | `'bottom'` | - |
| newRecordType | 新增行类型，`cache` 可取消，`dataSource` 直接写入数据源 | `'dataSource' \| 'cache'` | `'dataSource'` | - |
| parentKey | 新增到指定父节点，常用于树形表格 | `Key \| ((index: number, dataSource: T[]) => Key)` | - | - |
| creatorButtonText | 新建按钮文案 | `VueNode` | 国际化默认值 | - |

#### 事件 {#events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| update:value | 受控数据变化时触发 | `(value?: T[]) => void` | - |
| change | 表格数据变化时触发 | `(value?: T[]) => void` | - |
| tableChange | 原始 Table change 事件 | `ProTableProps['change']` | - |
| valuesChange | 表单值变化时触发 | `(values: T[], record: T) => void` | - |

#### EditableFormInstance

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| getRowData | 获取指定行数据，参数可以是行号或 rowKey | `(rowIndex: string \| number) => T \| undefined` | - |
| getRowsData | 获取全部表格数据 | `() => T[] \| undefined` | - |
| setRowData | 合并设置指定行数据 | `(rowIndex: string \| number, data: Partial<T>) => void` | - |
