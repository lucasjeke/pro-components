import type { InjectionKey, ShallowRef } from 'vue'
import type { ProTableInstance } from '../../typing'
import { inject, provide } from 'vue'

export const editableTableActionContextKey
  = Symbol('editableTableActionContext')

export function useEditableTableActionContextProvider<T extends Record<string, any> = Record<string, any>>(props: ShallowRef<ProTableInstance<T> | null>) {
  return provide(editableTableActionContextKey as InjectionKey<ShallowRef<ProTableInstance<T> | null>>, props)
}

export function useEditableTableActionContextInject<T extends Record<string, any> = Record<string, any>>() {
  return inject(editableTableActionContextKey as InjectionKey<ShallowRef<ProTableInstance<T> | null>>)
}
