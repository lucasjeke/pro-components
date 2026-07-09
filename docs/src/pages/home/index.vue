<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Footer from '@/layouts/base/components/footer.vue'

const PreviewBanner = defineAsyncComponent(() => import('./components/preview-banner/index.vue'))
</script>

<template>
  <div class="antdv-home-page min-h-100vh">
    <section>
      <Suspense>
        <PreviewBanner />
        <template #fallback>
          <div style="height: 640px;" />
        </template>
      </Suspense>
    </section>
    <Footer />
  </div>
</template>

<style>
.antdv-home-design-framework-decoration-image {
  position: absolute;
  inset-inline-start: 0;
  top: -50px;
  height: 160px;
}
</style>
