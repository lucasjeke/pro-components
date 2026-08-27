import type { ComputedRef, Ref } from 'vue'
import { useEffect } from '@antdv-next1/pro-utils'
import { useMergedState } from '@v-c/util'
import { computed } from 'vue'

export type RequestData<T = any> = {
  data?: T
  success?: boolean
  [key: string]: any
} & Record<string, any>

export interface UseFetchDataAction<T extends Record<string, any>> {
  dataSource?: Ref<RequestData<T>['data'] | T | undefined>
  setDataSource: (value?: RequestData<T>['data'] | T) => void
  loading?: Ref<boolean | undefined>
  reload: () => Promise<void>
}

function useFetchData<T extends Record<string, any>>(getData: () => Promise<RequestData<T>>, options?: {
  effects?: any[]
  manual: ComputedRef<boolean | undefined>
  loading: ComputedRef<boolean | undefined>
  onLoadingChange?: (loading?: boolean) => void
  onRequestError?: (e: Error) => void
  dataSource?: ComputedRef<RequestData<T>['data'] | undefined>
  defaultDataSource?: T['data']
  onDataSourceChange?: (value?: RequestData<T>['data']) => void
}): UseFetchDataAction<T> {
  const {
    onRequestError,
    effects,
    manual,
    dataSource,
    defaultDataSource,
    onDataSourceChange,
  } = options || {}
  const [entity, setEntity] = useMergedState<RequestData<T>['data']>(defaultDataSource, {
    value: dataSource,
    onChange: onDataSourceChange,
  })
  const [loading, setLoading] = useMergedState<boolean | undefined>(
    options?.loading.value,
    {
      value: computed(() => options?.loading.value),
      onChange: options?.onLoadingChange,
    },
  )

  const updateDataAndLoading = (data?: T) => {
    setEntity(data)
    setLoading(false)
  }
  /** 请求数据 */
  const fetchList = async () => {
    if (loading.value) {
      return
    }
    setLoading(true)
    try {
      const { data, success } = (await getData()) || {}
      if (success !== false) {
        updateDataAndLoading(data)
      }
    }
    catch (e) {
      // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误
      if (onRequestError === undefined)
        throw new Error(e as string)
      else onRequestError(e as Error)
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (manual?.value) {
      return
    }
    fetchList()
  }, [...(effects || []), manual])

  return {
    dataSource: entity,
    setDataSource: setEntity,
    loading,
    reload: () => {
      return fetchList()
    },
  }
}

export default useFetchData
