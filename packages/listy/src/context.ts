import type { ComputedRef, InjectionKey } from 'vue'
import type { ListyItemLayout, ProListyGridType } from './typing'
import { inject, provide } from 'vue'

export const proListyContextKey = Symbol('proListyContext')

export interface ProListyContextProps {
  grid?: ComputedRef<ProListyGridType>
  itemLayout?: ComputedRef<ListyItemLayout>
}
export function useProListyContextProvider(props: ProListyContextProps) {
  return provide(proListyContextKey as InjectionKey<ProListyContextProps>, props)
}

export function useProListyContextInject() {
  return inject(proListyContextKey as InjectionKey<ProListyContextProps>, {} as ProListyContextProps)
}
