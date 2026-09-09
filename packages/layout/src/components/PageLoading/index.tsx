import type { SpinProps } from 'antdv-next'
import type { FunctionalComponent } from 'vue'
import { Spin } from 'antdv-next'

const PageLoading: FunctionalComponent<
  SpinProps & {
    [key: string]: any
  }
> = ({ isLoading, pastDelay, timedOut, error, retry, ...reset }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', textAlign: 'center' }}>
    <Spin size="large" {...reset} />
  </div>
)
PageLoading.displayName = 'PageLoading'
PageLoading.inheritAttrs = false
export default PageLoading
