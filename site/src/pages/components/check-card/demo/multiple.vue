<docs lang="zh-CN">
通过设置 `ProCheckCard.Group` 的 `multiple` 属性配置多选，注意多选模式下表单项返回值为数组。
</docs>

<docs lang="en-US">
通过设置 `ProCheckCard.Group` 的 `multiple` 属性配置多选，注意多选模式下表单项返回值为数组。
</docs>

<script setup lang="ts">
import { ProCheckCard, ProCheckCardGroup } from '@antdv-next1/pro-components'
import { ConfigProvider, Flex } from 'antdv-next'
</script>

<template>
  <Flex gap="24" vertical>
    <ProCheckCardGroup
      multiple
      :default-value="['A']"
      @change="
        (value) => {
          console.log('value', value)
        }
      "
    >
      <ProCheckCard
        title="Card A"
        description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
        value="A"
      />
      <ProCheckCard
        title="Card B"
        description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
        value="B"
      />
    </ProCheckCardGroup>
    <ConfigProvider
      :theme="{
        token: {
          // colorPrimary: 'red',
        },
      }"
    >
      <ProCheckCardGroup
        multiple
        :default-value="['A']"
        @change="
          (value) => {
            console.log('value', value)
          }
        "
      >
        <ProCheckCard
          title="Card A"
          description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
          value="A"
        />
        <ProCheckCard
          title="Card B"
          description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念"
          value="B"
        />
      </ProCheckCardGroup>
    </ConfigProvider>
  </Flex>
</template>

<style scoped></style>
