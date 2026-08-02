<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from './header.vue'

const route = useRoute()

const currentPath = computed(() => route.path.replace(/^\/en-US/, '') || '/')
</script>

<template>
  <a-layout class="!bg-transparent">
    <Header :class="currentPath === '/' ? '!bg-transparent' : ''" />
    <router-view />
  </a-layout>
</template>
