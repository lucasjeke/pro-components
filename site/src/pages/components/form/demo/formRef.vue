<docs lang="zh-CN">
 你可以通过 `formRef` 获取到表单实例的引用，通过引用可以调用表单方法实现表单重置，设置表单，获取表单值等功能。
</docs>

<docs lang="en-US">
 你可以通过 `formRef` 获取到表单实例的引用，通过引用可以调用表单方法实现表单重置，设置表单，获取表单值等功能。
</docs>

<script lang="ts" setup>
import type { ProFormInstance } from '@antdv-next1/pro-components'
import { ProForm, ProFormDatePicker, ProFormText } from '@antdv-next1/pro-components'
import { Button, message, SpaceCompact } from 'antdv-next'
import dayjs from 'dayjs'
import { h, useTemplateRef } from 'vue'

const formRef = useTemplateRef<ProFormInstance>('formRef')

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const [messageApi, ContextHolder] = message.useMessage()

function onFill() {
  formRef?.value?.setFieldsValue({
    name: '书琰',
    company: '杭州星辰科技有限公司',
  })
}

function getCompanyName() {
  messageApi.info(`公司名称为 "${formRef?.value?.getFieldValue('company')}"`)
}

function getFormatValues() {
  console.log(
    '格式化后的所有数据：',
    formRef.value?.getFieldsFormatValue?.(),
  )
}

function validateAndGetFormatValue() {
  formRef.value?.validateFieldsReturnFormatValue?.().then((values) => {
    console.log('校验表单并返回格式化后的所有数据：', values)
  })
}
</script>

<template>
  <div clas="p-6">
    <ContextHolder />
    <ProForm
      ref="formRef"
      name="formref-demo"
      title="新建表单"
      :submitter="{
        render: (_, doms) => {
          return [
            ...doms,
            h(Button, { htmlType: 'button', onClick: onFill, key: 'edit' }, () => '一键填写'),
            h(Button, { htmlType: 'button', onClick: getCompanyName, key: 'read' }, () => '读取公司'),
            h(SpaceCompact, { style: { display: 'block' }, key: 'refs' }, () => [h(Button, { htmlType: 'button', onClick: getFormatValues, key: 'format' }, () => '获取格式化后的所有数据'), h(Button, { htmlType: 'button', onClick: validateAndGetFormatValue, key: 'format2' }, () => '校验表单并返回格式化后的所有数据')]),
          ];
        },
      }"
      @finish="async (values) => {
        await waitTime(2000);
        console.log(values);
        messageApi.success('提交成功');
        return true;
      }"
    >
      <ProFormText
        width="md"
        name="name"
        label="签约客户名称"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name="company"
        label="我方公司名称"
        placeholder="请输入名称"
      />
      <ProFormDatePicker name="date" :initial-value="dayjs('2021-08-09')" />
    </ProForm>
  </div>
</template>

<style scoped></style>
