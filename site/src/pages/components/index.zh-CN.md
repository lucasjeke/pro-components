---
title: 组件总览
order: 0
---

ProComponents Vue 是基于 Antdv Next 而开发的模板组件，提供了更高级别的抽象支持，开箱即用。可以显著地提升制作 CRUD 页面的效率，更加专注于页面。

- [ProLayout](/components/layout) 解决布局的问题，提供开箱即用的菜单和面包屑功能
- [ProTable](/components/table) 表格模板组件，抽象网络请求和表格格式化
- [ProForm](/components/form) 表单模板组件，预设常见布局和行为
- [ProCard](/components/card) 提供卡片切分以及栅格布局能力
- [ProDescriptions](/components/descriptions) 定义列表模板组件，ProTable 的配套组件
- [ProSkeleton](/components/skeleton) 页面级别的骨架屏

<ComponentOverview></ComponentOverview>

## 与网络请求库配置使用 {#configuring-use-with-the-web-request-library}

ProTable 和 ProListy 使用了新的数据结构，如果你使用了我们约定的参数使用起来会非常简单。

```ts
const msg: {
  data: T[];
  page: number;
  success: boolean;
  total: number;
} = {
  data: [],
  page: 1,
  success: true,
  total: 0,
};
```

如果使用了 fetch ，可以对 fetch 进行自定义。

```tsx
const request = (url, options) => {
  return fetch(url, options)
    .then((res) => res.json())
    .then((resData) => {
      return Promise.resolve({
        ...resData,
        total: resData.sum,
        success: resData.ok,
        errorMessage: resData.message,
      });
    });
};

// 使用时
<ProTable request={request('/list')} />;
```

## 通用配置 {#general-configuration}

ProTable 和 ProDescriptions 共享一组配置，可以使用相同的列和请求来生成数据，唯一的区别在于 Table 需要一个数组，而 ProDescriptions 只需要一个对象。以下是具体的配置说明。

```ts
/**
 * Commonly supported render for each component
 */
export type ProSchema<T = unknown, U = string, Extra = unknown> = {
  /**
   * @name key Determines the unique value of this column
   */
  key?: (string | number);
  /**
   * @name dataIndex The key mapped to the entity
   * @description supports a number, [a,b] will be converted to obj.a.b
   */
  dataIndex?: string | number | (string | number)[];
  /**
   * Select how to render the corresponding pattern
   */
  valueType?: ((entity: T, type: ProSchemaComponentTypes) => U) | U;

  /**
   * @name title
   * @description supports VueNode and methods
   */
  title?:
    | ((
        schema: ProSchema<T, U, Extra>,
        type: ProSchemaComponentTypes,
        dom:VueNode) => VueNode)
    | VueNode;

  /**
   *@name tooltip shows an icon, hover shows some hints
   */
  tooltip?: LabelTooltipType | string;

  render?: (
    dom: VueNode,
    entity: T,
    index: number,
    action: ProCoreActionType,
    schema: ProSchema<T, U, Extra>,
  ) => VueNode;

  /**
   * @name formItemRender  Customize the edit schema
   * @description returns a node that will automatically wrap value and onChange
   */
   formItemRender?: (
    item: ProSchema<T, U, Extra>,
    config: {
      index?: number;
      value?: any;
      onSelect?: (value: any) => void;
      type: ProSchemaComponentTypes;
      defaultRender: (newItem: ProSchema<T, U, Extra>) => JSX.Element | null;
    },
    form: FormInstance,
  ) => VueNode;

  /**
   * @name renderText Custom render
   * @description must return string
   */
  renderText?: (text: any, record: T, index: number, action: ProCoreActionType) => any;

  fieldProps?: any;
  /**
   * @name valueEnum The type of the mapped value
   */
  valueEnum?: ProSchemaValueEnumObj | ProSchemaValueEnumMap;

  /**
   * @name request enum from server
   */
  request?: ProFieldRequestData<ProSchema>;

  /**
   * @name params Parameter requested from the server, changes will trigger a reload
   */
  params?: {
    [key: string]: any;
  };
  /**
   * @name hideInDescriptions hidden in descriptions
   */
  hideInDescriptions?: boolean;
} & Extra;
```