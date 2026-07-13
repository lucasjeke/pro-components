<docs lang="zh-CN">
同时支持在 `ProForm`, `SchemaForm`, `ModalForm`, `DrawerForm`, `StepsForm` 中使用
</docs>

<docs lang="en-US">
Supported in `ProForm`, `SchemaForm`, `ModalForm`, `DrawerForm`, `StepsForm`
</docs>

<script setup lang="ts">
import type { FormLayout } from 'antdv-next/dist/form/Form'
import { ProForm, ProFormDatePicker, ProFormDateRangePicker, ProFormDigit, ProFormRadioGroup, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@antdv-next1/pro-components'
import { Col, message, Row, Space } from 'antdv-next'
import { h, shallowRef } from 'vue'

const LAYOUT_TYPE_HORIZONTAL = 'horizontal'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

const formLayoutType = shallowRef<FormLayout>(LAYOUT_TYPE_HORIZONTAL)

const grid = shallowRef<boolean>(true)
</script>

<template>
  <div class="p-6">
    <ProForm
      :layout="formLayoutType"
      :row-props="{
        gutter: [16, formLayoutType === 'inline' ? 16 : 0],
      }"
      :grid="grid"
      :submitter="{
        render: (_, doms) => {
          return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? h(Row, null, () => h(Col, { span: 14, offset: 4 }, () => h(Space, null, () => doms)),
          ) : (
            doms
          )
        },
      }"
      :params="{}"
      :request="async () => {
        await waitTime(100);
        return {
          name: 'Ant Design Co., Ltd.',
          useMode: 'chapter',
        };
      }"
      @finish="async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success('Submission successful');
      }"
    >
      <ProFormRadioGroup
        label="Label Layout"
        radio-type="button"
        :field-props="{
          'value': formLayoutType,
          'onUpdate:value': (_value) => {
            formLayoutType = _value
          },
        }"
        :col-props="{
          span: 20,
        }"
        :options="['horizontal', 'vertical', 'inline']"
      />

      <ProFormSwitch
        :col-props="{
          span: 4,
        }"
        :field-props="{
          'onUpdate:checked': (_grid) => {
            grid = _grid as boolean
          },
          'checked': grid,
        }"
        :initial-value="true"
        label="Grid Switch"
        name="grid"
      />

      <ProFormText
        name="name"
        label="Title"
        tooltip="Up to 24 characters"
        placeholder="Please enter a name"
      />
      <ProFormText :col-props="{ md: 12, xl: 8 }" name="company" label="Name" />
      <ProFormDigit :col-props="{ md: 12, xl: 8 }" name="phone" label="Phone" />
      <ProFormText :col-props="{ md: 12, xl: 8 }" name="email" label="Email" />
      <ProFormTextArea
        :col-props="{ span: 24 }"
        name="address"
        label="Detailed Work Address or Home Address"
      />
      <ProFormDatePicker
        :col-props="{ xl: 8, md: 12 }"
        label="Entry Date"
        name="date"
      />
      <ProFormDateRangePicker
        :col-props="{ xl: 8, md: 12 }"
        label="Work Period"
        name="dateRange"
      />
      <ProFormSelect
        :col-props="{ xl: 8, md: 12 }"
        label="Position"
        name="level"
        :value-enum="{
          1: 'Front End',
          2: 'Back End',
          3: 'Full Stack',
        }"
      />
    </ProForm>
  </div>
</template>

<style scoped></style>
