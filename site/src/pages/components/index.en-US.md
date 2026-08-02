---
title: Component Overview
order: 0
---

## Component Design {#component-design}

ProComponents Vue was developed to reduce the cost of implementing CRUD in the middle and backend, with the idea of reducing the necessary state maintenance and focusing more on the business.

- [ProLayout](/components/layout) solves the layout problem and provides out-of-the-box menu and breadcrumb functionality
- [ProTable](/components/table) solves table issues, abstracts web requests and table formatting
- [ProForm](/components/form) solves form issues, pre-defines common layouts and behaviors
- [ProCard](/components/card) provides card slicing and raster layout capabilities
- [ProDescriptions](/components/descriptions) provides the ability to use the same configuration as a table
- [ProSkeleton](/components/skeleton) Page level skeleton screen

<ComponentOverview></ComponentOverview>

## Configuring Use with the Web Request Library {#configuring-use-with-the-web-request-library}

ProTable, ProListy uses a new data structure which is very easy to use if you use the parameters we have agreed upon.

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

If fetch is used, you can customize fetch.

```tsx
const request = (url, options) => {
  return fetch(url, options)
    .then((res) => res.json())
    .then((resData) => {
      return Promise.resolve({
        ... . resData,
        total: resData.sum,
        success: resData.ok,
        errorMessage: resData.message,
      });
    });
};

// when used
<ProTable request={request('/list')} />;
```

## General Configuration {#general-configuration}

ProTable, ProDescriptions share a common set of configurations that can use the same columns and requests to generate data, the only difference being that Table requires an array, while ProDescriptions only requires an object. Here are the specific configurations.

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
        dom: VueNode
      ) => VueNode)
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
   * @name formItemRender Customize the edit schema
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
