<docs lang="zh-CN">
弹窗表单
</docs>

<docs lang="en-US">
modal form
</docs>

<script lang="ts" setup>
import { ProFormDateRangePicker, ProFormGroup, ProFormSelect, ProFormText, ProModalForm } from '@antdv-next1/pro-components'
import { PlusOutlined } from '@antdv-next/icons'
import { Button, message } from 'antdv-next'
import { h } from 'vue'

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
  <div class="p-6">
    <ContextHolder />
    <ProModalForm
      name="modal-form-demo"
      title="Create New Form"
      auto-focus-first-input
      :trigger="h(Button, { type: 'primary' }, () => [h(PlusOutlined), 'Create New Form'])"
      :submit-timeout="2000"
      @finish="async () => {
        await waitTime(2000);
        messageApi.success('Submission successful');
        return true;
      }"
    >
      <ProFormGroup>
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
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText
          width="md"
          name="contract"
          label="Contract Name"
          placeholder="Please enter a name"
        />
        <ProFormDateRangePicker
          name="contractTime"
          label="Contract Effective Time"
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormSelect
          :request="async () => [
            {
              value: 'chapter',
              label: 'Effective after stamping',
            },
          ]"
          width="xs"
          name="useMode"
          label="Contract Agreed Effective Method"
        />
        <ProFormSelect
          width="xs"
          :options="[
            {
              value: 'time',
              label: 'Terminate after performance',
            },
          ]"
          name="unusedMode"
          label="Contract Agreed Invalid Method"
        />
      </ProFormGroup>
      <ProFormText width="sm" name="id" label="Main Contract Number" />
      <ProFormText
        name="project"
        disabled
        label="Project Name"
        initial-value="示例项目"
      />
      <ProFormText
        width="xs"
        name="mangerName"
        disabled
        label="Business Manager"
        initial-value="书琰"
      />
    </ProModalForm>
  </div>
</template>

<style scoped></style>
