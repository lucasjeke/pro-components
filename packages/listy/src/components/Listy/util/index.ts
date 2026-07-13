import type { ConfigComponentProps as AntdConfigComponentProps, DirectionType, PopupOverflow } from 'antdv-next/config-provider/context'
import type { RenderEmptyHandler } from 'antdv-next/dist/config-provider/defaultRenderEmpty'
import type { ComputedRef, CSSProperties, Ref } from 'vue'
import { useComponentBaseConfig as AntdUseComponentBaseConfig } from 'antdv-next/config-provider/context'

interface ComponentBaseProps {
  rootClass?: string
  prefixCls?: string
}

interface ConfigComponentProps extends AntdConfigComponentProps {
  listy?: {
    class?: string
    style?: CSSProperties
  }
}
type UseComponentBaseConfigReturn<
  T extends keyof ConfigComponentProps,
>
  = ({
    classes?: any
    styles?: any
  } & ConfigComponentProps[T] extends infer T_1 ? { [Key in keyof T_1]-?: Ref<T_1[Key], T_1[Key]> } : never) & {
    direction: ComputedRef<DirectionType>
    prefixCls: ComputedRef<string>
    rootPrefixCls: ComputedRef<string>
    getPopupContainer: ((triggerNode?: HTMLElement) => HTMLElement) | undefined
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string
    getTargetContainer: (() => HTMLElement) | undefined
    virtual: ComputedRef<boolean | undefined>
    renderEmpty: ComputedRef<RenderEmptyHandler | undefined>
    popupMatchSelectWidth: ComputedRef<boolean | undefined>
    popupOverflow: ComputedRef<PopupOverflow | undefined>
  }
export function useComponentBaseConfig<
  T extends keyof ConfigComponentProps,
  K extends keyof NonNullable<ConfigComponentProps[T]> = keyof NonNullable<ConfigComponentProps[T]>,
>(propName: T, props?: ComponentBaseProps, keys?: readonly K[], suffixCls?: string): UseComponentBaseConfigReturn<T> {
  const config = AntdUseComponentBaseConfig(propName as keyof AntdConfigComponentProps, props, keys as keyof NonNullable<AntdConfigComponentProps[keyof AntdConfigComponentProps]>, suffixCls)
  return config as unknown as UseComponentBaseConfigReturn<T>
}
