---
title: FAQ
---

以下整理了一些 ProComponents of Vue 社区常见的问题和官方答复，在提问之前建议找找有没有类似的问题。


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


## 错误和警告

这里是一些你在使用 ProComponents of Vue 的过程中可能会遇到的错误和警告，但是其中一些并不是 ProComponents of Vue 的 bug。