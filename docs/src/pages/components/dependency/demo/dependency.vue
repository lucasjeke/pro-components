<docs lang="zh-CN">
互相依赖表单
</docs>

<docs lang="en-US">
dependency form
</docs>

<script lang="ts" setup>
import {
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProForm
      name="dependency-demo"
      @finish="(values) => {
        console.log(values, 'values')
      }"
    >
      <ProFormSelect
        :options="[
          {
            value: 'select',
            label: '选择框',
          },
          {
            value: 'input',
            label: '输入框',
          },
        ]"
        width="xs"
        name="globalUseMode"
        label="全局生效方式组件的类型"
      />
      <ProFormList
        :name="['default', 'users']"
        label="用户信息"
        :initial-value="[
          {
            useMode: 'select',
            function: 'chapter',
          },
        ]"
        always-show-item-label
      >
        <ProFormGroup key="group">
          <ProFormSelect
            :options="[
              {
                value: 'select',
                label: '选择框',
              },
              {
                value: 'input',
                label: '输入框',
              },
            ]"
            width="xs"
            name="useMode"
            label="生效方式组件的类型"
          />
          <ProFormDependency :name="['useMode']">
            <template #default="{ values }">
              <ProFormSelect
                v-if="values.useMode === 'select'"
                :options="[
                  {
                    value: 'chapter',
                    label: '盖章后生效',
                  },
                ]"
                width="md"
                name="function"
                label="生效方式"
              />
              <ProFormText v-else width="md" name="function" label="生效方式" />
            </template>
          </ProFormDependency>
          <ProFormDependency
            :name="['globalUseMode']"
            ignore-form-list-field
          >
            <template #default="{ values }">
              <ProFormSelect
                v-if="values.globalUseMode === 'select'"
                :options="[
                  {
                    value: 'chapter',
                    label: '盖章后生效',
                  },
                ]"
                width="md"
                name="gfunction"
                label="外层联动生效方式"
              />
              <ProFormText
                v-else
                width="md"
                name="gfunction"
                label="外层联动生效方式"
              />
            </template>
          </ProFormDependency>
        </ProFormGroup>
      </ProFormList>
    </ProForm>
  </div>
</template>

<style scoped></style>
