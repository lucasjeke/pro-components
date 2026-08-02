export interface InlineDemo {
  id: string
  source: string
}

const VUE_SFC_RE = /<(?:script|template|style)\b/i
const FENCE_RE = /```([^\n`]*)\n([\s\S]*?)```/g

function normalizePagePath(filePath: string) {
  return filePath
    .replace(/\\/g, '/')
    .replace(/^.*?\/src\/pages\//, '')
    .replace(/\.(?:zh-CN|en-US)\.md$/, '')
    .replace(/\.(?:md|vue)$/, '')
    .replace(/\/index$/, '')
    .replace(/^\/+|\/+$/g, '')
}

export function getInlineDemoId(filePath: string, index: number) {
  const pagePath = normalizePagePath(filePath) || 'markdown'
  return `${pagePath.replace(/\//g, '-')}-demo-${index}`
}

function isPureFence(info: string) {
  return info
    .split('|')
    .slice(1)
    .some(part => part.trim().split(/\s+/).includes('pure'))
}

export function isInlineVueDemo(info: string, source: string) {
  const lang = info.trim().split(/\s+/)[0]
  return lang === 'vue' && !isPureFence(info) && VUE_SFC_RE.test(source)
}

export function extractInlineDemos(filePath: string, markdown: string) {
  const demos: InlineDemo[] = []
  let match: RegExpExecArray | null

  FENCE_RE.lastIndex = 0
  while ((match = FENCE_RE.exec(markdown))) {
    const [, info = '', source = ''] = match
    if (!isInlineVueDemo(info, source))
      continue

    demos.push({
      id: getInlineDemoId(filePath, demos.length),
      source,
    })
  }

  return demos
}
