<script lang="ts" setup>
import { CheckOutlined, CodeOutlined, CopyOutlined, ThunderboltOutlined } from '@antdv-next/icons'
import { aquaBlue, atomDark } from '@codesandbox/sandpack-themes'
import { useClipboard, useDebounceFn } from '@vueuse/core'
import { SandpackProvider } from 'sandpack-vue3'
import { computed, markRaw, onMounted, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ExpandIcon, ExternalLinkIcon } from '@/components/icons'
import { useLocale } from '@/composables/use-locale'
import { useAppStore } from '@/store/modules/app'
import { compileSfcSource } from '../../utils/compileSfc'
import { loadPlaygroundUrl } from '../../utils/playground'
import { openStackBlitz } from '../../utils/stackblitz'
import { transformVueTsToJs } from '../../utils/tsToJs'
import CodeEditorBridge from '../CodeEditorBridge/index.vue'

type DemoCodeType = 'ts' | 'js'
defineOptions({
  name: 'CodeDemoInline',
})
const props = defineProps<CodeDemoInlineProps>()
interface CodeDemoInlineProps {
  id?: string
  source: string
  standalone?: boolean
}
const { t } = useLocale()
const router = useRouter()
const appStore = useAppStore()
const showCode = shallowRef(false)
const component = shallowRef<any>(null)
const liveComponent = shallowRef<any>(null)
const compileError = shallowRef<string | null>(null)
const currentCode = shallowRef<string | null>(null)
const jsSourceCode = shallowRef('')
const editorBridgeRef = shallowRef<{ resetCode: (code: string) => void }>()

const decodedSource = computed(() => decodeURIComponent(props.source))
const codeType = computed<DemoCodeType>({
  get() {
    return appStore.demoCodeType
  },
  set(value) {
    appStore.setDemoCodeType(value)
  },
})
const activeSourceCode = computed(() => {
  if (currentCode.value !== null)
    return currentCode.value

  if (codeType.value === 'js')
    return jsSourceCode.value || decodedSource.value

  return decodedSource.value
})
const previewComponent = computed(() => liveComponent.value || component.value)
const sandpackTheme = computed(() => appStore.darkMode ? atomDark : aquaBlue)
const sandpackFiles = computed(() => ({
  '/src/App.vue': activeSourceCode.value,
}))
const standaloneHref = computed(() => {
  if (props.id) {
    return router.resolve({
      path: `/~demos/${props.id}`,
    }).href
  }

  return router.resolve({
    path: '/~demos/inline',
    query: {
      source: props.source,
    },
  }).href
})

const { copied, copy } = useClipboard({
  source: activeSourceCode,
  legacy: true,
})

async function compilePreview(source: string, target: 'base' | 'live') {
  const result = await compileSfcSource(source)
  if (result.component) {
    if (target === 'base')
      component.value = markRaw(result.component)
    else
      liveComponent.value = markRaw(result.component)
    compileError.value = null
    return
  }

  if (target === 'base')
    component.value = null
  else
    liveComponent.value = null
  compileError.value = result.error
}

const handleCodeChange = useDebounceFn(async (newCode: string) => {
  currentCode.value = newCode
  if (newCode === decodedSource.value) {
    liveComponent.value = null
    compileError.value = null
    return
  }
  await compilePreview(newCode, 'live')
}, 300)

function handleShowCode() {
  showCode.value = !showCode.value
  if (!showCode.value) {
    liveComponent.value = null
    compileError.value = null
    currentCode.value = null
  }
}

watch(codeType, () => {
  liveComponent.value = null
  compileError.value = null
  currentCode.value = null
  editorBridgeRef.value?.resetCode(activeSourceCode.value)
})

function handleOpenPlayground() {
  const url = loadPlaygroundUrl(activeSourceCode.value)
  window.open(url, '_blank', 'noopener,noreferrer')
}

function handleStackBlitz() {
  openStackBlitz('Pro Components Vue Inline Demo', activeSourceCode.value)
}

watch(decodedSource, async (source) => {
  currentCode.value = null
  liveComponent.value = null
  jsSourceCode.value = await transformVueTsToJs(source)
  editorBridgeRef.value?.resetCode(activeSourceCode.value)
  await compilePreview(source, 'base')
})

onMounted(() => {
  void transformVueTsToJs(decodedSource.value).then((source) => {
    jsSourceCode.value = source
  })
  void compilePreview(decodedSource.value, 'base')
})
</script>

<template>
  <section class="ant-doc-demo-box ant-doc-inline-demo border-solid border-color-split border-1px">
    <section class="vp-raw ant-doc-demo-box-demo">
      <Suspense>
        <component :is="previewComponent" v-if="previewComponent" />
        <a-alert v-else-if="compileError" type="error" show-icon :message="compileError" />
        <a-skeleton v-else active :paragraph="{ rows: 4 }" />
      </Suspense>
    </section>
    <section v-if="!standalone" class="ant-doc-demo-box-meta markdown">
      <a-flex class="ant-doc-demo-box-actions" justify="center" align="center" gap="middle">
        <a-tooltip :title="t('ui.codeDemo.action.stackblitz')">
          <button class="ant-doc-demo-box-code-action" type="button" @click="handleStackBlitz">
            <ThunderboltOutlined />
          </button>
        </a-tooltip>
        <a-tooltip :title="t('ui.codeDemo.action.externalLink')">
          <a class="ant-doc-demo-box-code-action" :href="standaloneHref" target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon />
          </a>
        </a-tooltip>
        <a-tooltip :title="t('ui.codeDemo.action.openPlayground')">
          <button class="ant-doc-demo-box-code-action" type="button" @click="handleOpenPlayground">
            <CodeOutlined />
          </button>
        </a-tooltip>
        <a-tooltip :title="t(`ui.codeDemo.action.${showCode ? 'expandedCode' : 'expandCode'}`)">
          <button class="ant-doc-demo-box-code-action ant-doc-demo-box-expand-icon" type="button" @click="handleShowCode">
            <ExpandIcon :expanded="showCode" />
          </button>
        </a-tooltip>
      </a-flex>
    </section>
    <template v-if="showCode || standalone">
      <div class="ant-doc-demo-box-code-tabs">
        <a-tabs
          v-model:active-key="codeType"
          centered
          size="small"
          :items="[{
            key: 'ts',
            label: t('ui.codeDemo.type.typescript'),
          }, {
            key: 'js',
            label: t('ui.codeDemo.type.javascript'),
          }]"
        />
      </div>
      <div class="ant-doc-demo-box-code">
        <a-tooltip :title="t(`ui.codeDemo.action.${copied ? 'copied' : 'copy'}`)">
          <button class="ant-doc-demo-box-code-copy" :class="copied ? 'ant-doc-demo-box-code-copied' : ''" type="button" @click="copy()">
            <CopyOutlined v-if="!copied" />
            <CheckOutlined v-else />
          </button>
        </a-tooltip>
        <SandpackProvider
          template="vite-vue-ts"
          :files="sandpackFiles"
          :theme="{
            ...sandpackTheme,
            syntax: {
              ...sandpackTheme.syntax,
              keyword: {
                color: '#a626a4',
              },
              plain: {
                color: 'rgba(0,0,0,0.88)',
              },
            },
            font: {
              ...sandpackTheme.font,
              mono: `${'Lucida Console'},Consolas, Monaco, Andale Mono,${'Ubuntu Mono'}, monospace`,
              body: `${'Lucida Console'},Consolas, Monaco, Andale Mono,${'Ubuntu Mono'}, monospace`,
            },
          }"
          :options="{ autorun: false }"
        >
          <CodeEditorBridge
            ref="editorBridgeRef"
            @update:code="handleCodeChange"
          />
        </SandpackProvider>
      </div>
      <button v-if="!standalone" class="ant-doc-demo-box-collapse-btn" type="button" @click="handleShowCode">
        <ExpandIcon :expanded="showCode" />
        <span>{{ t('ui.codeDemo.action.expandedCode') }}</span>
      </button>
    </template>
  </section>
</template>

<style scoped>
.ant-doc-inline-demo {
  display: flow-root;
  margin: 16px 0;
  border-radius: 8px;
  background: var(--ant-color-bg-container);
  overflow: hidden;
}

.ant-doc-demo-box-demo {
  padding: 42px 24px 50px;
  border-bottom: 1px solid var(--ant-color-split);
  background: var(--ant-color-bg-container);
}

.ant-doc-demo-box-meta {
  padding: 8px 12px;
  background: var(--ant-color-bg-container);
}

.ant-doc-demo-box-actions {
  min-height: 28px;
}

.ant-doc-demo-box-code-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 4px;
  color: var(--ant-color-text-secondary);
  background: transparent;
  cursor: pointer;
  transition: color 0.2s;
}

.ant-doc-demo-box-code-action:hover {
  color: var(--ant-color-primary);
}

.ant-doc-demo-box-code {
  position: relative;
  line-height: 1;
}

.ant-doc-demo-box-code-tabs {
  border-top: 1px dashed var(--ant-color-split);
}

.ant-doc-demo-box-code-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.ant-doc-demo-box-code-copy {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  width: 24px;
  height: 24px;
  color: var(--ant-color-icon);
  background: transparent;
  cursor: pointer;
  transition: color 0.2s;
}

.ant-doc-demo-box-code-copy:hover,
.ant-doc-demo-box-code-copied {
  color: var(--ant-color-primary);
}

.ant-doc-demo-box-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-top: 1px dashed var(--ant-color-split);
  padding: 8px;
  width: 100%;
  color: var(--ant-color-text-secondary);
  background: var(--ant-color-bg-container);
  cursor: pointer;
}

.ant-doc-demo-box-collapse-btn:hover {
  color: var(--ant-color-primary);
}

.ant-doc-demo-box-code :deep(.sp-wrapper),
.ant-doc-demo-box-code :deep(.sp-layout),
.ant-doc-demo-box-code :deep(.sp-stack),
.ant-doc-demo-box-code :deep([class*='sp-code-editor']) {
  border: none !important;
  background: transparent !important;
}

.ant-doc-demo-box-code :deep(.sp-layout) {
  display: block;
}

.ant-doc-demo-box-code :deep(.cm-editor) {
  background: transparent;
  font-size: var(--ant-font-size);
}

.ant-doc-demo-box-code :deep(.cm-activeLine),
.ant-doc-demo-box-code :deep(.cm-activeLineGutter) {
  background: transparent;
}

.ant-doc-demo-box-code :deep(.cm-gutters) {
  border: none;
  background: transparent;
}

.ant-doc-demo-box-code :deep(.sp-button),
.ant-doc-demo-box-code :deep(.sp-read-only) {
  display: none !important;
}
</style>
