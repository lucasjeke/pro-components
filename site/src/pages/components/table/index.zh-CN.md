---
category: Components
title: ProTable
subtitle: 高级表格
group: 数据展示
---

ProTable 在 antdv-next Table 之上封装了查询表单、工具栏、列设置、数据请求、轮询、密度切换和可编辑行等中后台表格常用能力。它适合需要与服务端交互、需要统一查询区域和表格操作区的业务页面。

## 何时使用 {#when-to-use}

- 表格数据来自异步接口，并需要分页、排序、筛选联动请求时。
- 需要把查询表单、工具栏、列设置和表格统一管理时。
- 需要通过 `valueType` 复用 ProField 的格式化展示能力时。
- 需要在表格上扩展可编辑行、批量操作或自定义区域渲染时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/single.vue">查询表格</demo>
</demo-group>

## API

### ProTable

除下列能力外，ProTable 还透传 antdv-next Table 的大部分属性。

#### 属性 {#props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| columns | 列配置，扩展了 `valueType`、搜索、表单和编辑配置 | `ProColumns<T>[]` | `[]` | - |
| request | 异步请求数据 | `(params, sort, filter) => Promise<Partial<RequestData<T>>>` | - | - |
| params | 额外请求参数，变化时会重新请求 | `Record<string, any>` | - | - |
| dataSource | 受控数据源 | `T[]` | - | - |
| defaultData | 默认数据源 | `T[]` | - | - |
| postData | 请求完成后处理数据 | `(dataSource: T[]) => T[]` | - | - |
| search | 查询表单配置，设置为 `false` 可关闭 | `false \| SearchConfig` | - | - |
| form | 查询表单的 ProForm 配置 | `ProFormProps & ProQueryFilterProps` | - | - |
| toolbar | 工具栏配置 | `BaseToolbarProps` | - | - |
| toolBarRender | 自定义工具栏操作 | `false \| ToolBarRender<T>` | - | - |
| options | 工具栏操作项配置，设置为 `false` 可关闭 | `false \| OptionConfig` | - | - |
| columnsState | 列状态配置，支持持久化 | `ColumnStateType` | - | - |
| rowSelection | 行选择配置，设置为 `false` 可关闭 | `TableRowSelection & { alwaysShowAlert?: boolean } \| false` | - | - |
| tableAlertRender | 自定义选中项提示区域 | `TableAlertRender<T> \| false` | - | - |
| tableAlertOptionRender | 自定义选中项操作区域 | `TableAlertRender<T> \| false` | - | - |
| tableRender | 自定义整个表格区域 | `(props, defaultDom, domList) => VueNode` | - | - |
| tableViewRender | 自定义原始 Table 视图 | `(props, defaultDom) => VueNode` | - | - |
| tableExtraRender | 自定义查询表单与表格之间的区域 | `(props, dataSource) => VueNode` | - | - |
| searchFormRender | 自定义查询表单区域 | `(props, defaultDom) => VueNode` | - | - |
| manualRequest | 是否手动触发首次请求 | `boolean` | `false` | - |
| polling | 轮询间隔或根据数据返回轮询间隔 | `number \| ((dataSource: T[]) => number)` | - | - |
| debounceTime | 请求防抖时间 | `number` | - | - |
| revalidateOnFocus | 窗口重新聚焦时重新请求 | `boolean` | `false` | - |
| dateFormatter | 日期提交格式化方式 | `'string' \| 'number' \| false \| ((value, valueType) => string \| number)` | `'string'` | - |
| beforeSearchSubmit | 查询提交前转换参数 | `(params) => any` | - | - |
| columnEmptyText | 空值占位 | `ProFieldEmptyText` | `-` | - |
| editable | 可编辑行配置 | `RowEditableConfig<T>` | - | - |
| cardProps | 外层卡片配置，设置为 `false` 可关闭 | `ProCardProps \| false` | - | - |
| cardBordered | 查询表单和 Table 卡片边框配置 | `boolean \| { search?: boolean; table?: boolean }` | - | - |
| ghost | 是否移除卡片背景和内边距 | `boolean` | `false` | - |
| headerTitle | 工具栏标题 | `VueNode` | - | - |
| tooltip | 标题旁提示 | `string \| FormItemTooltipType` | - | - |
| size | 表格密度 | `'large' \| 'middle' \| 'small'` | - | - |
| defaultSize | 默认表格密度 | `'large' \| 'middle' \| 'small'` | - | - |
| name | 可编辑表格字段名 | `NamePath` | - | - |

#### ProColumns

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 列标题，也作为查询表单 label | `VueNode \| ((schema, type, dom) => VueNode)` | - | - |
| dataIndex | 数据字段 | `string \| string[]` | - | - |
| valueType | 字段类型，决定展示和表单控件 | `ProFieldValueType \| ProFieldValueObjectType` | `'text'` | - |
| valueEnum | 枚举值配置 | `Map \| Record` | - | - |
| initialValue | 查询表单默认值 | `any` | - | - |
| search | 查询表单配置，设置为 `false` 可隐藏 | `false \| { transform: SearchTransformKeyFn }` | - | - |
| hideInTable | 在表格中隐藏 | `boolean` | `false` | - |
| hideInForm | 在表单中隐藏 | `boolean` | `false` | - |
| hideInSetting | 在列设置中隐藏 | `boolean` | `false` | - |
| copyable | 是否支持复制 | `boolean` | `false` | - |
| ellipsis | 是否省略显示 | `boolean \| ColumnType['ellipsis']` | `false` | - |
| filters | 表头筛选项 | `boolean \| ColumnFilterItem[]` | - | - |
| sorter | 排序配置 | `boolean \| CompareFn \| { compare?: CompareFn; multiple?: number }` | - | - |
| order | 查询表单排序，值越大越靠前 | `number` | - | - |
| colSize | 查询表单占位大小 | `number` | `1` | - |
| editable | 单元格是否可编辑 | `boolean \| ProTableEditableFnType<T>` | - | - |
| readonly | 编辑表单只读 | `boolean` | `false` | - |
| render | 自定义只读渲染 | `(...args) => VueNode` | - | - |
| renderFormItem | 自定义查询/编辑表单项 | `(...args) => VueNode` | - | - |

#### 事件 {#events}

| 事件名 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 表格分页、筛选、排序变化时触发 | `(pagination, filters, sorter, extra) => void` | - |
| load | 数据加载完成后触发 | `(dataSource: T[]) => void` | - |
| loadingChange | loading 状态变化时触发 | `(loading: boolean \| SpinProps \| undefined) => void` | - |
| requestError | 请求失败时触发 | `(error: Error) => void` | - |
| submit | 查询表单提交时触发 | `(params) => void` | - |
| reset | 查询表单重置时触发 | `() => void` | - |
| dataSourceChange | 数据源变化时触发 | `(dataSource: T[]) => void` | - |
| sizeChange | 表格密度变化时触发 | `(size: DensitySize) => void` | - |

#### 方法 {#methods}

通过组件实例可以访问 ProTable 暴露的方法。

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| reload | 重新请求数据 | `() => Promise<void>` | - |
| reset | 重置查询并重新请求 | `() => Promise<void>` | - |
| fullScreen | 切换全屏 | `() => Promise<void>` | - |
| setPageInfo | 设置分页信息 | `(pageInfo: Partial<PageInfo>) => Promise<void>` | - |
| scrollTo | 滚动到指定行或位置 | `(arg: number \| { index?: number; key?: Key; top?: number }) => void` | - |
| focus | 聚焦表格容器 | `() => void` | - |
