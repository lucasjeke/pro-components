<docs lang="zh-CN">
手动设置轻量筛选的弹出框，默认为 `bottomLeft`
</docs>

<docs lang="en-US">
手动设置轻量筛选的弹出框，默认为 `bottomLeft`
</docs>

<script lang="ts" setup>
import type { TooltipPlacement } from 'antdv-next'
import { ProFormDatePicker, ProFormDateRangePicker, ProFormDateTimePicker, ProFormDateTimeRangePicker, ProFormDigit, ProFormFieldSet, ProFormSelect, ProFormSlider, ProFormSwitch, ProFormText, ProFormTimePicker, ProFormTimeRangePicker, ProLightFilter } from '@antdv-next1/pro-components'
import { RadioButton, RadioGroup } from 'antdv-next'
import { shallowRef } from 'vue'

const mode = shallowRef<TooltipPlacement>('topLeft')
</script>

<template>
  <div class="m-b-4">
    <RadioGroup
      :value="mode"
      @change="(e) => {
        mode = e.target.value
      }"
    >
      <RadioButton value="topLeft">
        topLeft
      </RadioButton>
      <RadioButton value="topRight">
        topRight
      </RadioButton>
      <RadioButton value="bottomLeft">
        bottomLeft
      </RadioButton>
      <RadioButton value="bottomRight">
        bottomRight
      </RadioButton>
    </RadioGroup>
    <ProLightFilter
      :placement="mode"
      :style="{
        marginBlockStart: '40px',
      }"
    >
      <ProFormSelect
        name="sex"
        label="性别"
        show-search
        :allow-clear="false"
        :field-props="{
          labelInValue: true,
        }"
        :value-enum="{
          man: '男',
          woman: '女',
        }"
      />
      <ProFormSelect
        name="area"
        label="地区"
        mode="multiple"
        :value-enum="{
          beijing: '北京',
          shanghai: '上海',
          hangzhou: '杭州',
          long: '这是一个很长的用来测试溢出的项目',
        }"
      />
      <ProFormDigit name="count" label="数量" />
      <ProFormSlider name="range" label="范围" range />
      <ProFormSlider name="slider" label="范围" />
      <ProFormText name="name1" label="名称" />
      <ProFormSwitch name="open" label="开关" secondary />
      <ProFormText name="name2" label="地址" secondary />
      <ProFormDatePicker
        name="name3"
        label="不能清空的日期"
        :allow-clear="false"
      />
      <ProFormDateRangePicker name="date" label="日期范围" />
      <ProFormDateTimePicker name="datetime" label="日期时间" />
      <ProFormDateTimeRangePicker
        name="datetimeRanger"
        label="日期时间范围"
      />
      <ProFormTimePicker name="time" label="时间" />
      <ProFormTimeRangePicker name="timeRanger" label="时间范围" />
      <ProFormFieldSet name="name" label="姓名">
        <ProFormText />
        <ProFormText />
      </ProFormFieldSet>
    </ProLightFilter>
  </div>
</template>

<style scoped></style>
