export type ChangelogCategory
  = | 'features'
    | 'fixes'
    | 'docs'
    | 'tests'
    | 'ci'
    | 'chore'
    | 'dependencies'
    | 'refactors'
    | 'changes'

export interface ChangelogEntry {
  text: string
  children: string[]
}

export interface PackageRelease {
  packageName: string
  version: string
  entries: ChangelogEntry[]
}

export interface ChangelogEntryWithPackage extends ChangelogEntry {
  packageName: string
}

/** Structured release data shared by changelog consumers. */
export interface ReleaseModel {
  packageName: string
  version: string
  date: string
  categories: Record<ChangelogCategory, ChangelogEntryWithPackage[]>
  dependencyChanges: Map<string, string>
}

export function splitChangelogSections(packageName: string, rawContent: string): PackageRelease[] {
  const lines = rawContent.replace(/\r\n/g, '\n').split('\n')
  const releases: PackageRelease[] = []
  let currentVersion: string | undefined
  let currentBody: string[] = []

  const flushRelease = () => {
    if (!currentVersion)
      return

    const entries = parseEntries(currentBody.join('\n'))
    if (entries.length) {
      releases.push({ packageName, version: currentVersion, entries })
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

export function parseEntries(body: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = []
  let currentEntry: ChangelogEntry | undefined

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trimEnd()
    const trimmedLine = line.trim()
    const leftTrimmedLine = line.trimStart()

    if (!trimmedLine || trimmedLine.startsWith('### '))
      continue

    if (line.startsWith('- ')) {
      currentEntry = { text: line.slice(2).trim(), children: [] }
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

export function parseDependencyLine(line: string) {
  if (!line.startsWith('@'))
    return undefined

  const versionSeparatorIndex = line.lastIndexOf('@')
  if (versionSeparatorIndex <= 0)
    return undefined

  const packageName = line.slice(0, versionSeparatorIndex)
  const version = line.slice(versionSeparatorIndex + 1)
  if (!packageName || !version)
    return undefined

  return { packageName, version }
}

export function isDependencyEntry(entry: ChangelogEntry) {
  const lowerText = entry.text.toLowerCase()
  return lowerText === 'updated dependencies'
    || lowerText.startsWith('chore(deps)')
    || !!parseDependencyLine(entry.text)
}

export function categorizeEntry(entry: ChangelogEntry): ChangelogCategory {
  const text = entry.text.trim()
  const lowerText = text.toLowerCase()
  const type = lowerText.match(/^([a-z]+)(?:\([^)]+\))?!?:/)?.[1]

  if (isDependencyEntry(entry))
    return 'dependencies'
  if (type === 'fix' || lowerText === 'fix' || lowerText.startsWith('fix ') || text.includes('修复') || lowerText.includes('bug'))
    return 'fixes'
  if (type === 'doc' || type === 'docs' || lowerText === 'doc' || lowerText === 'docs' || text.includes('文档'))
    return 'docs'
  if (type === 'test' || type === 'tests' || lowerText === 'test' || lowerText === 'tests' || text.includes('测试'))
    return 'tests'
  if (type === 'ci' || lowerText === 'ci')
    return 'ci'
  if (type === 'chore' || lowerText === 'chore')
    return 'chore'
  if (type === 'feat' || type === 'feature' || lowerText === 'feat' || lowerText === 'feature' || lowerText.startsWith('add ') || lowerText.startsWith('create ') || text.includes('新增'))
    return 'features'
  if (type === 'refactor' || lowerText === 'refactor')
    return 'refactors'

  return 'changes'
}

export function parseDependencyVersions(entry: ChangelogEntry) {
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
