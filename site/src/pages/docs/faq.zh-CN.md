---
title: FAQ
order: 3
---

以下整理了一些 ProComponents 社区常见的问题和官方答复，在提问之前建议找找有没有类似的问题。此外我们也维护了一个反馈较多 [how to use 标签](https://github.com/ant-design/pro-components/issues?q=is%3Aissue+label%3A%22%F0%9F%A4%B7%F0%9F%8F%BC+How+to+use%22+) 亦可参考。

### ProTable request 返回的数据格式可以自定义吗？

不行的，你可以在 request 中转化一下，或者写个拦截器。

[示例](https://beta-pro.ant.design/docs/request-cn)

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