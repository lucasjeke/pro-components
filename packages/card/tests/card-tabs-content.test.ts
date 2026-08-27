import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')

describe('ProCard tab item content contract', () => {
  it('uses tabList item content as the default tabs content fallback', () => {
    const source = readFileSync(resolve(root, 'src/Card.tsx'), 'utf8')

    expect(source).toContain('args.item?.content')
  })
})
