---
title: 提交与发布流程
---

本文档说明 ProComponents 的本地提交、版本生成、构建验证、npm 发布和文档站部署流程。

## 分支约定

- `main` 是发布分支。合并到 `main` 后，GitHub Actions 会构建并部署 docs 站点。
- 功能开发和修复应先在独立分支完成，再合并到 `main`。
- 发布前确认工作区只包含本次发布相关改动，避免把无关文件带入版本提交。

## 开发提交

### 安装与本地开发

```bash
pnpm install
pnpm dev
```

### 提交信息

提交信息由 `scripts/verify-commit.js` 校验，格式为：

```bash
<type>(<scope>): <subject>
```

常用示例：

```bash
feat(layout): add left layout
fix(form): correct readonly field style
docs(changelog): update release notes
ci: update docs deploy workflow
chore(release): version packages
```

可用 `type` 包括：

```text
build, chore, ci, deps, docs, feat, fix, perf, refactor, release, revert, style, test, types
```

常用 `scope` 包括：

```text
card, components, field, form, layout, listy, provider, route-utils, table, utils, docs, scripts, changelog, release, ci
```

本地提交时会执行：

- `pre-commit`: `pnpm exec lint-staged`
- `commit-msg`: `node scripts/verify-commit.js`

## 变更集

功能、修复、会影响包版本或用户使用的改动，都需要添加 changeset：

```bash
pnpm changeset
```

选择受影响的子包和版本类型：

- `patch`: bugfix、小兼容修复
- `minor`: 新功能、兼容性新增
- `major`: breaking change

仅文档、脚本或内部维护改动，如果不需要发包，可以不添加 changeset。

## 发布前验证

发布前建议至少执行：

```bash
pnpm test
pnpm test:scripts
pnpm build
```

如果只改了某个子包，可先跑对应子包测试或构建，再在发布前跑完整 `pnpm build`。

## 生成版本与更新日志

确认 changeset 已准备好后，执行：

```bash
pnpm bump
```

该命令会执行：

```bash
pnpm changeset version && pnpm docs:changelog
```

它会更新：

- 各子包 `package.json` 版本
- 各子包 `CHANGELOG.md`
- 内部 workspace 依赖版本
- docs 下的组件更新日志页面

生成完成后，需要提交版本变更：

```bash
git add .
git commit -m "chore(release): version packages"
```

## npm 发布

发布前确认已登录 npm，并且当前分支是要发布的 `main` 最新代码：

```bash
npm whoami
git status
```

发布：

```bash
pnpm ci:publish
```

该命令会执行 workspace 递归发布：

```bash
pnpm publish -r --access=public
```

## 文档站部署

docs 站点由 GitHub Actions 自动部署。

当代码推送到 `main` 后，`.github/workflows/deploy.yml` 会执行：

```bash
pnpm install --frozen-lockfile
pnpm build
```

构建产物 `docs/dist` 会发布到 GitHub Pages。

## 推荐发布顺序

```bash
git checkout main
git pull
pnpm install
pnpm test
pnpm test:scripts
pnpm build
pnpm bump
pnpm test:scripts
pnpm build
git add .
git commit -m "chore(release): version packages"
git push
pnpm ci:publish
```

如果 npm 发布必须严格在 Git tag 或 GitHub Release 之后执行，可先完成 `git push` 和 release tag，再执行 `pnpm ci:publish`。
