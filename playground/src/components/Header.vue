<script setup lang="ts">
import type { Ref } from 'vue'
import type { Store, VersionKey } from '@/composables/store'
import { languageToolsVersion } from '@vue/repl'
import { useDark } from '@vueuse/core'
import { message } from 'antdv-next'
import { reactive, ref } from 'vue'
import { useTypeLoadingState } from '@/composables/use-type-loading-state'
import {
  getSupportedAntdvVersions,
  getSupportedProComponentsVersions,
  getSupportedTSVersions,
  getSupportedVueVersions,
} from '@/utils/dependency'

import Settings from './Settings.vue'

const { store } = defineProps<{
  store: Store
  showConsole: boolean
}>()
const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'reset'): void
  (e: 'toggleConsole'): void
}>()
const appVersion = import.meta.env.APP_VERSION
const replVersion = import.meta.env.REPL_VERSION
const dtsStatus = useTypeLoadingState()
const dtsLabels: Record<string, string> = {
  initializing: 'Fetching types...',
  loading: 'Resolving types...',
  ready: 'Types ready',
}

const showReset = ref(false)
const dark = useDark()

function toggleDark(event?: MouseEvent) {
  const isSupported
    = typeof document.startViewTransition === 'function'
      && !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isSupported || !event) {
    dark.value = !dark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  const transition = document.startViewTransition!(() => {
    dark.value = !dark.value
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}

interface Version {
  text: string
  published: Ref<string[]>
  active: string
  hint?: string
}

const versions = reactive<Record<VersionKey, Version>>({
  proComponents: {
    text: 'Pro Components',
    published: getSupportedProComponentsVersions(),
    active: store.versions.proComponents,
  },
  antdvNext: {
    text: 'Antdv Next',
    published: getSupportedAntdvVersions(),
    active: store.versions.antdvNext,
  },
  vue: {
    text: 'Vue',
    published: getSupportedVueVersions(),
    active: store.versions.vue,
    hint: 'Antdv Next requires Vue >= 3.5.0',
  },
  typescript: {
    text: 'TypeScript',
    published: getSupportedTSVersions(),
    active: store.versions.typescript,
  },
})

async function setVersion(key: VersionKey, v: string) {
  versions[key].active = `loading...`
  await store.setVersion(key, v)
  versions[key].active = v
}

async function copyLink() {
  await navigator.clipboard.writeText(location.href)
  message.success('Sharable URL has been copied to clipboard.')
}

function refreshView() {
  emit('refresh')
}
function resetFiles() {
  showReset.value = false
  store.resetFiles()
}
</script>

<template>
  <nav>
    <div leading="[var(--nav-height)]" m-0 flex items-center font-medium>
      <img relative mr-2 h-24px v="mid" top="-2px" alt="logo" src="../assets/logo.png">
      <div flex="~ gap-1" items-center lt-sm-hidden>
        <div text-xl>
          Pro Components Vue Playground
        </div>
        <div flex="~ col gap-1">
          <a-tag size="small">
            v{{ appVersion }}, repl v{{ replVersion }}, language tools v{{
              languageToolsVersion
            }}
          </a-tag>
          <Transition name="fade" mode="out-in">
            <a-tag
              v-if="dtsStatus"
              :key="dtsStatus"
              :color="dtsStatus === 'ready' ? 'success' : 'processing'"
            >
              <div>
                <span
                  v-if="dtsStatus !== 'ready'"
                  i-ri-loader-4-line
                  mr-1
                  inline-block
                  animate-spin
                />
                <span v-else i-ri-check-line mr-1 inline-block />
                {{ dtsLabels[dtsStatus!] }}
              </div>
            </a-tag>
          </Transition>
        </div>
        <div flex="~ col gap-1">
          <a-tag v-if="store.pr" size="small">
            <a
              :href="`https://github.com/lucasjeke/pro-components/pull/${store.pr}`"
              target="_blank"
            >PR {{ store.pr }}</a>
          </a-tag>
          <a-tag v-if="store.vuePr" size="small">
            <a :href="`https://github.com/vuejs/core/pull/${store.vuePr}`" target="_blank">Vue PR {{ store.vuePr }}</a>
          </a-tag>
        </div>
      </div>
    </div>

    <div flex="~ gap-2" items-center>
      <!-- <div v-for="(v, key) of versions" :key="key" flex="~ gap-2" items-center lt-lg-hidden>
        <span flex items-center
          >{{ v.text }}:<a-tooltip v-if="v.hint" :title="v.hint" placement="bottom"
            ><span
              i-ri-information-line
              ml-1
              inline-block
              h-14px
              w-14px
              cursor-help
              op-50 /></a-tooltip
        ></span>
        <a-select
          :value="v.active"
          show-search
          size="small"
          :options="
            v.published.map((ver: string) => ({ label: ver, value: ver }))
          "
          :get-popup-container="
            (trigger: HTMLElement) => trigger.parentElement!
          "
          @change="setVersion(key, $event as string)"
        />
      </div> -->

      <div flex="~ gap-4" text-lg>
        <a-popover v-model:open="showReset" trigger="click">
          <template #content>
            <div flex="~ col gap-2" items-center>
              <div>Want to reset the editor ?</div>
              <a-button size="small" @click="resetFiles">
                Yes
              </a-button>
            </div>
          </template>
          <button i-ri-delete-bin-line hover:color-primary />
        </a-popover>
        <button
          i-ri-refresh-line
          title="Refresh sandbox"
          hover:color-primary
          @click="refreshView"
        />
        <button i-ri-share-line title="Copy link" hover:color-primary @click="copyLink" />
        <button
          i-ri-terminal-box-line
          title="Toggle console"
          hover:color-primary
          :class="{ 'color-primary': showConsole }"
          @click="emit('toggleConsole')"
        />
        <button
          i-ri-sun-line
          title="Toggle theme"
          dark:i-ri-moon-line
          hover:color-primary
          @click="toggleDark($event)"
        />
        <a
          href="https://github.com/lucasjeke/pro-components/tree/main/playground"
          target="_blank"
          flex
          hover:color-primary
        >
          <button title="View on GitHub" i-ri-github-fill />
        </a>

        <a-popover
          trigger="click"
          placement="bottomRight"
          :get-popup-container="
            (trigger: HTMLElement) => trigger.parentElement!
          "
        >
          <template #content>
            <Settings />
          </template>
          <button i-ri:settings-line title="cdn" hover:color-primary />
        </a-popover>
      </div>
    </div>
  </nav>
</template>

<style lang="less">
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;
  --text: #333;

  --at-apply: 'box-border flex justify-between px-4 z-999 relative';

  height: var(--nav-height);
  background-color: var(--bg);
  color: var(--text);
  box-shadow: 0 0 6px #1677ff;

  .ant-select {
    width: 140px;
  }
}

.dark nav {
  --bg: #1a1a1a;
  --bg-light: #242424;
  --border: #383838;
  --text: rgba(255, 255, 255, 0.85);

  --at-apply: 'shadow-none';
  border-bottom: 1px solid var(--border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}
</style>
