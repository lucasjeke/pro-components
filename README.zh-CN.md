<div align="center"><a name="readme-top"></a>

<img height="180" src="./docs/public/logo.png">

<h1>Pro Components</h1>

一套基于 [Antdv Next](https://github.com/antdv-next/antdv-next) 构建的 Vue 3 高级企业级组件集，专为中后台应用场景设计。

[English](./README.md) · 中文

</div>

## ✨ 特性

- 🏢 **企业级组件** — 面向复杂中后台场景的 Pro 级组件。
- 📦 **Monorepo 架构** — 模块化包设计，可独立使用，也可通过 `@antdv-next1/pro-components` 统一引入。
- 🛡 **完整 TypeScript** — 使用 TypeScript 开发，提供完整的类型定义。
- 🎨 **CSS-in-JS 主题** — 基于 `@antdv-next/cssinjs` 的灵活主题定制能力。
- 🌍 **国际化支持** — 通过 `ProConfigProvider` 内置多语言支持。
- 🧩 **对齐 Ant Design** — API 和交互模式与 Ant Design 保持一致。

## 📦 组件包

| 包名 | 版本 | 说明 |
|------|------|------|
| `@antdv-next1/pro-components` | 1.0.15 | 元包，统一导出所有 Pro 组件 |
| `@antdv-next1/pro-layout` | 1.0.10 | 高级页面布局（ProLayout、BasicLayout） |
| `@antdv-next1/pro-table` | 1.0.13 | 增强型表格，支持搜索表单、工具栏和拖拽排序 |
| `@antdv-next1/pro-form` | 1.0.10 | 高级表单，支持多种布局和分步表单 |
| `@antdv-next1/pro-card` | 2.0.6 | 灵活卡片组件，支持分割和栅格布局 |
| `@antdv-next1/pro-field` | 1.0.7 | 丰富的字段渲染（文本、选择、日期、级联等） |
| `@antdv-next1/pro-listy` | 1.0.3 | 高级列表组件 |
| `@antdv-next1/pro-provider` | 1.0.3 | 全局配置提供者、国际化与主题上下文 |
| `@antdv-next1/pro-utils` | 1.0.9 | 通用工具函数与组合式函数 |
| `@antdv-next1/route-utils` | 1.0.4 | 路由转换与菜单生成工具 |

## 🖥 兼容环境

- 现代浏览器（[browserslist](https://browsersl.ist/#q=defaults)：last 2 versions, Firefox ESR, > 1%）
- 支持服务端渲染
- [Electron](https://www.electronjs.org/)
- Node.js >= 24.x（开发环境）

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Electron |
| --- | --- | --- | --- | --- |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 📦 安装

### 安装元包（包含所有组件）

```bash
npm install @antdv-next1/pro-components
```

```bash
pnpm add @antdv-next1/pro-components
```

### 按需安装单个包

```bash
pnpm add @antdv-next1/pro-layout @antdv-next1/pro-table @antdv-next1/pro-form
```

### 对等依赖

所有组件包需要 `vue >= 3.5.30` 和 `antdv-next >= 1.1.6` 作为对等依赖。

```bash
pnpm add vue antdv-next
```

## 🚀 快速开始

```vue
<script setup lang="ts">
import { ProLayout } from '@antdv-next1/pro-components'
</script>

<template>
  <ProLayout :route="route" title="我的应用">
    <template #default>
      <router-view />
    </template>
  </ProLayout>
</template>
```

## 🛠 开发指南

### 环境要求

- [Node.js](https://nodejs.org/) >= 24.x
- [pnpm](https://pnpm.io/) >= 10.x

### 初始化

```bash
# 克隆仓库
git clone https://github.com/archiesong/pro-components.git
cd pro-components

# 安装依赖
pnpm install

# 启动开发 Playground
pnpm dev
```

### 常用命令

```bash
# 启动开发服务器（文档 Playground）
pnpm dev

# 运行代码检查
pnpm lint

# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 构建所有组件包
pnpm build:pro

# 构建所有内容（组件包 + 文档站点）
pnpm build
```

## 🏗 项目结构

```
pro-components/
├── packages/
│   ├── components/       # @antdv-next1/pro-components（元包）
│   ├── layout/           # @antdv-next1/pro-layout
│   ├── table/            # @antdv-next1/pro-table
│   ├── form/             # @antdv-next1/pro-form
│   ├── card/             # @antdv-next1/pro-card
│   ├── field/            # @antdv-next1/pro-field
│   ├── listy/            # @antdv-next1/pro-listy
│   ├── provider/         # @antdv-next1/pro-provider
│   ├── utils/            # @antdv-next1/pro-utils
│   └── route-utils/      # @antdv-next1/route-utils
├── docs/                 # 基于 Vite 的文档与 Playground
├── scripts/              # 构建与 CI 脚本
├── turbo.json            # Turborepo 配置
├── pnpm-workspace.yaml   # pnpm 工作区配置
└── package.json
```

## 🧪 测试

测试基于 [Vitest](https://vitest.dev/) 和 `@vue/test-utils`。

```bash
# 运行所有测试
pnpm test

# 以 UI 模式运行测试
pnpm test:ui

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 🤝 参与贡献

非常欢迎您参与到我们的开源项目中来！

**PR 流程：**

1. Fork 代码仓库。
2. 创建自己的分支：`git checkout -b feat-xxxx`
3. 提交你的修改：`git commit -am 'feat(scope): add xxxxx'`
4. 推送您的分支：`git push origin feat-xxxx`
5. 提交 Pull Request。

### 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` — 新功能
- `fix:` — Bug 修复
- `refactor:` — 代码重构
- `docs:` — 文档变更
- `test:` — 测试更新
- `chore:` — 构建/基础设施变更

## 📄 开源协议

[MIT](./LICENSE) © [lucasjeke](https://github.com/lucasjeke)

## 🙏 鸣谢

本项目的开发与实现参考、借鉴并使用了以下优秀的开源项目，在此表示感谢。

- [Ant Design](https://ant.design/) — 设计体系与 UI 模式
- [Ant Design Pro Components (React)](https://procomponents.ant.design/) — Pro 组件设计参考
- [Antdv Next](https://github.com/antdv-next/antdv-next) — Vue 3 基础组件库
- [Vue.js](https://vuejs.org/) — 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) — 下一代前端构建工具
