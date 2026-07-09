import type { RequestOptionsType, VueNode } from '@antdv-next1/pro-utils'
import type { DefaultOptionType } from '@v-c/select'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ScrollConfig } from '@v-c/virtual-list'
import type {
  SelectProps,
  SelectValue,
} from 'antdv-next'
import type { LabeledValue } from 'antdv-next/dist/select/index'
import type { SetupContext } from 'vue'
import {
  nanoid,
  useEffect,
  useState,
} from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { Select } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, isVNode, ref } from 'vue'

// 支持 key, value, label，兼容 UserSearch 中只填写了 key 的情况。
export type KeyLabel = Partial<LabeledValue> & RequestOptionsType

/** 用户扩展数据后的值类型 */
export type DataValueType<T> = KeyLabel & T

/** 可能单选，可能多选 */
export type DataValuesType<T> = DataValueType<T> | DataValueType<T>[]

export type SearchSelectProps<T = Record<string, any>> = Omit<
  SelectProps,
  'options'
  | 'searchValue'
> & {
/** 防抖动时间 默认10 单位ms */
  debounceTime?: number
  /** 自定义搜索方法, 返回搜索结果的 Promise */
  request?: (params: { query: string }) => Promise<DataValueType<T>[]>
  /** 自定义选项渲染 */
  optionItemRender?: (item: DataValueType<T>) => VueNode
  /** 指定组件中的值 */
  value?: KeyLabel | KeyLabel[]
  /** 指定默认选中的条目 */
  defaultValue?: KeyLabel | KeyLabel[]

  options?: RequestOptionsType[]

  /**
   * Placeholder 输入提示
   *
   * @default 请输入关键字搜索
   */
  placeholder?: VueNode
  /**
   * 是否在输入框聚焦时触发搜索
   *
   * @default false
   */
  searchOnFocus?: boolean
  /**
   * 选择完一个之后是否清空搜索项重新搜索
   *
   * @default false
   */
  resetAfterSelect?: boolean
  /**
   * 自定义前缀
   *
   * @ignore
   */
  prefixCls?: string

  /** 刷新数据 */
  fetchData: (keyWord?: string) => void

  /** 清空数据 */
  resetData: () => void

  /**
   * 当搜索关键词发生变化时是否请求远程数据
   *
   * @default true
   */
  fetchDataOnSearch?: boolean

  /** 默认搜索关键词 */
  defaultSearchValue?: string

  /**
   * 在选择时保留选项的原始标签文本
   * 当设置为 true 时，选中后回填的内容将使用选项的原始 label，而不是经过 optionItemRender 处理后的内容
   * @default false
   */
  preserveOriginalLabel?: boolean
}

const SearchSelect = defineComponent(
  <T extends Record<string, any>>(props: SearchSelectProps<T>, { attrs, expose }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-filed-search-select`)
    const [searchValue, setSearchValue] = useState<string | undefined>(
      (typeof props.showSearch !== 'boolean' ? props.showSearch?.searchValue : undefined) ?? props.defaultSearchValue,
    )
    const selectRef = ref<{
      focus: () => void
      blur: () => void
      scrollTo: (arg: number | ScrollConfig) => void
    } | null>(null)

    useEffect(() => {
      if (props.autoFocus) {
        selectRef.value?.focus()
      }
    }, [() => props.autoFocus])

    useEffect(() => {
      if (typeof props.showSearch !== 'boolean') {
        setSearchValue(props.showSearch?.searchValue)
      }
    }, [() => props.showSearch])

    // 获取原始 label 的辅助函数
    const getOriginalLabel = (item: DefaultOptionType, fallbackValue: any): string => {
    // 优先使用 dataItem.label（原始字符串），避免使用 value.label（可能是 optionItemRender 渲染的组件）
      if (item && typeof item.label === 'string' && item.label) {
        return item.label
      }
      if (item && item.text && typeof item.text === 'string') {
        return item.text
      }
      if (item && item.label) {
        return String(item.label)
      }
      if (item && item.text) {
        return String(item.text)
      }
      // 如果 dataItem 不存在，尝试从 value 中提取原始 label
      // 但 value.label 可能是组件，需要从组件中提取原始 label
      if (fallbackValue && fallbackValue.label) {
      // 如果是 React 元素（Highlight 组件），尝试提取其 props.label
      // 检查多种可能的 React 元素格式
        const labelValue = fallbackValue.label
        if (
          (isVNode(labelValue)
            || (labelValue
              && typeof labelValue === 'object'
              && 'props' in labelValue))
            && labelValue.props
            && labelValue.props.label
        ) {
          return String(labelValue.props.label)
        }
        // 如果是字符串，直接返回
        if (typeof labelValue === 'string') {
          return labelValue
        }
        // 最后尝试转换为字符串
        return String(labelValue)
      }
      return ''
    }
    const getMergeValue: SelectProps['onChange'] = (value, option) => {
      if (Array.isArray(value) && Array.isArray(option) && value.length > 0) {
        // 多选情况且用户有选择
        return value.map((item, index) => {
          const optionItem = (option as DefaultOptionType[])?.[index] as DefaultOptionType
          const dataItem = optionItem?.['data-item'] || {}
          const originalLabel = getOriginalLabel(dataItem, item)
          return {
            ...dataItem,
            ...(item as LabeledValue),
            label: originalLabel || item.label,
            // label: props.preserveOriginalLabel ? dataItem.label : (item as LabeledValue).label,
          }
        })
      }
      return []
    }

    const genOptions = (mapOptions: RequestOptionsType[]): DefaultOptionType[] =>
      mapOptions.map((item, index) => {
        const { class: itemClassName, optionType, ...resetItem } = item as RequestOptionsType

        // 获取 label，优先使用 labelPropsName，如果没有则使用 text（valueEnum 的情况）
        const label = item[props.fieldNames?.label || 'label'] ?? item.text
        const value = item[props.fieldNames?.value || 'value']
        const itemOptions = (item[props.fieldNames?.options || 'options'] ?? []) as Omit<RequestOptionsType, 'children' | 'optionType'>[]

        if (optionType === 'optGroup' || item.options) {
          return {
            label,
            ...resetItem,
            data_title: label,
            title: label,
            key: value ?? `${label?.toString()}-${index}-${nanoid()}`, // 防止因key相同导致虚拟滚动出问题
            children: genOptions(itemOptions),
          } as DefaultOptionType
        }

        return {
          title: label,
          ...resetItem,
          data_title: label,
          value: value ?? index,
          key: value ?? `${label?.toString()}-${index}-${nanoid()}`,
          'data-item': item,
          class: `${baseClassName.value}-option ${itemClassName || ''}`.trim(),
          label: props.optionItemRender?.(item as DataValueType<T>) || label,
        } as DefaultOptionType
      })
    expose({
      focus: () => selectRef.value?.focus(),
      blur: () => selectRef.value?.blur(),
      scrollTo: (arg: number | ScrollConfig) => selectRef.value?.scrollTo(arg),
    })
    return () => {
      const {
        request,
        autoFocus,
        debounceTime,
        optionItemRender,
        mode,
        onFocus,
        onChange,
        searchOnFocus = false,
        resetAfterSelect = false,
        fetchDataOnSearch = true,
        optionLabelProp = 'label',
        disabled,
        options,
        fetchData,
        resetData,
        prefixCls: customizePrefixCls,
        onClear,
        showSearch,
        fieldNames,
        defaultSearchValue,
        preserveOriginalLabel: _preserveOriginalLabel = false,
        ...restProps
      } = props

      return (
        <Select
          ref={selectRef}
          {...attrs}
          {...restProps}
          class={classNames(baseClassName.value, attrs.class, {
            [`${baseClassName.value}-disabled`]: disabled,
          })}
          disabled={disabled}
          mode={mode}
          showSearch={showSearch && typeof showSearch !== 'boolean' ? {
            ...showSearch,
            searchValue: searchValue.value,
            onSearch: (value) => {
              if (fetchDataOnSearch) {
                fetchData?.(value)
              }
              showSearch?.onSearch?.(value)
              setSearchValue(value)
            },
            filterOption: showSearch?.filterOption === false ? false : (inputValue, option) => {
              // 当 inputValue 为空或 searchValue 为空时，显示所有选项
              // 这样可以确保 searchOnFocus 时能够显示所有选项
              const effectiveSearchValue
                = searchValue.value === '' ? '' : inputValue || searchValue.value
              if (!effectiveSearchValue) {
                return true
              }
              if (showSearch?.filterOption && typeof showSearch.filterOption === 'function') {
                return showSearch.filterOption(effectiveSearchValue, {
                  ...option,
                  label: option?.data_title,
                })
              }
              return !!(
                option?.data_title
                  ?.toString()
                  .toLowerCase()
                  .includes(effectiveSearchValue.toLowerCase())
                  || option[(typeof showSearch !== 'boolean' && showSearch.optionFilterProp) || 'label']?.toString().toLowerCase().includes(effectiveSearchValue.toLowerCase())
                  // || option?.value?.toString().toLowerCase().includes(inputValue.toLowerCase())
              )
            },
          } : showSearch}
          optionLabelProp={optionLabelProp}
          onClear={() => {
            onClear?.()
            fetchData?.(undefined)
            if (showSearch) {
              if (typeof showSearch !== 'boolean') {
                showSearch.onSearch?.('')
              }
              setSearchValue(undefined)
            }
          }}
          onChange={(value, optionList, ...rest) => {
            // 将搜索框置空 和 antd 行为保持一致
            if (showSearch && typeof showSearch !== 'boolean' && showSearch?.autoClearSearchValue) {
              fetchData?.(undefined)
              showSearch.onSearch?.('')
              setSearchValue(undefined)
            }

            if (!props.labelInValue) {
              onChange?.(value, optionList, ...rest)
              return
            }

            if (mode !== 'multiple' && !Array.isArray(optionList)) {
              // 单选情况且用户选择了选项
              const dataItem = optionList && optionList['data-item']
              // 如果 dataItem 不存在，尝试从 options 中查找对应的原始数据
              let foundDataItem = dataItem
              if (!foundDataItem && value && options) {
                const optionValue = value[props.fieldNames?.value || 'value'] ?? value.value
                const findDataItem = (opts: RequestOptionsType[]): any => {
                  for (const opt of opts) {
                    const optValue = opt[props.fieldNames?.value || 'value'] ?? opt.value
                    if (optValue === optionValue) {
                      return opt
                    }
                    if (opt[props.fieldNames?.options || 'options'] || opt.options) {
                      const found = findDataItem(
                        opt[props.fieldNames?.options || 'options'] || opt.options || [],
                      )
                      if (found)
                        return found
                    }
                  }
                  return null
                }
                foundDataItem = findDataItem(options)
              }

              // 如果value值为空则是清空时产生的回调,直接传值就可以了
              if (!value || !foundDataItem) {
                const originalLabel = getOriginalLabel(foundDataItem, value)
                const changedValue = value
                  ? {
                      ...(value as LabeledValue),
                      // 这里有一种情况，如果用户使用了 request和labelInValue，保存之后，刷新页面，正常回显，但是再次添加会出现 label 丢失的情况。所以需要兼容
                      label: originalLabel,
                      // label: preserveOriginalLabel
                      //   ? dataItem?.label || (value as LabeledValue).label
                      //   : (value as LabeledValue).label
                    }
                  : value
                onChange?.(changedValue, optionList, ...rest)
              }
              else {
                // 确保使用 dataItem.label（原始字符串），避免使用 value.label（可能是 optionItemRender 渲染的组件）
                const originalLabel = getOriginalLabel(foundDataItem, value)
                onChange?.(
                  {
                    ...(value as LabeledValue),
                    ...foundDataItem,
                    label: originalLabel,
                    // label: preserveOriginalLabel ? dataItem.label : (value as LabeledValue).label,
                  },
                  optionList,
                  ...rest,
                )
              }
              return
            }
            // 合并值
            const mergeValue = getMergeValue(value, optionList) as SelectValue
            onChange?.(mergeValue, optionList, ...rest)

            // 将搜索结果置空，重新搜索
            if (resetAfterSelect)
              resetData?.()
          }}
          onFocus={(e) => {
            if (searchOnFocus) {
              // 当 searchOnFocus 为 true 时，应该清空搜索关键词以显示所有选项
              fetchData?.(undefined)
              // 同时清空搜索值
              if (showSearch) {
                if (typeof showSearch !== 'boolean') {
                  showSearch.onSearch?.('')
                }
                setSearchValue('')
              }
            }
            onFocus?.(e)
          }}
          options={genOptions(options || [])}
        />
      )
    }
  },
  {
    name: 'SearchSelect',
    inheritAttrs: false,
    props: ['allowClear', 'animation', 'autoClearSearchValue', 'autoFocus', 'bordered', 'builtinPlacements', 'choiceTransitionName', 'classes', 'clearIcon', 'components', 'debounceTime', 'defaultActiveFirstOption', 'defaultOpen', 'defaultSearchValue', 'direction', 'disabled', 'dropdownClassName', 'dropdownMatchSelectWidth', 'dropdownRender', 'dropdownStyle', 'fetchData', 'fetchDataOnSearch', 'fieldNames', 'filterOption', 'filterSort', 'getPopupContainer', 'id', 'labelInValue', 'labelRender', 'listHeight', 'listItemHeight', 'loading', 'maxCount', 'maxLength', 'maxTagCount', 'maxTagPlaceholder', 'maxTagTextLength', 'menuItemSelectedIcon', 'mode', 'notFoundContent', 'onActive', 'onBlur', 'onChange', 'onClear', 'onClick', 'onDeselect', 'onDropdownVisibleChange', 'onFocus', 'onInputKeydown', 'onKeydown', 'onKeyup', 'onMousedown', 'onMouseenter', 'onMouseleave', 'onOpenChange', 'onPopupScroll', 'onSearch', 'onSelect', 'onUpdate:value', 'open', 'optionFilterProp', 'optionItemRender', 'optionLabelProp', 'optionRender', 'options', 'placeholder', 'placement', 'popupAlign', 'popupClassName', 'popupMatchSelectWidth', 'popupRender', 'popupStyle', 'prefix', 'prefixCls', 'preserveOriginalLabel', 'removeIcon', 'request', 'resetAfterSelect', 'resetData', 'rootClass', 'searchOnFocus', 'showAction', 'showArrow', 'showScrollBar', 'showSearch', 'size', 'status', 'styles', 'suffix', 'suffixIcon', 'tabIndex', 'tagRender', 'title', 'tokenSeparators', 'transitionName', 'value', 'variant', 'virtual'],
  },
)

export default SearchSelect
