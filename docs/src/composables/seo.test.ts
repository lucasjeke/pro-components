import { beforeEach, describe, expect, it } from 'vitest'
import { applyRouteSeo } from './seo'

describe('applyRouteSeo', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  it('uses the canonical site name without the previous typo', () => {
    applyRouteSeo({ path: '/' })

    expect(document.title).toBe('ProComponents Vue - Vue 3 组件库')
    expect(document.title).not.toContain('Vuents')
    expect(document.querySelector('meta[property="og:site_name"]')?.getAttribute('content')).toBe('ProComponents Vue')
  })

  it('uses markdown frontmatter as the html title for package changelog pages', () => {
    applyRouteSeo(
      { path: '/changelog/pro-form' },
      { frontmatter: { title: 'ProForm 更新日志' } },
    )

    expect(document.title).toBe('ProForm 更新日志 - ProComponents Vue')
  })

  it('uses changelog route title before markdown frontmatter is available', () => {
    applyRouteSeo({ path: '/changelog' })

    expect(document.title).toBe('ProComponents 更新日志 - ProComponents Vue')
  })

  it('uses package changelog route title before markdown frontmatter is available', () => {
    applyRouteSeo({ path: '/changelog/pro-form' })

    expect(document.title).toBe('ProForm 更新日志 - ProComponents Vue')
  })

  it('uses english changelog route title for en-US paths', () => {
    applyRouteSeo({ path: '/en-US/changelog/pro-form' })

    expect(document.title).toBe('ProForm Changelog - ProComponents Vue')
  })
})
