<docs lang="zh-CN">
ProCheckCard 可以和表单组件一起使用，这里给出演示示例。。
</docs>

<docs lang="en-US">
ProCheckCard 可以和表单组件一起使用，这里给出演示示例。
</docs>

<script setup lang="ts">
import { ProCheckCard, ProCheckCardGroup } from '@antdv-next1/pro-components'
import { Avatar, Button, Form, FormItem } from 'antdv-next'
import { h, reactive } from 'vue'

const formState = reactive({
  'checkbox-group': undefined,
})
function handleSubmit(values: any) {
  console.log('values', values)
}
</script>

<template>
  <div>
    <Form layout="vertical" :model="formState" @finish="handleSubmit">
      <FormItem name="checkbox-group" label="技术栈">
        <ProCheckCardGroup
          v-model:value="formState['checkbox-group']"
          :style="{ width: '100%' }"
        >
          <ProCheckCard
            title="Spring Boot"
            :avatar="
              h(Avatar, {
                src: 'https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg',
                size: 'large',
              })
            "
            description="通过业界流行的技术栈来快速构建 Java 后端应用"
            value="SpringBoot"
          />
          <ProCheckCard
            title="SOFA Boot"
            :avatar="
              h(Avatar, {
                src: 'https://gw.alipayobjects.com/zos/bmw-prod/6935b98e-96f6-464f-9d4f-215b917c6548.svg',
                size: 'large',
              })
            "
            description="使用 SOFAStack 中间件来快速构建分布式后端应用"
            value="SOFABoot"
          />
          <ProCheckCard
            title="Node JS"
            :avatar="
              h(Avatar, {
                src: 'https://gw.alipayobjects.com/zos/bmw-prod/d12c3392-61fa-489e-a82c-71de0f888a8e.svg',
                size: 'large',
              })
            "
            description="使用前后端统一的语言方案快速构建后端应用"
            value="NodeJS"
          />
        </ProCheckCardGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" html-type="submit">
          Submit
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<style  scoped></style>
