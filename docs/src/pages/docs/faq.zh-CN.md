---
title: FAQ
order: 3
---

以下整理了一些 ProComponents Vue 社区常见的问题和官方答复，在提问之前建议找找有没有类似的问题。

### 如何隐藏 ProTable 生成的搜索的 label？

columns 的 title 支持 function 的，你可以这样写：

```typescript
title: (_, type) => {
  if (type === 'table') {
    return '标题';
  }
  return null;
};
```

### 为什么组件会出现异常？

### 相关组件使用异常怎么办？

如果 Pro Component Vue 组件出现异常、样式不生效、组件行为异常等问题，请先检查当前项目使用的 `antdv-next` 版本是否与 Pro Component Vue 依赖的版本一致。

**版本不一致可能导致组件异常。**

Pro Component Vue 的部分组件依赖 `antdv-next` 通过 Vue 3 `Provide / Inject` 机制提供的组件上下文。如果项目中存在多个不同版本的 `antdv-next`，或者实际运行的版本与 Pro Component Vue 使用的版本不一致，可能导致组件上下文无法正确匹配，从而出现组件异常。

#### 如何解决？

1. 检查项目当前安装的 `antdv-next` 版本：

```bash
pnpm why antdv-next
```

2. 确认项目中实际使用的 `antdv-next` 版本与 Pro Component Vue 所要求的版本一致。

3. 如果存在多个 `antdv-next` 版本，请统一依赖版本，并重新安装依赖：

```bash
rm -rf node_modules
pnpm install
```

> **注意：** 这并非简单的版本兼容问题。由于 Vue 3 `Provide / Inject` 以及 `antdv-next` 组件上下文的实现方式，使用不同版本的 `antdv-next` 可能导致 Pro Component Vue 无法获取正确的组件上下文。
