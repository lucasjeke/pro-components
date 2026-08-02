<docs lang="zh-CN">
支持 antdv-next 定义的[栅格式响应布局](https://www.antdv-next.cn/components/grid-cn#grid-demo-responsive)。预设六个响应尺寸：`col-xs` `col-sm` `col-md` `col-lg` `col-xl` `col-xxl`, 其他响应式 `col-span` `col-flex`  `col-pull` `col-offset` `col-order`
</docs>

<docs lang="en-US">
支持 antdv-next 定义的[栅格式响应布局](https://www.antdv-next.cn/components/grid-cn#grid-demo-responsive)。预设六个响应尺寸：`col-xs` `col-sm` `col-md` `col-lg` `col-xl` `col-xxl`, 其他响应式 `col-span` `col-flex`  `col-pull` `col-offset` `col-order`
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
</script>

<template>
  <div class="p-6">
    <ProCard :style="{ marginBlockStart: '8px' }" :gutter="8" title="24 Grid">
      <ProCard
        :col-xs="2"
        :col-sm="4"
        :col-md="6"
        :col-lg="8"
        :col-xl="10"
        layout="center"
        variant="outlined"
      >
        Col
      </ProCard>
      <ProCard
        :col-xs="20"
        :col-sm="16"
        :col-md="12"
        :col-lg="8"
        :col-xl="4"
        layout="center"
        variant="outlined"
      >
        Col
      </ProCard>
      <ProCard
        :col-xs="2"
        :col-sm="4"
        :col-md="6"
        :col-lg="8"
        :col-xl="10"
        layout="center"
        variant="outlined"
      >
        Col
      </ProCard>
    </ProCard>
    <ProCard
      :style="{ marginBlockStart: '8px' }"
      :gutter="8"
      title="Specified Width px"
    >
      <ProCard
        :col-xs="{ flex: '50px' }"
        :col-sm="{ flex: '100px' }"
        :col-md="{ flex: '200px' }"
        :col-lg="{ flex: '300px' }"
        :col-xl="{ flex: '400px' }"
        layout="center"
        variant="outlined"
      >
        Col
      </ProCard>
      <ProCard layout="center" variant="outlined">
        Auto
      </ProCard>
    </ProCard>

    <ProCard
      :style="{ marginBlockStart: '8px' }"
      :gutter="8"
      title="Specified Width Percentage"
    >
      <ProCard layout="center" variant="outlined">
        Auto
      </ProCard>
      <ProCard
        layout="center"
        :col-xs="{ flex: '10%' }"
        :col-sm="{ flex: '20%' }"
        :col-md="{ flex: '30%' }"
        :col-lg="{ flex: '40%' }"
        :col-xl="{ flex: '50%' }"
        variant="outlined"
      >
        Col - Percentage
      </ProCard>
    </ProCard>
  </div>
</template>

<style scoped></style>
