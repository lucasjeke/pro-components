---
category: Components
title: Query/LightFilter
subtitle: Filter Form
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Data Entry
---

QueryFilter and LightFilter are ProForm layouts for filtering. QueryFilter is suitable for multi-condition search above tables and lists; LightFilter is for compact inline filtering in toolbars or card headers.

## When To Use {#when-to-use}

- A filter form is used with ProTable, ProListy, or another data display component.
- Many query fields need responsive collapse and expand behavior.
- A compact inline or popover-based filter is needed.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Query filter</demo>
  <demo src="./demo/default-collapsed.vue">Default collapsed</demo>
  <demo src="./demo/vertical.vue">Vertical layout</demo>
  <demo src="./demo/search.vue">Search</demo>
  <demo src="./demo/defaultFormItemsNumber.vue">Default visible count</demo>
  <demo src="./demo/light-filter.vue">Light filter</demo>
  <demo src="./demo/footer.vue">Custom footer</demo>
  <demo src="./demo/bordered.vue">Light filter border</demo>
  <demo src="./demo/collapse.vue">Light filter collapse</demo>
  <demo src="./demo/placement.vue">Popover placement</demo>
</demo-group>

## API

### QueryFilter

QueryFilter inherits most ProForm props.

#### Props {#query-filter-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultCollapsed | Default collapsed state | `boolean` | `true` | - |
| layout | Form layout | `'horizontal' \| 'inline' \| 'vertical'` | - | - |
| defaultColsNumber | Default number of fields per row | `number` | - | - |
| defaultFormItemsNumber | Default number of visible fields | `number` | - | - |
| labelWidth | Label width | `number \| 'auto'` | - | - |
| split | Show divider in vertical layout | `boolean` | `false` | - |
| span | Grid column config | `number \| { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number }` | - | - |
| searchText | Search button text | `string` | - | - |
| resetText | Reset button text | `string` | - | - |
| searchGutter | Search grid gutter | `RowProps['gutter']` | - | - |
| optionRender | Custom bottom actions | `OptionRender` | - | - |
| ignoreRules | Ignore Form.Item rules | `boolean` | `false` | - |
| showHiddenNum | Show hidden field count | `boolean` | `false` | - |
| submitterColSpanProps | Submitter Col config | `ColProps & { span?: number }` | - | - |
| containerStyle | Container style | `CSSProperties` | - | - |

#### Events {#query-filter-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| reset | Triggered when reset | `(values) => void` | - |
| finish | Triggered when submit | `(values) => void \| Promise<void>` | - |
| valuesChange | Triggered when values change | `(changedValues, values) => void` | - |

### LightFilter

#### Props {#light-filter-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapse | Collapse into a popover filter | `boolean` | `false` | - |
| collapseLabel | Label in collapsed state | `VueNode` | - | - |
| variant | Style variant | `'outlined' \| 'filled' \| 'borderless'` | - | - |
| ignoreRules | Ignore rules | `boolean` | `false` | - |
| footerRender | Custom popover footer | `LightFilterFooterRender` | - | - |
| placement | Popover placement | `TooltipPlacement` | `'bottomLeft'` | - |
| popoverProps | Popover props in collapsed state | `PopoverProps` | - | - |
