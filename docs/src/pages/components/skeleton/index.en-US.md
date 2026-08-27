---
category: Components
title: ProSkeleton
subtitle: Skeleton
group: General
---

页面级别的骨架屏，不支持自定义


## When To Use {#when-to-use}


## Examples {#examples}

<demo-group>
  <demo src="./demo/list.vue">list page</demo>
  <demo src="./demo/result.vue">Results page</demo>
  <demo src="./demo/descriptions.vue">Details page</demo>
</demo-group>

## API

| parameter | description | type | default value |
| --- | --- | --- | --- |
| type | Different types of skeleton screens | `'list' \| 'result' \| 'descriptions'` | list |
| active | Whether to show dynamic | boolean | true |
| pageHeader | Whether to display pageHeader's skeleton screen descriptions and list are valid | - | - |
| statistic | number of statistic skeleton screens | `number` \| `false` | - |
| list | skeleton screen of the list, you can control the number | `number` \| `false` | - |
| toolbar | Action bar skeleton screen of the list | boolean | - |
| formItemRender | Customize the dom performance under `mode=update or edit`, generally used to render edit boxes | - | - |
| render | Customize the dom performance under `mode=read`, which is just a simple form of expression | - | - |
