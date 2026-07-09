---
category: Components
title: LoginForm/Page
subtitle: Login Form
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Data Entry
---

LoginForm and LoginFormPage are ProForm layouts for login scenarios. LoginForm provides a centered login form structure, while LoginFormPage adds full-page background, activity information, and login area layout.

## When To Use {#when-to-use}

- Build account/password, captcha, or third-party login forms quickly.
- Keep login title, logo, subtitle, and extra actions consistent.
- Build full-page login views with background image, background video, or activity information.

## Examples {#examples}

<demo-group>
  <demo src="./demo/login-form.vue">Login form</demo>
  <demo src="./demo/login-form-page.vue" iframe="650">Login page</demo>
</demo-group>

## API

### LoginForm

LoginForm inherits most ProForm props.

#### Props {#login-form-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Title | `VueNode \| false` | - | - |
| subTitle | Subtitle | `VueNode \| false` | - | - |
| logo | Logo node or image URL | `VueNode \| string` | - | - |
| message | Message above form fields | `VueNode \| false` | - | - |
| actions | Extra login methods or actions | `VueNode` | - | - |
| contentStyle | Main login form style | `CSSProperties` | - | - |
| containerStyle | Outer container style | `CSSProperties` | - | - |
| otherStyle | Actions area style | `CSSProperties` | - | - |

### LoginFormPage

#### Props {#login-form-page-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Title | `VueNode \| false` | - | - |
| subTitle | Subtitle | `VueNode \| false` | - | - |
| logo | Logo node or image URL | `VueNode \| string` | - | - |
| message | Message above form fields | `VueNode \| false` | - | - |
| actions | Extra login methods or actions | `VueNode` | - | - |
| activityConfig | Activity information config | `{ title?: VueNode; subTitle?: VueNode; action?: VueNode; style?: CSSProperties }` | - | - |
| backgroundImageUrl | Background image URL | `string` | - | - |
| backgroundVideoUrl | Background video URL. Takes priority over background image | `string` | - | - |
| containerStyle | Form container style | `CSSProperties` | - | - |
| mainStyle | Main area style | `CSSProperties` | - | - |
| otherStyle | Actions area style | `CSSProperties` | - | - |
