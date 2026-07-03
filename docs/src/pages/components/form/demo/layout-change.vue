<docs lang="zh-CN">
 高级表单布局切换
</docs>

<docs lang="en-US">
 ProForm layout change.
</docs>

<script lang="ts" setup>
import type { ProDrawerFormProps, ProModalFormProps, ProQueryFilterProps } from '@antdv-next1/pro-form'
import { ProDrawerForm, ProForm, ProFormDateRangePicker, ProFormGroup, ProFormPassword, ProFormRadioGroup, ProFormSelect, ProFormText, ProLightFilter, ProLoginForm, ProModalForm, ProQueryFilter, ProStepForm, ProStepsForm } from '@antdv-next1/pro-form'
import { AlipayCircleOutlined, LockOutlined, PlusOutlined, TaobaoCircleOutlined, UserOutlined, WeiboCircleOutlined } from '@antdv-next/icons'
import { Button, message, Space } from 'antdv-next'
import { computed, h, shallowRef } from 'vue'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const [messageApi, ContextHolder] = message.useMessage()
const Components = {
  ProForm,
  ProModalForm,
  ProDrawerForm,
  ProQueryFilter,
  ProLightFilter,
  ProStepsForm,
  ProLoginForm,
}
const type = shallowRef<keyof typeof Components>('ProLightFilter')
const FormComponents = computed(() => Components[type.value])
const iconStyles = {
  marginInlineStart: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
}

const formProps = computed(() => {
  if (['ProModalForm', 'ProDrawerForm'].includes(type.value)) {
    return {
      trigger: h(Button, {
        type: 'primary',
      }, () => [
        h(PlusOutlined),
        ' New Form',
      ]),
    } as ProModalFormProps & ProDrawerFormProps
  }
  if (type.value === 'ProQueryFilter') {
    return {
      labelWidth: 'auto',
    } as ProQueryFilterProps
  }
  return {

  }
})
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <div
      :style="{
        margin: '16px',
      }"
    >
      <ProFormRadioGroup
        radio-type="button"
        :field-props="{
          value: type,
          onChange: (e) => type = e.target.value,
        }"
        ignore-form-item
        :options="[
          'ProLightFilter',
          'ProForm',
          'ProModalForm',
          'ProDrawerForm',
          'ProQueryFilter',
          'ProStepsForm',
          'ProLoginForm',
        ]"
      />
    </div>
    <ProStepsForm
      v-if="type === 'ProStepsForm'"
      @finish="async (values: any) => {
        await waitTime(2000);
        console.log(values);
        messageApi.success('Submission successful');
      }"
    >
      <ProStepForm title="Step One">
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
            :name="['contract', 'name']"
            width="md"
            label="Contract Name"
            placeholder="Please enter a name"
          />
          <ProFormDateRangePicker
            width="md"
            :name="['contract', 'createTime']"
            label="Contract Effective Time"
          />
        </ProFormGroup>
      </ProStepForm>
      <ProStepForm title="Step Two">
        <ProFormGroup>
          <ProFormSelect
            :options="[
              {
                value: 'chapter',
                label: 'Effective after stamping',
              },
            ]"
            readonly
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
      </ProStepForm>
      <ProStepForm title="Step Three">
        <ProFormText width="sm" name="id" label="Main Contract Number" />
        <ProFormText
          name="project"
          width="md"
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
      </ProStepForm>
    </ProStepsForm>
    <FormComponents
      v-else-if="type === 'ProLoginForm'"
      title="Github"
      sub-title="The world's largest code hosting platform"
      :actions="h(Space, null, () => [
        'Other login methods',
        h(AlipayCircleOutlined, {
          style: iconStyles,
        }),
        h(TaobaoCircleOutlined, {
          style: iconStyles,
        }),
        h(WeiboCircleOutlined, {
          style: iconStyles,
        }),
      ])"
    >
      <ProFormText
        name="username"
        :field-props="{
          size: 'large',
          prefix: h(UserOutlined, { class: 'prefixIcon' }),
        }"
        placeholder="Username: admin or user"
        :rules="[
          {
            required: true,
            message: 'Please enter your username!',
          },
        ]"
      />
      <ProFormPassword
        name="password"
        :field-props="{
          size: 'large',
          prefix: h(LockOutlined, { class: 'prefixIcon' }),
        }"
        placeholder="Password: ant.design"
        :rules="[
          {
            required: true,
            message: 'Please enter your password!',
          },
        ]"
      />
    </FormComponents>

    <div v-else class="m-ie-6 m-is-6 max-w-180">
      <FormComponents
        v-bind="formProps"
        :model="{
          name: 'Ant Design Co., Ltd.',
          useMode: 'chapter',
        }"
        @finish="async (values) => {
          await waitTime(2000);
          console.log(values);
          messageApi.success('Submission successful');
          return true
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
            :name="['contract', 'name']"
            width="md"
            label="Contract Name"
            placeholder="Please enter a name"
          />
          <ProFormDateRangePicker
            width="md"
            :name="['contract', 'createTime']"
            label="Contract Effective Time"
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormSelect
            :options="[
              {
                value: 'chapter',
                label: 'Effective after stamping',
              },
            ]"
            readonly
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
              {
                value: 'hour',
                label: 'Terminate after performance2',
              },
            ]"
            name="unusedMode"
            label="Contract Agreed Invalid Method"
          />
        </ProFormGroup>
        <ProFormText width="sm" name="id" label="Main Contract Number" />
        <ProFormText
          name="project"
          width="md"
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
      </FormComponents>
    </div>
  </div>
</template>

<style scoped></style>
