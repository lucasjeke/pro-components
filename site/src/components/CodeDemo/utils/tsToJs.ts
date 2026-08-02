const SCRIPT_BLOCK_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const SCRIPT_LANG_RE = /\blang\s*=\s*(['"]?)([\w-]+)\1/i
const TS_LANGS = new Set(['ts', 'tsx', 'mts', 'cts'])
const EXPORT_MARKER_RE = /\n?export\s*\{\s*\};?\s*$/u

function collectValueImports(code: string) {
  return code
    .split('\n')
    .map(line => line.trim())
    .filter((line) => {
      return line.startsWith('import ')
        && !line.startsWith('import type ')
        && !line.includes(' type ')
    })
}

async function transformScript(code: string, lang: string) {
  const imports = collectValueImports(code)
  const { transform } = await import('sucrase')
  const result = transform(code, {
    transforms: ['typescript'],
    disableESTransforms: true,
    jsxPragma: lang === 'tsx' ? 'h' : undefined,
    jsxFragmentPragma: lang === 'tsx' ? 'Fragment' : undefined,
  })

  let nextCode = result.code.replace(EXPORT_MARKER_RE, '').trim()
  const missingImports = imports.filter(importCode => !nextCode.includes(importCode))

  if (missingImports.length)
    nextCode = `${missingImports.join('\n')}\n${nextCode}`.trim()

  return nextCode
}

export async function transformVueTsToJs(source: string) {
  let nextSource = ''
  let lastIndex = 0
  let changed = false

  SCRIPT_BLOCK_RE.lastIndex = 0
  for (const match of source.matchAll(SCRIPT_BLOCK_RE)) {
    const [fullMatch, attrs = '', code = ''] = match
    const startIndex = match.index ?? 0
    nextSource += source.slice(lastIndex, startIndex)

    const langMatch = attrs.match(SCRIPT_LANG_RE)
    const lang = langMatch?.[2]?.toLowerCase()

    if (!lang || !TS_LANGS.has(lang)) {
      nextSource += fullMatch
      lastIndex = startIndex + fullMatch.length
      continue
    }

    const nextAttrs = attrs.replace(SCRIPT_LANG_RE, `lang="${lang === 'tsx' ? 'jsx' : 'js'}"`)
    const transformedCode = await transformScript(code, lang)
    nextSource += `<script${nextAttrs}>\n${transformedCode}\n</script>`
    changed = true
    lastIndex = startIndex + fullMatch.length
  }

  nextSource += source.slice(lastIndex)
  return changed ? nextSource : source
}
