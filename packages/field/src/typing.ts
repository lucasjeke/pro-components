import type {
  BaseProFieldFC,
  ProFieldFCRenderProps,
  ProRenderFieldPropsType,
} from '@antdv-next1/pro-provider'
import type { ProFieldRequestData } from '@antdv-next1/pro-utils'
import type { VueNode } from '@v-c/util/dist/type'
import type { Ref } from 'vue'

/** 默认的 Field 需要实现的功能 */
export type ProFieldFC<T = any, K = any> = BaseProFieldFC<K>
  & ProRenderFieldPropsType<K>
  & T & {
    id?: string
  }

export type ProFieldEmptyText = string | false

/** 轻量筛选的field属性 */
export interface ProFieldLightProps {
  // label和clear图标的ref
  lightLabel?: Ref<{
    labelRef: Ref<HTMLElement>
    clearRef: Ref<HTMLElement>
  }>
  // 是否点击了label
  labelTrigger?: boolean
}

export type RenderProps = Omit<ProFieldFCRenderProps, 'text' | 'placeholder'> & ProRenderFieldPropsType & {
  id?: string
  /** 从服务器读取选项 */
  request?: ProFieldRequestData
  emptyText?: VueNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
