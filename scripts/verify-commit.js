import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pico from 'picocolors'

const allowedTypes = new Set([
  'build',
  'chore',
  'ci',
  'deps',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'release',
  'revert',
  'style',
  'test',
  'types',
])

const typeAliases = {
  ci: 'ci',
  dep: 'deps',
  tests: 'test',
  typos: 'docs',
  ui: 'style',
  workflow: 'ci',
}

const allowedScopes = new Set([
  'build',
  'card',
  'changelog',
  'ci',
  'compiler',
  'components',
  'deps',
  'docs',
  'field',
  'form',
  'layout',
  'listy',
  'playground',
  'pro-card',
  'pro-components',
  'pro-field',
  'pro-form',
  'pro-layout',
  'pro-listy',
  'pro-provider',
  'pro-table',
  'pro-utils',
  'provider',
  'release',
  'repo',
  'route-utils',
  'scripts',
  'table',
  'utils',
])

const generatedCommitPrefixes = [
  'Merge ',
  'Revert ',
]

const generatedCommitMessages = new Set([
  'Version Packages',
])

function normalizeType(type) {
  const lowerType = type.toLowerCase()
  return typeAliases[lowerType] ?? lowerType
}

function stripEmojiPrefix(message) {
  const trimmedMessage = message.trim()
  const firstSpaceIndex = trimmedMessage.indexOf(' ')
  if (firstSpaceIndex <= 0)
    return trimmedMessage

  const firstToken = trimmedMessage.slice(0, firstSpaceIndex)
  if (![...firstToken].some(char => isAsciiLetter(char)))
    return trimmedMessage.slice(firstSpaceIndex + 1).trim()

  return trimmedMessage
}

function isAsciiLetter(char) {
  const code = char.charCodeAt(0)
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
}

function parseHeader(header) {
  let workingHeader = header.trim()
  const breaking = workingHeader.endsWith('!')
  if (breaking)
    workingHeader = workingHeader.slice(0, -1)

  const scopeStart = workingHeader.indexOf('(')
  if (scopeStart === -1) {
    return {
      breaking,
      scope: undefined,
      type: normalizeType(workingHeader),
    }
  }

  const scopeEnd = workingHeader.lastIndexOf(')')
  if (scopeEnd !== workingHeader.length - 1 || scopeEnd <= scopeStart + 1) {
    return {
      error: 'scope must be written as type(scope)',
    }
  }

  return {
    breaking,
    scope: workingHeader.slice(scopeStart + 1, scopeEnd),
    type: normalizeType(workingHeader.slice(0, scopeStart)),
  }
}

function validateScope(scope) {
  if (!scope)
    return true

  return scope
    .split(/[,/]/)
    .map(item => item.trim())
    .every(item => allowedScopes.has(item))
}

export function validateCommitMessage(message) {
  const firstLine = stripEmojiPrefix(message.split('\n')[0] ?? '')

  if (!firstLine) {
    return {
      valid: false,
      reason: 'commit message is empty',
    }
  }

  if (generatedCommitMessages.has(firstLine) || generatedCommitPrefixes.some(prefix => firstLine.startsWith(prefix))) {
    return {
      valid: true,
    }
  }

  const colonIndex = firstLine.indexOf(':')
  if (colonIndex === -1) {
    return {
      valid: false,
      reason: 'missing ":" separator',
    }
  }

  const header = firstLine.slice(0, colonIndex)
  const subject = firstLine.slice(colonIndex + 1).trim()
  const parsedHeader = parseHeader(header)

  if (parsedHeader.error) {
    return {
      valid: false,
      reason: parsedHeader.error,
    }
  }

  if (!allowedTypes.has(parsedHeader.type)) {
    return {
      valid: false,
      reason: `unsupported type "${parsedHeader.type}"`,
    }
  }

  if (!validateScope(parsedHeader.scope)) {
    return {
      valid: false,
      reason: `unsupported scope "${parsedHeader.scope}"`,
    }
  }

  if (subject.length < 3) {
    return {
      valid: false,
      reason: 'subject must be at least 3 characters',
    }
  }

  if (subject.length > 100) {
    return {
      valid: false,
      reason: 'subject must be no longer than 100 characters',
    }
  }

  return {
    valid: true,
  }
}

function resolveCommitMessagePath() {
  if (process.argv[2])
    return path.resolve(process.argv[2])

  const gitDir = execSync('git rev-parse --git-dir', { encoding: 'utf-8' }).trim()
  return path.resolve(gitDir, 'COMMIT_EDITMSG')
}

function formatError(message, reason) {
  const scopes = [...allowedScopes].sort().join(', ')
  const types = [...allowedTypes].sort().join(', ')

  return [
    '',
    `  ${pico.white(pico.bgRed(' ERROR '))} ${pico.red('invalid commit message format.')}`,
    '',
    `  ${pico.gray('Reason:')} ${reason}`,
    `  ${pico.gray('Message:')} ${message}`,
    '',
    `  ${pico.gray('Format:')} ${pico.green('<type>(<scope>): <subject>')}`,
    `  ${pico.gray('Types:')} ${types}`,
    `  ${pico.gray('Scopes:')} ${scopes}`,
    '',
    `  ${pico.gray('Examples:')}`,
    `    ${pico.green('feat(layout): add left layout')}`,
    `    ${pico.green('fix(form): correct readonly field style')}`,
    `    ${pico.green('docs(changelog): update release notes')}`,
    `    ${pico.green('ci: update docs deploy workflow')}`,
    `    ${pico.green('chore(release): version packages')}`,
    '',
  ].join('\n')
}

export function run() {
  const msgPath = resolveCommitMessagePath()
  const msg = readFileSync(msgPath, 'utf-8').trim()
  const result = validateCommitMessage(msg)

  if (!result.valid) {
    console.error(formatError(msg.split('\n')[0] ?? '', result.reason))
    process.exit(1)
  }
}

const currentFilePath = fileURLToPath(import.meta.url)
const entryFilePath = process.argv[1] ? path.resolve(process.argv[1]) : undefined

if (entryFilePath && currentFilePath === entryFilePath)
  run()
