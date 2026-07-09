import type { Theme } from '@antdv-next/cssinjs'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { AliasToken } from 'antdv-next/dist/theme/internal'
import type { IntlType } from './intl'
import type { ProConfigProviderProps } from './typing'
import type { ProAliasCssVarToken, ProAliasToken } from './useStyle'
import { useCacheToken } from '@antdv-next/cssinjs'
import { ConfigProvider as AntdConfigProvider, theme as antdTheme } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { ignore } from 'antdv-next/dist/theme/useToken'
import dayjs from 'dayjs'
import { computed, defineComponent, watch } from 'vue'
import { useProCacheTokenProvider, useProConfig, useProConfigProvider } from './context'
import { findIntlKeyByAntdLocaleKey, intlMap, zhCNIntl } from './intl'
import { getLayoutDesignToken, proLayoutUnitless } from './typing/layoutToken'
import { isNeedOpenHash } from './utils'
import { shallowMergeOneLevel } from './utils/merge'
import 'dayjs/locale/zh-cn'

const preserve: {
  [key in keyof AliasToken]?: boolean;
} = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true,
  screenXXLMax: true,
  screenXXXL: true,
  screenXXXLMin: true,
}

function flattenToken(
  token: Record<string, any>,
  prefix = '',
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(token)) {
    const currentKey = prefix
      ? `${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}`
      : key

    if (
      value
      && typeof value === 'object'
      && !Array.isArray(value)
    ) {
      Object.assign(result, flattenToken(value, currentKey))
    }
    else {
      result[currentKey] = value
    }
  }

  return result
}
/**
 * 解析最终使用的 intl 实例。优先级从高到低：
 * 1. 组件 props 显式传入的 `intl`
 * 2. 父级 Provider 里非 `default` 的 intl（即用户已显式配置过）
 * 3. 根据 antd 的 locale 推断（zh_CN → zh-CN → zhCNIntl）
 * 4. 兜底 zh-CN
 */
function resolveIntl(propsIntl: IntlType | undefined, parentIntl: IntlType | undefined, antdLocaleName: string | undefined): IntlType {
  if (propsIntl)
    return propsIntl
  if (parentIntl && parentIntl.locale !== 'default')
    return parentIntl
  if (antdLocaleName) {
    const key = findIntlKeyByAntdLocaleKey(antdLocaleName)
    const found = key ? intlMap[key as keyof typeof intlMap] : undefined
    if (found)
      return found
  }
  return zhCNIntl
}

const ConfigProviderContainer = defineComponent<ProConfigProviderProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  const config = useConfig()
  const proProvide = useProConfig()
  const tokenContext = antdTheme.useToken?.()
  const mergedProps = computed(() => ({ ...attrs, ...props }) as ProConfigProviderProps)
  /**
   * pro 的 类
   * @example ref('.ant-pro')
   */
  const proComponentsCls = computed(() => (mergedProps.value.prefixCls ? `.${mergedProps.value.prefixCls}` : `.${config.value.getPrefixCls()}-pro`))
  const antCls = computed(() => `.${config.value.getPrefixCls()}`)

  const salt = computed(() => `${proComponentsCls.value}`)

  const proLayoutTokenMerge = computed(() => getLayoutDesignToken(mergedProps.value.token || {}, tokenContext.token.value))
  const proProvideValue = computed(() => {
    return {
      ...proProvide.value,
      dark: mergedProps.value.dark ?? proProvide.value.dark,
      compact: mergedProps.value.compact ?? proProvide.value.compact,
      token: shallowMergeOneLevel<ProAliasToken>(proProvide.value.token, tokenContext.token.value, {
        proComponentsCls: proComponentsCls.value,
        antCls: antCls.value,
        themeId: tokenContext.theme.value.id,
        layout: proLayoutTokenMerge.value,
        // ...flattenToken({ layout: proLayoutTokenMerge.value }, 'pro'),
      }),
      intl: resolveIntl(mergedProps.value.intl, proProvide.value.intl, config.value.locale?.locale),
    }
  })

  const finalToken = computed(() => ({
    ...(proProvideValue.value?.token || {}),
    proComponentsCls: proComponentsCls.value,
  }))
  const cacheToken = useCacheToken(
    tokenContext.theme,
    computed(() => {
      const { layout, ...restFinalToken } = finalToken.value || {}
      const prolayoutToken = flattenToken({ layout }, 'pro')
      return [tokenContext.token.value, { ...restFinalToken, ...prolayoutToken }]
    }),
    computed(() => {
      const { layout, ...restFinalToken } = finalToken.value || {}
      const prolayoutToken = flattenToken({ layout }, 'pro')
      return {
        salt: salt.value,
        override: { ...restFinalToken, ...prolayoutToken },
        cssVar: {
          key: 'css-var-pro',
          unitless: proLayoutUnitless,
          ignore,
          preserve,
          prefix: 'ant',
        },
        nonce: config.value.csp?.nonce,
      }
    }),
  )
  const hashed = computed(() => {
    if (mergedProps.value.hashed === false) {
      return false
    }
    if (proProvide.value.hashed === false)
      return false
    return true
  })
  const hashId = computed(() => {
    if (mergedProps.value.hashed === false) {
      return ''
    }
    if (proProvide.value.hashed === false)
      return ''
    if (isNeedOpenHash() === false) {
      return ''
    }
    else {
      // 生产环境或其他环境
      return cacheToken.value[1]
    }
  })
  watch(
    () => config.value.locale?.locale,
    () => {
      dayjs.locale(config.value.locale?.locale || 'zh-cn')
    },
    {
      immediate: true,
    },
  )

  const themeConfig = computed(() => {
    const { locale, getPrefixCls, ...restConfig } = config.value
    return {
      ...restConfig.theme,
      // token: flattenToken({ layout: proLayoutTokenMerge.value }, 'pro'),
      hashId: hashId.value,
      hashed: hashed.value && isNeedOpenHash(),
    }
  })
  const proConfigConsumerValue = computed(() => {
    return ({
      ...proProvideValue.value!,
      valueTypeMap: mergedProps.value.valueTypeMap || proProvide.value.valueTypeMap,
      token: finalToken.value,
      theme: tokenContext.theme.value as unknown as Theme<any, any>,
      hashed: hashed.value,
      hashId: hashId.value,
      prefixCls: mergedProps.value.prefixCls,
    })
  })
  useProCacheTokenProvider({
    realToken: computed(() => cacheToken.value[2] as ProAliasCssVarToken),
    token: computed(() => cacheToken.value[0] as ProAliasCssVarToken),
  })
  useProConfigProvider(proConfigConsumerValue)
  return () => {
    const { locale, getPrefixCls, ...restConfig } = config.value
    return (
      <AntdConfigProvider {...restConfig} theme={themeConfig.value}>
        {slots.default?.()}
      </AntdConfigProvider>
    )
  }
}, {
  name: 'ConfigProviderContainer',
  inheritAttrs: false,
})

export default ConfigProviderContainer
