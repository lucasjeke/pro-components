import type { Key } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type {
  ComputedRef,
  FunctionalComponent,
  InjectionKey,
  VNode,
} from 'vue'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import {
  childrenToArray,
  isSpecialNode,
  useMountMergeState,
} from '@antdv-next1/pro-utils'
import { classNames, omit } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, inject, provide, shallowRef, toRef } from 'vue'
import ProCard from '../../ProCard'
import ProCheckCard from './CheckCard'
import useStyle from './style/group'

export type CheckCardValueType = string | number | boolean

/**
 * Represents the possible value types for a CheckGroup.
 * It can be an array of CheckCardValueTypes, a single CheckCardValueType, or undefined.
 */
export type CheckGroupValueType = CheckCardValueType[] | CheckCardValueType | undefined

/**
 * Represents an option for a CheckCard component.
 */
export interface CheckCardItemType {
  key?: Key
  /**
   * The title to be displayed.
   *
   * @title Title
   */
  title?: AntVueNode

  /**
   * The value of the option.
   *
   * @title Value
   */
  value: CheckCardValueType

  /**
   * The description to be displayed.
   *
   * @title Description
   */
  description?: AntVueNode

  /**
   * The size of the component. Supports three default sizes: 'large', 'default', 'small'.
   * Users can also customize the width and height.
   *
   * @default default
   * @title Component Size
   */
  size?: 'large' | 'default' | 'small'

  /**
   * The avatar to be displayed on the left side. Can be a link or a ReactNode.
   *
   * @title Left Avatar Area
   */
  avatar?: AntVueNode

  /**
   * The cover image. In this mode, other display values are ignored.
   *
   * @title Cover Image
   */
  cover?: AntVueNode

  /**
   * Specifies if the option is disabled.
   *
   * @default false
   * @title Disabled
   */
  disabled?: boolean

  /**
   * Change callback function.
   *
   * @param checked - Indicates whether the option is checked or not.
   * @title Change Callback
   */
  onChange?: (checked: boolean) => void
}

export interface CheckCardItemGroupType {
  title?: string
  key?: Key
  /**
   * Child options.
   */
  children: CheckCardItemType[]
}

export type CheckCardOptionType = string | CheckCardItemType | CheckCardItemGroupType

/**
 * Represents the props for the CheckCardGroup component.
 */
export interface CheckCardGroupContextType {
  /**
   * A function to toggle the selected option.
   * @param option - The option to toggle.
   */
  toggleOption?: (option: CheckCardItemType) => void

  /**
   * The currently selected value.
   */
  value?: any

  /**
   * Specifies whether the component is disabled.
   */
  disabled?: boolean
  /**
   * The size of the component.
   */
  size?: any

  /**
   * Specifies whether the component is in a loading state.
   */
  loading?: any

  /**
   * Specifies whether the component has a border.
   */
  bordered?: any

  /**
   * Specifies whether multiple options can be selected.
   */
  multiple?: boolean

  /**
   * A function to register a value.
   * @param value - The value to register.
   */
  registerValue?: (value: any) => void

  /**
   * A function to cancel a value.
   * @param value - The value to cancel.
   */
  cancelValue?: (value: any) => void
}

export const checkCardGroupContextKey: InjectionKey<ComputedRef<CheckCardGroupContextType>>
  = Symbol('checkCardGroupContext')

export function useCheckCardGroupContextProvider(props: ComputedRef<CheckCardGroupContextType>) {
  return provide(checkCardGroupContextKey, props)
}

export function useCheckCardGroupContextInject() {
  return inject(
    checkCardGroupContextKey,
    computed(() => undefined as unknown as CheckCardGroupContextType),
  )
}

export interface ProCheckCardGroupProps {
  prefixCls?: string
  disabled?: boolean
  /**
   * 是否多选
   *
   * @title 是否多选
   */
  multiple?: boolean
  /**
   * 默认选中的选项
   *
   * @title 默认选中的选项
   */
  defaultValue?: CheckGroupValueType
  /**
   * 指定选中的选项
   *
   * @title 指定选中的选项
   */
  value?: CheckGroupValueType
  'onUpdate:value'?: (value: CheckGroupValueType) => void
  onChange?: (value: CheckGroupValueType) => void
  options?: CheckCardOptionType[]
  loading?: boolean
  size?: 'large' | 'default' | 'small'
}

const InternalCheckCardGroup = defineComponent<ProCheckCardGroupProps, {}, string, CustomSlotsType<{
  default?: () => VNode[]
}>>((props, { slots, attrs }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-checkcard-group`)
  const registerValueMap = shallowRef<Map<CheckCardValueType, any>>(new Map())
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const [stateValue, setStateValue] = useMountMergeState<
      CheckCardValueType[] | CheckCardValueType | undefined
  >(props.defaultValue, {
    value: toRef(() => props.value),
    onChange: (value) => {
      props.onChange?.(value)
      props['onUpdate:value']?.(value)
    },
  })
  const registerValue = (value: string) => registerValueMap.value?.set(value, true)

  const cancelValue = (value: string) => registerValueMap.value?.delete(value)
  const getOptions = (options: CheckCardOptionType[] = []) =>
    options.map((option) => {
      if (typeof option === 'string') {
        return {
          title: option,
          value: option,
        } as CheckCardItemType
      }
      return option
    })
  const children = computed(() => {
    if (props.loading) {
      return Array.from({ length: props.options?.length
        || childrenToArray(slots.default?.()).filter(vnode => !isSpecialNode(vnode)).length
        || 1 })
        .fill(0)
        .map((_, index) => <ProCheckCard key={index} loading />)
    }
    if (getOptions(props.options) && getOptions(props.options).length > 0) {
      const optionValue = stateValue.value as CheckCardValueType[] | CheckCardValueType
      const renderOptions = (list: CheckCardOptionType[]) => {
        return list.map((option, index) => {
          if (
            (option as CheckCardItemGroupType)?.children
            && (option as CheckCardItemGroupType)?.children.length > 0
          ) {
            return (
              <ProCard
                collapsible
                key={(option as CheckCardItemGroupType).title?.toString() || index.toString()}
                title={(option as CheckCardItemGroupType).title}
                style={{ flex: '0 0 100%' }}
                v-slots={{
                  default: () => renderOptions((option as CheckCardItemGroupType)?.children),
                }}
              />
            )
          }
          return (
            <ProCheckCard
              {...omit(attrs, ['class', 'style'])}
              key={(option as CheckCardItemType).value.toString()}
              disabled={(option as CheckCardItemType).disabled}
              size={(option as CheckCardItemType).size ?? props.size}
              value={(option as CheckCardItemType).value}
              checked={
                props.multiple
                  ? (optionValue as CheckCardValueType[])?.includes(
                      (option as CheckCardItemType).value,
                    )
                  : (optionValue as CheckCardValueType) === (option as CheckCardItemType).value
              }
              onChange={(option as CheckCardItemType).onChange}
              title={(option as CheckCardItemType).title}
              avatar={(option as CheckCardItemType).avatar}
              description={(option as CheckCardItemType).description}
              cover={(option as CheckCardItemType).cover}
            />
          )
        })
      }
      return renderOptions(getOptions(props.options))
    }
    return slots.default?.()
  })
  const toggleOption = (option: CheckCardItemType) => {
    if (!props.multiple) {
      let changeValue
      changeValue = stateValue.value
      // 单选模式
      if (changeValue === option.value) {
        changeValue = undefined
      }
      else {
        changeValue = option.value
      }
      setStateValue?.(changeValue)
    }

    if (props.multiple) {
      let changeValue = []
      const stateValues = stateValue.value as CheckCardValueType[]
      const hasOption = stateValues?.includes(option.value)
      changeValue = [...(stateValues || [])]
      if (!hasOption) {
        changeValue.push(option.value)
      }
      if (hasOption) {
        changeValue = changeValue.filter(itemValue => itemValue !== option.value)
      }
      const newOptions = getOptions(props.options)
      const newValue = changeValue
        ?.filter(val => registerValueMap.value.has(val))
        ?.sort((a, b) => {
          const indexA = newOptions.findIndex(opt => (opt as CheckCardItemType).value === a)
          const indexB = newOptions.findIndex(opt => (opt as CheckCardItemType).value === b)
          return indexA - indexB
        })

      setStateValue(newValue)
    }
  }
  useCheckCardGroupContextProvider(
    computed(() => ({
      toggleOption,
      value: stateValue.value,
      disabled: props.disabled,
      size: props.size,
      loading: props.loading,
      multiple: props.multiple,
      registerValue,
      cancelValue,
    })),
  )
  return () =>
    (
      <div class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value)} style={attrs.style}>
        {children.value}
      </div>
    )
}, {
  name: 'InternalCheckCardGroup',
  inheritAttrs: false,
})

const ProCheckCardGroup: FunctionalComponent<ProCheckCardGroupProps> = (props, { slots }) => (
  <ProConfigProvider needDeps>
    <InternalCheckCardGroup {...props} v-slots={slots} />
  </ProConfigProvider>
)

export default ProCheckCardGroup
