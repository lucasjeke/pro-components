<script setup lang="ts">
import { Repl } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import { useDark, useEventListener, useLocalStorage } from '@vueuse/core'
import { theme } from 'antdv-next'
import { computed, ref, watch, watchEffect } from 'vue'
import ConsolePanel from '@/components/ConsolePanel.vue'
import Header from '@/components/Header.vue'
import { useStore } from './composables/store'
import { useConsole } from './composables/use-console'

const loading = ref(true)
const replRef = ref<InstanceType<typeof Repl>>()
const showConsole = useLocalStorage('console-visible', false)
const consoleHeight = useLocalStorage('console-height', 200)
const { logs, clearLogs } = useConsole()

const AUTO_SAVE_KEY = 'auto-save-state'
function getAutoSaveState() {
  return JSON.parse(localStorage.getItem(AUTO_SAVE_KEY) || 'true')
}
function setAutoSaveState(value: boolean) {
  localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(value))
}

const autoSave = ref(getAutoSaveState())

const previewOptions = {
  showRuntimeError: false,
  headHTML: `
    <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"><\/script>
    <script>
      window.__unocss = {
        rules: [],
        presets: [],
      }
    <\/script>
    <div id="__preview-loading" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:var(--bg,#fff);z-index:9999;transition:opacity .3s">
      <svg width="36" height="36" viewBox="0 0 24 24" style="animation:spin 1s linear infinite;color:#1677ff"><style>@keyframes spin{to{transform:rotate(360deg)}}</style><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="3" d="M12 3a9 9 0 0 1 9 9" /></svg>
    </div>
    <script>
      const __ob = new MutationObserver(() => {
        if (document.getElementById('app')?.children.length) {
          const el = document.getElementById('__preview-loading');
          if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }
          __ob.disconnect();
        }
      });
      document.addEventListener('DOMContentLoaded', () => {
        const app = document.getElementById('app');
        if (app) __ob.observe(app, { childList: true, subtree: true });
      });
    <\/script>
    <style>
html.dark #__preview-loading { background: #141414; }
:root {
--scrollbar-size: 6px;
}
    * {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
      ::-webkit-scrollbar {
  width: var(--scrollbar-size);
}

::-webkit-scrollbar:horizontal {
  height: var(--scrollbar-size);
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.3);
  }
}

.dark {
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    &:hover {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
}
    </style>
  `,
}

const dark = useDark()

const urlTheme = new URLSearchParams(location.search).get('theme')
if (urlTheme === 'dark') {
  dark.value = true
}

// antdv-next theme config: use darkAlgorithm when dark mode
const { darkAlgorithm, defaultAlgorithm } = theme
const themeConfig = computed(() => ({
  algorithm: dark.value ? darkAlgorithm : defaultAlgorithm,
}))

const store = useStore({
  serializedState: location.hash.slice(1),
  initialized: () => {
    loading.value = false
  },
})

function handleKeydown(evt: KeyboardEvent) {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === 'KeyS') {
    evt.preventDefault()
  }
}

useEventListener(globalThis, 'keydown', (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === 'Backquote') {
    evt.preventDefault()
    showConsole.value = !showConsole.value
  }
})

// persist state & clear console on file changes
watchEffect(() => {
  const serialized = store.serialize()
  history.replaceState(
    {},
    '',
    `${location.origin}${location.pathname}#${serialized}`,
  )
  clearLogs()
})

function refreshPreview() {
  clearLogs()
  replRef.value?.reload()
}

watch(autoSave, setAutoSaveState)
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <div v-if="!loading" antialiased>
      <Header
        :store="store"
        :show-console="showConsole"
        @refresh="refreshPreview"
        @toggle-console="showConsole = !showConsole"
      />
      <Repl
        ref="replRef"
        v-model="autoSave"
        :theme="dark ? 'dark' : 'light'"
        :preview-theme="true"
        :store="store"
        :editor="Monaco"
        :preview-options="previewOptions"
        @keydown="handleKeydown"
      />
      <Teleport defer to=".vue-repl .right">
        <ConsolePanel
          v-if="showConsole"
          v-model:height="consoleHeight"
          :logs="logs"
          @clear="clearLogs"
        />
      </Teleport>
    </div>
    <template v-else>
      <div h-100vh flex items-center justify-center>
        <a-spin size="large" description="Loading..." />
      </div>
    </template>
  </a-config-provider>
</template>

<style>
body {
  --at-apply: m-none text-13px overflow-hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height)) !important;
}

.vue-repl .right {
  display: flex !important;
  flex-direction: column !important;
}

.vue-repl .right > .tab-buttons {
  flex-shrink: 0;
}

.vue-repl .right > .output-container {
  flex: 1;
  height: auto !important;
  min-height: 0;
}

.dark .vue-repl,
.vue-repl {
  --color-branding: #1677ff !important;
}

.dark body {
  background-color: #1a1a1a;
}
</style>
