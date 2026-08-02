---
category: Components
title: ProFormDependency
subtitle: Dependency
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group:
  title: Data Entry
  order: 1
---

ProFormDependency watches specific fields inside ProForm and renders children with the latest values. It behaves like a no-style FormItem and is useful for dependent fields, conditional content, and dynamic form items.

## When To Use {#when-to-use}

- A form item should render based on other field values.
- Fields inside FormList need row-level dependency values.
- You need formatted field values and the form instance.

## Examples {#examples}

<demo-group>
  <demo src="./demo/dependency.vue">Dependency</demo>
</demo-group>

## API

### ProFormDependency

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | Dependency field paths | `NamePath[]` | - | - |
| originDependencies | Original dependency paths for shaping returned values | `NamePath[]` | `name` | - |
| ignoreFormListField | Ignore current FormList prefix and read from global form values | `boolean` | `false` | - |

### Notes {#notes}

The default slot receives `{ values, form }`, where `values` contains dependency values extracted by `name`, and `form` is the enhanced ProForm instance.
