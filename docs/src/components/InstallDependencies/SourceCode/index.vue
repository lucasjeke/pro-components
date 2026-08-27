<script setup lang="ts">
import type { VueNode } from '@v-c/util'
import type { CSSProperties, StyleValue } from 'vue'
import { CheckOutlined, CopyOutlined } from '@antdv-next/icons'
import { useClipboard } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import { codeToSourceTokens } from './highlight'

export interface SourceCodeProps {
  language?: string
  langPrefix?: string
  textarea?: VueNode
  extra?: VueNode
  children?: string
  hideCopy?: boolean
  highlightLines?: number[]
  title?: string
}

defineOptions({ name: 'SourceCode' })
const props = withDefaults(defineProps<SourceCodeProps>(), {
  language: 'bash',
  langPrefix: '',
})

interface SourceCodeToken {
  content: string
  htmlStyle?: CSSProperties
}

const tokenLines = shallowRef<SourceCodeToken[][]>([])
const rootStyle = shallowRef<StyleValue>({})
const highlightId = shallowRef(0)

const sourceCode = computed(() => props.children ?? '')
const normalizedLanguage = computed(() => {
  const language = props.language || 'text'
  if (props.langPrefix && language.startsWith(props.langPrefix))
    return language.slice(props.langPrefix.length) || 'text'
  return language
})

function renderPlainText(source: string) {
  tokenLines.value = source.split('\n').map(line => [{ content: line }])
  rootStyle.value = {}
}

watch(
  [sourceCode, normalizedLanguage],
  async ([source, language]) => {
    const currentId = highlightId.value + 1
    highlightId.value = currentId

    if (!source) {
      tokenLines.value = []
      rootStyle.value = {}
      return
    }

    try {
      const result = await codeToSourceTokens(source, language)

      if (currentId !== highlightId.value)
        return

      tokenLines.value = result.tokens.map(line =>
        line.map(token => ({
          content: token.content,
          htmlStyle: token.htmlStyle as CSSProperties | undefined,
        })),
      )
      rootStyle.value = result.rootStyle
    }
    catch {
      if (currentId !== highlightId.value)
        return
      renderPlainText(source)
    }
  },
  { immediate: true },
)
const { copied, copy } = useClipboard({
  source: sourceCode,
  legacy: true,
})
</script>

<template>
  <div class="source-code language-bash ant-code-theme">
    <a-button
      class="source-code-copy copy"
      :data-copied="copied || undefined"
      @click="() => copy()"
    >
      <template #icon>
        <CheckOutlined v-if="copied" />
        <CopyOutlined v-else />
      </template>
    </a-button>
    <span class="source-code-language lang">{{ language }}</span>
    <pre class="source-code-pre ant-doc-code shiki shiki-themes vitesse-light vitesse-dark" :style="rootStyle"><code><template
      v-for="(line, lineIndex) in tokenLines"
      :key="lineIndex"
    ><span class="source-code-line"><span
      v-for="(token, tokenIndex) in line"
      :key="tokenIndex"
      class="source-code-token"
      :style="token.htmlStyle"
    >{{ token.content }}</span></span>{{ lineIndex < tokenLines.length - 1 ? '\n' : '' }}</template></code></pre>
  </div>
</template>

<style scoped lang="less">
.source-code {
  position: relative;
  background-color: var(--ant-color-fill-tertiary);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  margin: 1em 0;
  overflow: hidden;
  .source-code-copy {
    cursor: pointer;
    z-index: 2;
    position: absolute;
    top: 9px;
    right: 12px;
    // opacity: 0;
  }
  &-language {
    position: absolute;
    top: 2px;
    right: 8px;
    z-index: 2;
    font-size: 12px;
    font-weight: 500;
    user-select: none;
    color: #8a9099;
    transition:
      color 0.4s,
      opacity 0.4s;
  }

  &-pre {
    margin: 0;
    padding: 16px 24px 16px 0;
    overflow: auto;
    background: transparent;
    color: var(--ant-color-text);
    font-family: var(--ant-font-family-code);
    font-size: 13px;
    line-height: 1.7;
    white-space: pre;

    code {
      display: block;
      min-width: max-content;
      font-family: inherit;
    }
  }

  &-line {
    display: inline;
  }
}
</style>
