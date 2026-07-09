---
category: Components
title: StepsForm
subtitle: 分步表单
group: 数据录入
---

StepsForm 用于把一个复杂表单拆成多个步骤填写。它由 `ProStepsForm` 和多个 `ProStepsForm.StepForm` 组成，每一步可以拥有独立的表单配置，最终在最后一步统一提交。

## 何时使用 {#when-to-use}

- 表单字段很多，需要分步骤引导用户完成时。
- 每一步需要单独校验，但最终统一提交时。
- 需要自定义步骤条、步骤表单区域或底部提交按钮时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/steps-from.vue">基础用法</demo>
</demo-group>

## API

### ProStepsForm

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| current | 当前步骤，受控模式 | `number` | - | - |
| stepsProps | 传递给 Steps 的属性 | `StepsProps` | - | - |
| formProps | 传递给每个 StepForm 的默认表单属性 | `ProFormProps` | - | - |
| formMap | 所有步骤的表单实例 | `FormInstance[]` | - | - |
| submitter | 底部按钮配置，设置为 `false` 可隐藏 | `SubmitterProps<{ step: number; onPre: () => void; form?: FormInstance }> \| false` | - | - |
| containerStyle | 容器样式 | `CSSProperties` | - | - |
| stepsRender | 自定义步骤条渲染 | `(steps, defaultDom) => VueNode` | - | - |
| stepFormRender | 自定义单个表单区域 | `(formDom) => VueNode` | - | - |
| stepsFormRender | 自定义表单区域和提交按钮区域 | `(formDom, submitter) => VueNode` | - | - |
| layoutRender | 自定义整体布局 | `(layoutDom: { stepsDom: VNode; formDom: VNode }) => VueNode` | - | - |

#### 事件 {#events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| finish | 最后一步提交时触发，返回 `true` 会重置步数和表单 | `(values) => void \| Promise<boolean \| void>` | - |
| currentChange | 当前步骤变化时触发 | `(current: number) => void` | - |
| update:formMap | 表单实例列表变化时触发 | `(formMap: FormInstance[]) => void` | - |

### ProStepsForm.StepForm

StepForm 继承 ProForm 的大部分属性，常用属性包括 `name`、`title`、`layout`、`grid`、`submitter`、`finish` 等。
