---
category: Components
title: LoginForm/Page
subtitle: 登录表单
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 数据录入
---

LoginForm 和 LoginFormPage 是面向登录页的 ProForm 布局。LoginForm 提供居中的登录表单结构，LoginFormPage 额外提供整页背景、活动信息和登录区域布局。

## 何时使用 {#when-to-use}

- 快速搭建账号密码、验证码、第三方登录等登录表单时。
- 需要统一登录页标题、Logo、副标题和额外操作区时。
- 需要带背景图片、背景视频或活动说明的整页登录场景时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/login-form.vue">登录表单</demo>
  <demo src="./demo/login-form-page.vue" iframe="650">登录页</demo>
</demo-group>

## API

### LoginForm

LoginForm 继承 ProForm 的大部分属性。

#### 属性 {#login-form-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 标题 | `VueNode \| false` | - | - |
| subTitle | 副标题 | `VueNode \| false` | - | - |
| logo | Logo，支持节点或图片地址 | `VueNode \| string` | - | - |
| message | 表单顶部提示 | `VueNode \| false` | - | - |
| actions | 额外登录方式或操作区 | `VueNode` | - | - |
| contentStyle | 登录表单主体样式 | `CSSProperties` | - | - |
| containerStyle | 外层容器样式 | `CSSProperties` | - | - |
| otherStyle | actions 区域样式 | `CSSProperties` | - | - |

### LoginFormPage

#### 属性 {#login-form-page-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 标题 | `VueNode \| false` | - | - |
| subTitle | 副标题 | `VueNode \| false` | - | - |
| logo | Logo，支持节点或图片地址 | `VueNode \| string` | - | - |
| message | 表单顶部提示 | `VueNode \| false` | - | - |
| actions | 额外登录方式或操作区 | `VueNode` | - | - |
| activityConfig | 活动信息配置 | `{ title?: VueNode; subTitle?: VueNode; action?: VueNode; style?: CSSProperties }` | - | - |
| backgroundImageUrl | 背景图片地址 | `string` | - | - |
| backgroundVideoUrl | 背景视频地址，优先级高于背景图片 | `string` | - | - |
| containerStyle | 表单容器样式 | `CSSProperties` | - | - |
| mainStyle | 主区域样式 | `CSSProperties` | - | - |
| otherStyle | actions 区域样式 | `CSSProperties` | - | - |
