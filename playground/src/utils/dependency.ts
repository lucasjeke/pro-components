import type { ImportMap } from '@vue/repl'
import type { Ref } from 'vue'
import type { Versions } from '@/composables/store'
import { useFetch, useLocalStorage } from '@vueuse/core'
import { gte } from 'semver'
import { computed, unref } from 'vue'

type MaybeRef<T> = T | Ref<T>

export interface Dependency {
  pkg?: string
  version?: string
  path: string
}

export type Cdn = 'unpkg' | 'jsdelivr' | 'jsdelivr-fastly'
export const cdn = useLocalStorage<Cdn>('setting-cdn', 'jsdelivr')

export function genCdnLink(pkg: string, version: string | undefined, path: string) {
  console.info(pkg, version, path)
  version = version ? `@${version}` : ''
  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'jsdelivr-fastly':
      return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'unpkg':
      return `https://unpkg.com/${pkg}${version}${path}`
  }
}

export function genCompilerSfcLink(version: string) {
  return genCdnLink('@vue/compiler-sfc', version, '/dist/compiler-sfc.esm-browser.js')
}

export function getExtraPackages() {
  return new URLSearchParams(location.search).get('extra_packages')
}

export function genImportMap({
  vue,
  antdvNext,
  proComponents,
}: Partial<Versions> = {}): ImportMap {
  const deps: Record<string, Dependency> = {
    vue: {
      pkg: '@vue/runtime-dom',
      version: vue,
      path: '/dist/runtime-dom.esm-browser.js',
    },
    '@vue/shared': {
      version: vue,
      path: '/dist/shared.esm-bundler.js',
    },
    'antdv-next': {
      version: antdvNext,
      path: '/dist/antd.esm.js',
    },
    'antdv-next/': {
      version: antdvNext,
      path: '/',
    },
    '@antdv-next/icons': {
      version: 'latest',
      path: '/dist/antd-icons.esm.js',
    },
    '@antdv-next1/pro-components': {
      version: proComponents,
      path: '/dist/pro-components.esm.js',
    },
  }

  const extraPackages = getExtraPackages()
  if (extraPackages === '@vueuse/core') {
    Object.assign(deps, {
      '@vueuse/core': {
        version: 'latest',
        path: '/dist/index.js',
      },
      '@vueuse/shared': {
        version: 'latest',
        path: '/dist/index.js',
      },
    })
  }

  return {
    imports: Object.fromEntries(
      Object.entries(deps).map(([key, dep]) => [
        key,
        genCdnLink(dep.pkg ?? key, dep.version, dep.path),
      ]),
    ),
  }
}

export function getVersions(pkg: MaybeRef<string>) {
  const url = computed(() => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`)
  return useFetch(url, {
    initialData: [],
    afterFetch: ctx => ((ctx.data = ctx.data.versions), ctx),
    refetch: true,
  }).json<string[]>().data as Ref<string[]>
}

export function getSupportedVueVersions() {
  const versions = getVersions('vue')
  return computed(() => versions.value.filter(version => gte(version, '3.5.0')))
}

export function getSupportedTSVersions() {
  const versions = getVersions('typescript')
  return computed(() =>
    versions.value.filter(version => !version.includes('dev') && !version.includes('insiders')),
  )
}

export function getSupportedAntdvVersions() {
  const versions = getVersions('antdv-next')
  return computed(() =>
    // 1.0.0 ~ 1.0.3 没有 dist/antd.esm.js（早期打包结构不同）
    versions.value.filter(version => gte(version, '1.0.4')),
  )
}

export function getSupportedProComponentsVersions() {
  const versions = getVersions('@antdv-next1/pro-components')
  return computed(() => versions.value.filter(version => gte(version, '1.0.0')))
}
