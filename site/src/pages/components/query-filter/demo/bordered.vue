<docs lang="zh-CN">
  边框模式
</docs>

<docs lang="en-US">
bordered model
</docs>

<script lang="ts" setup>
import { ProFormCascader, ProFormCheckboxGroup, ProFormDatePicker, ProFormRadioGroup, ProFormSelect, ProFormTreeSelect, ProLightFilter } from '@antdv-next1/pro-components'
import { FilterOutlined } from '@antdv-next/icons'
import { TreeSelect } from 'antdv-next'
import { h } from 'vue'

const treeData = [
  {
    title: '技术研发部',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '前端开发组',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: '产品设计部',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '产品策划组',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'UX 设计组',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: '用户研究组',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
]
</script>

<template>
  <div class="m-b-4">
    <ProLightFilter
      :model="{
        sex: 'man',
        time: '2024-01-23',
        treeSelect: ['0-0', '0-1'],
        area: ['zhejiang', 'hangzhou', 'xihu'],
      }"
      variant="outlined"
      :collapse-label="h(FilterOutlined)"
      @finish="async (values) => console.log(values)"
    >
      <ProFormSelect
        name="sex"
        show-search
        :value-enum="{
          man: '男',
          woman: '女',
        }"
        placeholder="性别"
      />
      <ProFormRadioGroup
        name="radio"
        radio-type="button"
        :options="[
          {
            value: 'weekly',
            label: '每周',
          },
          {
            value: 'quarterly',
            label: '每季度',
          },
          {
            value: 'monthly',
            label: '每月',
          },
          {
            value: 'yearly',
            label: '每年',
          },
        ]"
      />
      <ProFormDatePicker name="time" placeholder="日期" label="日期" />
      <ProFormTreeSelect
        :request="async () => treeData"
        :field-props="{
          fieldNames: {
            label: 'title',
          },
          treeCheckable: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: 'Please select',
        }"
        label="树形选择"
        name="treeSelect"
      />
      <ProFormCheckboxGroup
        name="checkbox"
        label="迁移类型"
        width="lg"
        :options="['结构迁移', '全量迁移', '增量迁移', '全量校验']"
      />
      <ProFormCascader
        label="区域"
        :request="async () => [
          {
            value: 'zhejiang',
            label: '浙江',
            children: [
              {
                value: 'hangzhou',
                label: '杭州',
                children: [
                  {
                    value: 'xihu',
                    label: '西湖',
                  },
                ],
              },
            ],
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
              {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                  {
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                  },
                ],
              },
            ],
          },
        ]"
        name="area"
      />
    </ProLightFilter>
  </div>
</template>

<style scoped></style>
