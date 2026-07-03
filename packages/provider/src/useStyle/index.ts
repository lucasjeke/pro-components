import type { CSSObject, CSSUtil } from '@antdv-next/cssinjs'
import type { GlobalToken } from 'antdv-next'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { CSSInterpolation } from 'antdv-next/dist/theme/interface/index'
import type { Ref } from 'vue'
import type { ProTokenType } from '../typing/layoutToken'
import { FastColor } from '@ant-design/fast-color'
import { genCalc, useStyleContext } from '@antdv-next/cssinjs'
import genMaxMin from '@antdv-next/cssinjs/dist/cssinjs-utils/util/maxmin'
import { normalizeStyle, parseStyle } from '@antdv-next/cssinjs/dist/hooks/useStyleRegister'
import { ATTR_MARK, CSS_IN_JS_INSTANCE } from '@antdv-next/cssinjs/dist/StyleContext'
import { removeCSS, updateCSS } from '@v-c/util/dist/Dom/dynamicCSS'
import { theme as antdTheme } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, onBeforeUnmount, watch } from 'vue'
import { useProConfig } from '../context'
import * as batToken from './token'
/**
 * 把一个颜色设置一下透明度
 * @example (#fff, 0.5) => rgba(255, 255, 255, 0.5)
 * @param baseColor {string}
 * @param alpha {number} 0-1
 * @returns rgba {string}
 */
export const setAlpha = (baseColor: string, alpha: number) => new FastColor(baseColor).setA(alpha).toRgbString()
/**
 * 把一个颜色修改一些明度
 * @example (#000, 50) => #808080
 * @param baseColor {string}
 * @param brightness {number} 0-100
 * @returns hexColor {string}
 */
export function lighten(baseColor: string, brightness: number) {
  const instance = new FastColor(baseColor)
  return instance.lighten(brightness).toHexString()
}

export type GenerateStyle<ComponentToken extends object = GlobalToken, ReturnType = CSSInterpolation> = (token: ComponentToken, ...rest: any[]) => ReturnType

function genTheme() {
  if (typeof antdTheme === 'undefined' || !antdTheme)
    return batToken
  return antdTheme
}

export const proTheme = genTheme()

export const useToken = proTheme.useToken

export interface UseStyleResult {
  wrapSSR: <T extends VueNode>(node: T) => T
  hashId: Ref<string>
}

export type ProAliasToken = GlobalToken
  & ProTokenType & {
    themeId: number
    /**
     * pro 的 className
     * @type {string}
     * @example .ant-pro
     */
    proComponentsCls: string
    /**
     * antd 的 className
     * @type {string}
     * @example .ant
     */
    antCls: string
    /**
     * antd 的 iconCls
     * @type {string}
     * @example .anticon
     */
    iconCls?: string
  } & Partial<CSSUtil>

export function resetComponent(token: ProAliasToken): CSSObject {
  return {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    color: token.colorText,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    listStyle: 'none',
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
  }
}

export function operationUnit(token: ProAliasToken): CSSObject {
  return {
  // FIXME: This use link but is a operation unit. Seems should be a colorPrimary.
  // And Typography use this to generate link style which should not do this.
    color: token.colorLink,
    outline: 'none',
    cursor: 'pointer',
    transition: `color ${token.motionDurationSlow}`,

    '&:focus, &:hover': {
      color: token.colorLinkHover,
    },

    '&:active': {
      color: token.colorLinkActive,
    },
  }
}

function hashString(input: string): string {
  let hash = 5381
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

function getProTokenKey(token: ProAliasToken): string {
  try {
    // ProProvider exposes finalToken instead of useCacheToken token,
    // so build a stable key from Pro token payload directly.
    return hashString(JSON.stringify(token))
  }
  catch {
    return ''
  }
}

const registeredStyleRefCount = new Map<string, number>()
const registeredEffectStyleKeys = new Map<string, Set<string>>()

function getStableStyleId(componentName: string): string {
  return `antd-pro-${hashString(componentName)}`
}

function useProStyleRegister(info: Ref<{
  componentName: string
  tokenKey: string
  token: ProAliasToken
  hashId?: string
  layer?: {
    name: string
    dependencies?: string[]
  }
  nonce?: () => string
  order?: number
}>, styleFn: () => CSSInterpolation) {
  const styleContext = useStyleContext()
  const stableStyleId = computed(() => getStableStyleId(info.value.componentName))
  const isLayerEnabled = computed(() => !!styleContext.value.layer)

  registeredStyleRefCount.set(stableStyleId.value, (registeredStyleRefCount.get(stableStyleId.value) || 0) + 1)

  const stop = watch(
    () => [
      info.value.componentName,
      info.value.tokenKey,
      info.value.hashId,
      isLayerEnabled.value,
      styleContext.value.hashPriority,
      styleContext.value.autoPrefix,
    ],
    () => {
      const infoValue = info.value
      const context = styleContext.value
      const styleId = stableStyleId.value
      const layer = isLayerEnabled.value ? infoValue.layer : undefined
      const [parsedStyle, effectStyle] = parseStyle(styleFn(), {
        hashId: infoValue.hashId,
        hashPriority: context.hashPriority,
        layer,
        path: `${infoValue.componentName}-${infoValue.tokenKey}`,
        transformers: (context.transformers || []) as any,
        linters: context.linters || [],
      })
      const styleStr = normalizeStyle(parsedStyle, context.autoPrefix || false)
      const order = infoValue.order ?? 0
      const nonce = infoValue.nonce?.()
      const cssConfig = {
        mark: ATTR_MARK,
        prepend: layer ? false as const : 'queue' as const,
        attachTo: context.container,
        priority: order,
        csp: nonce ? { nonce } : undefined,
      }

      const previousEffectKeys = registeredEffectStyleKeys.get(styleId) || new Set<string>()
      const nextEffectKeys = new Set<string>()
      Object.keys(effectStyle).forEach((effectKey) => {
        const effectStyleId = `${styleId}-effect-${hashString(effectKey)}`
        nextEffectKeys.add(effectStyleId)
        updateCSS(normalizeStyle(effectStyle[effectKey]!, context.autoPrefix || false), effectStyleId, {
          ...cssConfig,
          prepend: effectKey.startsWith('@layer') ? true : cssConfig.prepend,
        })
      })
      previousEffectKeys.forEach((effectStyleId) => {
        if (!nextEffectKeys.has(effectStyleId)) {
          removeCSS(effectStyleId, {
            mark: ATTR_MARK,
            attachTo: context.container,
          })
        }
      })
      registeredEffectStyleKeys.set(styleId, nextEffectKeys)

      const style = updateCSS(styleStr, styleId, cssConfig)
      if (style) {
        style[CSS_IN_JS_INSTANCE] = context.cache.instanceId
        style.setAttribute('data-cache-path', `style|${infoValue.componentName}|${infoValue.tokenKey}`)
      }
    },
    {
      flush: 'sync',
      immediate: true,
    },
  )

  onBeforeUnmount(() => {
    stop()
    const styleId = stableStyleId.value
    const nextCount = (registeredStyleRefCount.get(styleId) || 1) - 1
    if (nextCount > 0) {
      registeredStyleRefCount.set(styleId, nextCount)
      return
    }
    registeredStyleRefCount.delete(styleId)
    removeCSS(styleId, {
      mark: ATTR_MARK,
      attachTo: styleContext.value.container,
    })
    registeredEffectStyleKeys.get(styleId)?.forEach((effectStyleId) => {
      removeCSS(effectStyleId, {
        mark: ATTR_MARK,
        attachTo: styleContext.value.container,
      })
    })
    registeredEffectStyleKeys.delete(styleId)
  })
}

/**
 * 封装了一下  antdv-next 的 useStyle
 * @param componentName {string} 组件的名字
 * @param styleFn {GenerateStyle} 生成样式的函数
 * @returns UseStyleResult
 */
export function useStyle(componentName: string, styleFn: (token: ProAliasToken) => CSSInterpolation): UseStyleResult {
  const proProvide = useProConfig()
  const { token: antdToken, hashId, theme } = useToken()
  const config = useConfig()
  const unitlessCssVar = new Set<string>()
  const { max, min } = genMaxMin('css')

  const calc = genCalc('css', unitlessCssVar)
  const themeToken = computed(() => {
    let _token = proProvide.value.token
    // 如果不在 ProProvider 里面，就用 antd 的
    if (!_token.layout) {
      _token = { ...(antdToken.value as ProAliasToken) }
    }
    _token.proComponentsCls = _token.proComponentsCls ?? `.${config.value.getPrefixCls('pro')}`
    _token.antCls = `.${config.value.getPrefixCls()}`
    _token.iconCls = _token.iconCls ?? `.${config.value.iconPrefixCls}`
    _token.calc = _token.calc ?? calc
    _token.max = _token.max ?? (max as CSSUtil['max'])
    _token.min = _token.min ?? (min as CSSUtil['min'])
    return _token
  })
  const proTokenKey = computed(() => getProTokenKey(themeToken.value))
  const styleKey = computed(() => [hashId.value, theme.value.id, proTokenKey.value].filter(Boolean).join('-'))
  console.log(componentName, proProvide.value, 'componentName')
  useProStyleRegister(computed(() => {
    return {
      componentName,
      tokenKey: styleKey.value,
      token: themeToken.value,
      hashId: proProvide.value.hashId,
      nonce: () => config.value.csp?.nonce!,
      layer: {
        name: 'antd-pro',
      },
    }
  }), () => styleFn(themeToken.value as ProAliasToken))
  console.log(proProvide.value.hashId, hashId.value, '====style')
  return {
    wrapSSR: <T>(node: T) => node,
    hashId: computed(() => (proProvide.value.hashed ? proProvide.value.hashId! : '')),
  }
}
