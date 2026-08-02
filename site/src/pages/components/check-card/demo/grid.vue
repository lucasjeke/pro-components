<docs lang="zh-CN">
`ProCheckCard.Group` 内嵌 `ProCheckCard` 并与 `Grid` 组件一起使用，可以实现更灵活的布局。
</docs>

<docs lang="en-US">
`ProCheckCard.Group` 内嵌 `ProCheckCard` 并与 `Grid` 组件一起使用，可以实现更灵活的布局。
</docs>

<script setup lang="ts">
import { ProCheckCard, ProCheckCardGroup } from '@antdv-next1/pro-components'
import { Col, Row } from 'antdv-next'
</script>

<template>
  <ProCheckCardGroup :style="{ width: '100%' }" size="small">
    <Row>
      <Col :span="8">
        <ProCheckCard title="Card A" description="This is the description" value="A" />
      </Col>
      <Col :span="8">
        <ProCheckCard title="Card B" description="This is the description" value="B" />
      </Col>
      <Col :span="8">
        <ProCheckCard title="Card C" description="This is the description" value="C" />
      </Col>
    </Row>
  </ProCheckCardGroup>
</template>

<style scoped></style>
