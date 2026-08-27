---
title: 快速上手
order: 2
---

## ProComponents Vue

ProComponents Vue 是基于 Antdv Next 而开发的模板组件，提供了更高级别的抽象支持，开箱即用。可以显著地提升制作 CRUD 页面的效率，更加专注于页面。

- [ProLayout](/components/layout) 解决布局的问题，提供开箱即用的菜单和面包屑功能
- [ProTable](/components/table) 表格模板组件，抽象网络请求和表格格式化
- [ProForm](/components/form) 表单模板组件，预设常见布局和行为
- [ProCard](/components/card) 提供卡片切分以及栅格布局能力
- [ProDescriptions](/components/descriptions) 定义列表模板组件，ProTable 的配套组件
- [ProSkeleton](/components/skeleton) 页面级别的骨架屏

在使用之前可以查看一下典型的 Demo 来判断组件是否适合你们的业务。ProComponents Vue 专注于中后台的 CRUD, 预设了相当多的样式和行为。这些行为和样式更改起来会比较困难，如果你的业务需要丰富的自定义建议直接使用 Antdv Next。

## 安装

当前 ProComponents Vue 每一个组件都是一个独立的包，你需要在你的项目中安装对应的 npm 包并使用。

### 使用 npm 或 yarn 或 pnpm 或 bun 安装

**我们推荐使用 [npm](https://www.npmjs.com/) 或 [yarn](https://github.com/yarnpkg/yarn/) 或 [pnpm](https://pnpm.io/zh/) 或 [bun](https://bun.sh/) 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

<InstallDependencies npm='$ npm install @antdv-next1/pro-components --save' yarn='$ yarn add @antdv-next1/pro-components' pnpm='$ pnpm install @antdv-next1/pro-components --save' bun='$ bun add @antdv-next1/pro-components'></InstallDependencies>

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。


当前 ProComponents Vue 提供了如下组件可直接使用：

- `npm i @antdv-next1/pro-components --save`


## 在项目中使用

每一个包都是一个独立的组件包，使用示例如下 ：

```vue
<script lang="ts" setup>
import { ProForm, ProFormText } from '@antdv-next1/pro-components';
</script>
<template>
  <ProForm 
	@finish="async (values) => {
      console.log(values);
    }"
  >
    <ProFormText name="name" label="姓名" />
  </ProForm>
</template>
<style scoped>
</style>
```

我们所有的包都使用 CSS-in-JS 管理样式，只需引入 js 即可。
