<div align="center"><a name="readme-top"></a>

<img height="180" src="./docs/public/logo.png">

<h1>Pro Components</h1>

A set of advanced Vue 3 enterprise components built on top of [Antdv Next](https://github.com/antdv-next/antdv-next), designed for middle-back office applications.

[English](./README.md) · [中文](./README.zh-CN.md)

</div>

## ✨ Features

- 🏢 **Enterprise-grade** — Pro-level components for complex middle-back office scenarios.
- 📦 **Monorepo Architecture** — Modular packages that can be used independently or together via `@antdv-next1/pro-components`.
- 🛡 **Full TypeScript** — Written in TypeScript with complete type definitions.
- 🎨 **CSS-in-JS Theming** — Powerful theme customization powered by `@antdv-next/cssinjs`.
- 🌍 **Internationalization** — Built-in i18n support via `ProConfigProvider`.
- 🧩 **Ant Design Aligned** — API and interaction patterns consistent with Ant Design.

## 📦 Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@antdv-next1/pro-components` | 1.0.15 | Meta package that bundles all pro components |
| `@antdv-next1/pro-layout` | 1.0.10 | Advanced page layout (ProLayout, BasicLayout) |
| `@antdv-next1/pro-table` | 1.0.13 | Enhanced table with search form, toolbar & drag-and-drop |
| `@antdv-next1/pro-form` | 1.0.10 | Advanced form with multiple layouts & steps |
| `@antdv-next1/pro-card` | 2.0.6 | Flexible card component with split & grid support |
| `@antdv-next1/pro-field` | 1.0.7 | Rich field rendering (text, select, date, cascader, etc.) |
| `@antdv-next1/pro-listy` | 1.0.3 | Advanced list component |
| `@antdv-next1/pro-provider` | 1.0.3 | Global config provider, locale & theme context |
| `@antdv-next1/pro-utils` | 1.0.9 | Shared utility functions & composables |
| `@antdv-next1/route-utils` | 1.0.4 | Route transformation & menu generation utilities |

## 🖥 Environment Support

- Modern browsers ([browserslist](https://browsersl.ist/#q=defaults): last 2 versions, Firefox ESR, > 1%)
- Server-side Rendering
- [Electron](https://www.electronjs.org/)
- Node.js >= 24.x (for development)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Electron |
| --- | --- | --- | --- | --- |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 📦 Installation

### Install the meta package (all components)

```bash
npm install @antdv-next1/pro-components
```

```bash
pnpm add @antdv-next1/pro-components
```

### Install individual packages

```bash
pnpm add @antdv-next1/pro-layout @antdv-next1/pro-table @antdv-next1/pro-form
```

### Peer dependencies

All component packages require `vue >= 3.5.30` and `antdv-next >= 1.1.6` as peer dependencies.

```bash
pnpm add vue antdv-next
```

## 🚀 Quick Start

```vue
<script setup lang="ts">
import { ProLayout } from '@antdv-next1/pro-components'
</script>

<template>
  <ProLayout :route="route" title="My App">
    <template #default>
      <router-view />
    </template>
  </ProLayout>
</template>
```

## 🛠 Development

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24.x
- [pnpm](https://pnpm.io/) >= 10.x

### Setup

```bash
# Clone the repository
git clone https://github.com/archiesong/pro-components.git
cd pro-components

# Install dependencies
pnpm install

# Start the dev playground
pnpm dev
```

### Scripts

```bash
# Start dev server (docs playground)
pnpm dev

# Run linting
pnpm lint

# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build all packages
pnpm build:pro

# Build everything (packages + docs site)
pnpm build
```

## 🏗 Project Structure

```
pro-components/
├── packages/
│   ├── components/       # @antdv-next1/pro-components (meta package)
│   ├── layout/           # @antdv-next1/pro-layout
│   ├── table/            # @antdv-next1/pro-table
│   ├── form/             # @antdv-next1/pro-form
│   ├── card/             # @antdv-next1/pro-card
│   ├── field/            # @antdv-next1/pro-field
│   ├── listy/            # @antdv-next1/pro-listy
│   ├── provider/         # @antdv-next1/pro-provider
│   ├── utils/            # @antdv-next1/pro-utils
│   └── route-utils/      # @antdv-next1/route-utils
├── docs/                 # Vite-based documentation & playground
├── scripts/              # Build & CI scripts
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace config
└── package.json
```

## 🧪 Testing

Tests are powered by [Vitest](https://vitest.dev/) with `@vue/test-utils`.

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your branch: `git checkout -b feat-xxxx`
3. Commit your changes: `git commit -am 'feat(scope): add xxxxx'`
4. Push your branch: `git push origin feat-xxxx`
5. Submit a pull request.

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New features
- `fix:` — Bug fixes
- `refactor:` — Code refactoring
- `docs:` — Documentation changes
- `test:` — Test updates
- `chore:` — Build / infrastructure changes

## 📄 License

[MIT](./LICENSE) © [lucasjeke](https://github.com/lucasjeke)

## 🙏 Acknowledgements

This project is built upon the shoulders of these excellent open-source projects:

- [Ant Design](https://ant.design/) — Design system and UI patterns
- [Ant Design Pro Components (React)](https://procomponents.ant.design/) — Pro component design reference
- [Antdv Next](https://github.com/antdv-next/antdv-next) — Vue 3 base component library
- [Vue.js](https://vuejs.org/) — Progressive JavaScript framework
- [Vite](https://vitejs.dev/) — Next generation frontend tooling
