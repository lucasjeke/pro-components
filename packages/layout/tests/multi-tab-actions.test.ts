import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function multiTabSource() {
  return readFileSync(resolve(process.cwd(), 'packages/layout/src/components/MultiTab/index.tsx'), 'utf8')
}

describe('MultiTab source boundaries', () => {
  it('does not depend on extracted action state helpers', () => {
    expect(multiTabSource()).not.toContain('./actionState')
  })

  it('keeps fixed width calculation local to the existing component implementation', () => {
    expect(multiTabSource()).not.toContain('getSiderMenuWidth')
  })
})
