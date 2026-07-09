import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { IntlType } from './intl'
import type { ProRenderFieldPropsType } from './typing'
import type { ProAliasCssVarToken, ProAliasToken } from './useStyle'
import { theme as antdTheme } from 'antdv-next'
import { inject, provide, ref } from 'vue'
import { zhCNIntl } from './intl'

/**
 * 自带的token 配置
 */
export interface ProConfigConsumerProps {
  intl?: IntlType
  valueTypeMap?: Record<string, ProRenderFieldPropsType>
  token: ProAliasToken
  hashId?: string
  hashed?: boolean
  dark?: boolean
  compact?: boolean
  prefixCls?: string
}

export interface ProCacheTokenProps {
  realToken?: ComputedRef<ProAliasCssVarToken>
  token?: ComputedRef<ProAliasCssVarToken>
}
export const proCacheTokenKey: InjectionKey<ProCacheTokenProps> = Symbol('proCacheTokenContext')

export const useProCacheTokenProvider = (props: ProCacheTokenProps) => provide(proCacheTokenKey, props)

export const useProCacheToken = () => inject(proCacheTokenKey, {})

export const proConfigConsumerKey: InjectionKey<Ref<ProConfigConsumerProps>> = Symbol('proConfigConsumerContext')

/**
 * The default value for ProConfigContext, used as a fallback when no provider is found.
 */
export const defaultProConfigConsumer: ProConfigConsumerProps = {
  intl: {
    ...zhCNIntl,
    locale: 'default',
  },
  valueTypeMap: {},
  hashed: true,
  dark: false,
  compact: false,
  token: {
    ...antdTheme.getDesignToken(),
    proComponentsCls: '.ant-pro',
    antCls: '.ant',
    themeId: 0,
  },
  prefixCls: '.ant-pro',
}
// defaultToken as ProAliasToken
// 预创建默认的 Ref，避免 inject 失败时重复创建新的 Ref 实例
const defaultProConfigConsumerRef = ref(defaultProConfigConsumer)

export const useProConfigProvider = (props: Ref<ProConfigConsumerProps>) => provide(proConfigConsumerKey, props)

/**
 * Inject the ProConfig context. If not found, use the default value.
 * @returns The context value (as a Ref)
 */
export const useProConfig = () => inject(proConfigConsumerKey, defaultProConfigConsumerRef)
