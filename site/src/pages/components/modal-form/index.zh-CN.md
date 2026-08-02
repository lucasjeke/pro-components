---
category: Components
title: Modal/Drawer
subtitle: 浮层表单
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 数据录入
---

ModalForm 和 DrawerForm 是基于 ProForm 的浮层表单，分别使用 Modal 和 Drawer 承载表单内容。它们保留 ProForm 的字段、提交、请求和只读能力，并额外管理浮层打开状态和提交后关闭逻辑。

## 何时使用 {#when-to-use}

- 新建、编辑等表单流程需要在弹窗或抽屉中完成时。
- 希望通过 `trigger` 自动打开浮层，减少额外状态管理时。
- 表单提交成功后需要自动关闭弹窗或抽屉时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/modal-form.vue">弹窗表单</demo>
  <demo src="./demo/drawer-form.vue">抽屉表单</demo>
  <demo src="./demo/modal-form-submitter.vue">自定义 Modal 表单按钮</demo>
</demo-group>

## API

### ModalForm

ModalForm 继承 ProForm 的大部分属性。

#### 属性 {#modal-form-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| trigger | 触发打开的节点 | `VNode` | - | - |
| open | 受控打开状态 | `boolean` | - | - |
| modalProps | 传递给 Modal 的属性 | `Omit<ModalProps, 'open'>` | - | - |
| title | 弹窗标题 | `VueNode` | - | - |
| width | 弹窗宽度 | `ModalProps['width']` | `800` | - |
| submitTimeout | 提交时禁用取消按钮的超时时间 | `number` | - | - |

#### 事件 {#modal-form-events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| update:open | 打开状态变化时触发 | `(open: boolean) => void` | - |
| openChange | 打开状态变化时触发 | `(open: boolean) => void` | - |
| finish | 提交成功时触发，返回真值会关闭弹窗 | `(formData) => Promise<any>` | - |

### DrawerForm

DrawerForm 继承 ProForm 的大部分属性。

#### 属性 {#drawer-form-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| trigger | 触发打开的节点 | `VNode` | - | - |
| open | 受控打开状态 | `boolean` | - | - |
| drawerProps | 传递给 Drawer 的属性 | `Omit<DrawerProps, 'open'>` | - | - |
| title | 抽屉标题 | `VueNode` | - | - |
| width | 抽屉宽度 | `DrawerProps['size']` | `800` | - |
| resize | 是否允许拖拽调整宽度或调整配置 | `boolean \| { minWidth?: DrawerProps['size']; maxWidth?: DrawerProps['size']; resize?: () => void }` | `false` | - |
| submitTimeout | 提交时禁用取消按钮的超时时间 | `number` | - | - |

#### 事件 {#drawer-form-events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| openChange | 打开状态变化时触发 | `(open: boolean) => void` | - |
| finish | 提交成功时触发，返回真值会关闭抽屉 | `(formData) => Promise<any>` | - |
