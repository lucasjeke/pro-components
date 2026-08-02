---
category: Components
title: PageContainer
subtitle: 页容器
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 布局
---

PageContainer 是一个页面容器组件，提供了统一的页面布局结构。它包含了页面标题、面包屑导航、页面操作区等标准化的页面元素，让您可以快速构建具有一致性的页面布局。
- 自动处理页面标题和面包屑导航
- 支持页面级别的操作按钮和工具栏
- 提供标准化的页面布局结构
- 支持水印、加载状态等高级功能

## 何时使用 {#when-to-use}

- 需要统一的页面标题、面包屑导航时
- 需要页面级别的操作按钮时
- 需要标准化的页面布局时
- 需要页面级别的加载状态时
- 需要页面水印功能时

## 代码演示 {#examples}

<demo-group>
    <demo src="./demo/basic.vue" iframe="550">基础用法</demo>
    <demo src="./demo/fixed-header.vue" iframe="550">固定头部</demo>
    <demo src="./demo/hideBreadMenu.vue" iframe="550">隐藏面包屑</demo>
</demo-group>

## API

### PageContainer

#### 属性 {#page-container-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 页面标题 | `VueNode` | - | - |
| subTitle | 页面副标题 | `VueNode` | - | - |
| extra | 页面操作区 | `VueNode` | - | - |
| content | 页面内容 | `VueNode` | - | - |
| loading | 加载状态 | `boolean` \| `SpinProps` | `false` | - |
| header | 头部配置 | `PageHeaderProps` | - | - |
| breadcrumb | 面包屑配置 | `BreadcrumbProps` | - | - |
| breadcrumbRender | 自定义面包屑渲染 | `(props: PageContainerProps) => VueNode` | - | - |
| waterMarkProps | 水印配置 | `WatermarkProps` | - | - |

#### 插槽 {#page-container-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- 
| breadcrumbRender | 自定义面包屑渲染 | `(props: PageContainerProps) => VueNode` | - |

### PageHeader 

#### 属性 {#pageheader-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 标题 | `VueNode` | - | - |
| subTitle | 副标题 | `VueNode` | - | - |
| extra | 操作区 | `VueNode` | - | - |
| breadcrumb | 面包屑配置 | `BreadcrumbProps` | - | - |
| tags | 标签 | `TagProps[]` | - | - |
| avatar | 头像 | `AvatarProps` | - | - |
| backIcon | 返回图标 | `VueNode` | - | - |

#### 事件 {#pageheader-event}

| 事件 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| back | 返回事件 | `() => void` | - |
