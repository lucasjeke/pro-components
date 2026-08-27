---
category: Components
title: ProDescriptions
subtitle: Descriptions
group: Data Display
---

The advanced description list component provides a more convenient and faster solution to build a description list.

## When to use {#when-to-use}

ProDescriptions reduces the boilerplate required to build description lists. In Vue, entries can be declared with the `items` prop or with `ProDescriptionsItem` children in an SFC template.

For example, ProDescriptions encapsulates the behavior of the request network, and ProDescriptions will bring the data in props.params into the request by default. If the interface happens to be the same as our definition, it will be very simple to implement a query.

```tsx
import request from 'axios';

const fetchData = (params) =>
  request.get<{
    data: T{};
  }>('https://proapi.azurewebsites.net/github/issues', {
    params,
  });

const keyWords = "Ant Design"

<ProDescriptions<T,U> request={fetchData} />;
```

We agree that request has a parameter, and `params` will carry the `params` in props. The types are as follows:

```ts
(params: U) => RequestData;
```

There are also some conventions on the ProDescriptions of the results returned by the request, the types are as follows:

```ts
interface RequestData {
  data: Datum{};
  success: boolean;
}
```

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic definition list</demo>
    <demo src="./demo/sfc.vue">SFC mode</demo>
</demo-group>
