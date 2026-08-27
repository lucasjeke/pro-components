import { describe, expect, it } from 'vitest'
import { categorizeEntry, splitChangelogSections } from './changelog-format'

describe('changelog format parser', () => {
  it('classifies feat/fix/docs/ci/chore entries', () => {
    expect(categorizeEntry({ text: 'feat: add release summary', children: [] })).toBe('features')
    expect(categorizeEntry({ text: 'fix: correct changelog layout', children: [] })).toBe('fixes')
    expect(categorizeEntry({ text: 'docs: update release process', children: [] })).toBe('docs')
    expect(categorizeEntry({ text: 'ci: update docs workflow', children: [] })).toBe('ci')
    expect(categorizeEntry({ text: 'chore: version packages', children: [] })).toBe('chore')
    expect(categorizeEntry({ text: 'feat!: remove UMD bundle', children: [] })).toBe('features')
    expect(categorizeEntry({ text: 'refactor(form)!: simplify schema', children: [] })).toBe('refactors')
  })

  it('keeps typed entries out of dependencies when they mention dependency versions', () => {
    expect(categorizeEntry({
      text: 'fix: correct package output',
      children: ['@antdv-next1/pro-card@3.0.0'],
    })).toBe('fixes')
    expect(categorizeEntry({
      text: 'Updated dependencies',
      children: ['@antdv-next1/pro-card@3.0.0'],
    })).toBe('dependencies')
  })

  it('splits release sections and keeps nested entries', () => {
    const releases = splitChangelogSections('@scope/pkg', '# Changelog\n\n## 1.2.3\n\n### Features\n- feat: add API\n  - @scope/dep@2.0.0\n\n## 1.2.2\n- fix: old bug\n')

    expect(releases).toEqual([
      {
        packageName: '@scope/pkg',
        version: '1.2.3',
        entries: [{ text: 'feat: add API', children: ['@scope/dep@2.0.0'] }],
      },
      {
        packageName: '@scope/pkg',
        version: '1.2.2',
        entries: [{ text: 'fix: old bug', children: [] }],
      },
    ])
  })
})
