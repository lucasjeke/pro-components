<docs lang="zh-CN">
SchemaForm 最基础的用法，通过 JSON 配置生成标准的表单页面。支持通过 `columns` 定义表单项，通过 `layoutType` 切换布局。
</docs>

<docs lang="en-US">
The most basic usage of SchemaForm, generating standard form pages through JSON configuration. Supports defining form items via `columns` and switching layouts via `layoutType`.
</docs>

<script lang="ts" setup>
import type { ProFormColumnsType, ProFormLayoutType } from '@antdv-next1/pro-components'
import { ProFormSelect, SchemaForm } from '@antdv-next1/pro-components'
import { DateRangePicker } from 'antdv-next'
import dayjs from 'dayjs'
import { computed, h, shallowRef } from 'vue'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

/** 固定基准日期 */
const FIXED_BASE_DATE = dayjs('2024-01-15')

const valueEnum = {
  all: { text: '全部', status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error',
  },
  closed: {
    text: '已解决',
    status: 'Success',
    disabled: true,
  },
  processing: {
    text: '解决中',
    status: 'Processing',
  },
}

interface DataItem {
  name: string
  state: string
}

const columns: ProFormColumnsType<DataItem>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    width: 'md',
    colProps: {
      xs: 24,
      md: 12,
    },
    initialValue: '默认值',
    convertValue: (value) => {
      return `标题：${value}`
    },
    transform: (value) => {
      return {
        title: `${value}-转换`,
      }
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum,
    width: 'md',
    colProps: {
      xs: 24,
      md: 12,
    },
  },
  {
    title: '标签',
    dataIndex: 'labels',
    width: 'md',
    colProps: {
      xs: 12,
      md: 4,
    },
  },
  {
    valueType: 'switch',
    title: '开关',
    dataIndex: 'switch',
    fieldProps: {
      style: {
        width: '200px',
      },
    },
    width: 'md',
    colProps: {
      xs: 12,
      md: 20,
    },
  },
  {
    title: '创建时间',
    key: 'showTime',
    valueType: 'dateRange',
    dataIndex: 'createName',
    initialValue: [FIXED_BASE_DATE.add(-1, 'm'), FIXED_BASE_DATE],
    formItemRender: () => h(DateRangePicker),
    width: 'md',
    colProps: {
      xs: 24,
      md: 12,
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateName',
    valueType: 'dateRange',
    initialValue: [FIXED_BASE_DATE.add(-1, 'm'), FIXED_BASE_DATE],
    formItemRender: () => h(DateRangePicker),
    width: 'md',
    colProps: {
      xs: 24,
      md: 12,
    },
  },
  {
    title: '分组',
    valueType: 'group',
    columns: [
      {
        title: '状态',
        dataIndex: 'groupState',
        valueType: 'select',
        width: 'xs',
        colProps: {
          xs: 12,
        },
        valueEnum,
      },
      {
        title: '标题',
        width: 'md',
        dataIndex: 'groupTitle',
        colProps: {
          xs: 12,
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
      },
    ],
  },
  {
    title: '列表',
    valueType: 'formList',
    dataIndex: 'list',
    initialValue: [{ state: 'all', title: '标题' }],
    colProps: {
      xs: 24,
      sm: 12,
    },
    columns: [
      {
        valueType: 'group',
        columns: [
          {
            title: '状态',
            dataIndex: 'state',
            valueType: 'select',
            colProps: {
              xs: 24,
              sm: 12,
            },
            width: 'xs',
            valueEnum,
          },
          {
            title: '标题',
            dataIndex: 'title',
            width: 'md',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项',
                },
              ],
            },
            colProps: {
              xs: 24,
              sm: 12,
            },
          },
        ],
      },
      {
        valueType: 'dateTime',
        initialValue: FIXED_BASE_DATE.toDate(),
        dataIndex: 'currentTime',
        width: 'md',
      },
    ],
  },
  {
    title: 'FormSet',
    valueType: 'formSet',
    dataIndex: 'formSet',
    colProps: {
      xs: 24,
      sm: 12,
    },
    rowProps: {
      gutter: [16, 0],
    },
    columns: [
      {
        title: '状态',
        dataIndex: 'groupState',
        valueType: 'select',
        width: 'md',
        valueEnum,
      },
      {
        width: 'xs',
        title: '标题',
        dataIndex: 'groupTitle',
        tooltip: '标题过长会自动收缩',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
      },
    ],
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'created_at',
  //   valueType: 'dateRange',
  //   width: 'md',
  //   colProps: {
  //     span: 24,
  //   },
  //   transform: (value) => {
  //     console.log(value)
  //     return {
  //       startTime: value[0],
  //       endTime: value[1],
  //     }
  //   },
  // },
]
const layoutType = shallowRef<ProFormLayoutType>('Form')
const layoutColumns = computed(() => (layoutType.value === 'StepsForm' ? [columns] : columns) as ProFormColumnsType<DataItem>[][])
const grid = computed(() => layoutType.value !== 'LightFilter' && layoutType.value !== 'QueryFilter')
const layout = computed(() => layoutType.value as 'StepsForm')
const formProps = computed(() => {
  if (['ModalForm', 'DrawerForm'].includes(layoutType.value!)) {
    console.log(layoutType.value)
    return {
      trigger: h('a', null, '点击我'),
    }
  }
  if (layoutType.value === 'StepsForm') {
    return {
      steps: [
        {
          title: 'ProComponent',
        },
      ],
    }
  }
  return {}
})
</script>

<template>
  <div class="p-6">
    <a-space style="width: 100%;" orientation="vertical">
      <a-alert
        type="warning"
        title="QueryFilter 和 lightFilter 暂不支持grid模式"
        style="margin-block-end: 24px;"
      />
      <ProFormSelect
        label="布局方式"
        :options="[
          'Form',
          'ModalForm',
          'DrawerForm',
          'LightFilter',
          'QueryFilter',
          'StepsForm',
          'StepForm',
          'Embed',
        ]"
        :field-props="{
          value: layoutType,
          onChange: (_layoutType) => layoutType = _layoutType,
        }"
      />
    </a-space>
    <SchemaForm
      name="schema-form-schema-demo"
      v-bind="formProps"
      :layout-type="layout"
      :grid="grid"
      :row-props="{
        gutter: [16, 16],
      }"
      :col-props="{
        span: 12,
      }"
      :columns="layoutColumns"
      @finish="async (values) => {
        await waitTime(2000)
        console.log(values);
      }"
    />
  </div>
</template>

<style scoped></style>
