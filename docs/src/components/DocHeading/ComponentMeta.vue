<script lang="ts" setup>
import type { Frontmatter } from '@/composables/doc-page.ts'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'ComponentMeta' })

const props = defineProps<{
  frontmatter?: Frontmatter
}>()

const route = useRoute()

const isEnUS = computed(() => route.path.includes('/en-US'))

const locale = computed(() => (isEnUS.value
  ? { import: 'Import', copy: 'Copy', copied: 'Copied' }
  : { import: '使用', copy: '复制', copied: '已复制' }))

const slug = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const last = segments[segments.length - 1] ?? ''
  return last.replace(/-cn$/, '')
})

const component = computed(() => props.frontmatter?.title)

// Some pages don't map 1:1 to a single named export or source directory, so
// override the import snippet / source path for those (keyed by docs slug).
const IMPORT_OVERRIDES: Record<string, string> = {
  'login-form': `import { ProLoginForm, ProLoginFormPage } from '@antdv-next1/pro-components'`,
  'modal-form': `import { ProModalForm, ProDrawerForm } from '@antdv-next1/pro-components'`,
  'query-filter': `import { ProQueryFilter, ProLightFilter } from '@antdv-next1/pro-components'`,
  'schema-form': `import { SchemaForm } from '@antdv-next1/pro-components'`,
}

const show = computed(() =>
  props.frontmatter?.category === 'Components'
  && props.frontmatter?.showImport !== false
  && !!component.value
  && !!slug.value)

const importCode = computed(() => {
  return IMPORT_OVERRIDES[slug.value] ?? `import { ${component.value} } from '@antdv-next1/pro-components'`
})

const copied = ref(false)
async function onCopy() {
  try {
    await navigator.clipboard.writeText(importCode.value)
    copied.value = true
  }
  catch {
    copied.value = false
  }
}
function onOpenChange(open: boolean) {
  if (open) {
    copied.value = false
  }
}
</script>

<template>
  <template v-if="show">
    <a-descriptions
      size="small"
      :colon="false"
      :column="1"
      class="component-meta"
      style="margin-top: 16px"
    >
      <a-descriptions-item :label="locale.import">
        <a-tooltip placement="right" :title="copied ? locale.copied : locale.copy" @open-change="onOpenChange">
          <a-typography-text class="component-meta-code" style="cursor: pointer" @click="onCopy">
            {{ importCode }}
          </a-typography-text>
        </a-tooltip>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
  </template>
</template>

<style scoped>
.component-meta :deep(.component-meta-code) {
  position: relative;
  display: inline-flex;
  align-items: center;
  column-gap: var(--ant-padding-xxs);
  border-radius: var(--ant-border-radius-sm);
  padding-inline: var(--ant-padding-xxs);
  transition: all var(--ant-motion-duration-slow);
  font-family: var(--ant-font-family-code, monospace);
  color: var(--ant-color-text-secondary);
}
.component-meta :deep(.component-meta-code:hover) {
  background: var(--ant-control-item-bg-hover);
}
.component-meta :deep(a.component-meta-code:hover) {
  text-decoration: underline;
}
.component-meta-icon {
  margin-inline-end: 4px;
}
</style>
