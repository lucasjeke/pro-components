import type MarkdownIt from 'markdown-it'

interface InlineDemoEnv {
  id?: string
  path?: string
  __inlineDemoIndex?: number
}
const VUE_SFC_RE = /<(?:script|template|style)\b/i

function normalizePagePath(filePath: string) {
  return filePath
    .replace(/\\/g, '/')
    .replace(/^.*?\/src\/pages\//, '')
    .replace(/\.(?:zh-CN|en-US)\.md$/, '')
    .replace(/\.(?:md|vue)$/, '')
    .replace(/\/index$/, '')
    .replace(/^\/+|\/+$/g, '')
}

function getInlineDemoId(filePath: string, index: number) {
  const pagePath = normalizePagePath(filePath) || 'markdown'
  return `${pagePath.replace(/\//g, '-')}-demo-${index}`
}

function isPureFence(info: string) {
  return info
    .split('|')
    .slice(1)
    .some(part => part.trim().split(/\s+/).includes('pure'))
}

function isInlineVueDemo(info: string, source: string) {
  const lang = info.trim().split(/\s+/)[0]
  return lang === 'vue' && !isPureFence(info) && VUE_SFC_RE.test(source)
}
export function inlineDemoPlugin(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, , env] = args
    const token = tokens[idx]
    const info = token.info.trim()

    if (isInlineVueDemo(info, token.content)) {
      const inlineDemoEnv = env as InlineDemoEnv
      const filePath = inlineDemoEnv.id || inlineDemoEnv.path || 'markdown'
      const demoIndex = inlineDemoEnv.__inlineDemoIndex ?? 0
      inlineDemoEnv.__inlineDemoIndex = demoIndex + 1
      const id = getInlineDemoId(filePath, demoIndex)

      return `<code-demo-inline id="${id}" source="${encodeURIComponent(token.content)}"></code-demo-inline>`
    }

    return fence(...args)
  }
}
