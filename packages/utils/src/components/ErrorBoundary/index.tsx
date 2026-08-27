import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VueNode } from '../../typing'
import { Result, TypographyText } from 'antdv-next'
import { defineComponent, onErrorCaptured, ref } from 'vue'

// emits: ['errorCaptured'],

const ErrorBoundary = defineComponent<{
  fallback?: (options: { error: Error, info: string }) => VueNode
  onError?: (error: Error) => void
  onErrorCaptured?: Parameters<typeof onErrorCaptured>[0]
}, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { slots }) => {
  const hasError = ref<boolean>(false)
  const errorInfo = ref()
  const $error = ref()
  onErrorCaptured((error: Error, vm, info: string) => {
    console.log('ErrorBoundary captured an error:', error, vm, info)
    if (!info.includes('render')) {
      return false
    }
    hasError.value = true
    errorInfo.value = info
    $error.value = error
    props.onError?.(error)
    props.onErrorCaptured?.(error, vm, info)
    return false
  })
  return () => (
    <>
      {hasError.value
        ? (
            <>
              {props.fallback
                ? (
                    <>
                      {typeof props.fallback === 'function'
                        ? props.fallback?.({ error: $error.value, info: errorInfo.value })
                        : props.fallback}
                    </>
                  )
                : (
                    <Result status="error" title="Something went wrong." style={{ zIndex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <TypographyText>
                          {errorInfo.value}
                          ：
                          <TypographyText>{$error.value.toString()}</TypographyText>
                        </TypographyText>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {($error.value?.stack || '')
                            .replace($error.value.toString(), '')
                            ?.split('\n')
                            .map((stack: string, i: number) => (
                              <div key={stack + i} style={{ textAlign: 'left', fontSize: '10px' }}>
                                <TypographyText type="secondary">{stack}</TypographyText>
                              </div>
                            )) ?? null}
                        </div>
                      </div>
                    </Result>
                  )}
            </>
          )
        : (
            <>{slots.default?.()}</>
          )}
    </>
  )
}, {
  name: 'ErrorBoundary',
  inheritAttrs: false,
})

export default ErrorBoundary
