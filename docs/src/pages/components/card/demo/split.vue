<docs lang="zh-CN">
通过卡片切分能力我们可以实现更加复杂的数据展现形式。
</docs>

<docs lang="en-US">
通过卡片切分能力我们可以实现更加复杂的数据展现形式。
</docs>

<script setup lang="ts">
import { ProCard } from '@antdv-next1/pro-components'
import ResizeObserver from '@v-c/resize-observer'
import { shallowRef } from 'vue'

const responsive = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <ResizeObserver
      key="resize-observer"
      @resize="(offset) => {
        responsive = offset.width < 596
      }"
    >
      <ProCard
        title="Complex Split"
        extra="September 28, 2019"
        variant="outlined"
        header-bordered
        :split="responsive ? 'horizontal' : 'vertical'"
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard :split="responsive ? 'horizontal' : 'vertical'">
              <ProCard title="Yesterday's Total Traffic">
                123
              </ProCard>
              <ProCard title="Total Traffic This Month">
                234
              </ProCard>
              <ProCard title="Total Traffic This Year">
                345
              </ProCard>
            </ProCard>
            <!-- <ProCard split="vertical">
              <ProCard title="Ongoing Experiments">
                12/56
              </ProCard>
              <ProCard title="Total Historical Experiments">
                134
              </ProCard>
            </ProCard> -->
          </ProCard>
          <!-- <ProCard title="Traffic Trends">
            <div>Chart</div>
            <div>Chart</div>
            <div>Chart</div>
            <div>Chart</div>
            <div>Chart</div>
          </ProCard> -->
        </ProCard>
        <ProCard title="Traffic Usage">
          Right Side Content
        </ProCard>
      </ProCard>
    </ResizeObserver>
  </div>
</template>

<style scoped></style>
