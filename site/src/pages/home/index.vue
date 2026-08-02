<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Footer from '@/layouts/base/components/footer.vue'

const PreviewBanner = defineAsyncComponent(() => import('./components/PreviewBanner/index.vue'))
</script>

<template>
  <div class="min-h-100vh">
    <a-layout-content>
      <Suspense>
        <PreviewBanner />
        <template #fallback>
          <div style="height: 640px;" />
        </template>
      </Suspense>
    </a-layout-content>
    <Footer />
  </div>
</template>

<style scoped>
</style>
