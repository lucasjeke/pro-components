---
category: Components
title: ProForm
subtitle: 高级表单
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group:
  title: 数据录入
  order: 1
---

ProForm 在原来的 Form 的基础上增加了一些语法糖和更多的布局设置，帮助我们快速地开发一个表单，同时添加了一些默认行为，让我们的表单默认好用。

分步表单、Modal 表单、Drawer 表单、查询表单、轻量筛选等多种 layout 可以覆盖大部分的使用场景，让我们脱离复杂而且繁琐的表单布局工作，用更少的代码完成更多的功能。

- 如果想要设置默认值，请使用 `model`，任何直接使用组件 `value` 和 `change` 事件的方式都有可能导致值绑定失效
- 如果想要表单联动或者做一些依赖，可以使用 render props 模式，ProFormDependency 绝对是最好的选择
- ProForm 的 `finish` 事件与 Antdv Next 的 Form 不同，支持 Promise，如果你正常返回会自动为你设置按钮的加载效果
- 如果想要监听某个值，建议使用 `valuesChange` 事件。保持单向的数据流无论对开发者还是维护者都大有裨益
- ProForm 没有黑科技，只是 Antdv Next 的 Form 的封装，如果要使用自定义的组件可以用 FormItem 包裹后使用，支持混用

```vue
<script lang="ts" setup>
import { Switch } from 'antdv-next'
import { ProForm, ProFormText, ProFormSelect } from '@antdv-next1/pro-form'
import { FormItem } form '@antdv-next1/pro-utils;'
</script>
<template>
  <!-- 设置整体默认值 -->
  <ProForm :model="obj" />
  <!-- 设置单个控件的 -->
   <ProForm @valuesChange="(changeValues) => console.log(changeValues)">
    <ProFormText initialValue="prop"/>
  </ProForm>
  <!-- 相互依赖的组件联动 -->
   <ProForm>
     <FormItem noStyle>
      <template #default={form}>
        <ProFormSelect
          :options="[
            {
              value: "chapter",
              label: "盖章后生效",
            },
          ]"
          width="md"
          name="useMode"
          :label="`与${form.getFieldValue("name")}合同约定生效方式`"
        />
      </template>
     </FormItem>
   </ProForm>
    <!-- 使用自定义组件 -->
    <ProForm>
       <FormItem name="switch" label="Switch" valuePropName="checked">
          <Switch />
       </FormItem>
    </ProForm>
</template>
```

## 何时使用 {#when-to-use}

当你想快速实现一个表单但不想花太多时间去布局时 ProForm 是最好的选择。

ProForm 是基于 Antdv Next Form 的可降级封装，与 Antdv Next 功能完全对齐，但是在其之上还增加一些预设行为和多种布局。这些布局之间可以无缝切换，并且拥有公共的 API。

| 布局 | 使用场景 |
| --- | --- |
| [ProForm](/components/form#proform) | 标准 Form，增加了 `finish` 中自动 `loading` 和根据 `request` 自动获取默认值的功能 |
| [ModalForm\|DrawerForm](/components/modal-form) | 在 ProForm 的基础上增加了 `trigger` ，无需维护 `open` 状态。 |
| [QueryFilter](/components/query-filter) | 一般用于作为筛选表单，需要配合其他数据展示组件使用。 |
| [LightFilter](/components/query-filter) | 一般用于作为行内内置的筛选，比如卡片操作栏和表格操作栏。 |
| [StepsForm](/components/steps-form) | 分步表单，需要配置 StepForm 使用。 |

## 代码演示 {#examples}

<demo-group>
    <demo src="./demo/basic.vue">基本使用</demo>
    <demo src="./demo/layout-change.vue">Form 的 layout 切换</demo>
    <demo src="./demo/form-layout.vue">标签与表单项布局</demo>
    <demo src="./demo/form-layout-grid.vue">栅格化布局</demo>
    <demo src="./demo/dependency.vue">表单联动</demo>
    <demo src="./demo/formRef.vue">表单方法调用</demo>
    <demo src="./demo/sync-to-url.vue">同步提交结果到 url</demo>
    <demo src="./demo/money.vue">金额</demo>
</demo-group>

## API

### ProForm

ProForm 是对 Antdv Next Form 的再封装，如果你想要自定义表单元素，ProForm 与 Antdv Next 的方法是相同的，你仍然可以用 FormItem + 自定义组件的方式来自定义。当然这样不会影响到别的组件，QueryFilter 等组件同理。

> Antdv Next 的 Form api 查看[这里](https://www.antdv-next.cn/components/form-cn/) model 相关知识查看[这里](https://procomponents.ant.design/docs/faq)

#### 属性 {#form-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| submitter | 提交按钮相关配置 | `SubmitterProps<{form?: FormInstance }> \| false` | `true` | - |
| loading | 表单按钮的 loading 状态 | `boolean` | - | - |
| syncToUrl | 同步参数到 url 上，url 只支持 string，在使用之前最好读一下[url 中的参数类型](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | `boolean \| ((values: Record<string, any>, type: 'get' \| 'set') => any)` | - | - |
| syncToUrlAsImportant | 当 syncToUrl 为 true，在页面回显示时，以url上的参数为主，默认为false | `boolean` | `false` | - |
| extraUrlParams | 额外的 url 参数 | `Record<string, any>` | - | - |
| syncToModel | 同步结果到 model，默认为 true，如果为 false，form.reset 的时候将会忽略从 url 上获取的数据 | `boolean` | `true` | - |
| omitNil | ProForm 会自动清空 null 和 undefined 的数据，如果你约定了 nil 代表某种数据，可以设置为 false 关闭此功能 | `boolean` | `true` | - |
| dateFormatter | 自动格式化数据，主要是 dayjs 的表单，支持 string 和 number 两种模式，此外还支持指定函数进行格式化。 | `string \| 'string' \| 'number' \| ((value: dayjs.Dayjs, valueType: string) => string \| number) \| false` | `string` | - |
| params | 发起网络请求的参数，与 request 配合使用 | `Record<string, any>` | - | - |
| request | 发起网络请求的参数，返回值会覆盖给 model | `ProRequestData<any, any>` | - | - |
| isKeyPressSubmit | 是否使用回车提交 | `boolean` | - | - |
| formKey | 用于控制form 是否相同的key，高阶用法 | `string` | - | - |
| autoFocusFirstInput | 自动 focus 表单第一个输入框，只对有 input 的类型有效 | `boolean` | `true` | - |
| readonly | 是否只读模式，对所有表单项生效，优先低于表单项的 readonly | `boolean` | - | - |
| grid | 开启栅格化模式，宽度默认百分比，请使用 `colProps` 控制宽度 [查看示例](components/form-cn#form-demo-form-layout-grid) | `boolean` | `false` | - |
| rowProps | 开启 `grid` 模式时传递给 `Row`, 仅在`ProFormGroup`, `ProFormList`, `ProFormFieldSet` 中有效 | [RowProps](https://www.antdv-next.cn/components/grid-cn#row) | `{ gutter: 8 }` | - |
| colProps | 开启 `grid` 模式时传递给 `Col`, 仅在`ProFormGroup`, `ProFormList`, `ProFormFieldSet` 中有效 | [ColProps](https://www.antdv-next.cn/components/grid-cn/#col) | `{ xs: 24 }` | - |
| [(...)](https://www.antdv-next.cn/components/form-cn/) | 注意 `LightFilter` 和 `QueryFilter` 仅支持除 `wrapperCol` \| `labelCol` \| `layout` 外的其他 Antdv Next `Form` 组件参数 | - | - | - |

#### 事件 {#form-events}

| 事件名 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| finish | 提交表单且数据验证成功后回调事件，支持 Promise，会自动设置按钮的加载效果 | `(formData: T) => Promise<boolean \| void> \| void` | - |
| rest | 点击重置按钮的回调 | `(e) => void` | - |
| loadingChange | loading 状态改变时的回调 | `(loading: boolean) => void` | - |
| init | 表单初始化成功，比如布局，label等计算完成 | `(values: T, form: ProFormInstance) => void` | - |

#### 方法 {#form-methods}

```ts
import type { ProFormInstance } from '@antdv-next1/pro-form'
const formRef = useTemplateRef<ProFormInstance>('form')
```

`ProFormInstance` 在原先 `FormInstance` 的基础上增加了如下方法：

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| getFieldsFormatValue | 使用方法与 FormInstance 的 getFieldsValue 方法相同，获取被 ProForm 格式化后的所有数据 | `(nameList?: true, omitNil?: boolean) => T` | - |
| getFieldFormatValue | 使用方法与 FormInstance 的 getFieldValue 方法相同，获取被 ProForm 格式化后的单个数据 | `(nameList?: NamePath) => T` | - |
| getFieldFormatValueObject | 使用方法与 FormInstance 的 getFieldValue 方法相同，获取被 ProForm 格式化后的单个数据, 包含他的 name | `(nameList?: NamePath) => T` | - |
| validateFieldsReturnFormatValue | 使用方法与 FormInstance 的 validateFields 方法相同，校验字段后返回格式化之后的所有数据 | `(nameList?: NamePath[]) => Promise<T>` | - |

### ProFormGroup

#### 属性 {#form-group-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 标题 | `string` | - | - |
| tooltip | 标题旁边的？号提示展示的信息 | `FormItemTooltipType | `string` | - |
| extra | 额外的内容配置,在标题的另外一边 | `VueNode` | - | - |
| size | size 组件之前的间隔 | `[Size](https://www.antdv-next.cn/components/space-cn#size)` | `small` | - |
| titleStyle | 自定义 title 样式 | `CSSProperties` | - | - |
| titleRender | 自定义title渲染 | `(title: VueNode, props: ProFormBaseGroupProps) => VueNode` | - | - |
| orientation | 子项的排列方式 | `'horizontal' \| 'vertical'` | `horizontal` | - |
| labelLayout | 布局方式，键值对模式和两行模式 | `'inline' \| 'twoLine'` | `inline` | - |
| collapsed | 是否折叠 | `boolean` | - | - |
| collapsible | 是否可折叠 | `boolean` | - | - |
| defaultCollapsed | 默认的折叠状态 | `boolean` | - | - |
| autoFocus | 自定选中一个input，只能有一个生效 | `boolean` | - | - |
| grid | 开启栅格化模式，宽度默认百分比，请使用 `colProps` 控制宽度 [查看示例](components/form-cn#form-demo-form-layout-grid) | `boolean` | - | - |
| rowProps | 开启 `grid` 模式时传递给 `Row` | [RowProps](https://www.antdv-next.cn/components/grid-cn#row) | - | - |
| colProps | 开启 `grid` 模式时传递给 `Col` | [ColProps](https://www.antdv-next.cn/components/grid-cn/#col) | - | - |

#### 事件 {#form-group-event}

| 事件名 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| collapse | 折叠修改的事件 | `(collapsed: boolean) => void` | - |

### Submitter

虽然我们希望不要对 submitter 进行修改，但在使用中修改是很常见的需求，ProForm 的各个组件都使用了同样的 API 来支持需求。

#### 属性 {#submitter-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| searchConfig | 搜索的配置，一般用来配置文本 | `{resetText: string,submitText: string}` | - | - |
| submitButtonProps | 提交按钮的 props | [ButtonProps](https://www.antdv-next.cn/components/button-cn/) | - | - |
| resetButtonProps | 重置按钮的 props | [ButtonProps](https://www.antdv-next.cn/components/button-cn/) | - | - |
| render | 自定义操作的渲染 | `false \| (props: Record<string, any>, dom: VueNode[])=>VueNode[]` | - | - |

> render 的第二个参数是默认的 dom 数组，第一个是提交按钮，第二个是重置按钮。

```vue
<script setup lang="ts">
import { ProForm } from '@antdv-next1/pro-form'
</script>

<template>
  <ProForm :submitter="{
    // 配置按钮文本
    searchConfig: {
      resetText: '重置',
      submitText: '提交',
    },
     // 配置按钮的属性
    resetButtonProps: {
      style: {
        // 隐藏重置按钮
        display: 'none',
      },
    },
    submitButtonProps: {},
     // 完全自定义整个区域
    render: (props, doms) => {
      console.log(props);
      return [
        h(Button, { key: 'rest', onClick: ()=> props.form?.resetFields() }, ()=> '重置')
        h(Button, { type: 'primary', key: 'submit', onClick: ()=>props.form?.submit() }, ()=> '提交')
      ]
    }
  }">
  </ProForm>
</template>

<style scoped></style>
```

#### 事件 {#submitter-events}

| 事件名 | 说明 | 类型 | 版本 |
| ----- | --- | --- | --- |
| submit | 提交方法 | `()=>void` | - |
| reset | 重置方法 | `()=>void` | - |

## 数据转化 {#data-conversion}

很多时候组件需要的数据和后端需要的数据之间不能完全匹配，ProForm 为了解决这个问题提供了 `transform` 和 `convertValue` 两个 API 来处理这种情况。

### convertValue 前置转化 {#convertvalue-pre-conversion}

convertValue 发生在组件获得数据之前，一般是后端直接给前端的数据，有时需要精加工一下。

```ts
  export type SearchConvertKeyFn =
    (value: any, field: NamePath)=>string | boolean | Record<string, any>;
  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   * @param value 字段的值
   * @param namePath 字段的name
   * @returns 字段新的值
   *
   * @example a,b => [a,b]
   * convertValue:(value,namePath)=>value.split(",")
   * @example string =>json
   * convertValue:(value,namePath)=>JSON.parse(value)
   * @example number =>date
   * convertValue:(value,namePath)=>Moment(value)
   * @example YYYY-MM-DD => date
   * convertValue:(value,namePath)=>Moment(value,"YYYY-MM-DD")
   * @example  string => object
   * convertValue:(value,namePath)=>({value,label:value})
   */
  convertValue?: SearchConvertKeyFn;
```

### transform 提交时转化 {#transform-when-submitting}

transform 发生在提交的时候，一般来说都是吐给后端的存在数据库里的数据。

为了方便大家使用，`ProFormDependency` 和 `formRef` 都支持了 `transform`，可以获取到被转化后的值。

```vue
<script setup lang="ts">
import { ProFormDependency, ProFormText } from '@antdv-next1/pro-form'
</script>

<template>
  <ProFormDependency>
    <template #default="{value, form}">
     <!-- value 被 transform转化之后的值 -->
     <!-- form 当前的formRef，可以获取未转化的值 -->
      <ProFormText />
    </template>
</ProFormDependency>
</template>
```

formRef 内置了几个方法来获取转化之后的值，这也是相比  Antdv Next 的 Form 新增的功能，详细可以看 ProFormInstance 的类型定义。

```ts
  /** 获取被 ProForm 格式化后的所有数据  */
  getFieldsFormatValue?: (nameList?: true) => T;
  /** 获取格式化之后的单个数据 */
  getFieldFormatValue?: (nameList?: NamePath) => T;
  /** 获取格式化之后的单个数据 */
  getFieldFormatValueObject?: (nameList?: NamePath) => T;
  /** 验字段后返回格式化之后的所有数据*/
  validateFieldsReturnFormatValue?: (nameList?: NamePath[]) => Promise<T>;
```

```ts
  export type SearchTransformKeyFn = (
    value: any,
    namePath: string[],
    allValues: any,
  ) => string | Record<string, any>;

  /**
   * @name 提交时转化值，一般用于将值转化为提交的数据
   * @param value 字段的值
   * @param namePath 字段的name
   * @param allValues 所有的字段
   * @returns 字段新的值，如果返回对象，会和所有值深度 merge 一次
   *
   * @example {name:[a,b] => {name:a,b }
   * transform: (value,namePath,allValues)=> value.join(",")
   * @example {name: string => { newName:string }
   * transform: (value,namePath,allValues)=> { newName:value }
   * @example {name:moment} => {name:string
   * transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
   * @example {name:moment}=> {name:时间戳}
   * transform: (value,namePath,allValues)=> value.valueOf()
   * @example {name:{value,label}} => { name:string}
   * transform: (value,namePath,allValues)=> value.value
   * @example {name:{value,label}} => { valueName,labelName  }
   * transform: (value)=>{valueName:value.value,labelName:value.name}
   */
  transform?: SearchTransformKeyFn;
```

#### transform 的两种常见返回写法（建议直接照着用）{#two-common-return-patterns-for-transform-recommended}

`transform` 的返回值常见有两种写法：

- **1）返回普通值（最直观，也最稳定）**：会替换当前字段的提交值。

```vue
<script setup lang="ts">
import { ProFormText } from '@antdv-next1/pro-form'
</script>

<template>
<ProFormText name="name" :transform="(value) => `${value}:suffix`" />
 <!-- 提交时：{ name: 'xxx:suffix' } -->
</template>
```

- **2）返回对象（用于“改名/拆分字段/写回嵌套路径”）**：推荐按字段的 `name` / `namePath` 构造对象，避免“看起来对但提交没变”的情况。

```vue
<script setup lang="ts">
import { set } from '@v-c/util'
import { ProFormText } from '@antdv-next1/pro-form'
</script>

<template>
  <!-- 写回同一路径（推荐：不依赖外层 merge 行为） -->
   <ProFormText
    :name="['company', 'name']"
    :transform="(value) => set({}, ['company', 'name'], `${value}:suffix`)"
  />
  <!-- 提交时：{ company: { name: 'xxx:suffix' } } -->
  <!-- 变更 key（示例：把 name 写成 displayName） -->
   <ProFormText
    name="name"
    :transform="(value) => ({ displayName: value })"
  />
 <!-- 提交时：{ displayName: 'xxx' }（注意：这会改变最终输出结构） -->
</template>
```

> 提醒：`SearchTransformKeyFn` 的类型签名里第二个参数是 `namePath: string[]`，但在部分场景（例如嵌套、`ProFormList`）里你可能会观察到传入值并不总是你期望的“完整路径数组”。这也是推荐你**直接用组件的 `name` 构造返回对象**的原因。
