import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createDocsChangelogContent, writeDocsChangelog } from './generate-docs-changelog'

const releaseNotes = [
  {
    version: '1.0.0',
    date: '2026-08-27',
    packages: ['@antdv-next1/pro-components', '@antdv-next1/pro-card'],
    categories: {
      features: [{ packageName: '@antdv-next1/pro-components', text: 'feat: add release summary', children: [] }],
      fixes: [{ packageName: '@antdv-next1/pro-components', text: 'fix: correct changelog layout', children: [] }],
      docs: [{ packageName: '@antdv-next1/pro-components', text: 'docs: update release process', children: [] }],
      tests: [],
      ci: [{ packageName: '@antdv-next1/pro-components', text: 'ci: update docs workflow', children: [] }],
      chore: [{ packageName: '@antdv-next1/pro-components', text: 'chore: version packages', children: [] }],
      dependencies: [{ packageName: '@antdv-next1/pro-components', text: 'Updated dependencies', children: ['@antdv-next1/pro-card@2.0.0'] }],
      refactors: [],
      changes: [],
    },
  },
] as const

async function writePackageFixture(rootDir: string, packageDir: string, packageName: string, changelog: string) {
  const fullPackageDir = join(rootDir, 'packages', packageDir)
  await mkdir(fullPackageDir, { recursive: true })
  await writeFile(join(fullPackageDir, 'package.json'), JSON.stringify({ name: packageName }, null, 2))
  await writeFile(join(fullPackageDir, 'CHANGELOG.md'), changelog)
}

describe('generate docs changelog', () => {
  it('renders structured release notes by category', () => {
    const zh = createDocsChangelogContent(releaseNotes as any, 'zh-CN')
    const en = createDocsChangelogContent(releaseNotes as any, 'en-US')

    expect(zh).toContain('### 新特性 Features')
    expect(zh).toContain('### 问题修复 Fixes')
    expect(zh).toContain('### 文档 Docs')
    expect(zh).toContain('### 持续集成 CI')
    expect(zh).toContain('### 工程维护 Chore')
    expect(zh).toContain('### 依赖更新 Dependencies')

    expect(en).toContain('### Features')
    expect(en).toContain('### Fixes')
    expect(en).toContain('### Docs')
    expect(en).toContain('### CI')
    expect(en).toContain('### Chore')
    expect(en).toContain('### Dependencies')
  })

  it('writes synchronized changelog pages for the aggregate module and package pages', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'docs-changelog-'))

    await mkdir(join(rootDir, 'docs/src/pages/components'), { recursive: true })
    await writeFile(
      join(rootDir, 'docs/src/pages/components/changelog.zh-CN.md'),
      [
        '## V1.0.0',
        '',
        '**发布日期：** 2026-01-02',
        '',
      ].join('\n'),
    )

    await writePackageFixture(
      rootDir,
      'components',
      '@antdv-next1/pro-components',
      '# @antdv-next1/pro-components\n\n## 1.0.0\n\n### Patch Changes\n\n- feat: add release summary\n- fix: correct changelog layout\n- docs: update release process\n- ci: update docs workflow\n- chore: version packages\n- Updated dependencies\n  - @antdv-next1/pro-card@2.0.0\n',
    )
    await writePackageFixture(
      rootDir,
      'card',
      '@antdv-next1/pro-card',
      '# @antdv-next1/pro-card\n\n## 2.0.0\n\n### Patch Changes\n\n- feat: improve card sync\n- fix: align changelog output\n',
    )

    await writeDocsChangelog(rootDir, { today: '2026-08-27' })

    const aggregateZh = await readFile(join(rootDir, 'docs/src/pages/components/changelog.zh-CN.md'), 'utf8')
    const aggregateEn = await readFile(join(rootDir, 'docs/src/pages/components/changelog.en-US.md'), 'utf8')
    const rootZh = await readFile(join(rootDir, 'docs/src/pages/changelog/index.zh-CN.md'), 'utf8')
    const rootEn = await readFile(join(rootDir, 'docs/src/pages/changelog/index.en-US.md'), 'utf8')
    const packageZh = await readFile(join(rootDir, 'docs/src/pages/changelog/pro-card.zh-CN.md'), 'utf8')
    const packageEn = await readFile(join(rootDir, 'docs/src/pages/changelog/pro-card.en-US.md'), 'utf8')

    expect(aggregateZh).toContain('### 持续集成 CI')
    expect(aggregateZh).toContain('### 工程维护 Chore')
    expect(aggregateZh).toContain('### 依赖更新 Dependencies')
    expect(aggregateEn).toContain('### CI')
    expect(aggregateEn).toContain('### Chore')
    expect(aggregateEn).toContain('### Dependencies')

    expect(rootZh).toContain('ProComponents 更新日志')
    expect(rootEn).toContain('ProComponents Changelog')

    expect(packageZh).toContain('ProCard 更新日志')
    expect(packageZh).toContain('packages/card/CHANGELOG.md')
    expect(packageZh).toContain('**发布日期：** 2026-01-02')
    expect(packageEn).toContain('ProCard Changelog')
    expect(packageEn).toContain('packages/card/CHANGELOG.md')
    expect(packageEn).toContain('**Release date:** 2026-01-02')
  })
})
