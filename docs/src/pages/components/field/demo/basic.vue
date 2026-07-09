<docs lang="zh-CN">
典型的页面布局。
</docs>

<docs lang="en-US">
Classic page layouts.
</docs>

<script setup lang="ts">
import type { ProFieldFCMode } from '@antdv-next1/pro-provider'
import { ProField } from '@antdv-next1/pro-field'
import dayjs from 'dayjs'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'

const inputRef = useTemplateRef('inputRef')
const state = ref<ProFieldFCMode>('read')
const modelValue = reactive({
  value1: '用户认证服务',
  value2: '核心服务，承载全站用户登录与鉴权，高峰期需要关注性能指标',
  value3: '123456',
  value4: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  value5: '128000',
  value6: '1234567',
  value7: [1000, 5000],
  value8: 86400,
  value9: 99.5,
  value10: 75,
  value11: 4,
  value12: 60,
  value13: 'open',
  value14: 'open',
  value15: 'open',
  value16: ['open', 'processing'],
  value17: true,
  value18: 'open',
  value19: 'open',
  value20: ['zhejiang', 'hangzhou', 'xihu'],
  value21: 'tech',
  value22: '#1677FF',
  value23: dayjs('2024-01-15 10:30:00').valueOf(),
  value24: dayjs('2024-01-15 10:30:00').valueOf(),
  value25: dayjs('2024-01-15 10:30:00').valueOf(),
  value26: dayjs('2024-01-15 10:30:00').valueOf(),
  value27: dayjs('2024-01-15 10:30:00').valueOf(),
  value28: dayjs('2024-01-15 10:30:00').valueOf(),
  value29: dayjs('2024-01-15 10:30:00').valueOf(),
  value30: dayjs('2024-01-15 10:30:00').valueOf(),
  value31: [dayjs('2024-01-01').valueOf(), dayjs('2024-01-31').valueOf()],
  value32: [dayjs('2024-01-01 09:00:00').valueOf(), dayjs('2024-01-31 18:00:00').valueOf()],
  value33: [dayjs('2024-01-01 09:00:00').valueOf(), dayjs('2024-01-01 18:00:00').valueOf()],
  value34: [dayjs('2024-01-01').valueOf(), dayjs('2024-01-14').valueOf()],
  value35: [dayjs('2024-01-01').valueOf(), dayjs('2024-06-30').valueOf()],
  value36: [dayjs('2024-01-01').valueOf(), dayjs('2024-09-30').valueOf()],
  value37: [dayjs('2023-01-01').valueOf(), dayjs('2025-12-31').valueOf()],
  value38: `pnpm install
pnpm run build
pnpm run deploy --env production`,
  value39: `{
  "service": "user-auth",
  "port": 8080,
  "replicas": 3
}`,
})
const statusEnum = reactive({
  all: { text: '全部', disabled: true, status: 'Default' },
  open: { text: '待处理', status: 'Error' },
  closed: { text: '已完成', status: 'Success' },
  processing: { text: '进行中', status: 'Processing' },
})
onMounted(() => {
  console.log(inputRef.value, '测试')
})
</script>

<template>
  <div class="p-6 flex flex-col  gap-6">
    <div class="m-b-4">
      <span>模式：</span>
      <a-segmented
        v-model:value="state"
        :options="[
          { label: '只读 read', value: 'read' },
          { label: '编辑 edit', value: 'edit' },
        ]"
      />
    </div>
    <a-descriptions :column="2" title="文本与展示类">
      <a-descriptions-item label="空字符串">
        <ProField text="" mode="read" />
      </a-descriptions-item>
      <a-descriptions-item label="文本 text">
        <ProField
          ref="inputRef"
          v-model:value="modelValue.value1"
          v-model:text="modelValue.value1"
          value-type="text"
          :field-props="{
            class: 'sd',
          }"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="文本域 textarea">
        <ProField
          v-model:value="modelValue.value2"
          v-model:text="modelValue.value2"
          value-type="textarea"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="密码 password">
        <ProField
          v-model:value="modelValue.value3"
          v-model:text="modelValue.value3"
          value-type="password"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="头像 avatar">
        <ProField
          text="https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
          value-type="avatar"
          mode="read"
        />
      </a-descriptions-item>
      <a-descriptions-item label="图片 image">
        <ProField
          v-model:text="modelValue.value4"
          v-model:value="modelValue.value4"
          value-type="image"
          :mode="state"
        />
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions :column="2" title="数值类">
      <a-descriptions-item label="金额 money">
        <ProField
          v-model:value="modelValue.value5"
          v-model:text="modelValue.value5"
          value-type="money"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="数字 digit">
        <ProField
          v-model:value="modelValue.value6"
          v-model:text="modelValue.value6"
          value-type="digit"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="数字范围 digitRange">
        <ProField
          v-model:value="modelValue.value7"
          v-model:text="modelValue.value7"
          value-type="digitRange"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="秒格式化 second">
        <ProField
          v-model:value="modelValue.value8"
          v-model:text="modelValue.value8"
          value-type="second"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="百分比 percent">
        <ProField
          v-model:value="modelValue.value9"
          v-model:text="modelValue.value9"
          value-type="percent"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="百分比（带颜色)">
        <a-space>
          <ProField
            :text="15"
            :value-type="{ type: 'percent', showSymbol: true, showColor: true }"
            mode="read"
          />
          <ProField
            :text="0"
            :value-type="{ type: 'percent', showSymbol: true, showColor: true }"
            mode="read"
          />
          <ProField
            :text="-8"
            :value-type="{ type: 'percent', showSymbol: true, showColor: true }"
            mode="read"
          />
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="进度 progress">
        <ProField
          v-model:value="modelValue.value10"
          v-model:text="modelValue.value10"
          value-type="progress"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="评分 rate">
        <ProField
          v-model:value="modelValue.value11"
          v-model:text="modelValue.value11"
          value-type="rate"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="滑动条 slider">
        <ProField
          v-model:value="modelValue.value12"
          v-model:text="modelValue.value12"
          value-type="slider"
          :mode="state"
        />
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions :column="2" title="枚举选择类">
      <a-descriptions-item label="选择框 select">
        <ProField
          v-model:value="modelValue.value13"
          v-model:text="modelValue.value13"
          :value-enum="statusEnum"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="单选 radio">
        <ProField
          v-model:value="modelValue.value14"
          v-model:text="modelValue.value14"
          :value-enum="statusEnum"
          value-type="radio"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="单选按钮 radioButton">
        <ProField
          v-model:value="modelValue.value15"
          v-model:text="modelValue.value15"
          :value-enum="statusEnum"
          value-type="radioButton"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="多选 checkbox">
        <ProField
          v-model:value="modelValue.value16"
          v-model:text="modelValue.value16"
          :value-enum="statusEnum"
          value-type="checkbox"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="开关 switch">
        <ProField
          v-model:value="modelValue.value17"
          v-model:text="modelValue.value17"
          value-type="switch"
          :mode="state"
        />
      </a-descriptions-item>
      <a-descriptions-item label="分段选择 segmented">
        <ProField
          v-model:value="modelValue.value18"
          v-model:text="modelValue.value18"
          value-type="segmented"
          :mode="state"
          :value-enum="statusEnum"
        />
      </a-descriptions-item>
      <a-descriptions-item label="远程选择框 select(request)">
        <ProField
          v-model:value="modelValue.value19"
          v-model:text="modelValue.value19"
          value-type="select"
          :mode="state"
          :request="async () => [
            { label: '全部', value: 'all', status: 'Default' },
            { label: '待处理', value: 'open', status: 'Error' },
            { label: '已完成', value: 'closed', status: 'Success' },
            { label: '进行中', value: 'processing', status: 'Processing' },
          ]"
        />
      </a-descriptions-item>
      <a-descriptions-item label="级联选择 cascader">
        <ProField
          v-model:value="modelValue.value20"
          v-model:text="modelValue.value20"
          value-type="cascader"
          :field-props="{
            fieldNames: { label: 'name' },
          }"
          :mode="state"
          :request="async () => [
            {
              value: 'zhejiang',
              name: '浙江省',
              children: [
                {
                  value: 'hangzhou',
                  name: '杭州市',
                  children: [{ value: 'xihu', name: '西湖区' }],
                },
              ],
            },
            {
              value: 'jiangsu',
              name: '江苏省',
              children: [
                {
                  value: 'nanjing',
                  name: '南京市',
                  children: [{ value: 'gulou', name: '鼓楼区' }],
                },
              ],
            },
          ]"
        />
      </a-descriptions-item>
      <a-descriptions-item label="树形选择 treeSelect">
        <ProField
          v-model:value="modelValue.value21"
          v-model:text="modelValue.value21"
          value-type="treeSelect"
          :mode="state"
          :field-props="{
            options: [
              {
                label: '技术研发部',
                value: 'tech',
                children: [
                  { label: '前端开发组', value: 'tech-fe' },
                  { label: '后端开发组', value: 'tech-be' },
                ],
              },
              {
                label: '产品设计部',
                value: 'product',
                children: [
                  { label: '产品策划组', value: 'product-pm' },
                  { label: 'UX 设计组', value: 'product-ux' },
                ],
              },
            ],
          }"
        />
      </a-descriptions-item>
      <a-descriptions-item label="颜色选择 color">
        <ProField
          v-model:value="modelValue.value22"
          v-model:text="modelValue.value22"
          value-type="color"
          :mode="state"
        />
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions :column="2" title="日期时间类">
      <a-descriptions-item label="日期 date">
        <ProField
          v-model:value="modelValue.value23"
          v-model:text="modelValue.value23"
          :mode="state"
          value-type="date"
        />
      </a-descriptions-item>
      <a-descriptions-item label="日期时间 dateTime">
        <ProField
          v-model:value="modelValue.value24"
          v-model:text="modelValue.value24"
          :mode="state"
          value-type="dateTime"
        />
      </a-descriptions-item>
      <a-descriptions-item label="周 dateWeek">
        <ProField
          v-model:value="modelValue.value25"
          v-model:text="modelValue.value25"
          :mode="state"
          value-type="dateWeek"
        />
      </a-descriptions-item>
      <a-descriptions-item label="月 dateMonth">
        <ProField
          v-model:value="modelValue.value26"
          v-model:text="modelValue.value26"
          :mode="state"
          value-type="dateMonth"
        />
      </a-descriptions-item>
      <a-descriptions-item label="季度 dateQuarter">
        <ProField
          v-model:value="modelValue.value27"
          v-model:text="modelValue.value27"
          :mode="state"
          value-type="dateQuarter"
        />
      </a-descriptions-item>
      <a-descriptions-item label="年 dateYear">
        <ProField
          v-model:value="modelValue.value28"
          v-model:text="modelValue.value28"
          :mode="state"
          value-type="dateYear"
        />
      </a-descriptions-item>
      <a-descriptions-item label="时间 time">
        <ProField
          v-model:value="modelValue.value29"
          v-model:text="modelValue.value29"
          :mode="state"
          value-type="time"
        />
      </a-descriptions-item>
      <a-descriptions-item label="相对时间 fromNow">
        <ProField
          v-model:value="modelValue.value30"
          v-model:text="modelValue.value30"
          :mode="state"
          value-type="fromNow"
        />
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions :column="2" title="日期范围类">
      <a-descriptions-item label="日期范围 dateRange">
        <ProField
          v-model:value="modelValue.value31"
          v-model:text="modelValue.value31"
          :mode="state"
          value-type="dateRange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="日期时间范围 dateTimeRange">
        <ProField
          v-model:value="modelValue.value32"
          v-model:text="modelValue.value32"
          :mode="state"
          value-type="dateTimeRange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="时间范围 timeRange">
        <ProField
          v-model:value="modelValue.value33"
          v-model:text="modelValue.value33"
          :mode="state"
          value-type="timeRange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="周范围 dateWeekRange">
        <ProField
          v-model:value="modelValue.value34"
          v-model:text="modelValue.value34"
          :mode="state"
          value-type="dateWeekRange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="月范围 dateMonthRange">
        <ProField
          v-model:value="modelValue.value35"
          v-model:text="modelValue.value35"
          :mode="state"
          value-type="dateMonthRange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="季度范围 dateQuarterRange">
        <ProField
          v-model:value="modelValue.value36"
          v-model:text="modelValue.value36"
          :mode="state"
          value-type="dateQuarterRange"
        />
      </a-descriptions-item>
      <a-descriptions-item label="年范围 dateYearRange">
        <ProField
          v-model:value="modelValue.value37"
          v-model:text="modelValue.value37"
          :mode="state"
          value-type="dateYearRange"
        />
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions :column="2" title="代码类">
      <a-descriptions-item label="代码块 code">
        <ProField
          v-model:value="modelValue.value38"
          v-model:text="modelValue.value38"
          :mode="state"
          value-type="code"
        />
      </a-descriptions-item>
      <a-descriptions-item label="JSON 代码块 jsonCode">
        <ProField
          v-model:value="modelValue.value39"
          v-model:text="modelValue.value39"
          :mode="state"
          value-type="jsonCode"
        />
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<style scoped></style>
