---
category: Components
title: ProFormFields
subtitle: 表单项
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YSm4RI3iOJ8AAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*03dxS64LxeQAAAAAAAAAAAAADrJ8AQ/original
group: 数据录入
---

ProFormFields 是 ProForm 内置的一组表单项组件。它们本质上是 `Form.Item` 与具体输入组件的组合，统一支持 `name`、`label`、`rules`、`fieldProps`、`readonly`、`placeholder` 等表单项能力。

## 何时使用 {#when-to-use}

- 希望少写 FormItem 样板代码，快速组合业务表单时。
- 需要输入态与只读态使用同一份字段配置时。
- 需要金额、日期、选择、上传、验证码等常见表单项时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/components-other.vue">表单项</demo>
</demo-group>

## API

### 通用属性 {#common-props}

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 表单字段名 | `NamePath` | - | - |
| label | 标签 | `VueNode` | - | - |
| tooltip | 标签提示 | `FormItemTooltipType` | - | - |
| rules | 校验规则 | `Rule[]` | - | - |
| width | 表单项宽度，支持 `xs`、`sm`、`md`、`lg`、`xl` | `number \| string` | - | - |
| fieldProps | 透传给底层输入组件的属性 | `Record<string, any>` | - | - |
| formItemProps | 透传给 FormItem 的属性 | `Record<string, any>` | - | - |
| placeholder | 占位文案 | `string \| string[]` | - | - |
| readonly | 只读态 | `boolean` | `false` | - |
| disabled | 禁用态 | `boolean` | `false` | - |
| initialValue | 初始值 | `any` | - | - |
| transform | 提交时转换值 | `(value, namePath, allValues) => any` | - | - |
| convertValue | 读取时转换值 | `(value, namePath) => any` | - | - |

### 导出组件 {#exports}

常用组件包括 `ProFormText`、`ProFormTextArea`、`ProFormPassword`、`ProFormDigit`、`ProFormMoney`、`ProFormSelect`、`ProFormTreeSelect`、`ProFormCascader`、`ProFormCheckbox`、`ProFormRadio`、`ProFormSwitch`、`ProFormSlider`、`ProFormRate`、`ProFormDatePicker`、`ProFormDateRangePicker`、`ProFormTimePicker`、`ProFormUploadButton`、`ProFormUploadDragger`、`ProFormCaptcha` 等。
