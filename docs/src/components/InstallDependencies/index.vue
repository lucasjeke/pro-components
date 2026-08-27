<script setup lang="ts">
import { h } from 'vue'
import BashTabs from './BashTabs/index.vue'
import { BunLogo, NpmLogo, PnpmLogo, YarnLogo } from './icons'
import SourceCode from './SourceCode/index.vue'

interface InstallProps {
  npm?: string
  yarn?: string
  pnpm?: string
  bun?: string
}

defineOptions({ name: 'InstallDependencies' })

const { npm, yarn, pnpm, bun } = defineProps<InstallProps>()
const tabItems = [
  {
    key: 'npm',
    label: 'npm',
    content: () => h(SourceCode, { children: npm }),
    icon: () => h(NpmLogo),
  },
  {
    key: 'yarn',
    label: 'yarn',
    content: () => h(SourceCode, { children: yarn }),
    icon: () => h(YarnLogo),
  },
  {
    key: 'pnpm',
    label: 'pnpm',
    content: () => h(SourceCode, { children: pnpm }),
    icon: () => h(PnpmLogo),
  },
  {
    key: 'bun',
    label: 'Bun',
    content: () => h(SourceCode, { children: bun }),
    icon: () => h(BunLogo),
  },
].filter(item => Boolean(item.content))
</script>

<template>
  <BashTabs :tab-items="tabItems" />
</template>
