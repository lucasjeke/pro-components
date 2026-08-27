import type { InnerLocale } from '#/config'

const EN_PREFIX = '/en-US'

export function toCnPathname(pathname: string): string {
  if (pathname.startsWith('/~demos')) {
    return pathname
  }

  if (pathname === EN_PREFIX) {
    return '/'
  }

  if (pathname.startsWith(`${EN_PREFIX}/`)) {
    return pathname.slice(EN_PREFIX.length)
  }

  return pathname || '/'
}

export function toEnPathname(pathname: string): string {
  if (pathname.startsWith('/~demos') || pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)) {
    return pathname
  }

  if (pathname === '/' || pathname === '') {
    return EN_PREFIX
  }

  return `${EN_PREFIX}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export function toLocalePathname(pathname: string, locale: InnerLocale): string {
  return locale === 'en-US' ? toEnPathname(pathname) : toCnPathname(pathname)
}
