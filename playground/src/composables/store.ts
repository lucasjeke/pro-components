import type { ImportMap, StoreState } from '@vue/repl'
import {
  File,

  mergeImportMap,
  compileFile as originalCompileFile,

  useStore as useReplStore,
} from '@vue/repl'
import { objectOmit, useDebounceFn } from '@vueuse/core'
import { computed, reactive, toRefs, watch, watchEffect } from 'vue'
import { IS_DEV } from '@/constants'
import { genCdnLink, genCompilerSfcLink, genImportMap } from '@/utils/dependency'
import { atou, utoa } from '@/utils/encode'
import antdvNextCode from '../template/antdv-next.js.txt?raw'
import mainCode from '../template/main.vue.txt?raw'
import tsconfigCode from '../template/tsconfig.json.txt?raw'
import welcomeCode from '../template/welcome.vue.txt?raw'

export interface Initial {
  serializedState?: string
  initialized?: () => void
}
export type VersionKey = 'proComponents' | 'vue' | 'antdvNext' | 'typescript'
export type Versions = Record<VersionKey, string>
export interface UserOptions {
  styleSource?: string
  showHidden?: boolean
  vueVersion?: string
  tsVersion?: string
  proComponentsVersion?: string
  antdvVersion?: string
  vuePr?: string
}
export type SerializeState = Record<string, string> & {
  _o?: UserOptions
}

const MAIN_FILE = 'src/PlaygroundMain.vue'
const APP_FILE = 'src/App.vue'
const ANTDV_NEXT_FILE = 'src/antdv-next.js'
const LEGACY_IMPORT_MAP = 'src/import_map.json'
export const IMPORT_MAP = 'import-map.json'
export const TSCONFIG = 'tsconfig.json'

export function useStore(initial: Initial) {
  const saved: SerializeState | undefined = initial.serializedState
    ? deserialize(initial.serializedState)
    : undefined
  const pr
    = new URLSearchParams(location.search).get('pr')
      || saved?._o?.styleSource?.match(/@antdv-next1\/pro-components@([^/]+)/)?.[1]
  const prUrl = `https://raw.esm.sh/pr/@antdv-next1/pro-components@${pr}/dist`
  const vuePr = new URLSearchParams(location.search).get('vue') || saved?._o?.vuePr
  const vuePrUrl = `https://esm.sh/pr`
  const antdvNextUrl = `https://raw.esm.sh/pr/antdv-next@${pr}/dist`

  const versions = reactive<Versions>({
    proComponents: pr ? 'preview' : (saved?._o?.proComponentsVersion ?? 'latest'),
    vue: saved?._o?.vueVersion ?? 'latest',
    antdvNext: saved?._o?.antdvVersion ?? 'latest',
    typescript: saved?._o?.tsVersion ?? 'latest',
  })
  const userOptions: UserOptions = {}
  if (pr) {
    Object.assign(userOptions, {
      showHidden: true,
    })
  }
  if (antdvNextUrl) {
    // Object.assign(userOptions, {
    //   styleSource: `${prUrl}/antd.css`,
    // });
  }
  if (vuePr) {
    Object.assign(userOptions, {
      vuePr,
    })
  }
  Object.assign(userOptions, {
    vueVersion: saved?._o?.vueVersion,
    tsVersion: saved?._o?.tsVersion,
    antdvVersion: saved?._o?.antdvVersion,
    proComponents: saved?._o?.proComponentsVersion,
  })
  const hideFile = !IS_DEV && !userOptions.showHidden

  if (pr)
    useWorker(pr)
  const builtinImportMap = computed<ImportMap>(() => {
    let importMap = genImportMap(versions)
    // if (pr)
    //   importMap = mergeImportMap(importMap, {
    //     imports: {
    //       'antdv-next': `${prUrl}/antd.esm.js`,
    //       'antdv-next/': `https://raw.esm.sh/pr/antdv-next@${pr}/`,
    //     },
    //   });

    if (vuePr) {
      importMap = mergeImportMap(importMap, {
        imports: {
          vue: `${vuePrUrl}/vue@${vuePr}`,
          '@vue/shared': `${vuePrUrl}/@vue/shared@${vuePr}`,
        },
      })
    }
    return importMap
  })

  const storeState: Partial<StoreState> = toRefs(
    reactive({
      files: initFiles(),
      mainFile: MAIN_FILE,
      activeFilename: APP_FILE,
      vueVersion: computed(() => versions.vue),
      typescriptVersion: versions.typescript,
      builtinImportMap,
      template: {
        welcomeSFC: mainCode,
      },
      sfcOptions: {
        script: {
          propsDestructure: true,
        },
      },
    }),
  )
  console.log(storeState, 'storeState')
  const store = useReplStore(storeState)
  store.files[ANTDV_NEXT_FILE]!.hidden = hideFile
  store.files[MAIN_FILE]!.hidden = hideFile
  setVueVersion(versions.vue).then(() => {
    initial.initialized?.()
  })

  watch(
    () => versions.antdvNext,
    (version) => {
      store.files[ANTDV_NEXT_FILE]!.code = generateAntdvNextCode(
        version,
        userOptions.styleSource,
      ).trim()
      originalCompileFile(store, store.files[ANTDV_NEXT_FILE]!).then(
        errs => (store.errors = errs),
      )
    },
  )
  watch(
    builtinImportMap,
    (newBuiltinImportMap) => {
      const importMap = JSON.parse(store.files[IMPORT_MAP]!.code)
      store.files[IMPORT_MAP]!.code = JSON.stringify(
        mergeImportMap(importMap, newBuiltinImportMap),
        undefined,
        2,
      )
    },
    { deep: true },
  )

  function init() {
    watchEffect(() => {
      originalCompileFile(store, store.activeFile).then(errs => (store.errors = errs))
    })
    for (const [filename, file] of Object.entries(store.files)) {
      if (filename === store.activeFilename)
        continue
      originalCompileFile(store, file).then(errs => store.errors.push(...errs))
    }

    watch(
      () => [
        store.files[TSCONFIG]?.code,
        store.typescriptVersion,
        store.locale,
        store.dependencyVersion,
        store.vueVersion,
      ],
      useDebounceFn(() => store.reloadLanguageTools?.(), 300),
      { deep: true },
    )
  }
  function serialize() {
    const state: SerializeState = { ...store.getFiles() }
    state._o = userOptions
    return utoa(JSON.stringify(state))
  }
  function deserialize(text: string): SerializeState {
    const state = JSON.parse(atou(text))
    return state
  }
  function initFiles() {
    const files: Record<string, File> = Object.create(null)
    if (saved) {
      for (let [filename, file] of Object.entries(objectOmit(saved, ['_o']))) {
        if (![IMPORT_MAP, TSCONFIG].includes(filename) && !filename.startsWith('src/')) {
          filename = `src/${filename}`
        }
        if (filename === LEGACY_IMPORT_MAP) {
          filename = IMPORT_MAP
        }
        files[filename] = new File(filename, file as string)
      }
    }
    else {
      files[APP_FILE] = new File(APP_FILE, welcomeCode)
    }
    if (!files[ANTDV_NEXT_FILE]) {
      files[ANTDV_NEXT_FILE] = new File(
        ANTDV_NEXT_FILE,
        generateAntdvNextCode(versions.antdvNext, userOptions.styleSource),
      )
    }
    if (!files[TSCONFIG]) {
      files[TSCONFIG] = new File(TSCONFIG, tsconfigCode)
    }
    return files
  }
  async function setVueVersion(version: string) {
    store.compiler = await import(/* @vite-ignore */ genCompilerSfcLink(version))
    versions.vue = version
  }
  async function setVersion(key: VersionKey, version: string) {
    switch (key) {
      case 'vue':
        userOptions.vueVersion = version
        await setVueVersion(version)
        break
      case 'antdvNext':
        versions.antdvNext = version
        userOptions.antdvVersion = version
        break
      case 'typescript':
        store.typescriptVersion = version
        userOptions.tsVersion = version
        break
    }
  }
  const resetFiles = () => {
    const { files, addFile } = store

    const isRandomFile = (filename: string) =>
      ![MAIN_FILE, TSCONFIG, IMPORT_MAP, ANTDV_NEXT_FILE].includes(filename)
    for (const filename of Object.keys(files)) {
      if (isRandomFile(filename))
        delete files[filename]
    }

    const appFile = new File(APP_FILE, welcomeCode, false)
    addFile(appFile)
  }

  const utils = {
    versions,
    pr,
    setVersion,
    serialize,
    init,
    vuePr,
    resetFiles,
  }
  Object.assign(store, utils)

  return store as typeof store & typeof utils
}

function generateAntdvNextCode(version: string, styleSource?: string) {
  const style = styleSource
    ? styleSource.replace('#VERSION#', version)
    : genCdnLink('antdv-next', version, '/dist/antd.css')
  const resetStyle = genCdnLink('antdv-next', version, '/dist/reset.css')
  return antdvNextCode.replace('#STYLE#', style).replace('#RESETSTYLE#', resetStyle)
}

function useWorker(pr: string) {
  const _worker = globalThis.Worker
  globalThis.Worker = class extends _worker {
    constructor(url: URL | string, options?: WorkerOptions) {
      if (typeof url === 'string' && url.includes('vue.worker')) {
        url = `${url}?pr=${pr}`
      }
      super(url, options)
    }
  }
}

export type Store = ReturnType<typeof useStore>
