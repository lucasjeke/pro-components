<docs lang="zh-CN">
高级表单用法。
</docs>

<docs lang="en-US">
ProForm usage.
</docs>

<script lang="ts" setup>
import type { ProFormInstance } from '@antdv-next1/pro-form'
import { ProForm, ProFormCascader, ProFormDatePicker, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSearchSelect, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@antdv-next1/pro-form'
import { message, TreeSelect } from 'antdv-next'

import dayjs from 'dayjs'
import { h, useTemplateRef } from 'vue'

const [messageApi, ContextHolder] = message.useMessage()

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const formRef = useTemplateRef<
  ProFormInstance<{
    name: string
    company?: string
    useMode?: string
  }>
>('formRef')

// 地区级联数据
const DEMO_AREA_CASCADER = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'binjiang', label: '滨江区' },
          { value: 'yuhang', label: '余杭区' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波市',
        children: [
          { value: 'haishu', label: '海曙区' },
          { value: 'jiangbei', label: '江北区' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      {
        value: 'nanjing',
        label: '南京市',
        children: [
          { value: 'gulou', label: '鼓楼区' },
          { value: 'jianye', label: '建邺区' },
        ],
      },
      {
        value: 'suzhou',
        label: '苏州市',
        children: [
          { value: 'gongyeyuan', label: '工业园区' },
          { value: 'gusu', label: '姑苏区' },
        ],
      },
    ],
  },
  {
    value: 'guangdong',
    label: '广东省',
    children: [
      {
        value: 'shenzhen',
        label: '深圳市',
        children: [
          { value: 'nanshan', label: '南山区' },
          { value: 'futian', label: '福田区' },
        ],
      },
    ],
  },
]
const DEMO_DEPARTMENT_TREE = [
  {
    title: '技术研发部',
    value: 'tech',
    key: 'tech',
    children: [
      { title: '前端开发组', value: 'tech-fe', key: 'tech-fe' },
      { title: '后端开发组', value: 'tech-be', key: 'tech-be' },
      { title: '测试保障组', value: 'tech-qa', key: 'tech-qa' },
    ],
  },
  {
    title: '产品设计部',
    value: 'product',
    key: 'product',
    children: [
      { title: '产品策划组', value: 'product-pm', key: 'product-pm' },
      { title: 'UX 设计组', value: 'product-ux', key: 'product-ux' },
    ],
  },
  {
    title: '市场运营部',
    value: 'marketing',
    key: 'marketing',
    children: [
      { title: '品牌推广组', value: 'marketing-brand', key: 'marketing-brand' },
      {
        title: '用户增长组',
        value: 'marketing-growth',
        key: 'marketing-growth',
      },
      {
        title: '内容运营组',
        value: 'marketing-content',
        key: 'marketing-content',
      },
    ],
  },
]
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <ProForm
      ref="formRef"
      name="base-form-demo"
      :request="async () => {
        await waitTime(1500);
        return {
          name: '杭州星辰科技有限公司',
          useMode: 'chapter',
        };
      }"
      :params="{ id: '100' }"
      form-key="base-demo"
      :date-formatter="(value) => {
        // console.log('---->', value, valueType);
        return value.format('YYYY/MM/DD HH:mm:ss');
      }"
      auto-focus-first-input
      @finish="async(values) => {
        await waitTime(2000);
        console.log(values, 'values');
        const val1 = await formRef?.validateFields();
        console.log('validateFields:', val1);
        const val2 = await formRef?.validateFieldsReturnFormatValue?.();
        console.log('validateFieldsReturnFormatValue:', val2);
        messageApi.success('提交成功');
      }"
    >
      <ProFormGroup>
        <ProFormText
          width="md"
          name="name"
          :dependencies="[['contract', 'name']]"
          :addon-before="h('a', null, ' 如何获取客户名称？')"
          :addon-after="h('a', null, '点击查看更多')"
          label="签约客户名称"
          tooltip="最长 24 个字符"
          placeholder="请输入客户名称"
          :rules="[{ required: true, message: '此项为必填项' }]"
        />
        <ProFormText
          width="md"
          name="company"
          label="我方公司名称"
          placeholder="请输入公司名称"
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormDigit name="count" label="项目团队人数" width="lg" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText
          :name="['contract', 'name']"
          width="md"
          label="合同名称"
          placeholder="请输入合同名称"
        />
        <ProFormDateRangePicker
          width="md"
          :name="['contract', 'createTime']"
          label="合同有效期"
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormSelect
          :options="[
            {
              value: 'chapter',
              label: '盖章后生效',
            },
          ]"
          readonly
          width="xs"
          name="useMode"
          label="合同约定生效方式"
        />
        <ProFormSearchSelect
          width="xs"
          :options="[
            {
              value: 'time',
              label: '履行完毕后终止',
              type: 'time',
              options: [
                {
                  value: 'time1',
                  label: '履行完毕后终止（自动续期）',
                },
                {
                  value: 'time2',
                  label: '履行完毕后终止（不续期）',
                },
              ],
            },
          ]"
          name="unusedMode"
          label="合同约定失效方式"
        />
        <ProFormMoney
          width="md"
          name="money"
          label="合同签约金额"
          :field-props="{
            numberPopoverRender: true,
          }"
        />
      </ProFormGroup>
      <ProFormText width="sm" name="id" label="主合同编号" />
      <ProFormText
        name="project"
        width="md"
        disabled
        label="关联项目"
        initial-value="智慧零售平台"
      />
      <ProFormTextArea
        :col-props="{ span: 24 }"
        name="address"
        label="详细办公地址"
      />
      <ProFormText
        width="xs"
        name="mangerName"
        disabled
        label="商务经理"
        initial-value="期贤"
      />
      <ProFormCascader
        width="md"
        :request="async () => DEMO_AREA_CASCADER"
        name="areaList"
        label="所在地区"
        :initial-value="['zhejiang', 'hangzhou', 'binjiang']"
        addon-after="区县"
      />
      <ProFormTreeSelect
        :initial-value="['tech-fe']"
        label="所属部门"
        :width="600"
        name="dept"
        :field-props="{
          fieldNames: {
            label: 'title',
          },
          treeData: DEMO_DEPARTMENT_TREE,
          treeCheckable: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: '请选择部门',
        }"
      />
      <ProFormDatePicker
        name="date"
        label="签约日期"
        :transform="(value) => {
          return {
            date: dayjs(value).unix(),
          };
        }"
      />
      <ProFormList
        name="datas"
        label="补充条款"
        :initial-value="[{
          date: dayjs('2023-01-01'),
          innerDatas: [
            {
              date: dayjs('2023-01-02'),
            },
          ],
        },
        ]"
      >
        <ProFormDatePicker
          name="date"
          label="生效日期"
          :transform="
            (value: string) => ({
              date: dayjs(value).unix(),
            })
          "
        />
        <ProFormList name="innerDatas" label="子条款">
          <ProFormDatePicker
            name="date"
            label="子条款生效日期"
            :transform="
              (value: string) => ({
                date: dayjs(value).unix(),
              })
            "
          />
        </ProFormList>
      </ProFormList>
    </ProForm>
  </div>
</template>

<style scoped></style>
