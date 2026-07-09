import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SelectProps } from 'antdv-next'
import type { VNode } from 'vue'
import type { ProFieldLightProps } from '../../../typing'
import {
  FieldLabel,
  useMemo,
  useState,
} from '@antdv-next1/pro-utils'
import { SearchOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { toArray } from '@v-c/util/dist/Children/toArray'
import { Input, Select } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent } from 'vue'
import useStyle from './style'

export type LightSelectProps = {
  label?: VueNode
  valueMaxLength?: number
  /** 刷新数据 */
  fetchData: (keyWord?: string) => void
  /**
   * 当搜索关键词发生变化时是否请求远程数据
   *
   * @default true
   */
  fetchDataOnSearch?: boolean
  /** 变体类型 */
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
  /**
   * 搜索展位符
   */
  searchPlaceholder?: string

  labelVariant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
} & ProFieldLightProps & SelectProps
/**
 * 如果有 label 就优先使用 label
 *
 * @param valueMap
 * @param v
 */
function getValueOrLabel(valueMap: Record<string, string>, v:
  | {
    label: string
    value: string
  }
  | string
  | number) {
  if (typeof v !== 'object') {
    return valueMap[v] || v
  }
  return valueMap[v?.value] || v.label
}
const LightSelect = defineComponent<LightSelectProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { attrs }) => {
    const config = useConfig()
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-field-select-light-select`)
    const [open, setOpen] = useState<boolean>(props.open || false)
    const [keyword, setKeyword] = useState<string>('')
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const fieldNames = computed(() => ({
      label: props.fieldNames?.label || 'label',
      value: props.fieldNames?.value || 'value',
    }))
    const valueMap = useMemo(() => {
      const values = {} as Record<string, any>
      props.options?.forEach((item) => {
        const optionLabel = item[props.optionLabelProp || ''] || item[fieldNames.value.label]
        const optionValue = item[fieldNames.value.value]
        values[optionValue!] = optionLabel || optionValue
      })
      return values
    }, [
      () => fieldNames.value.label,
      () => props.options,
      () => fieldNames.value.value,
      () => props.optionLabelProp,
    ])

    const filterValue = computed(() =>
      Array.isArray(props.value)
        ? props.value.map(v => getValueOrLabel(valueMap.value, v as string))
        : getValueOrLabel(valueMap.value, props.value as string),
    )
    return () => {
      const {
        label,
        prefixCls: customizePrefixCls,
        onChange,
        value,
        mode,
        defaultValue,
        labelVariant,
        size,
        showSearch,
        'onUpdate:value': onUpdateValue,
        disabled,
        options,
        allowClear,
        labelInValue,
        fieldNames = {},
        lightLabel,
        labelTrigger,
        optionLabelProp = '',
        valueMaxLength = 41,
        fetchDataOnSearch = false,
        fetchData,
        variant = 'outlined',
        searchPlaceholder,
        ...restProps
      } = props
      const { placeholder = label } = props
      return (
        <div
          class={classNames(
            baseClassName.value,
            attrs.class,
            hashId.value,
            cssVarCls.value,
            {
              [`${baseClassName.value}-searchable`]: showSearch,
            },
            `${baseClassName.value}-container-${restProps.placement || 'bottomLeft'}`,
          )}
          onClick={(e) => {
            if (disabled)
              return
            // 点击label切换下拉菜单
            const isLabelClick = lightLabel?.value?.labelRef.value?.contains(
              e.target as HTMLElement,
            )
            if (!isLabelClick) {
              setOpen(true)
            }
          }}
        >
          <Select
            {...restProps}
            allowClear={allowClear}
            value={value}
            mode={mode}
            labelInValue={labelInValue}
            size={size}
            disabled={disabled}
            variant={variant}
            onUpdate:value={onUpdateValue}
            onChange={(v, option) => {
              onChange?.(v, option)
              if (mode !== 'multiple') {
                setOpen(false)
              }
            }}
            showSearch={showSearch && typeof showSearch !== 'boolean' ? {
              ...showSearch,
              onSearch: (keyValue) => {
                if (fetchDataOnSearch && fetchData) {
                  fetchData(keyValue)
                  showSearch?.onSearch?.(keyValue)
                }
              },
            } : showSearch}
            popupRender={(menuNode: VNode) => (
              <>
                {showSearch && (
                  <div style={{ margin: '4px 8px' }}>
                    <Input
                      value={keyword.value}
                      allowClear={!!allowClear}
                      onChange={(e) => {
                        setKeyword(e.target.value!)
                        if (fetchDataOnSearch && fetchData) {
                          fetchData(e.target.value)
                        }
                        showSearch && typeof showSearch !== 'boolean' && showSearch.onSearch?.(e.target.value!)
                      }}
                      placeholder={searchPlaceholder}
                      onKeydown={(e) => {
                        // 避免按下删除键把选项也删除了
                        if (e.key === 'Backspace') {
                          e.stopPropagation()
                          return
                        }
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault()
                        }
                      }}
                      style={{ width: '100%' }}
                      prefix={<SearchOutlined />}
                    />
                  </div>
                )}
                {menuNode}
              </>
            )}
            open={open.value}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                //  测试环境下直接跑
                setKeyword('')
              }
              if (!labelTrigger) {
                setOpen(isOpen)
              }
              restProps?.onDropdownVisibleChange?.(isOpen)
            }}
            prefixCls={customizePrefixCls}
            options={
              (typeof showSearch !== 'boolean' && showSearch?.onSearch) || !keyword.value
                ? options
                : options?.filter((o) => {
                    if (typeof showSearch !== 'boolean' && showSearch?.optionFilterProp) {
                      return toArray(o[showSearch.optionFilterProp]).join('').toLowerCase().includes(keyword.value)
                    }
                    return (
                      String(o[fieldNames.label || 'label'])
                        .toLowerCase()
                        ?.includes(keyword.value?.toLowerCase())
                        || o[fieldNames.value || 'value']
                          .toString()
                          ?.toLowerCase()
                          ?.includes(keyword.value?.toLowerCase())
                    )
                  })
            }
          />
          <FieldLabel
            ellipsis
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            variant={labelVariant}
            allowClear={!!allowClear}
            value={filterValue.value || value?.label || value}
            onClear={() => {
              onChange?.(undefined, undefined)
              onUpdateValue?.(undefined)
            }}
            onClick={() => {
              if (disabled)
                return
              setOpen(!open.value)
            }}
            ref={lightLabel}
            valueMaxLength={valueMaxLength}
          />
        </div>
      )
    }
  },
  {
    name: 'LightSelect',
    inheritAttrs: false,
  },
)

export default LightSelect
