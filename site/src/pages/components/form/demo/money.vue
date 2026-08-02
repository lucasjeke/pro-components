<docs lang="zh-CN">
 金额
</docs>

<docs lang="en-US">
 金额
</docs>

<script lang="ts" setup>
import type { ProFormInstance } from '@antdv-next1/pro-components'
import { ProForm, ProFormMoney, ProFormSwitch } from '@antdv-next1/pro-components'
import { message } from 'antdv-next'
import { shallowRef, useTemplateRef } from 'vue'

const formRef = useTemplateRef<ProFormInstance<{ name: string, company?: string, useMode?: string }>>('formRef')

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const [messageApi, ContextHolder] = message.useMessage()
const readonly = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <ProFormSwitch
      checked-children="On"
      un-checked-children="Off"
      label="Read Only"
      :field-props="{
        onChange: (value) => readonly = value,
      }"
    />
    <ProForm
      ref="formRef"
      name="money-demo"
      :params="{ id: '100' }"
      form-key="money-demo"
      :readonly="readonly"
      :request="async () => {
        await waitTime(100);
        return {
        };
      }"
      auto-focus-first-input
      @finish="async (values) => {
        await waitTime(2000);
        console.log(values);
        const val1 = await formRef?.validateFields();
        console.log('validateFields:', val1);
        const val2 = await formRef?.validateFieldsReturnFormatValue?.();
        console.log('validateFieldsReturnFormatValue:', val2);
        messageApi.success('提交成功');
      }"
    >
      <ProFormMoney
        label="No Symbol"
        name="amount0"
        :field-props="{
          moneySymbol: false,
        }"
        locale="en-US"
        :initial-value="22.22"
        :min="0"
        width="lg"
      />
      <ProFormMoney
        label="Width"
        name="amount1"
        locale="en-US"
        :initial-value="22.22"
        :min="0"
        width="lg"
      />
      <ProFormMoney
        label="Minimum Amount 0"
        name="amount2"
        locale="en-US"
        :initial-value="22.22"
        :min="0"
        trigger="blur"
      />
      <ProFormMoney
        label="No Limit"
        name="amount3"
        locale="en-GB"
        :initial-value="22.22"
      />
      <ProFormMoney
        label="Follow Global Locale"
        name="amount4"
        :initial-value="22.22"
      />
      <ProFormMoney
        label="Locale ms-MY"
        name="amount-ms-My"
        locale="ms-MY"
        :initial-value="-22.22"
      />
      <ProFormMoney
        label="Locale zh-TW"
        name="amount-zh-TW"
        locale="zh-TW"
        :initial-value="22.22"
      />
      <ProFormMoney
        label="Custom Symbol"
        name="amount5"
        :initial-value="22.22"
        custom-symbol="💰"
      />
      <ProFormMoney
        label="Precision"
        name="amount6"
        :initial-value="2222222222.222222"
        :field-props="{ precision: 2 }"
        custom-symbol="💰"
      />
      <ProFormMoney
        label="Precision 0"
        name="amount7"
        :initial-value="2222222222.222222"
        :field-props="{ precision: 0 }"
        custom-symbol="💰"
      />
    </ProForm>
  </div>
</template>

<style scoped></style>
