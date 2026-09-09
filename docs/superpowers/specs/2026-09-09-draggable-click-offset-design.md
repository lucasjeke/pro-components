# Draggable 点击偏移修复设计

## 问题描述

`DraggableCore` 初始化时将 `lastX` 和 `lastY` 设为 `Number.NaN`。
`createCoreData` 会根据这两个值是否为有效数字来判断当前事件是不是一次新拖拽的开始；
新拖拽开始时，返回的 `deltaX` 和 `deltaY` 应当都是 `0`。

当前实现结束拖拽后，却将 `lastX` 和 `lastY` 重置成了 `0`。下一次按下鼠标时，
起拖逻辑会把它误判为上一轮拖拽的延续，并按照鼠标相对于页面原点的位置计算初始
位移。`ModalForm` 等调用方会使用这个错误的起始坐标计算拖拽边界，因此即使用户
只是点击标题，后续出现一个极小的 `mousemove` 事件，也可能让弹窗发生非预期偏移。

## 修复方案

拖拽正常结束后，将 `lastX` 和 `lastY` 恢复成与初始化阶段相同的哨兵值
`Number.NaN`，保证下一次按下鼠标时一定被识别为新一轮拖拽。

点击偏移本身通过 `DraggableCore` 的坐标哨兵修复，不在 `ModalForm` 中增加坐标补偿，
也不通过反复销毁和重新创建组件来清理错误状态。本次发布同时补齐 Draggable 的公开
导出、缩放与受控位置行为、卸载清理，以及 ModalForm 的拖拽和全屏能力。

## 行为约定

- 每次新拖拽开始时，`deltaX` 和 `deltaY` 都必须为 `0`。
- 只按下并松开鼠标、没有实际移动时，拖拽元素的 CSS `transform` 不得变化。
- 第二次及后续拖拽不得复用上一轮拖拽的坐标。
- `scale` 只参与一次坐标换算。
- 受控位置在每次拖拽结束后恢复到 `position`。
- 组件在拖拽中卸载时必须清理 document 事件和用户选择状态。
- `ModalForm` 只能通过标题区域拖拽，全屏按钮不得触发拖拽。
- 现有网格吸附、边界限制、鼠标事件和触摸事件保持兼容。

## 测试方案

在 `packages/utils/tests/` 下新增聚焦的 Vitest 测试，使用真实的 `Draggable`
组件和 `nodeRef` 挂载可拖拽元素。

回归测试覆盖以下流程：

1. 完成第一轮鼠标拖拽生命周期。
2. 在非零客户端坐标处开始第二轮拖拽。
3. 断言第二轮 `onStart` 事件中的 `deltaX` 和 `deltaY` 仍为 `0`。
4. 完成一次只点击、不移动的生命周期，并断言 CSS `transform` 保持不变。

测试必须覆盖首次拖拽、重复拖拽、点击不移动、缩放、受控位置、边界、禁用状态、
触摸完整生命周期和拖拽中卸载清理。ModalForm 测试还需验证标题拖拽区域、全屏切换、
关闭后状态复位和自定义 footer 合并。

## 修改范围

生产代码范围：

- `packages/utils/src/components/Draggable/`：提供 Draggable 与 DraggableCore，修复坐标、
  缩放、受控模式和生命周期清理。
- `packages/form/src/layouts/ModalForm/`：增加 `draggable` 与 `fullscreenable`，并保持
  title、modalRender、footer 和提交按钮渲染契约一致。
