import { describe, expect, it } from 'vitest'
import { validateCommitMessage } from './verify-commit.js'

describe('verify commit message', () => {
  it('accepts conventional commit messages aligned with package scopes', () => {
    expect(validateCommitMessage('feat(layout): add left layout')).toEqual({ valid: true })
    expect(validateCommitMessage('fix(pro-layout): correct header width')).toEqual({ valid: true })
    expect(validateCommitMessage('fix(form)!: remove deprecated api')).toEqual({ valid: true })
    expect(validateCommitMessage('🐛 fix(table): fix editable row state')).toEqual({ valid: true })
    expect(validateCommitMessage('ci: update docs deploy workflow')).toEqual({ valid: true })
    expect(validateCommitMessage('chore(release): version packages')).toEqual({ valid: true })
  })

  it('accepts git generated messages used by CI and release workflows', () => {
    expect(validateCommitMessage('Merge branch \'main\' into release')).toEqual({ valid: true })
    expect(validateCommitMessage('Revert "fix(layout): header width"')).toEqual({ valid: true })
    expect(validateCommitMessage('Version Packages')).toEqual({ valid: true })
  })

  it('normalizes legacy aliases to standard commit types', () => {
    expect(validateCommitMessage('CI: update workflow')).toEqual({ valid: true })
    expect(validateCommitMessage('tests(layout): add regression')).toEqual({ valid: true })
    expect(validateCommitMessage('dep: update lockfile')).toEqual({ valid: true })
  })

  it('rejects messages that do not help changelog and CI automation', () => {
    expect(validateCommitMessage('fix')).toMatchObject({ valid: false })
    expect(validateCommitMessage('feature(layout): add item')).toMatchObject({ valid: false })
    expect(validateCommitMessage('fix(unknown): broken scope')).toMatchObject({ valid: false })
    expect(validateCommitMessage('fix(layout): ')).toMatchObject({ valid: false })
    expect(validateCommitMessage('fix(layout): 修复')).toMatchObject({ valid: false })
  })
})
