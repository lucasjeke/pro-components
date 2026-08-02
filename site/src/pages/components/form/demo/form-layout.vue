<docs lang="zh-CN">
除了 `LightFilter` 和 `QueryFilter` 这样固定布局的表单样式，其他表单布局支持配置与 `Antdv Next` 一致的三种布局方式。
</docs>

<docs lang="en-US">
除了 `LightFilter` 和 `QueryFilter` 这样固定布局的表单样式，其他表单布局支持配置与 `Antdv Next` 一致的三种布局方式。
</docs>

<script lang="ts" setup>
import type { ProFormInstance } from '@antdv-next1/pro-components'
import { ProForm, ProFormRadioGroup, ProFormText } from '@antdv-next1/pro-components'
import { Col, message, Row, Space } from 'antdv-next'
import { computed, h, shallowRef, useTemplateRef } from 'vue'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const [messageApi, ContextHolder] = message.useMessage()
const LAYOUT_TYPE_HORIZONTAL = 'horizontal'
const formLayoutType = shallowRef<'horizontal' | 'inline' | 'vertical'>(
  LAYOUT_TYPE_HORIZONTAL,
)
const formItemLayout = computed(() =>
  formLayoutType.value === LAYOUT_TYPE_HORIZONTAL
    ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }
    : null)
const formRef = useTemplateRef<
  ProFormInstance<{
    name: string
    company?: string
    useMode?: string
  }>
>('formRef')
</script>

<template>
  <div class="p-6">
    <ContextHolder />

    <ProForm
      ref="formRef"
      name="form-layout-demo"
      v-bind="formItemLayout"
      :request="async () => {
        await waitTime(1500);
        return {
          name: 'Ant Design Co., Ltd.',
          useMode: 'chapter',
        };
      }"
      :params="{ }"
      :layout="formLayoutType"
      :submitter="{
        render: (_, doms) => {
          return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? h(Row, null, () => h(Col, { span: 14, offset: 4 }, () => h(Space, null, () => doms)),
          ) : doms
        },
      }"
      @finish="async(values) => {
        await waitTime(2000);
        console.log(values, formRef);
        messageApi.success('Submission successful');
      }"
    >
      <ProFormRadioGroup
        label="Label Layout"
        radio-type="button"
        :field-props="{
          value: formLayoutType,
          onChange: (e) => formLayoutType = e.target.value,
        }"
        :options="['horizontal', 'vertical', 'inline']"
      />
      <ProFormText
        width="md"
        name="name"
        label="Contract Customer Name"
        tooltip="Up to 24 characters"
        placeholder="Please enter a name"
      />
      <ProFormText
        width="md"
        name="company"
        label="Our Company Name"
        placeholder="Please enter a name"
      />
      <ProFormText
        :name="['contract', 'name']"
        width="md"
        label="Contract Name"
        placeholder="Please enter a name"
      />
    </ProForm>
  </div>
</template>

<style scoped></style>
