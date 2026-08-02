<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCopyCode } from '@/components/CodeDemo/utils/copy-code'
import BaseConfig from './layouts/base/index.vue'

const route = useRoute()
useCopyCode()
</script>

<template>
  <BaseConfig v-if="!route.path.startsWith('/~demos')">
    <router-view />
  </BaseConfig>
  <router-view v-else />
</template>
