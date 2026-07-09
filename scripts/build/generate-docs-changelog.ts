import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

interface PackageJson {
  name?: string
  private?: boolean
}

interface ChangelogEntry {
  text: string
  children: string[]
}

interface PackageRelease {
  packageName: string
  version: string
  entries: ChangelogEntry[]
}

interface ReleaseNote {
  version: string
  date: string
  packages: string[]
  categories: Record<ReleaseCategory, ChangelogEntryWithPackage[]>
}

interface ChangelogEntryWithPackage extends ChangelogEntry {
  packageName: string
}

export interface WriteDocsChangelogOptions {
  today?: string
}

type ReleaseCategory = 'features' | 'fixes' | 'docs' | 'tests' | 'dependencies' | 'refactors' | 'changes'

const rootPackageName = '@antdv-next1/pro-components'

const preferredPackageOrder = [
  '@antdv-next1/pro-components',
  '@antdv-next1/pro-layout',
  '@antdv-next1/pro-form',
  '@antdv-next1/pro-table',
  '@antdv-next1/pro-card',
  '@antdv-next1/pro-field',
  '@antdv-next1/pro-listy',
  '@antdv-next1/pro-provider',
  '@antdv-next1/pro-utils',
  '@antdv-next1/route-utils',
]

const categoryOrder: ReleaseCategory[] = [
  'features',
  'fixes',
  'docs',
  'tests',
  'dependencies',
  'refactors',
  'changes',
]

const categoryTitles: Record<'zh-CN' | 'en-US', Record<ReleaseCategory, string>> = {
  'zh-CN': {
    features: '新特性 Features',
    fixes: '问题修复 Fixes',
    docs: '文档 Docs',
    tests: '测试 Tests',
    dependencies: '依赖更新 Dependencies',
    refactors: '重构 Refactors',
    changes: '其他更新 Changes',
  },
  'en-US': {
    features: 'Features',
    fixes: 'Fixes',
    docs: 'Docs',
    tests: 'Tests',
    dependencies: 'Dependencies',
    refactors: 'Refactors',
    changes: 'Changes',
  },
}

const docsOutputMap = {
  'zh-CN': {
    filename: 'changelog.zh-CN.md',
    title: '组件更新日志',
    description: '本页面由各子包 `CHANGELOG.md` 自动生成。发布前运行 `pnpm bump` 更新。',
    dateLabel: '发布日期',
    highlightsTitle: '版本摘要 Highlights',
    detailsTitle: '完整详情 Details',
    detailsSummary: '展开依赖版本与完整详情',
    remainingText: '更多更新见下方折叠详情。',
    dependencyOnlyText: '更新内部依赖版本。',
    summary: (note: ReleaseNote) => {
      const total = countHighlightEntries(note)
      const visible = countVisibleHighlights(note)
      const packages = note.packages.map(name => `\`${name}\``).join('、')
      if (total > visible)
        return `本版本默认展示 ${visible} 条摘要，完整 ${total} 项更新见折叠详情，涉及 ${packages}。`
      return `本版本包含 ${total} 项摘要更新，涉及 ${packages}。`
    },
  },
  'en-US': {
    filename: 'changelog.en-US.md',
    title: 'Component Changelog',
    description: 'This page is generated from package `CHANGELOG.md` files. Run `pnpm bump` before publishing.',
    dateLabel: 'Release date',
    highlightsTitle: 'Highlights',
    detailsTitle: 'Details',
    detailsSummary: 'Show dependency versions',
    remainingText: 'See folded details below for the remaining updates.',
    dependencyOnlyText: 'Updated internal dependency versions.',
    summary: (note: ReleaseNote) => {
      const total = countHighlightEntries(note)
      const visible = countVisibleHighlights(note)
      const packages = note.packages.map(name => `\`${name}\``).join(', ')
      if (total > visible)
        return `This release shows ${visible} highlights from ${total} updates across ${packages}.`
      return `This release includes ${total} highlights across ${packages}.`
    },
  },
} as const

function getPackageOrder(name: string) {
  const index = preferredPackageOrder.indexOf(name)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function countHighlightEntries(note: ReleaseNote) {
  return getHighlightEntries(note).length
}

function countVisibleHighlights(note: ReleaseNote) {
  const highlightCount = countHighlightEntries(note)
  if (highlightCount)
    return Math.min(highlightCount, 4)
  if (note.categories.dependencies.length)
    return 1
  return 0
}

function sortPackageNames(packageNames: Iterable<string>) {
  return [...packageNames].sort((a, b) => {
    const orderDiff = getPackageOrder(a) - getPackageOrder(b)
    if (orderDiff !== 0)
      return orderDiff

    return a.localeCompare(b)
  })
}

function splitChangelogSections(packageName: string, rawContent: string): PackageRelease[] {
  const lines = rawContent.replace(/\r\n/g, '\n').split('\n')
  const releases: PackageRelease[] = []
  let currentVersion: string | undefined
  let currentBody: string[] = []

  const flushRelease = () => {
    if (!currentVersion)
      return

    const entries = parseEntries(currentBody.join('\n'))
    if (entries.length) {
      releases.push({
        packageName,
        version: currentVersion,
        entries,
      })
    }
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushRelease()
      currentVersion = line.slice(3).trim()
      currentBody = []
      continue
    }

    if (currentVersion)
      currentBody.push(line)
  }

  flushRelease()

  return releases
}

function parseEntries(body: string) {
  const entries: ChangelogEntry[] = []
  let currentEntry: ChangelogEntry | undefined

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trimEnd()
    const trimmedLine = line.trim()
    const leftTrimmedLine = line.trimStart()

    if (!trimmedLine || trimmedLine.startsWith('### '))
      continue

    if (line.startsWith('- ')) {
      currentEntry = {
        text: line.slice(2).trim(),
        children: [],
      }
      entries.push(currentEntry)
      continue
    }

    if (leftTrimmedLine.startsWith('- ') && currentEntry) {
      currentEntry.children.push(leftTrimmedLine.slice(2).trim())
      continue
    }

    if (currentEntry)
      currentEntry.text = `${currentEntry.text} ${trimmedLine}`
  }

  return entries
}

async function readPackageJson(packageJsonPath: string) {
  return JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson
}

export async function readPackageReleases(rootDir = process.cwd()) {
  const packagesDir = join(rootDir, 'packages')
  const packageDirs = await readdir(packagesDir, { withFileTypes: true })
  const releaseMap = new Map<string, PackageRelease[]>()

  for (const dirent of packageDirs) {
    if (!dirent.isDirectory())
      continue

    const packageDir = join(packagesDir, dirent.name)
    const packageJsonPath = join(packageDir, 'package.json')
    const changelogPath = join(packageDir, 'CHANGELOG.md')

    if (!existsSync(packageJsonPath) || !existsSync(changelogPath))
      continue

    const packageJson = await readPackageJson(packageJsonPath)
    if (!packageJson.name || packageJson.private)
      continue

    const rawContent = await readFile(changelogPath, 'utf8')
    releaseMap.set(packageJson.name, splitChangelogSections(packageJson.name, rawContent))
  }

  return releaseMap
}

function parseDependencyVersions(entry: ChangelogEntry) {
  const dependencies = new Map<string, string>()

  if (!isDependencyEntry(entry))
    return dependencies

  for (const child of entry.children) {
    const dependency = parseDependencyLine(child)
    if (dependency)
      dependencies.set(dependency.packageName, dependency.version)
  }

  return dependencies
}

function parseDependencyLine(line: string) {
  if (!line.startsWith('@'))
    return undefined

  const versionSeparatorIndex = line.lastIndexOf('@')
  if (versionSeparatorIndex <= 0)
    return undefined

  const packageName = line.slice(0, versionSeparatorIndex)
  const version = line.slice(versionSeparatorIndex + 1)
  if (!packageName || !version)
    return undefined

  return {
    packageName,
    version,
  }
}

function isDependencyEntry(entry: ChangelogEntry) {
  const lowerText = entry.text.toLowerCase()
  return lowerText === 'updated dependencies'
    || lowerText.startsWith('chore(deps)')
    || lowerText.includes('dependency')
    || lowerText.includes('dependencies')
    || !!parseDependencyLine(entry.text)
    || entry.children.some(child => !!parseDependencyLine(child))
}

function categorizeEntry(entry: ChangelogEntry): ReleaseCategory {
  const text = entry.text.trim()
  const lowerText = text.toLowerCase()

  if (isDependencyEntry(entry))
    return 'dependencies'
  if (lowerText === 'fix' || lowerText.startsWith('fix(') || lowerText.startsWith('fix:') || lowerText.startsWith('fix ') || text.includes('修复') || lowerText.includes('bug'))
    return 'fixes'
  if (lowerText === 'doc' || lowerText === 'docs' || lowerText.startsWith('doc(') || lowerText.startsWith('docs(') || lowerText.startsWith('doc:') || lowerText.startsWith('docs:') || text.includes('文档'))
    return 'docs'
  if (lowerText === 'test' || lowerText === 'tests' || lowerText.startsWith('test(') || lowerText.startsWith('tests(') || lowerText.startsWith('test:') || lowerText.startsWith('tests:') || text.includes('测试'))
    return 'tests'
  if (lowerText === 'feat' || lowerText === 'feature' || lowerText.startsWith('feat(') || lowerText.startsWith('feature(') || lowerText.startsWith('feat:') || lowerText.startsWith('feature:') || lowerText.startsWith('add ') || lowerText.startsWith('create ') || text.includes('新增'))
    return 'features'
  if (lowerText === 'refactor' || lowerText.startsWith('refactor(') || lowerText.startsWith('refactor:'))
    return 'refactors'

  return 'changes'
}

function dedupeEntries(entries: ChangelogEntryWithPackage[]) {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    const key = `${entry.packageName}:${entry.text}:${[...entry.children].sort().join('|')}`
    if (seen.has(key))
      return false
    seen.add(key)
    return true
  })
}

function readExistingReleaseDates(content: string) {
  const dates = new Map<string, string>()
  let currentVersion: string | undefined

  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      const title = line.slice(3).trim()
      currentVersion = title.startsWith('V') ? title.slice(1) : title
      continue
    }

    if (!currentVersion || !(line.includes('发布日期') || line.includes('Release date')))
      continue

    const date = findIsoDate(line)
    if (date)
      dates.set(currentVersion, date)
  }

  return dates
}

function findIsoDate(value: string) {
  for (let index = 0; index <= value.length - 10; index += 1) {
    const candidate = value.slice(index, index + 10)
    if (isIsoDate(candidate))
      return candidate
  }

  return undefined
}

function isIsoDate(value: string) {
  return value.length === 10
    && value[4] === '-'
    && value[7] === '-'
    && isDigits(value.slice(0, 4))
    && isDigits(value.slice(5, 7))
    && isDigits(value.slice(8, 10))
}

function isDigits(value: string) {
  return [...value].every(char => char >= '0' && char <= '9')
}

async function getExistingReleaseDates(rootDir: string) {
  const dates = new Map<string, string>()

  for (const meta of Object.values(docsOutputMap)) {
    const filePath = join(rootDir, 'docs/src/pages/components', meta.filename)
    if (!existsSync(filePath))
      continue

    const currentDates = readExistingReleaseDates(await readFile(filePath, 'utf8'))
    for (const [version, date] of currentDates)
      dates.set(version, date)
  }

  return dates
}

function getTagDate(rootDir: string, packageName: string, version: string) {
  try {
    return execFileSync(
      'git',
      ['log', '-1', '--format=%cs', `${packageName}@${version}`],
      { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim()
  }
  catch {
    return undefined
  }
}

async function createReleaseNotes(rootDir: string, options: WriteDocsChangelogOptions = {}) {
  const releaseMap = await readPackageReleases(rootDir)
  const rootReleases = releaseMap.get(rootPackageName) ?? []
  const existingDates = await getExistingReleaseDates(rootDir)
  const today = options.today ?? getToday()
  const releaseNotes: ReleaseNote[] = []
  const rootReleaseGroups = new Map<string, PackageRelease[]>()

  for (const release of rootReleases) {
    const releases = rootReleaseGroups.get(release.version) ?? []
    releases.push(release)
    rootReleaseGroups.set(release.version, releases)
  }

  for (const [version, rootReleaseGroup] of rootReleaseGroups) {
    const packageVersions = new Map<string, string>([[rootPackageName, version]])

    for (const release of rootReleaseGroup) {
      for (const entry of release.entries) {
        for (const [packageName, packageVersion] of parseDependencyVersions(entry))
          packageVersions.set(packageName, packageVersion)
      }
    }

    const categories = Object.fromEntries(
      categoryOrder.map(category => [category, [] as ChangelogEntryWithPackage[]]),
    ) as Record<ReleaseCategory, ChangelogEntryWithPackage[]>

    for (const [packageName, packageVersion] of packageVersions) {
      const packageReleaseList = releaseMap.get(packageName) ?? []
      const matchedReleases = packageReleaseList.filter(release => release.version === packageVersion)

      for (const release of matchedReleases) {
        for (const entry of release.entries) {
          const category = categorizeEntry(entry)
          if (category === 'dependencies' && packageName !== rootPackageName)
            continue

          categories[category].push({
            packageName,
            text: entry.text,
            children: entry.children,
          })
        }
      }
    }

    for (const category of categoryOrder)
      categories[category] = dedupeEntries(categories[category])

    releaseNotes.push({
      version,
      date: getTagDate(rootDir, rootPackageName, version) ?? existingDates.get(version) ?? today,
      packages: sortPackageNames(packageVersions.keys()),
      categories,
    })
  }

  return releaseNotes
}

function formatEntry(entry: ChangelogEntryWithPackage) {
  const lines = [`- **${entry.packageName}**: ${entry.text}`]

  for (const child of entry.children)
    lines.push(`  - ${child}`)

  return lines.join('\n')
}

function getHighlightEntries(note: ReleaseNote) {
  return categoryOrder
    .filter(category => category !== 'dependencies')
    .flatMap(category => note.categories[category])
}

function createVisibleHighlights(
  note: ReleaseNote,
  locale: keyof typeof docsOutputMap,
) {
  const meta = docsOutputMap[locale]
  const highlightEntries = getHighlightEntries(note)
  const visibleEntries = highlightEntries.slice(0, 4).map(formatEntry)

  if (!visibleEntries.length && note.categories.dependencies.length)
    visibleEntries.push(`- ${meta.dependencyOnlyText}`)

  if (highlightEntries.length > visibleEntries.length)
    visibleEntries.push(`- ${meta.remainingText}`)

  return visibleEntries.join('\n')
}

function createCategorySections(
  note: ReleaseNote,
  locale: keyof typeof docsOutputMap,
) {
  return categoryOrder
    .filter(category => note.categories[category].length)
    .map((category) => {
      const entries = note.categories[category].map(formatEntry).join('\n')
      return `### ${categoryTitles[locale][category]}\n\n${entries}`
    })
    .join('\n\n')
}

export function createDocsChangelogContent(
  releaseNotes: ReleaseNote[],
  locale: keyof typeof docsOutputMap,
) {
  const meta = docsOutputMap[locale]
  const sections = releaseNotes.map((note) => {
    const dateColon = locale === 'zh-CN' ? '：' : ':'
    const highlights = createVisibleHighlights(note, locale)
    const categorySections = createCategorySections(note, locale)

    return [
      `## V${note.version}`,
      '',
      `**${meta.dateLabel}${dateColon}** ${note.date}`,
      '',
      meta.summary(note),
      '',
      `### ${meta.highlightsTitle}`,
      '',
      highlights,
      '',
      '<details>',
      `<summary>${meta.detailsSummary}</summary>`,
      '',
      `### ${meta.detailsTitle}`,
      '',
      categorySections,
      '',
      '</details>',
    ].join('\n')
  }).join('\n\n')

  return [
    '---',
    `title: ${meta.title}`,
    '---',
    '',
    '<!-- This file is generated by scripts/build/generate-docs-changelog.ts. Do not edit manually. -->',
    '',
    `> ${meta.description}`,
    '',
    sections || '> No package changelog has been generated yet.',
    '',
  ].join('\n')
}

export async function writeDocsChangelog(rootDir = process.cwd(), options: WriteDocsChangelogOptions = {}) {
  const releaseNotes = await createReleaseNotes(rootDir, options)
  const outputDir = join(rootDir, 'docs/src/pages/components')

  await mkdir(outputDir, { recursive: true })

  await Promise.all(
    Object.entries(docsOutputMap).map(([locale, meta]) => {
      const content = createDocsChangelogContent(releaseNotes, locale as keyof typeof docsOutputMap)
      return writeFile(join(outputDir, meta.filename), content)
    }),
  )
}

const currentFilePath = fileURLToPath(import.meta.url)
const entryFilePath = process.argv[1] ? resolve(process.argv[1]) : undefined

if (entryFilePath && currentFilePath === entryFilePath) {
  writeDocsChangelog(resolve(dirname(currentFilePath), '../..')).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
