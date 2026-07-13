import type {
  CSSObject,
  StyleInfo,
  Theme,
  TokenMap,
} from '@antdv-next/cssinjs'
import type { UseCSP } from '@antdv-next/cssinjs/dist/cssinjs-utils/hooks/useCSP'
import type { UsePrefix } from '@antdv-next/cssinjs/dist/cssinjs-utils/hooks/usePrefix'
import type { LayerConfig } from '@antdv-next/cssinjs/dist/hooks/useStyleRegister'
import type { GlobalToken } from 'antdv-next'
import type { AliasToken, CSSInterpolation } from 'antdv-next/dist/theme/interface/index'
import type { Ref } from 'vue'
import type { ProFlattenTokenType, ProTokenType } from '../typing/layoutToken'
import { FastColor } from '@ant-design/fast-color'
import {
  genCalc,
  mergeToken,
  statisticToken,
  token2CSSVar,
  useCSSVarRegister,
} from '@antdv-next/cssinjs'
import useUniqueMemo from '@antdv-next/cssinjs/dist/cssinjs-utils/_util/hooks/useUniqueMemo'
import useDefaultCSP from '@antdv-next/cssinjs/dist/cssinjs-utils/hooks/useCSP'
import getComponentToken from '@antdv-next/cssinjs/dist/cssinjs-utils/util/getComponentToken'
import getCompVarPrefix from '@antdv-next/cssinjs/dist/cssinjs-utils/util/getCompVarPrefix'
import getDefaultComponentToken from '@antdv-next/cssinjs/dist/cssinjs-utils/util/getDefaultComponentToken'
import genMaxMin from '@antdv-next/cssinjs/dist/cssinjs-utils/util/maxmin'
import useStyleRegister from '@antdv-next/cssinjs/dist/hooks/useStyleRegister'
import { theme as antdTheme } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import useLocalToken, { unitless } from 'antdv-next/dist/theme/useToken'
import { computed } from 'vue'
import { useProCacheToken, useProConfig } from '../context'
import batToken from './token'
/**
 * 把一个颜色设置一下透明度
 * @example (#fff, 0.5) => rgba(255, 255, 255, 0.5)
 * @param baseColor {string}
 * @param alpha {number} 0-1
 * @returns rgba {string}
 */
export function setAlpha(baseColor: string, alpha: number) {
  return new FastColor(baseColor).setA(alpha).toRgbString()
}
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

export type GenerateStyle<
  ComponentToken extends object = GlobalToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken, ...rest: any[]) => ReturnType
function genTheme() {
  if (typeof antdTheme === 'undefined' || !antdTheme)
    return batToken
  return antdTheme
}

export const proTheme = genTheme()

export const useToken = proTheme.useToken

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
  }

export type ProAliasCssVarToken = GlobalToken & ProFlattenTokenType & {
  componentCls: string
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
  calc: ReturnType<typeof genCalc>
  min: ReturnType<typeof genMaxMin>['min']
  max: ReturnType<typeof genMaxMin>['max']
} & {
  [key: string]: any
}
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

function genStyleUtils(config: {
  usePrefix: UsePrefix
  useToken: () => {
    token: Ref<ProAliasCssVarToken | GlobalToken>
    realToken?: Ref<ProAliasCssVarToken | GlobalToken>
    theme?: Ref<Theme<any, any>>
    hashId?: Ref<string>
    hashed?: Ref<string | boolean>
    cssVar?: Ref<{
      prefix?: string
      key?: string
    }>
    zeroRuntime?: Ref<boolean>
  }
  useCSP?: UseCSP
  getCompUnitless?: () => typeof unitless
  layer?: LayerConfig
}) {
  const {
    useCSP = useDefaultCSP,
    useToken: useAntdToken,
    usePrefix,
    getCompUnitless,
  } = config
  function genStyleHooks(
    component: string | [string, string],
    styleFn: (token: ProAliasCssVarToken, info: StyleInfo & {
      proComponentsCls: string
    }) => CSSInterpolation,
    getDefaultToken?: (token: AliasToken) => TokenMap,
    options?: {
      /**
       * Component tokens that do not need unit.
       */
      unitless?: Record<string, boolean>
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean
      /**
       * Set order of component style.
       * @default -999
       */
      order?: number
      /**
       * Whether generate styles
       * @default true
       */
      injectStyle?: boolean
    },
  ) {
    const componentName = Array.isArray(component) ? component[0] : component
    function prefixToken(key: string) {
      return `${String(componentName)}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`
    }

    // Fill unitless
    const originUnitless = options?.unitless || {}

    const originCompUnitless
      = typeof getCompUnitless === 'function' ? getCompUnitless() : {}
    const compUnitless = {
      ...originCompUnitless,
      [prefixToken('zIndexPopup')]: true,
    }
    Object.keys(originUnitless).forEach((key) => {
      compUnitless[prefixToken(key) as keyof typeof compUnitless] = originUnitless[key]
    })

    // Options
    const mergedOptions = {
      ...options,
      unitless: compUnitless,
      prefixToken,
    }
    // Hooks
    const useStyle = genComponentStyleHook(component, styleFn, getDefaultToken, mergedOptions)
    const useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions)
    return (prefixCls: Ref<string>, rootCls: Ref<string | undefined> = prefixCls) => {
      const hashId = useStyle(prefixCls)
      const cssVarCls = useCSSVar(rootCls)
      return [hashId, cssVarCls] as const
    }
  }
  function genCSSVarRegister(component: string, getDefaultToken: ((token: AliasToken) => TokenMap) | undefined, options: {
    unitless?: Record<string, boolean>
    ignore?: Partial<Record<keyof AliasToken, boolean>>
    deprecatedTokens?: any[]
    injectStyle?: boolean
    prefixToken: (key: string) => string
  }) {
    const { unitless: compUnitless, prefixToken, ignore } = options
    return (rootCls: Ref<string | undefined>) => {
      const { cssVar, hashId, realToken } = useAntdToken()
      const csp = useCSP()
      useCSSVarRegister(
        computed(() => {
          const _cssVar = cssVar!.value!
          return {
            path: [component],
            prefix: _cssVar?.prefix!,
            key: _cssVar.key!,
            unitless: compUnitless!,
            ignore,
            hashId: hashId?.value,
            nonce: () => csp.value.nonce!,
            token: realToken?.value!,
            scope: rootCls.value!,
          }
        }),
        () => {
          const defaultToken = getDefaultComponentToken(
            component,
            realToken!.value!,
            getDefaultToken,
          )
          const componentToken = getComponentToken(
            component,
            realToken!.value!,
            defaultToken,
            {
              deprecatedTokens: options?.deprecatedTokens,
            },
          )
          if (defaultToken) {
            Object.keys(defaultToken).forEach((key) => {
              componentToken[prefixToken(key)] = componentToken[key]
              delete componentToken[key]
            })
          }
          return componentToken
        },
      )

      return computed(() => cssVar?.value?.key)
    }
  }
  function genComponentStyleHook(
    componentName: string | [string, string],
    styleFn: (token: ProAliasCssVarToken, info: StyleInfo & { proComponentsCls: string }) => CSSInterpolation,
    getDefaultToken: ((token: AliasToken) => TokenMap) | undefined,
    options: {
      // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
      deprecatedTokens?: any[]
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean
      /**
       * Set order of component style. Default is -999.
       */
      order?: number
      injectStyle?: boolean
      unitless?: Record<string, boolean>
    } = {},
  ) {
    const cells = (
      Array.isArray(componentName) ? componentName : [componentName, componentName]
    ) as [string, string]

    const [component] = cells
    const concatComponent = cells.join('-')
    const styleRegisterKey = `${concatComponent}-${hashString(styleFn.toString())}`
    const mergedLayer = config.layer || {
      name: 'antd-pro',
    }
    // Return new style hook
    return (prefixCls: Ref<string>) => {
      const { theme, hashId, token, realToken, cssVar, zeroRuntime } = useAntdToken()
      // Update of `disabledRuntimeStyle` would cause React hook error, so memoized it and never update.
      const mergedZeroRuntime = computed(() => {
        return zeroRuntime?.value
      })
      if (mergedZeroRuntime.value) {
        return hashId!
      }
      const prefix = usePrefix()
      const csp = useCSP()
      const type = 'css'
      // Use unique memo to share the result across all instances
      const calc = computed(() => useUniqueMemo(() => {
        const unitlessCssVar = new Set<string>()
        Object.keys(options.unitless || {}).forEach((key) => {
          unitlessCssVar.add(key)
          // Some component proxy the AliasToken (e.g. Image) and some not (e.g. Modal)
          // We should both pass in `unitlessCssVar` to make sure the CSSVar can be unitless.
          unitlessCssVar.add(token2CSSVar(key, cssVar?.value?.prefix))
          unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix(component, cssVar?.value?.prefix)))
        })
        return genCalc(type, unitlessCssVar)
      }, [type, component, cssVar?.value?.prefix]))
      const { max, min } = genMaxMin(type)
      // Shared config
      const sharedConfig = computed(() => {
        return {
          theme: theme?.value!,
          token: token?.value,
          hashId: hashId?.value,
          nonce: () => csp.value.nonce!,
          clientOnly: options.clientOnly,
          layer: mergedLayer,
          // antd is always at top of styles
          order: options.order || -999,
        }
      })

      const getMergedToken = () => {
        const { token: proxyToken, flush } = statisticToken(token.value)
        const tokenForCalc = realToken?.value || proxyToken
        const defaultComponentToken = getDefaultComponentToken(
          component,
          tokenForCalc,
          getDefaultToken,
        )
        const componentToken = getComponentToken(
          component,
          tokenForCalc,
          defaultComponentToken,
          { deprecatedTokens: options.deprecatedTokens },
        )

        if (defaultComponentToken && typeof defaultComponentToken === 'object') {
          Object.keys(defaultComponentToken).forEach((key) => {
            (defaultComponentToken as any)[key] = `var(${token2CSSVar(
              key,
              getCompVarPrefix(component, cssVar?.value?.prefix),
            )})`
          })
        }

        const mergedToken = mergeToken(
          proxyToken,
          {
            componentCls: `.${prefixCls.value}`,
            prefixCls: prefixCls.value,
            proComponentsCls: `.${prefix.value.rootPrefixCls}-pro`,
            iconCls: `.${prefix.value.iconPrefixCls}`,
            antCls: `.${prefix.value.rootPrefixCls}`,
            calc: calc.value,
            max,
            min,
          } as TokenMap,
          defaultComponentToken,
        ) as ProAliasCssVarToken

        return {
          componentToken,
          flush,
          mergedToken,
        }
      }
      useStyleRegister(
        computed(() => {
          return {
            ...sharedConfig.value,
            path: [styleRegisterKey, prefixCls.value, prefix.value.iconPrefixCls],
          }
        }),
        () => {
          if (options.injectStyle === false)
            return []

          const { componentToken, flush, mergedToken } = getMergedToken()
          const styleInterpolation = styleFn(mergedToken, {
            hashId: hashId!.value!,
            prefixCls: prefixCls.value,
            rootPrefixCls: prefix.value.rootPrefixCls,
            iconPrefixCls: prefix.value.iconPrefixCls,
            proComponentsCls: `${prefix.value.rootPrefixCls}-pro`,
          })
          flush(component, componentToken)
          return styleInterpolation
        },
      )

      return hashId!
    }
  }
  return { genStyleHooks, genComponentStyleHook }
}

const {
  genStyleHooks: useStyle,
  genComponentStyleHook,
} = genStyleUtils({
  usePrefix: () => {
    const configCtx = useConfig()
    return computed(() => {
      const { getPrefixCls, iconPrefixCls } = configCtx.value
      const rootPrefixCls = getPrefixCls()
      return {
        rootPrefixCls,
        iconPrefixCls,
      }
    })
  },
  useToken() {
    const proProvide = useProConfig()
    const { realToken: proRealToken, token: proToken } = useProCacheToken()
    const [theme, localToken, localHashId, localRealToken,,zeroRuntime] = useLocalToken()
    return {
      theme,
      realToken: computed(() => proRealToken?.value || localRealToken.value),
      hashId: computed(() => {
        if (proProvide.value.hashed === false)
          return ''
        return proProvide.value.hashId ?? localHashId.value ?? ''
      }),
      token: computed(() => proToken?.value || localToken.value),
      cssVar: computed(
        () => ({ prefix: 'ant', key: 'css-var-pro' }),
      ),
      zeroRuntime,
    }
  },
  useCSP: () => {
    const configCtx = useConfig()
    return computed(() => configCtx.value?.csp ?? {})
  },
  getCompUnitless: () => unitless,
})

export { genComponentStyleHook, useStyle }
