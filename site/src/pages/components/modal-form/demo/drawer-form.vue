<docs lang="zh-CN">
抽屉表单
</docs>

<docs lang="en-US">
drawer form
</docs>

<script lang="ts" setup>
import { ProDrawerForm, ProFormDateRangePicker, ProFormGroup, ProFormSelect, ProFormText } from '@antdv-next1/pro-components'
import { PlusOutlined } from '@antdv-next/icons'
import { Button, message } from 'antdv-next'
import { computed, h } from 'vue'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const [messageApi, ContextHolder] = message.useMessage()
const resize = computed(() => ({
  onResize() {
    console.log('resize!')
  },
  maxWidth: window.innerWidth * 0.8,
  minWidth: 300,
}))
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <ProDrawerForm
      name="drawer-form-demo"
      title="Create New Form"
      :trigger="h(Button, { type: 'primary',
                            onClick: (e) => {
                              console.log('click', e)
                            } }, () => [h(PlusOutlined), 'Create New Form'])"
      auto-focus-first-input
      :resize="resize"
      :drawer-props="{
        destroyOnHidden: true,
      }"
      :submit-timeout="2000"
      @finish="async (values) => {
        await waitTime(2000);
        console.log(values.name);
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
    </ProDrawerForm>
  </div>
</template>

<style scoped></style>
