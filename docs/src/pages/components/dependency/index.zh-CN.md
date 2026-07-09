---
category: Components
title: ProFormDependency
subtitle: 数据联动
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group:
  title: 数据录入
  order: 1
---

ProFormDependency 用于在 ProForm 中监听指定字段并基于最新值渲染子内容。它内置 `noStyle` 行为，会自动从表单中提取依赖字段值，适合做字段联动、条件展示和动态表单项。

## 何时使用 {#when-to-use}

- 某个表单项需要依赖其它字段值动态渲染时。
- 需要在 FormList 内部按当前行字段联动时。
- 需要拿到格式化后的字段值和表单实例时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/dependency.vue">互相依赖表单</demo>
</demo-group>

## API

### ProFormDependency

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 依赖字段列表 | `NamePath[]` | - | - |
| originDependencies | 原始依赖字段路径，用于自定义 values 输出结构 | `NamePath[]` | `name` | - |
| ignoreFormListField | 在 FormList 中是否忽略当前 list 前缀，从全局表单取值 | `boolean` | `false` | - |

### 使用说明 {#notes}

默认插槽会收到 `{ values, form }`，其中 `values` 是按 `name` 提取出的依赖字段值，`form` 是增强后的 ProForm 实例。
