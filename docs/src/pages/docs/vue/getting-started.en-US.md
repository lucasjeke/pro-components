---
title: Getting Started
---

ProComponents of Vue is a set of advanced middle-back office components built on top of `antdv-next`. Before getting started, make sure you are familiar with Vue 3, TypeScript, and Vite basics, and that Node.js v20 or above is installed.

## Installation

We recommend using the meta package `@antdv-next1/pro-components`. It re-exports ProLayout, ProTable, ProForm, ProCard, ProField, ProConfigProvider, and other Pro components from one entry.

```bash
pnpm add vue antdv-next @antdv-next1/pro-components
```

If you only need a few components, install individual packages instead:

```bash
pnpm add antdv-next @antdv-next1/pro-form @antdv-next1/pro-provider
```

## Configure Providers

`ConfigProvider` controls the base antdv-next component theme and locale. `ProConfigProvider` controls ProComponents theme tokens, locale, and global configuration. It is recommended to wrap your application once near the app entry.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ProConfigProvider } from '@antdv-next1/pro-components'
import { ConfigProvider, theme } from 'antdv-next'
import enUS from 'antdv-next/locale/en_US'

const isDark = false
</script>

<template>
  <ConfigProvider
    :locale="enUS"
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

If your project does not use `vue-router`, replace `RouterView` with your own page component.

## Use Your First Component

The following example shows a minimal ProForm. Events use Vue syntax, such as `@finish`.

```vue
<script setup lang="ts">
import { ProCard, ProForm, ProFormText } from '@antdv-next1/pro-components'

function handleSubmit(values: Record<string, any>) {
  console.log(values)
}
</script>

<template>
  <ProCard title="User Info" style="max-width: 520px">
    <ProForm @finish="handleSubmit">
      <ProFormText
        name="name"
        label="Name"
        :rules="[{ required: true, message: 'Please input your name' }]"
      />
      <ProFormText
        name="email"
        label="Email"
        :rules="[{ type: 'email', message: 'Please input a valid email' }]"
      />
    </ProForm>
  </ProCard>
</template>
```

## Theme and Styles

ProComponents uses `@antdv-next/cssinjs` to generate styles and CSS variables to carry theme values. When the theme changes dynamically, static component styles are not inserted repeatedly; only variable styles are updated.

Common configuration entries:

- Base component theme: configure through `ConfigProvider.theme`.
- Pro component theme: configure through `ProConfigProvider.token`.
- Dark and compact mode: configure through `dark` and `compact` on `ProConfigProvider`.
- For complete theming details, see [Customize Theme](/docs/vue/customize-theme).

## Next Steps

- Use [Layout](/components/layout) to build the page framework.
- Use [Form](/components/form) to build complex forms.
- Use [Table](/components/table) for search, filtering, and list actions.
- Use [Internationalization](/docs/vue/i18n) to configure locale text.
