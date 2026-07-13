<docs lang="zh-CN">
分布表单
</docs>

<docs lang="en-US">
seeps form
</docs>

<script lang="ts" setup>
import type { ProFormInstance } from '@antdv-next1/pro-components'
import { ProCard, ProFormCheckboxGroup, ProFormDatePicker, ProFormDateRangePicker, ProFormGroup, ProFormSelect, ProFormText, ProFormTextArea, ProStepForm, ProStepsForm } from '@antdv-next1/pro-components'
import { message } from 'antdv-next'

import { useTemplateRef } from 'vue'

const formRef = useTemplateRef<ProFormInstance<{
  name: string
}>>('formRef')

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
  <ProCard>
    <ContextHolder />
    <ProStepsForm
      ref="formRef"
      :form-props="{
        validateMessages: {
          required: 'This field is required',
        },
      }"
      @finish="async () => {
        await waitTime(2000);
        messageApi.success('Submission successful');
      }"
    >
      <ProStepForm
        name="steps-from-base"
        title="Create Experiment"
        :step-props="{
          content: 'All basic information is filled in here',
        }"
        @finish="async () => {
          console.log(formRef?.getFieldsValue());
          await waitTime(2000);
          return true;
        }"
      >
        <ProFormText
          name="name"
          label="Experiment Name"
          width="md"
          tooltip="Up to 24 characters, used as a unique id"
          placeholder="Please enter a name"
          :rules="[{ required: true }]"
        />
        <ProFormDatePicker name="date" label="Date" />
        <ProFormDateRangePicker name="dateTime" label="Time Range" />
        <ProFormTextArea
          name="remark"
          label="Remarks"
          width="lg"
          placeholder="Please enter remarks"
        />
      </ProStepForm>
      <ProStepForm
        name="steps-from-checkbox"
        title="Set Parameters"
        :step-props="{
          content: 'Fill in the operation parameters here',
        }"
        @finish="async () => {
          console.log(formRef?.getFieldsValue());
          return true;
        }"
      >
        <ProFormCheckboxGroup
          name="checkbox"
          label="Migration Type"
          width="lg"
          :options="[
            'Structural Migration',
            'Full Migration',
            'Incremental Migration',
            'Full Verification',
          ]"
        />
        <ProFormGroup>
          <ProFormText name="dbname" label="Business DB Username" />
          <ProFormDatePicker
            name="datetime"
            label="Record Retention Time"
            width="sm"
          />
          <ProFormCheckboxGroup
            name="checkbox"
            label="Migration Type"
            :options="['Complete LOB', 'Do Not Sync LOB', 'Restricted LOB']"
          />
        </ProFormGroup>
      </ProStepForm>
      <ProStepForm
        name="steps-from-time"
        title="Publish Experiment"
        :step-props="{
          content: 'Fill in the release criteria here',
        }"
        @finish="async () => {
          console.log(formRef?.getFieldsValue());
          return true;
        }"
      >
        <ProFormCheckboxGroup
          name="checkbox"
          label="Deployment Units"
          :rules="[
            {
              required: true,
            },
          ]"
          :options="[
            'Deployment Unit 1',
            'Deployment Unit 2',
            'Deployment Unit 3',
          ]"
        />
        <ProFormSelect
          label="Deployment Group Strategy"
          name="remark"
          :rules="[
            {
              required: true,
            },
          ]"
          initial-value="1"
          :options="[
            {
              value: '1',
              label: 'Strategy One',
            },
            { value: '2', label: 'Strategy Two' },
          ]"
        />
        <ProFormSelect
          label="Pod Scheduling Strategy"
          name="remark2"
          initial-value="2"
          :options="[
            {
              value: '1',
              label: 'Strategy One',
            },
            { value: '2', label: 'Strategy Two' },
          ]"
        />
      </ProStepForm>
    </ProStepsForm>
  </ProCard>
</template>

<style scoped></style>
