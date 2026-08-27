<docs lang="zh-CN">
总分 / 业绩目标
</docs>

<docs lang="en-US">
总分 / 业绩目标
</docs>

<script setup lang="ts">
import { ProCard, ProStatistic, ProStatisticCard, ProStatisticCardGroup } from '@antdv-next1/pro-components'
import ResizeObserver from '@v-c/resize-observer'
import { h, shallowRef } from 'vue'

const responsive = shallowRef(false)
</script>

<template>
  <div class="p-6">
    <ResizeObserver
      @resize="(offset) => {
        responsive = offset.width < 596
      }"
    >
      <ProCard :split="responsive ? 'horizontal' : 'vertical'">
        <ProStatisticCard
          :col-span="responsive ? 24 : 6"
          title="Fiscal Year Performance Target"
          :statistic="{
            value: 82.6,
            suffix: 'Billion',
            description: h(ProStatistic, {
              title: 'Daily Comparison',
              value: '6.47%',
              trend: 'up',
            }),
          }"
          :chart="h('img', {
            src: 'https://gw.alipayobjects.com/zos/alicdn/PmKfn4qvD/mubiaowancheng-lan.svg',
            alt: 'Progress Bar',
            width: '100%',
          })"
          :footer="[
            h(ProStatistic, {
              value: '70.98%',
              title: 'Fiscal Year Performance Completion Rate',
              layout: 'horizontal',
            }),
            h(ProStatistic, {
              value: '86.98%',
              title: 'Performance Completion Rate Same Period Last Year',
              layout: 'horizontal',
            }),
            h(ProStatistic, {
              value: '88.98%',
              title: 'Performance Completion Rate Same Period Year Before Last',
              layout: 'horizontal',
            }),
          ]"
        />
        <ProStatisticCardGroup
          :col-span="responsive ? 24 : 18"
          :direction="responsive ? 'column' : undefined"
        >
          <ProStatisticCard
            :statistic="{
              title: 'Total Revenue for the Fiscal Year',
              value: 601987768,
              description: h(ProStatistic, {
                title: 'Daily Comparison',
                value: '6.15%',
                trend: 'up',
              }),
            }"
            :chart="h('img', {
              src: 'https://gw.alipayobjects.com/zos/alicdn/zevpN7Nv_/xiaozhexiantu.svg',
              alt: 'Line Chart',
              width: '100%',
            })"
          >
            <ProStatistic
              title="Total Market Revenue" value="1982312" layout="vertical"
              :description="h(ProStatistic, {
                title: 'Daily Comparison',
                value: '6.15%',
                trend: 'up',
              })"
            />
          </ProStatisticCard>
          <ProStatisticCard
            :statistic="{
              title: 'Daily Ranking',
              value: 6,
              description: h(ProStatistic, {
                title: 'Daily Comparison',
                value: '3.85%',
                trend: 'down',
              },
              ),
            }"
            :chart="h('img', {
              src: 'https://gw.alipayobjects.com/zos/alicdn/zevpN7Nv_/xiaozhexiantu.svg',
              alt: 'Line Chart',
              width: '100%',
            })"
          >
            <ProStatistic
              title="Revenue in the Last 7 Days"
              value="17458"
              layout="vertical"
              :description="h(ProStatistic, {
                title: 'Daily Comparison',
                value: '6.47%',
                trend: 'up',
              })"
            />
          </ProStatisticCard>
          <ProStatisticCard
            :statistic="{
              title: 'Fiscal Year Performance Revenue Ranking',
              value: 2,
              description: h(ProStatistic, {
                title: 'Daily Comparison',
                value: '6.47%',
                trend: 'up',
              }),
            }"
            :chart="h('img', {
              src: 'https://gw.alipayobjects.com/zos/alicdn/zevpN7Nv_/xiaozhexiantu.svg',
              alt: 'Line Chart',
              width: '100%',
            })"
          >
            <ProStatistic
              title="Monthly Payment Count"
              :value="601"
              layout="vertical"
              :description="h(ProStatistic, {
                title: 'Daily Comparison',
                value: '6.47%',
                trend: 'down',
              })"
            />
          </ProStatisticCard>
        </ProStatisticCardGroup>
      </ProCard>
    </ResizeObserver>
  </div>
</template>

<style scoped>
</style>
