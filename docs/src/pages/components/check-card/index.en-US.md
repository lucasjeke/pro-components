---
category: Components
title: CheckCard
subtitle: Check Card
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Layout
---

CheckCard is a selectable card component. It supports single cards, group selection, multiple selection, avatar, cover, description, loading, disabled state, and custom content.

## When To Use {#when-to-use}

- Options need richer visual content than Radio or Checkbox.
- A card should be selected in single or multiple selection mode.
- Options need title, description, avatar, cover, or extra content.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/group.vue">Group</demo>
  <demo src="./demo/multiple.vue">Multiple</demo>
  <demo src="./demo/avatar.vue">Avatar</demo>
  <demo src="./demo/image.vue">Cover</demo>
  <demo src="./demo/form.vue">Form</demo>
</demo-group>

## API

### ProCheckCard

#### Props {#check-card-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Card title | `VueNode` | - | - |
| description | Card description | `VueNode` | - | - |
| avatar | Avatar content or image URL | `VueNode \| string` | - | - |
| cover | Cover content or image URL | `VueNode \| string` | - | - |
| extra | Extra content | `VueNode` | - | - |
| value | Option value in group mode | `string \| number \| boolean` | - | - |
| checked | Controlled checked state | `boolean` | - | - |
| defaultChecked | Default checked state | `boolean` | `false` | - |
| disabled | Disabled state | `boolean` | `false` | - |
| loading | Loading state | `boolean` | `false` | - |
| size | Card size | `'large' \| 'default' \| 'small'` | `'default'` | - |
| borderBeam | Border beam config | `BorderBeamProps \| boolean` | - | - |
| collapsible | Collapse config inherited from ProCard | `ProCardProps['collapsible']` | - | - |

#### Events {#check-card-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| update:checked | Triggered when controlled checked state changes | `(checked: boolean) => void` | - |
| change | Triggered when checked state changes | `(checked: boolean) => void` | - |
| click | Triggered when card is clicked | `(event: MouseEvent) => void` | - |

### ProCheckCardGroup

#### Props {#check-card-group-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | Controlled selected value | `CheckGroupValueType` | - | - |
| defaultValue | Default selected value | `CheckGroupValueType` | - | - |
| multiple | Enable multiple selection | `boolean` | `false` | - |
| options | Option list | `CheckCardOptionType[]` | - | - |
| disabled | Disabled all cards | `boolean` | `false` | - |
| loading | Loading all cards | `boolean` | `false` | - |
| size | Card size | `'large' \| 'default' \| 'small'` | `'default'` | - |

#### Events {#check-card-group-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| update:value | Triggered when selected value changes | `(value: CheckGroupValueType) => void` | - |
| change | Triggered when selected value changes | `(value: CheckGroupValueType) => void` | - |
