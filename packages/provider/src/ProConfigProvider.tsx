import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { App, Plugin } from 'vue'
import type { ProConfigProviderProps } from './typing'
import { ConfigProvider as AntdConfigProvider, theme as antdTheme } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import zh_CN from 'antdv-next/locale/zh_CN'
import { computed, defineComponent } from 'vue'
import ConfigProviderContainer from './ConfigProviderContainer'
import { useProConfig } from './context'

type OmitUndefined<T> = {
  [P in keyof T]: NonNullable<T[P]>;
}
function omitUndefined<T extends Record<string, any> | undefined>(obj: T): OmitUndefined<T> {
  const newObj = {} as Record<string, any> as T
  Object.keys(obj || {}).forEach((key) => {
    if (obj?.[key] !== undefined) {
      (newObj as Record<string, any>)[key] = obj[key]
    }
  })
  if (Object.keys(newObj || {}).length < 1) {
    return undefined as unknown as OmitUndefined<T>
  }
  return newObj as OmitUndefined<T>
}

const _ProConfigProvider = defineComponent<ProConfigProviderProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { slots, attrs }) => {
  const config = useConfig()
  const proProvide = useProConfig()
  const mergedProps = computed(() => ({ ...attrs, ...props }) as ProConfigProviderProps)
  const mergeAlgorithm = () => {
    const algorithm = config.value.theme?.algorithm
    const isDark = mergedProps.value.dark ?? proProvide.value.dark
    const isCompact = mergedProps.value.compact ?? proProvide.value.compact
    if (algorithm) {
      if (!Array.isArray(algorithm)) {
        if (isDark && !isCompact) {
          return [algorithm, antdTheme.darkAlgorithm].filter(Boolean)
        }
        else if (!isDark && isCompact) {
          return [algorithm, antdTheme.compactAlgorithm].filter(Boolean)
        }
        else if (isDark && isCompact) {
          return [algorithm, antdTheme.darkAlgorithm, antdTheme.compactAlgorithm].filter(Boolean)
        }
      }
      else {
        if (isDark && !isCompact) {
          return [...(algorithm || []), antdTheme.darkAlgorithm].filter(Boolean)
        }
        else if (!isDark && isCompact) {
          return [...(algorithm || []), antdTheme.compactAlgorithm].filter(Boolean)
        }
        else if (isDark && isCompact) {
          return [...(algorithm || []), antdTheme.darkAlgorithm, antdTheme.compactAlgorithm].filter(Boolean)
        }
      }
    }
    else {
      if (isDark && !isCompact) {
        return [antdTheme.darkAlgorithm]
      }
      else if (!isDark && isCompact) {
        return [antdTheme.compactAlgorithm]
      }
      else if (isDark && isCompact) {
        return [antdTheme.darkAlgorithm, antdTheme.compactAlgorithm]
      }
    }
    return algorithm
  }
  // 是不是不需要渲染 provide
  const isNullProvide = computed(
    () => mergedProps.value.needDeps
      && proProvide.value.hashId !== undefined
      && Object.keys(Object.fromEntries(Object.entries(mergedProps.value).filter(([, v]) => v !== undefined)))
        .sort()
        .join('-') === 'needDeps',
  )
  const configProviderProps = computed(() => {
    const { locale, theme, ...rest } = config.value
    return {
      ...rest,
      locale: locale || zh_CN,
      theme: omitUndefined({
        ...theme,
        algorithm: mergeAlgorithm(),
      }),
    }
  })
  return () => {
    const { token } = mergedProps.value
    if (isNullProvide.value) {
      return <>{slots.default?.()}</>
    }
    return (
      <AntdConfigProvider
        {...configProviderProps.value}
      >
        <ConfigProviderContainer {...mergedProps.value} token={token} v-slots={slots} />
      </AntdConfigProvider>
    )
  }
}, {
  name: 'ProConfigProvider',
  inheritAttrs: false,
})

const ProConfigProvider = _ProConfigProvider as typeof _ProConfigProvider & Plugin

ProConfigProvider.install = (app: App) => {
  app.component(ProConfigProvider.name, ProConfigProvider)
  return app
}

export default ProConfigProvider
