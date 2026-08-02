---
category: Components
title: PageContainer
description: PageContainer is a page container component that provides a unified page layout structure. It includes standardized page elements such as page title, breadcrumb navigation, and page operation area, allowing you to quickly build pages with consistent layouts.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Layout
---

- Automatically handles page title and breadcrumb navigation
- Supports page-level operation buttons and toolbars
- Provides standardized page layout structure
- Supports advanced features like watermarks and loading states

## When To Use {#when-to-use}

- When you need unified page title and breadcrumb navigation
- When you need page-level operation buttons
- When you need standardized page layout
- When you need page-level loading states
- When you need page watermark functionality

## Examples {#examples}

<demo-group>
    <demo src="./demo/basic.vue">Basic Usage</demo>
    <demo src="./demo/fixed-header.vue">Fixed Header</demo>
    <demo src="./demo/hideBreadMenu.vue">Hide Breadcrumb</demo>
</demo-group>

## API

### PageContainer

#### Props {#page-container-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Page title | `VueNode` | - | - |
| subTitle | Page subtitle | `VueNode` | - | - |
| extra | Page operation area | `VueNode` | - | - |
| content | Page content | `VueNode` | - | - |
| loading | Loading state | `boolean` \| `SpinProps` | `false` | - |
| header | Header configuration | `PageHeaderProps` | - | - |
| breadcrumb | Breadcrumb configuration | `BreadcrumbProps` | - | - |
| breadcrumbRender | Custom breadcrumb rendering | `(props: PageContainerProps) => VueNode` | - | - |
| waterMarkProps | Watermark configuration | `WatermarkProps` | - | - |

#### Slots {#page-container-slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| breadcrumbRender | Custom breadcrumb rendering | `(props: PageContainerProps) => VueNode` | - |

### PageHeader 

#### Props {#pageheader-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Title | `VueNode` | - | - |
| subTitle | Subtitle | `VueNode` | - | - |
| extra | Operation area | `VueNode` | - | - |
| breadcrumb | Breadcrumb | `BreadcrumbProps` | - | - |
| tags | Tags | `TagProps[]` | - | - |
| avatar | Avatar | `AvatarProps` | - | - |
| backIcon | Back icon | `VueNode` | - | - |

#### Events {#pageheader-event}

| Event | Description | Type | Version |
| ----- | --- | --- | --- |
| back | Back event | `() => void` | - |
