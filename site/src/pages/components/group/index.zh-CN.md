---
category: Components
title: ProFormList
subtitle: 数据结构化
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 数据录入
---

ProFormList 用于录入结构化数组数据，支持新增、删除、复制、排序、嵌套列表和自定义操作按钮。它必须放在 ProForm 内部使用，并会把列表数据作为表单字段提交。

## 何时使用 {#when-to-use}

- 表单中存在联系人、明细行、规则项等可增删的数组数据时。
- 需要对列表项做复制、删除、排序和自定义渲染时。
- 需要在 FormList 内嵌套 ProForm 其它表单项时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/list-arrowsort.vue">箭头排序</demo>
  <demo src="./demo/horizontal-layout.vue">横向布局</demo>
</demo-group>

## API

### ProFormList

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 列表字段名 | `NamePath` | - | - |
| label | 标签 | `VueNode` | - | - |
| tooltip | 标签提示 | `FormItemTooltipType` | - | - |
| rules | 校验规则 | `Rule[]` | - | - |
| wrapperCol | FormItem wrapperCol | `ColProps` | - | - |
| hidden | 是否隐藏 | `boolean` | `false` | - |
| required | 是否必填 | `boolean` | `false` | - |
| readonly | 是否只读 | `boolean` | `false` | - |
| creatorButtonProps | 新增按钮配置，设置为 `false` 可隐藏 | `false \| ButtonProps & { creatorButtonText?: VueNode; position?: 'top' \| 'bottom' }` | - | - |
| actionGuard | 新增、删除等操作前置守卫 | `FormListActionGuard` | - | - |
| isValidateList | 是否校验列表不能为空 | `boolean` | `false` | - |
| emptyListMessage | 列表为空时的校验文案 | `string` | - | - |
| containerStyle | 列表容器样式 | `CSSProperties` | - | - |
| containerClassName | 列表容器类名 | `string` | - | - |
| colProps | 栅格 Col 配置 | `ColProps` | - | - |
| rowProps | 栅格 Row 配置 | `RowProps` | - | - |
| itemRender | 自定义列表项渲染 | `(dom, listMeta) => VueNode` | - | - |
| itemContainerRender | 自定义列表项容器 | `(doms, listMeta) => VueNode` | - | - |
| actionRender | 自定义每项操作按钮 | `(field, action, defaultActionDom, count) => VueNode[]` | - | - |
| fieldExtraRender | 自定义字段额外内容 | `(fieldAction, meta) => VueNode` | - | - |

#### 事件 {#events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| afterAdd | 新增成功后触发 | `(...params) => void` | - |
| afterRemove | 删除成功后触发 | `(...params) => void` | - |

#### 方法 {#methods}

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| add | 新增一项 | `(defaultValue?: StoreValue, insertIndex?: number) => void` | - |
| remove | 删除一项或多项 | `(index: number \| number[]) => void` | - |
| move | 移动项目位置 | `(from: number, to: number) => void` | - |
| get | 获取指定项 | `(index: number) => StoreValue` | - |
| getList | 获取整个列表 | `() => StoreValue[]` | - |
