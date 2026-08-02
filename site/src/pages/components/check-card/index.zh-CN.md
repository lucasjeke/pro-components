---
category: Components
title: CheckCard
subtitle: 多选卡片
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 布局
---

集合多种相关联说明信息，并且可被选择的卡片。特点：
- ① 可容纳多种相关联说明信息，如标题、描述、图片、标签等
- ② 有明显边界
- ③ 有明显选中态

## 何时使用 {#when-to-use}

- 需要展示被选择对象的多种说明信息时
- 被选择对象的数量不多时

## 代码演示 {#examples}

<demo-group>
    <demo src="./demo/basic.vue">基本使用</demo>
    <demo src="./demo/single.vue">单选模式</demo>
    <demo src="./demo/multiple.vue">多选模式</demo>
    <demo src="./demo/size.vue">不同尺寸</demo>
    <demo src="./demo/custom.vue">自定义尺寸</demo>
    <demo src="./demo/form.vue">表单中使用</demo>
    <demo src="./demo/compose.vue">组合样式</demo>
    <demo src="./demo/avatar.vue">自定义头像</demo>
    <demo src="./demo/title.vue">自定义标题</demo>
    <demo src="./demo/description.vue">自定义描述</demo>
    <demo src="./demo/defaultChecked.vue">默认选中</demo>
    <demo src="./demo/extra.vue">操作栏</demo>
    <demo src="./demo/loading.vue">组件 Loading</demo>
    <demo src="./demo/image.vue">纯图片选项</demo>
    <demo src="./demo/disabled.vue">选项不可用</demo>
    <demo src="./demo/group.vue">选项列表</demo>
    <demo src="./demo/list.vue">应用列表示例</demo>
    <demo src="./demo/grid.vue">布局</demo>
</demo-group>

## API

### CheckCard

#### 属性 {#checkcard-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| checked | 指定当前是否选中 | `boolean` | - | - |    
| variant | 形态变体 | `'borderless'\| 'outlined'` | `outlined` | - |
| value | 选项值 | `string` | - | - |
| defaultChecked | 初始是否选中 | `boolean` | `false` | - |
| disabled | 失效状态 | `boolean` | `false` | - |
| size | 选择框大小，可选 `large` `small`  | `string` | `default` | - |
| loading | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | `boolean`  | `false` | - |
| title | 标题 | `VueNode`  | - | - |
| description | 描述 | `VueNode` | - | - |
| avatar | 选项元素的图片地址 | `link \| VueNode` | - | - |
| extra | 卡片右上角的操作区域 | `VueNode` | - | - |
| cover | 卡片背景图片，注意使用该选项后`title`，`description`和`avatar`失效 | `VueNode` | - | - |   

#### 事件 {#checkcard-events}

| 事件名 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| change | 变化时回调函数 | `(checked) => void` | - |


#### 插槽 {#checkcard-slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| title | 标题 | `() => VueNode`  | - |
| description | 描述 | `() => VueNode` | - |
| avatar | 选项元素的图片地址 | `() => VueNode` | - | 
| extra | 卡片右上角的操作区域 | `() => VueNode ` | - | 
| cover | 卡片背景图片，注意使用该选项后`title`，`description`和`avatar`失效 | `() => VueNode ` | - | 

### CheckCard.Group 

#### 属性 {#checkcard-group-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| multiple | 多选 | `boolean` | `false` | - |
| defaultValue | 默认选中的选项 | `string \| string[]` | - | - |
| disabled | 整组失效 | `boolean` | `false` | - |
| loading | 当卡片组内容还在加载中时，可以用 loading 展示一个占位 | `boolean` | `false` | - |
| options | 指定可选项 | `string[] \| Array<{ title: VueNode, value: string, description?: VueNode, avatar?: link or VueNode, cover?:VueNode, disabled?: boolean }>` | `[]` | - |
| value | 指定选中的选项 | `string \| string[]` | - | - |
| size | 选择框大小 | `large` \| `small` | - | - |

#### 事件 {#checkcard-group-events}

| 事件名 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| change | 变化时回调函数 | `(checkedValue) => void` | - |
