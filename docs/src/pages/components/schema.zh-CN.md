---
title: 通用配置总览
order: 1
---

在 `ProComponents Vue` 项目中，对于组件我们使用了与 table 相同的定义，同时扩展了部分字段，让其可以满足更多需求。

| 字段名称 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `Key` | 确定这个列的唯一值，一般用于 dataIndex 重复的情况 |
| `dataIndex` | `Key` \| `Key[]` | 与实体映射的 key，数组会被转化 `[a,b] => Entity.a.b` |
| `valueType` | `ProFieldValueType` | 数据的渲染方式，我们自带了一部分，你也可以自定义 valueType |
| `title` | `VueNode` \|`(props,type,dom)=> VueNode` | 标题的内容，在 form 中是 label |
| `tooltip` | `string` | 会在 title 旁边展示一个 icon，鼠标浮动之后展示 |
| `valueEnum` | `(Entity)=> ValueEnum` \| `ValueEnum` | 支持 object 和 Map，Map 是支持其他基础类型作为 key |
| `fieldProps` | `(form,config)=>fieldProps`\| `fieldProps` | 传给渲染的组件的 props，自定义的时候也会传递 |
| `formItemProps` | `(form,config)=>formItemProps` \| `formItemProps` | 传递给 Form.Item 的配置 |
| `renderText` | `(text: any, record: Entity, index: number, action: ProCoreActionType) => any` | 修改的数据是会被 valueType 定义的渲染组件消费 |
| `render` | `(dom,entity,index, action, schema) => VueNode` | 自定义只读模式的 dom,`render` 方法只管理的只读模式，编辑模式需要使用 `formItemRender` |
| `formItemRender` | `(schema,config,form) => VueNode` | 自定义编辑模式，返回一个 VueNode，会自动包裹 value 和 onChange |
| `request` | `(params,props) => Promise<{label,value}[]>` | 从远程请求网络数据，一般用于选择类组件 |
| `params` | `Record<string, any>` | 额外传递给 `request` 的参数，组件不做处理，但是变化会引起`request` 重新请求数据 |
| `hideInForm` | `boolean` | 在 Form 中隐藏 |
| `hideInTable` | `boolean` | 在 Table 中隐藏 |
| `hideInDescriptions` | `boolean` | 在 descriptions 中隐藏 |
| `rowProps` | [RowProps](https://antdv-next.cn/components/grid/#Row) | 在开启 `grid` 模式时传递给 Row，仅在`ProFormGroup`, `ProFormList`, `ProFormFieldSet` 中有效 |
| `colProps` | [ColProps](https://antdv-next.cn/components/grid/#Col) | 在开启 `grid` 模式时传递给 Col |

## TypeScript 定义 {#typescript-definitions}

```ts
export type ProSchema<T = unknown, U = string, Extra = unknown> = {
  /** @name key 确定这个列的唯一值 */
  key?: string | number;
  /**
   * 支持一个数组，[a,b] 会转化为 obj.a.b
   *
   * @name dataIndex 与实体映射的key
   */
  dataIndex?: string | number | (string | number)[];
  /** 选择如何渲染相应的模式 */
  valueType?: ((entity: T, type: ProSchemaComponentTypes) => U) | U;

  /**
   * 支持 VueNode
   *
   * @name title 标题
   */
  title?:
    | ((
        schema: ProSchema<T, U, Extra>,
        type: ProSchemaComponentTypes,
        dom: VueNode,
      ) => VueNode)
    | VueNode;

  /** @name tooltip 展示一个 icon，hover 是展示一些提示信息 */
  tooltip?: string | LabelTooltipType;

  render?: (
    dom: VueNode,
    entity: T,
    index: number,
    action: ProCoreActionType,
    schema: ProSchema<T, U, Extra>,
  ) => VueNode;

  /**
   * 返回一个node，会自动包裹 value 和 onChange
   *
   * @name formItemRender 自定义编辑模式
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
   * 必须要返回 string
   *
   * @name renderText 自定义 render
   */
  renderText?: (
    text: any,
    record: T,
    index: number,
    action: ProCoreActionType,
  ) => any;

  fieldProps?: any;
  /** @name valueEnum 映射值的类型 */
  valueEnum?: ProSchemaValueEnumObj | ProSchemaValueEnumMap;

  /** @name request 从服务器请求枚举 */
  request?: ProFieldRequestData<ProSchema>;

  /** @name params 从服务器请求的参数，改变了会触发 reload */
  params?: {
    [key: string]: any;
  };
  /** @name hideInDescriptions 隐藏在 descriptions */
  hideInDescriptions?: boolean;
} & Extra;
```

## valueType 列表 {#valueType-list}

<demo src="./schema-form/demo/value-type.vue">schema 表单</demo>

valueType 是 ProComponents Vue 的灵魂，ProComponents Vue 会根据 valueType 来映射成不同的表单项。以下是支持的常见表单项：

| valueType       | 说明                         |
| --------------- | ---------------------------- |
| `password`      | 密码输入框                   |
| `money`         | 金额输入框                   |
| `textarea`      | 文本域                       |
| `date`          | 日期                         |
| `dateTime`      | 日期时间                     |
| `dateWeek`      | 周                           |
| `dateMonth`     | 月                           |
| `dateQuarter`   | 季度输入                     |
| `dateYear`      | 年份输入                     |
| `dateRange`     | 日期区间                     |
| `dateTimeRange` | 日期时间区间                 |
| `time`          | 时间                         |
| `timeRange`     | 时间区间                     |
| `text`          | 文本框                       |
| `select`        | 下拉框                       |
| `treeSelect`    | 树形下拉框                   |
| `checkbox`      | 多选框                       |
| `rate`          | 星级组件                     |
| `radio`         | 单选框                       |
| `radioButton`   | 按钮单选框                   |
| `progress`      | 进度条                       |
| `percent`       | 百分比组件                   |
| `digit`         | 数字输入框                   |
| `second`        | 秒格式化                     |
| `avatar`        | 头像                         |
| `code`          | 代码框                       |
| `switch`        | 开关                         |
| `fromNow`       | 相对于当前时间               |
| `image`         | 图片                         |
| `jsonCode`      | 代码框，但是带了 json 格式化 |
| `color`         | 颜色选择器                   |
| `cascader`      | 级联选择器                   |
| `segmented`     | 分段器                       |
| `group`         | 分组                         |
| `formList`      | 表单列表                     |
| `formSet`       | 表单集合                     |
| `divider`       | 分割线                       |
| `dependency`    | 依赖项                       |

这里的 demo 可以来了解一下各个 valueType 的展示效果。

### 传入 function {#function}

只有一个值并不能表现很多类型，`progress` 就是一个很好的例子。所以我们支持传入一个 function。你可以这样使用：

```ts
const columns = {
  title: '进度',
  key: 'progress',
  dataIndex: 'progress',
  valueType: (item: T) => ({
    type: 'progress',
    status: item.status !== 'error' ? 'active' : 'exception',
  }),
};
```

### 支持的返回值 {#supported-return-value}

#### progress

```js
return {
  type: 'progress',
  status: 'success' | 'exception' | 'normal' | 'active',
};
```

#### money 

```js
return { type: 'money', locale: 'en-US' };
```

#### percent

```js
return { type: 'percent', showSymbol: true | false, precision: 2 };
```

如果我们带的 valueType 不能满足需求，我们可以用自定义 valueType 来自定义业务组件。

### 自定义 valueType {#customization-value-type}

<!--<code src="./customization-value-type.tsx" title="schema 表单"></code>-->

### valueEnum

valueEnum 需要传入一个枚举，ProTable 会自动根据值获取响应的枚举，并且在 form 中生成一个下拉框。看起来是这样的：

```ts
const valueEnum = {
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
  },
};

// 也可以设置为一个function
const valueEnum = (row) =>
  row.isMe
    ? {
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      }
    : {
        open: {
          text: '等待解决',
          status: 'Error',
        },
        closed: {
          text: '已回应',
          status: 'Success',
        },
      };
```

> 这里值得注意的是在 form 中并没有 row，所以 row 的值为 null，你可以根据这个来判断要在 form 中显示什么选项。

当前列值的枚举

```ts
interface IValueEnum {
  [key: string]:
    | VueNode
    | {
        text: VueNode;
        status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
      };
}
```

使用 Map 来让 valueEnum 更灵活，某些场景会用到 number 类型或者 boolean 类型，例如：

<!--<code src="./valueEnum-map.tsx" title="使用Map的valueEnum"></code>-->

## 远程数据 {#remote-data}

支持组件 `Select`, `TreeSelect`, `Cascader`, `Checkbox`, `Radio`, `RadioButton`

支持参数 `request`,`params`,`fieldProps.options`, `valueEnum` 来支持远程数据，这几个属性分别有不同的用法。

### valueEnum

valueEnum 是最基础的用法， 它支持传入一个 [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 或者是 [`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)，相比于 options 支持更加丰富的定义，比如在表格中常见的各种 [badge](https://www.antdv-next.cn/components/badge-cn#props)。

```ts
const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
  },
};
```

```tsx
import { defineComponent } from 'vue';
import { ProFormSelect } from '@antdv-next1/pro-components';

const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
  },
};

export default defineComponent(() =>{
 return () =>  (
  <ProFormSelect
    name="select2"
    label="Select"
    params={{}}
    valueType="select"
    valueEnum={valueEnum}
    placeholder="Please select a country"
  />
)
});
```

### fieldProps.options

options 是 Antdv Next 定义的标准，但是只有部分组件支持， ProComponents Vue 扩展了组件，使得 `select`, `checkbox`, `radio`, `radioButton` 都支持了 `options`, 他们的用法是相同的。

```ts
const options = [
  { label: '全部', value: 'all' },
  { label: '未解决', value: 'open' },
  { label: '已解决', value: 'closed' },
  { label: '解决中', value: 'processing' },
  {
    label: '特殊选项',
    value: 'optGroup',
    optionType: 'optGroup',
    options: [
      { label: '不解决', value: 'no' },
      { label: '已废弃', value: 'clear' },
    ],
  },
];

// 或者不需要 label
const options = ['chapter', 'chapter2'];

// 列中定义
const columns = [
  {
    title: '创建者',
    width: 120,
    dataIndex: 'creator',
    valueType: 'select',
    fieldProps: {
      options: [
        {
          label: 'item 1',
          value: 'a',
        },
        {
          label: 'item 2',
          value: 'b',
        },
        {
          label: 'item 3',
          value: 'c',
        },
      ],
    },
  },
];
```

```tsx
import { defineComponent } from 'vue';
import { ProFormSelect } from '@antdv-next1/pro-components';

const options = [
  {
    label: 'item 1',
    value: 'a',
  },
  {
    label: 'item 2',
    value: 'b',
  },
  {
    label: 'item 3',
    value: 'c',
  },
];

export default defineComponent(() =>{
  return () => (
  <ProFormSelect
    name="select2"
    label="Select"
    valueType="select"
    fieldProps={{ options }}
    placeholder="Please select a country"
  />
)
});
```

### request 和 params {#request-params}

> 可以使用 debounceTime 调整请求防抖时间，默认为 10ms

大部分时候我们是从网络中获取数据，但是获取写一个 hooks 来请求数据还是比较繁琐的，同时还要定义一系列状态，所以我们提供了 `request` 和 `params` 来获取数据。

- `request` ：是一个 promise，需要返回一个 options 相同的数据
- `params` ：一般而言 `request` 是惰性的，`params` 修改会触发 `request` 的重新请求。

```tsx
const request = async () => [
  { label: '全部', value: 'all' },
  { label: '未解决', value: 'open' },
  { label: '已解决', value: 'closed' },
  { label: '解决中', value: 'processing' },
];

<ProFormSelect
  name="select2"
  label="Select"
  params={{}}
  valueType="select"
  debounceTime={1000}
  request={request}
  placeholder="Please select a country"
/>;

// 列中定义
const columns = [
  {
    title: '创建者',
    width: 120,
    dataIndex: 'creator',
    valueType: 'select',
    request,
    params: {},
  },
];
```

```tsx
import { defineComponent } from 'vue';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@antdv-next1/pro-components';

const request = async (params) => {
  console.log(params);
  return [
    { label: params.text, value: 'all' },
    { label: '未解决', value: 'open' },
    { label: '已解决', value: 'closed' },
    { label: '解决中', value: 'processing' },
  ];
};

export default defineComponent(() => {
  return () => (
  <ProForm>
    <ProFormText label="相互依赖的" initialValue="所有的" name="text" />
    <ProFormSelect
      name="select2"
      label="Select"
      valueType="select"
      dependencies={['text']}
      request={request}
      placeholder="Please select a country"
    />
  </ProForm>
)
});
```

在实际的使用中 `request` 增加了一个 5s 缓存，可能会导致数据更新不及时。如果需要频繁更新，建议使用 `state`+`fieldProps.options`。
