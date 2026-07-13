<docs lang="zh-CN">
  打开时也会把 url 的参数设置为默认值，支持 transform, 但是要注意字段的映射。
</docs>

<docs lang="en-US">
  打开时也会把 url 的参数设置为默认值，支持 transform, 但是要注意字段的映射。
</docs>

<script lang="ts" setup>
import { ProForm, ProFormDatePicker, ProFormDateRangePicker, ProFormSelect } from '@antdv-next1/pro-components'
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
      name="sync-to-url-demo"
      :sync-to-url="(values, type) => {
        if (type === 'get') {
          // To cooperate with transform
          // startTime and endTime are combined into createTimeRanger
          return {
            ...values,
            createTimeRanger:
              values.startTime || values.endTime
                ? [values.startTime, values.endTime]
                : undefined,
          };
        }
        // expirationTime is not synchronized to the URL
        return {
          ...values,
          expirationTime: undefined,
        };
      }"
      :model="{
        name: 'Ant Design Co., Ltd.',
        useMode: 'chapter',
      }"
      auto-focus-first-input
      @finish="async (values) => {
        await waitTime(2000);
        console.log(values);
        messageApi.success('提交成功');
      }"
    >
      <ProFormSelect
        :options="[
          {
            value: 'chapter',
            label: 'Effective after stamping',
          },
        ]"
        width="sm"
        name="useMode"
        label="Contract Agreed Effective Method"
      />
      <ProFormDateRangePicker
        :transform="(values) => {
          return {
            startTime: values ? values[0] : undefined,
            endTime: values ? values[1] : undefined,
          };
        }"
        width="md"
        name="createTimeRanger"
        label="Contract Effective Time"
      />
      <ProFormDatePicker
        width="md"
        name="expirationTime"
        label="Contract Expiration Time"
      />
    </ProForm>
  </div>
</template>

<style scoped></style>
