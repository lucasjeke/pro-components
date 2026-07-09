import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { ConfigProvider } from 'antdv-next'
import { createSSRApp, Fragment, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

;

(globalThis as any).React = {
  Fragment,
  createElement: (type: any, props: any, ...children: any[]) =>
    h(type, props, children.length > 1 ? children : children[0]),
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distOutput = path.resolve(__dirname, '../../dist/listy.css')
const docsOutput = path.resolve(__dirname, '../../../../docs/src/assets/listy.css')

async function extractStyleText() {
  const { default: Listy } = await import('../../src/components/Listy')
  const cache = createCache()
  const app = createSSRApp({
    render: () => h(ConfigProvider, { theme: { hashed: false } }, {
      default: () => h(StyleProvider, { cache, mock: 'server' }, {
        default: () => h(Fragment, null, [
          h(Listy, { items: [] }, {}),
          h(Listy.Item, {}, { default: () => 'Test Item' }),
        ]),
      }),
    }),
  })

  await renderToString(app)
  return extractStyle(cache, { plain: true, types: 'style' })
}

async function buildStyle() {
  const styleText = await extractStyleText()
  for (const output of [distOutput, docsOutput]) {
    await fs.mkdir(path.dirname(output), { recursive: true })
    await fs.rm(output, { force: true })
    await fs.writeFile(output, styleText)
  }
  console.log(`Style output saved to: ${distOutput}, ${docsOutput}`)
}

async function main() {
  if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
    await buildStyle()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
