<docs lang="zh-CN">
 表单联动
</docs>

<docs lang="en-US">
 表单联动
</docs>

<script lang="ts" setup>
import { ProForm, ProFormDependency, ProFormItem, ProFormSelect, ProFormText } from '@antdv-next1/pro-components'
import { message } from 'antdv-next'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const [messageApi, ContextHolder] = message.useMessage()
</script>

<template>
  <div clas="p-6">
    <ContextHolder />
    <ProForm
      name="form-dependency-demo"
      :model="{
        name: 'Ant Design Co., Ltd.',
        name2: 'Ant Design Group',
        useMode: 'chapter',
      }"
      @finish="async (values) => {
        await waitTime(2000);
        console.log(values);
        messageApi.success('Submission successful');
      }"
    >
      <ProFormText
        width="md"
        name="name"
        label="Contract Customer Name"
        tooltip="Up to 24 characters"
        placeholder="Please enter a name"
      />
      <ProFormText
        width="md"
        :name="['name2', 'text']"
        label="Contract Customer Name"
        tooltip="Up to 24 characters"
        placeholder="Please enter a name"
      />
      <!-- ProFormDependency will automatically inject and perform shouldUpdate comparison  -->
      <ProFormDependency :name="['name', ['name2', 'text']]">
        <template #default="{ values }">
          <ProFormSelect
            :options="[
              {
                value: 'chapter',
                label: 'Effective after stamping',
              },
            ]"
            width="md"
            name="useMode"
            :label="`Effective method agreed in the contract with '${values.name || ''}' and '${values.name2?.text || ''}'`"
          />
        </template>
      </ProFormDependency>
      <!-- noStyle shouldUpdate is required, writing name will invalidate it  -->
      <ProFormItem no-style is-render-props>
        <template #default="form">
          <ProFormSelect
            :options="[
              {
                value: 'chapter',
                label: 'Effective after stamping',
              },
            ]"
            width="md"
            name="useMode"
            :label="`Effective method agreed in the contract with '${form?.getFieldValue('name')}'`"
          />
        </template>
      </ProFormItem>
    </ProForm>
  </div>
</template>

<style scoped></style>
