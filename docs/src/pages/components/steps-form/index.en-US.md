---
category: Components
title: StepsForm
subtitle: Steps Form
group: Data Entry
---

StepsForm splits a complex form into multiple steps. It is composed with `ProStepsForm` and multiple `ProStepsForm.StepForm` components. Each step can have its own form config, while the final step submits all values together.

## When To Use {#when-to-use}

- A form has many fields and should guide users step by step.
- Each step needs validation, but values should be submitted together.
- The steps, form area, or submitter should be customized.

## Examples {#examples}

<demo-group>
  <demo src="./demo/steps-from.vue">Basic</demo>
</demo-group>

## API

### ProStepsForm

#### Props {#props}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| current | Current step in controlled mode | `number` | - | - |
| stepsProps | Props passed to Steps | `StepsProps` | - | - |
| formProps | Default form props passed to each StepForm | `ProFormProps` | - | - |
| formMap | Form instances of all steps | `FormInstance[]` | - | - |
| submitter | Submitter config. Set to `false` to hide | `SubmitterProps<{ step: number; onPre: () => void; form?: FormInstance }> \| false` | - | - |
| containerStyle | Container style | `CSSProperties` | - | - |
| stepsRender | Custom steps renderer | `(steps, defaultDom) => VueNode` | - | - |
| stepFormRender | Custom single form area renderer | `(formDom) => VueNode` | - | - |
| stepsFormRender | Custom form and submitter area renderer | `(formDom, submitter) => VueNode` | - | - |
| layoutRender | Custom full layout renderer | `(layoutDom: { stepsDom: VNode; formDom: VNode }) => VueNode` | - | - |

#### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| finish | Triggered on final submit. Returning `true` resets step and forms | `(values) => void \| Promise<boolean \| void>` | - |
| currentChange | Triggered when current step changes | `(current: number) => void` | - |
| update:formMap | Triggered when form instances change | `(formMap: FormInstance[]) => void` | - |

### ProStepsForm.StepForm

StepForm inherits most ProForm props. Common props include `name`, `title`, `layout`, `grid`, `submitter`, and `finish`.
