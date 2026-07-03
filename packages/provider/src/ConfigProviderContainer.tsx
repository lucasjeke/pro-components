import type { Theme } from '@antdv-next/cssinjs'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { IntlType } from './intl'
import type { ProConfigProviderProps } from './typing'
import type { ProAliasToken } from './useStyle'
import { useCacheToken } from '@antdv-next/cssinjs'
import { ConfigProvider as AntdConfigProvider, theme as antdTheme } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import dayjs from 'dayjs'
import { computed, defineComponent, watch } from 'vue'
import { useProConfig, useProConfigProvider } from './context'
import { findIntlKeyByAntdLocaleKey, intlMap, zhCNIntl } from './intl'
import { getLayoutDesignToken } from './typing/layoutToken'
import { isNeedOpenHash } from './utils'
import { shallowMergeOneLevel } from './utils/merge'
import 'dayjs/locale/zh-cn'

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
}>>((props, { slots }) => {
  const config = useConfig()
  const proProvide = useProConfig()
  const tokenContext = antdTheme.useToken?.()
  /**
   * pro 的 类
   * @example ref('.ant-pro')
   */
  const proComponentsCls = computed(() => (props.prefixCls ? `.${props.prefixCls}` : `.${config.value.getPrefixCls()}-pro`))
  const antCls = computed(() => `.${config.value.getPrefixCls()}`)

  const salt = computed(() => `${proComponentsCls.value}`)

  /**
   * 合并一下token，不然导致嵌套 token 失效
   */
  const proLayoutTokenMerge = computed(() => getLayoutDesignToken(props.token || {}, tokenContext.token.value))

  const proProvideValue = computed(() => {
    return {
      ...proProvide.value,
      dark: props.dark ?? proProvide.value.dark,
      compact: props.compact ?? proProvide.value.compact,
      token: shallowMergeOneLevel<ProAliasToken>(proProvide.value.token, tokenContext.token.value, {
        proComponentsCls: proComponentsCls.value,
        antCls: antCls.value,
        themeId: tokenContext.theme.value.id,
        layout: proLayoutTokenMerge.value,
      }),
      intl: resolveIntl(props.intl, proProvide.value.intl, config.value.locale?.locale),
    }
  })

  const finalToken = computed(() => ({
    ...(proProvideValue.value?.token || {}),
    proComponentsCls: proComponentsCls.value,
  }))

  const cacheToken = useCacheToken<ProAliasToken>(
    tokenContext.theme,
    computed(() => [tokenContext.token.value, finalToken.value ?? {}]),
    computed(() => ({
      salt: salt.value,
      override: finalToken.value,
      cssVar: {
        key: 'pro',
      },
    })),
  )

  const hashed = computed(() => {
    if (props.hashed === false) {
      return false
    }
    if (proProvide.value.hashed === false)
      return false
    return true
  })
  const hashId = computed(() => {
    if (props.hashed === false) {
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
      hashId: hashId.value,
      hashed: hashed.value && isNeedOpenHash(),
    }
  })
  const proConfigConsumerValue = computed(() => {
    return ({
      ...proProvideValue.value!,
      valueTypeMap: props.valueTypeMap || proProvide.value.valueTypeMap,
      token: finalToken.value,
      theme: tokenContext.theme.value as unknown as Theme<any, any>,
      hashed: hashed.value,
      hashId: hashId.value,
      prefixCls: props.prefixCls,
    })
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
