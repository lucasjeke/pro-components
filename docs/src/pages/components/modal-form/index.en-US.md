---
category: Components
title: Modal/Drawer
subtitle: Layer Form
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: Data Entry
---

ModalForm and DrawerForm are ProForm-based layer forms rendered inside Modal and Drawer. They keep ProForm field, submit, request, and readonly capabilities while adding open-state management and close-after-submit behavior.

## When To Use {#when-to-use}

- Create or edit forms should be completed in a modal or drawer.
- A `trigger` node should open the layer without extra state code.
- The layer should close automatically after successful submit.

## Examples {#examples}

<demo-group>
  <demo src="./demo/modal-form.vue">Modal form</demo>
  <demo src="./demo/drawer-form.vue">Drawer form</demo>
  <demo src="./demo/modal-form-submitter.vue">Custom submitter</demo>
</demo-group>

## API

### ModalForm

ModalForm inherits most ProForm props.

#### Props {#modal-form-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| trigger | Node that opens the modal | `VNode` | - | - |
| open | Controlled open state | `boolean` | - | - |
| modalProps | Props passed to Modal | `Omit<ModalProps, 'open'>` | - | - |
| title | Modal title | `VueNode` | - | - |
| width | Modal width | `ModalProps['width']` | `800` | - |
| submitTimeout | Timeout for disabling cancel button during submit | `number` | - | - |

#### Events {#modal-form-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| update:open | Triggered when open state changes | `(open: boolean) => void` | - |
| openChange | Triggered when open state changes | `(open: boolean) => void` | - |
| finish | Triggered on successful submit. Truthy return closes the modal | `(formData) => Promise<any>` | - |

### DrawerForm

DrawerForm inherits most ProForm props.

#### Props {#drawer-form-props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| trigger | Node that opens the drawer | `VNode` | - | - |
| open | Controlled open state | `boolean` | - | - |
| drawerProps | Props passed to Drawer | `Omit<DrawerProps, 'open'>` | - | - |
| title | Drawer title | `VueNode` | - | - |
| width | Drawer width | `DrawerProps['size']` | `800` | - |
| resize | Enable resizing or provide resize config | `boolean \| { minWidth?: DrawerProps['size']; maxWidth?: DrawerProps['size']; resize?: () => void }` | `false` | - |
| submitTimeout | Timeout for disabling cancel button during submit | `number` | - | - |

#### Events {#drawer-form-events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Triggered when open state changes | `(open: boolean) => void` | - |
| finish | Triggered on successful submit. Truthy return closes the drawer | `(formData) => Promise<any>` | - |
