import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('docs style runtime config', () => {
  it('keeps css-in-js runtime enabled for non-iframe demos', () => {
    const source = readFileSync(resolve('docs/src/layouts/base/index.vue'), 'utf8')

    expect(source).not.toContain('const zeroRuntime = import.meta.env.PROD')
    expect(source).not.toContain('zeroRuntime,')
  })
})
