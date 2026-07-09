---
title: 快速上手
---

ProComponents of Vue 是一套基于 `antdv-next` 的中后台高级组件。开始使用前，请确保你已经了解 Vue 3、TypeScript 和 Vite 的基础用法，并安装了 Node.js v20 或以上版本。

## 安装

推荐使用元包 `@antdv-next1/pro-components`，它会统一导出 ProLayout、ProTable、ProForm、ProCard、ProField、ProConfigProvider 等组件。

```bash
pnpm add vue antdv-next @antdv-next1/pro-components
```

如果只使用少量组件，也可以按需安装单个子包：

```bash
pnpm add antdv-next @antdv-next1/pro-form @antdv-next1/pro-provider
```

## 配置 Provider

`ConfigProvider` 负责 antdv-next 基础组件主题和语言，`ProConfigProvider` 负责 ProComponents 的主题 Token、国际化和全局配置。建议在应用入口统一包裹一次。

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ProConfigProvider } from '@antdv-next1/pro-components'
import { ConfigProvider, theme } from 'antdv-next'
import zhCN from 'antdv-next/locale/zh_CN'

const isDark = false
</script>

<template>
  <ConfigProvider
    :locale="zhCN"
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
      },
    }"
  >
    <ProConfigProvider :dark="isDark">
      <RouterView />
    </ProConfigProvider>
  </ConfigProvider>
</template>
```

如果你的项目还没有接入 `vue-router`，可以把 `RouterView` 替换为自己的页面组件。

## 使用第一个组件

下面示例展示了一个最小的 ProForm。所有事件都使用 Vue 的事件写法，例如 `@finish`。

```vue
<script setup lang="ts">
import { ProCard, ProForm, ProFormText } from '@antdv-next1/pro-components'

function handleSubmit(values: Record<string, any>) {
  console.log(values)
}
</script>

<template>
  <ProCard title="用户信息" style="max-width: 520px">
    <ProForm @finish="handleSubmit">
      <ProFormText
        name="name"
        label="姓名"
        :rules="[{ required: true, message: '请输入姓名' }]"
      />
      <ProFormText
        name="email"
        label="邮箱"
        :rules="[{ type: 'email', message: '请输入正确的邮箱' }]"
      />
    </ProForm>
  </ProCard>
</template>
```

## 主题和样式

ProComponents 使用 `@antdv-next/cssinjs` 生成样式，并通过 CSS 变量承载主题值。动态切换主题时，组件静态样式不会反复插入，只会更新变量样式。

常见配置入口：

- 基础组件主题：通过 `ConfigProvider.theme` 配置。
- Pro 组件主题：通过 `ProConfigProvider.token` 配置。
- 暗色/紧凑模式：通过 `ProConfigProvider` 的 `dark`、`compact` 配置。
- 更完整的主题说明：查看 [定制主题](/docs/vue/customize-theme)。

## 下一步

- 使用 [Layout](/components/layout) 搭建页面框架。
- 使用 [Form](/components/form) 构建复杂表单。
- 使用 [Table](/components/table) 处理查询、筛选和列表操作。
- 使用 [国际化](/docs/vue/i18n) 配置多语言文案。
