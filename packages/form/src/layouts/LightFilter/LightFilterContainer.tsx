import type { VueNode } from '@antdv-next1/pro-utils'
import type { ChangeEvent } from '@v-c/util/dist/EventInterface'
import type { PopoverProps, SizeType, TooltipPlacement } from 'antdv-next'
import type { VNode } from 'vue'
import type { LightFilterFooterRender } from '../../RenderTypings'
import { useIntl } from '@antdv-next1/pro-provider'
import {
  FieldLabel,
  FilterDropdown,
  normalizeProps,
  useEffect,
  useState,
} from '@antdv-next1/pro-utils'
import { FilterOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { cloneVNode, computed, defineComponent } from 'vue'
import { useStyle } from './style'

export interface ProLightFilterContainerProps {
  items?: VNode[]
  prefixCls?: string
  size?: SizeType
  values: Record<string, any>
  onValuesChange: (values: Record<string, any>) => void
  collapse?: boolean
  collapseLabel?: VueNode
  variant?: 'outlined' | 'filled' | 'borderless'
  footerRender?: LightFilterFooterRender
  placement?: TooltipPlacement
  popoverProps?: Omit<
    PopoverProps,
     'content' | 'trigger' | 'open' | 'onOpenChange' | 'placement'
  >
}

const ProLightFilterContainer = defineComponent<ProLightFilterContainerProps>((props) => {
  const intl = useIntl()
  const [open, setOpen] = useState<boolean>(false)
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const lightFilterClassName = computed(() => `${prefixCls.value}-form-light-filter`)
  const { wrapSSR, hashId } = useStyle(lightFilterClassName)
  const [moreValues, setMoreValues] = useState<Record<string, any>>(() => {
    return { ...props.values }
  })
  useEffect(() => {
    setMoreValues({ ...props.values })
  }, [() => props.values])

  const renderCollapseLabelRender = () => {
    if (props.collapseLabel) {
      return props.collapseLabel
    }
    if (props.collapse) {
      return (
        <FilterOutlined
          class={classNames(`${lightFilterClassName.value}-collapse-icon`, hashId.value)}
        />
      )
    }
    return (
      <FieldLabel
        variant={props.variant || 'borderless'}
        size={props.size || 'middle'}
        label={intl.value.getMessage({ id: 'form.lightFilter.more', defaultMessage: '更多筛选' })}
      />
    )
  }
  const items = computed(() => {
    const collapseItemsArr: VNode[] = []
    const outsideItemsArr: VNode[] = []
    props.items?.forEach((item) => {
      if (!item)
        return
      // 彻底归一化 VNode 的 props：将 kebab-case 属性名统一转换为 camelCase，
      // 解决泛型组件未显式声明 props 时 Vue 不会自动转换的问题，
      // 使后续所有 item.props.xxx 的访问都能正常工作
      if (item.props) {
        item.props = normalizeProps(item.props)
      }
      let { secondary } = item.props || {}
      if (typeof secondary === 'string') {
        secondary = true
      }
      let collapse = props.collapse
      if (typeof collapse === 'string') {
        collapse = true
      }
      if (secondary || collapse) {
        collapseItemsArr.push(item)
      }
      else {
        outsideItemsArr.push(item)
      }
    })
    return {
      collapseItems: collapseItemsArr,
      outsideItems: outsideItemsArr,
    }
  })
  return () => {
    const { size = 'middle', onValuesChange, variant, values, footerRender, placement, popoverProps } = props
    return wrapSSR(
      <div
        class={classNames(
          lightFilterClassName.value,
          hashId.value,
          `${lightFilterClassName.value}-${size}`,
          {
            [`${lightFilterClassName.value}-effective`]: Object.keys(values!).some(key =>
              Array.isArray(values?.[key]) ? values[key].length > 0 : values?.[key],
            ),
          },
        )}
      >
        <div class={classNames(`${lightFilterClassName.value}-container`, hashId.value)}>
          {items.value.outsideItems.map((child, index) => {
            if (!child?.props) {
              return child
            }
            const { key } = child
            const { fieldProps } = normalizeProps(child?.props || {}) as {
              fieldProps: { placement: TooltipPlacement }
            }

            const newPlacement = fieldProps?.placement ? fieldProps?.placement : placement
            return (
              <div
                class={classNames(`${lightFilterClassName.value}-item`, hashId.value)}
                key={key || index}
              >
                {cloneVNode(child, {
                  fieldProps: {
                    ...fieldProps,
                    placement: newPlacement,
                    variant: 'borderless',
                  },
                  // proFieldProps 会直接作为 ProField 的 props 传递过去
                  proFieldProps: {
                    ...normalizeProps(child.props.proFieldProps || {}),
                    light: true,
                    label: child.props.label,
                    variant,
                  },
                  variant,
                })}
              </div>
            )
          })}
          {items.value.collapseItems.length ? (
            <div
              class={classNames(`${lightFilterClassName.value}-item`, hashId.value)}
              key="more"
            >
              <FilterDropdown
                padding={24}
                open={open.value}
                onOpenChange={changeOpen => setOpen(changeOpen)}
                placement={placement}
                popoverProps={popoverProps}
                label={renderCollapseLabelRender()}
                footerRender={footerRender}
                footer={{
                  onConfirm: () => {
                    onValuesChange?.({
                      ...moreValues.value,
                    })
                    setOpen(false)
                  },
                  onClear: () => {
                    const clearValues = {} as Record<string, any>
                    items.value.collapseItems.forEach((child: any) => {
                      const { name } = child.props
                      clearValues[name] = undefined
                    })
                    onValuesChange?.(clearValues)
                  },
                }}
              >
                {items.value.collapseItems.map((child) => {
                  const { key } = child
                  const { name, fieldProps } = normalizeProps(child.props || {}) as {
                    name: string
                    fieldProps: Record<string, any>
                  }
                  const newFieldProps = {
                    ...fieldProps,
                    onChange: (e: ChangeEvent) => {
                      setMoreValues({
                        ...moreValues.value,
                        [name]: e?.target ? e.target.value : e,
                      })
                      return false
                    },
                  } as { [key: string]: any }
                  if (Object.prototype.hasOwnProperty.call(moreValues.value, name)) {
                    newFieldProps[
                      (child.props?.valuePropName || 'value') as keyof typeof newFieldProps
                    ] = moreValues.value[name]
                  }
                  const newPlacement = fieldProps?.placement ? fieldProps?.placement : placement
                  return (
                    <div
                      class={classNames(`${lightFilterClassName.value}-line`, hashId.value)}
                      key={key!}
                    >
                      {cloneVNode(child, {
                        fieldProps: {
                          ...newFieldProps,
                          placement: newPlacement,
                        },
                      })}
                    </div>
                  )
                })}
              </FilterDropdown>
            </div>
          ) : null}
        </div>
      </div>,
    )
  }
}, {
  name: 'ProLightFilterContainer',
  inheritAttrs: false,
})

export default ProLightFilterContainer
