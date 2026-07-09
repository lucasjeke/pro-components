import { describe, expect, it } from 'vitest'
import { createDocsChangelogContent } from './build/generate-docs-changelog.ts'

describe('generate docs changelog', () => {
  it('keeps release notes compact with dependency details folded', () => {
    const content = createDocsChangelogContent([
      {
        version: '1.0.29',
        date: '2026-07-09',
        packages: [
          '@antdv-next1/pro-components',
          '@antdv-next1/pro-layout',
          '@antdv-next1/pro-table',
        ],
        categories: {
          features: [
            {
              packageName: '@antdv-next1/pro-layout',
              text: 'add MultiTab layout support',
              children: [],
            },
          ],
          fixes: [
            {
              packageName: '@antdv-next1/pro-table',
              text: 'fix table layout',
              children: [],
            },
          ],
          docs: [],
          tests: [],
          dependencies: [
            {
              packageName: '@antdv-next1/pro-components',
              text: 'Updated dependencies',
              children: [
                '@antdv-next1/pro-layout@1.0.24',
                '@antdv-next1/pro-table@1.0.27',
              ],
            },
          ],
          refactors: [],
          changes: [
            {
              packageName: '@antdv-next1/pro-components',
              text: 'prepare pro components publish',
              children: [],
            },
          ],
        },
      },
    ], 'en-US')

    expect(content).toContain('This release includes 3 highlights')
    expect(content).toContain('### Highlights')
    expect(content).toContain('- **@antdv-next1/pro-layout**: add MultiTab layout support')
    expect(content).toContain('<details>')
    expect(content).toContain('<summary>Show dependency versions</summary>')
    expect(content).toContain('### Details')
    expect(content.indexOf('### Dependencies')).toBeGreaterThan(content.indexOf('<details>'))
  })

  it('uses singular wording for one English highlight', () => {
    const content = createDocsChangelogContent([
      {
        version: '1.0.30',
        date: '2026-07-09',
        packages: ['@antdv-next1/pro-components', '@antdv-next1/pro-layout'],
        categories: {
          features: [],
          fixes: [
            {
              packageName: '@antdv-next1/pro-layout',
              text: 'fix SiderMenu title hide animation name',
              children: [],
            },
          ],
          docs: [],
          tests: [],
          dependencies: [],
          refactors: [],
          changes: [],
        },
      },
    ], 'en-US')

    expect(content).toContain('This release includes 1 highlight across')
    expect(content).not.toContain('1 highlights')
  })
})
