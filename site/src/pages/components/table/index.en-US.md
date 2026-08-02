---
category: Components
title: ProTable
subtitle: Advanced Table
group: Data Display
---

ProTable extends antdv-next Table with common admin-table capabilities: search form, toolbar, column settings, async request, polling, density switching, and editable rows. It is designed for business pages that need server interaction and a consistent table workflow.

## When To Use {#when-to-use}

- Table data comes from an async API and must react to pagination, sorting, and filtering.
- Search form, toolbar, column settings, and table actions should be managed together.
- Cells should reuse ProField formatting through `valueType`.
- The table needs editable rows, batch actions, or custom rendering areas.

## Examples {#examples}

<demo-group>
  <demo src="./demo/single.vue">Search Table</demo>
</demo-group>

## API

### ProTable

ProTable also passes through most antdv-next Table props.

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| columns | Column definitions with `valueType`, search, form, and edit extensions | `ProColumns<T>[]` | `[]` | - |
| request | Async data request | `(params, sort, filter) => Promise<Partial<RequestData<T>>>` | - | - |
| params | Extra request params. Changes trigger request again | `Record<string, any>` | - | - |
| dataSource | Controlled data source | `T[]` | - | - |
| defaultData | Default data source | `T[]` | - | - |
| postData | Transform loaded data | `(dataSource: T[]) => T[]` | - | - |
| search | Search form config. Set to `false` to disable | `false \| SearchConfig` | - | - |
| form | ProForm config for the search form | `ProFormProps & ProQueryFilterProps` | - | - |
| toolbar | Toolbar config | `BaseToolbarProps` | - | - |
| toolBarRender | Custom toolbar actions | `false \| ToolBarRender<T>` | - | - |
| options | Toolbar option config. Set to `false` to disable | `false \| OptionConfig` | - | - |
| columnsState | Column state config with persistence support | `ColumnStateType` | - | - |
| rowSelection | Row selection config. Set to `false` to disable | `TableRowSelection & { alwaysShowAlert?: boolean } \| false` | - | - |
| tableAlertRender | Custom selected-row alert area | `TableAlertRender<T> \| false` | - | - |
| tableAlertOptionRender | Custom selected-row actions | `TableAlertRender<T> \| false` | - | - |
| tableRender | Custom full table area renderer | `(props, defaultDom, domList) => VueNode` | - | - |
| tableViewRender | Custom raw Table view renderer | `(props, defaultDom) => VueNode` | - | - |
| tableExtraRender | Custom area between search form and table | `(props, dataSource) => VueNode` | - | - |
| searchFormRender | Custom search form area | `(props, defaultDom) => VueNode` | - | - |
| manualRequest | Trigger first request manually | `boolean` | `false` | - |
| polling | Polling interval or interval resolver | `number \| ((dataSource: T[]) => number)` | - | - |
| debounceTime | Request debounce time | `number` | - | - |
| revalidateOnFocus | Re-request when window regains focus | `boolean` | `false` | - |
| dateFormatter | Date submit formatter | `'string' \| 'number' \| false \| ((value, valueType) => string \| number)` | `'string'` | - |
| beforeSearchSubmit | Transform search params before submit | `(params) => any` | - | - |
| columnEmptyText | Empty value placeholder | `ProFieldEmptyText` | `-` | - |
| editable | Editable row config | `RowEditableConfig<T>` | - | - |
| cardProps | Outer card config. Set to `false` to disable | `ProCardProps \| false` | - | - |
| cardBordered | Border config for search and table cards | `boolean \| { search?: boolean; table?: boolean }` | - | - |
| ghost | Remove card background and padding | `boolean` | `false` | - |
| headerTitle | Toolbar title | `VueNode` | - | - |
| tooltip | Tooltip beside title | `string \| FormItemTooltipType` | - | - |
| size | Table density | `'large' \| 'middle' \| 'small'` | - | - |
| defaultSize | Default table density | `'large' \| 'middle' \| 'small'` | - | - |
| name | Field name for editable table | `NamePath` | - | - |

#### ProColumns

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Column title and search form label | `VueNode \| ((schema, type, dom) => VueNode)` | - | - |
| dataIndex | Data field | `string \| string[]` | - | - |
| valueType | Field type for display and form control | `ProFieldValueType \| ProFieldValueObjectType` | `'text'` | - |
| valueEnum | Enum config | `Map \| Record` | - | - |
| initialValue | Search form initial value | `any` | - | - |
| search | Search form config. Set to `false` to hide | `false \| { transform: SearchTransformKeyFn }` | - | - |
| hideInTable | Hide in table | `boolean` | `false` | - |
| hideInForm | Hide in form | `boolean` | `false` | - |
| hideInSetting | Hide in column setting | `boolean` | `false` | - |
| copyable | Enable copy | `boolean` | `false` | - |
| ellipsis | Enable ellipsis | `boolean \| ColumnType['ellipsis']` | `false` | - |
| filters | Header filters | `boolean \| ColumnFilterItem[]` | - | - |
| sorter | Sorter config | `boolean \| CompareFn \| { compare?: CompareFn; multiple?: number }` | - | - |
| order | Search form order. Larger value comes first | `number` | - | - |
| colSize | Search form span size | `number` | `1` | - |
| editable | Whether the cell is editable | `boolean \| ProTableEditableFnType<T>` | - | - |
| readonly | Readonly in edit form | `boolean` | `false` | - |
| render | Custom read renderer | `(...args) => VueNode` | - | - |
| renderFormItem | Custom search/edit form item renderer | `(...args) => VueNode` | - | - |

#### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Triggered by pagination, filter, or sorter changes | `(pagination, filters, sorter, extra) => void` | - |
| load | Triggered after data is loaded | `(dataSource: T[]) => void` | - |
| loadingChange | Triggered when loading changes | `(loading: boolean \| SpinProps \| undefined) => void` | - |
| requestError | Triggered when request fails | `(error: Error) => void` | - |
| submit | Triggered when search form submits | `(params) => void` | - |
| reset | Triggered when search form resets | `() => void` | - |
| dataSourceChange | Triggered when data source changes | `(dataSource: T[]) => void` | - |
| sizeChange | Triggered when density changes | `(size: DensitySize) => void` | - |

#### Methods {#methods}

Methods are exposed on the component instance.

| Method | Description | Type | Version |
| --- | --- | --- | --- |
| reload | Request data again | `() => Promise<void>` | - |
| reset | Reset search and request again | `() => Promise<void>` | - |
| fullScreen | Toggle fullscreen | `() => Promise<void>` | - |
| setPageInfo | Set pagination state | `(pageInfo: Partial<PageInfo>) => Promise<void>` | - |
| scrollTo | Scroll to a row or position | `(arg: number \| { index?: number; key?: Key; top?: number }) => void` | - |
| focus | Focus table container | `() => void` | - |
