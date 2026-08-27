---
category: Components
title: ProSkeleton
subtitle: 骨架屏
group: 通用
---

页面级别的骨架屏，不支持自定义

## 何时使用 {#when-to-use}

- 页面级别的骨架屏



## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/list.vue">列表页面</demo>
  <demo src="./demo/result.vue">结果页</demo>
  <demo src="./demo/descriptions.vue">详情页</demo>
</demo-group>


## API

### ProSkeleton

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 不同类型的骨架屏 | `'list' \| 'result' \| 'descriptions'` | `list` |
| active | 是否显示动态 | `boolean` | `true` |
| pageHeader | 是否显示 pageHeader 的骨架屏 descriptions 和 list 有效 | `boolean` | `true` |
| statistic | 统计信息骨架屏的数量 | `number` \| `false` | `4` |
| list | 列表的骨架屏，可以控制数量 | `number` \| `false` | `5` |
| toolbar | 列表的操作栏骨架屏 | `boolean` | `true` |
| formItemRender | 自定义 `mode=update 或 edit` 下的 dom 表现，一般用于渲染编辑框 | `(item: any, config: any) => VueNode` | - |
| render | 自定义 `mode=read` 下的 dom 表现，只是单纯的表现形式 | `(item: any, config: any) => VueNode` | - |
