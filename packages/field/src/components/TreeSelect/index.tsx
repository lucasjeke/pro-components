import type { ProSchemaValueEnumObj, RequestOptionsType } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { TreeSelectProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { ProFieldFC } from '../../typing'
import type { FieldSelectProps } from '../Select'
import { useIntl } from '@antdv-next1/pro-provider'
import {
  FieldLabel,
  objectToMap,
  proFieldParsingText,
  useMemo,
  useState,
} from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { classNames, omit, useMergedState } from '@v-c/util'
import { Spin, TreeSelect } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { useFieldFetchData } from '../Select'

export type FieldTreeSelectProps = ProFieldFC<{
  /**
   * 当搜索关键词发生变化时是否请求远程数据
   *
   * @default true
   */
  fetchDataOnSearch?: boolean
}, TreeSelectProps & { style?: CSSProperties, class?: string, options?: RequestOptionsType[] }> & TreeSelectProps & Omit<FieldSelectProps, 'variant' | 'fieldProps' | 'id' | 'label' | 'labelTrigger' | 'lightLabel' | 'light' | 'plain'>

const FieldTreeSelect = defineComponent<FieldTreeSelectProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { expose, attrs }) => {
  const config = useConfig()
  const layoutClassName = computed(() => config.value.getPrefixCls('pro-field-tree-select'))
  const treeSelectRef = shallowRef(null)
  const [open, setOpen] = useState(false)
  const intl = useIntl()
  const [loading, options, fetchData] = useFieldFetchData({
    ...omit(props, ['variant']),
    defaultKeyWords: props.fieldProps?.showSearch !== undefined ? typeof props.fieldProps?.showSearch !== 'boolean' ? props.fieldProps.showSearch.searchValue : undefined : undefined,
  })

  const [searchValue, setSearchValue] = useMergedState<string | undefined>(undefined, {
    onChange: value => props.fieldProps?.onSearch?.(value!),
    value: computed(() => props.fieldProps?.showSearch !== undefined ? typeof props.fieldProps?.showSearch !== 'boolean' ? props.fieldProps.showSearch.searchValue : undefined : undefined),
  })

  const optionsValueEnum = useMemo(() => {
    if (props.mode !== 'read')
      return
      /**
       * Support TreeSelect fieldNames
       * @see https://ant.design/components/tree-select-cn
       */
    const {
      value: valuePropsName = 'value',
      label: labelPropsName = 'label',
      children: childrenPropsName = 'children',
    } = props.fieldProps?.fieldNames || {}

    const valueEnumObj = {} as ProSchemaValueEnumObj

    const traverseOptions = (_options: typeof options.value) => {
      if (!_options?.length) {
        return valueEnumObj
      }

      const length = _options.length
      let i = 0
      while (i < length) {
        const cur = _options[i++]
        valueEnumObj[cur![valuePropsName]] = {
          text: cur!.text || cur![labelPropsName],
          status: cur!.status,
          color: cur!.color,
          disabled: cur!.disabled,
        }
        traverseOptions(cur![childrenPropsName])
      }
      return valueEnumObj
    }

    return traverseOptions(options.value)
  }, [() => props.fieldProps?.fieldNames, () => props.mode, options])

  const onChange: TreeSelectProps['onChange'] = (value, optionList, extra) => {
    // 将搜索框置空 和 antdv 行为保持一致
    if (props.fieldProps?.showSearch && typeof props.fieldProps.showSearch !== 'boolean' && props.fieldProps.showSearch.autoClearSearchValue) {
      fetchData(undefined)
      setSearchValue(undefined)
    }
    props.fieldProps?.onChange?.(value, optionList, extra)
  }

  expose({
    fetchData: (keyWord: string) => fetchData(keyWord),
  })
  return () => {
    const { mode, text, render, fetchDataOnSearch, request, params, variant, onClear: propsOnClear, showSearch: propsShowSearch, placeholder: propsPlaceholder, onBlur: propsOnBlur, formItemRender, ...rest } = props

    if (mode === 'read') {
      const dom = (
        <>
          {proFieldParsingText(
            text! as string[],
            objectToMap(rest.valueEnum || optionsValueEnum.value),
          )}
        </>
      )
      if (render) {
        return (
          <>
            { render(
              text,
              { mode, ...rest, treeData: options.value },
              dom,
            ) ?? null}
          </>
        )
      }
      return dom
    }
    if (mode === 'edit') {
      const showSearch = rest.fieldProps?.showSearch || propsShowSearch
      const onClear = rest.fieldProps?.onClear || propsOnClear
      const onBlur = rest.fieldProps?.onBlur || propsOnBlur
      const valuesLength = Array.isArray(rest.fieldProps?.value) ? rest.fieldProps.value.length : 0
      const placeholder = rest.fieldProps?.placeholder || propsPlaceholder || intl.value.getMessage({
        id: 'tableForm.selectPlaceholder',
        defaultMessage: '请选择',
      })
      let dom = (
        <Spin spinning={loading.value}>
          <TreeSelect
            {...attrs}
            open={open.value}
            onOpenChange={(isOpen) => {
              rest.fieldProps?.onOpenChange?.(isOpen)
              setOpen(isOpen)
            }}
            ref={treeSelectRef}
            popupMatchSelectWidth={!rest.light}
            placeholder={placeholder}
            tagRender={
              rest.light
                ? (item) => {
                    if (valuesLength < 2)
                      return <>{item.label}</>
                    const itemIndex
                      = rest.fieldProps?.value?.findIndex(
                        (v: any) => v === item.value || v.value === item.value,
                      )
                    return (
                      <>
                        {item.label}
                        {' '}
                        {itemIndex < valuesLength - 1 ? ',' : ''}
                      </>
                    )
                  }
                : undefined
            }
            {...omit(rest.fieldProps!, ['options', 'onBlur', 'onChange'])}
            treeData={options.value as TreeSelectProps['treeData']}
            showSearch={showSearch && typeof showSearch !== 'boolean' ? {
              ...showSearch,
              searchValue: searchValue.value,
              onSearch: (value) => {
                // fix 不支持请求的情况下不刷新options
                if (fetchDataOnSearch && request) {
                  fetchData(value)
                }
                setSearchValue(value)
              },
            } : showSearch}
            style={{
              minWidth: unit(60),
              ...rest.fieldProps?.style,
            }}
            allowClear={rest.fieldProps?.allowClear !== false}
            onClear={() => {
              onClear?.()
              fetchData(undefined)
              if (showSearch) {
                setSearchValue(undefined)
              }
            }}
            onChange={onChange}
            onBlur={(event) => {
              setSearchValue(undefined)
              fetchData(undefined)
              onBlur?.(event)
            }}
            class={classNames(
              rest.fieldProps?.class,
              layoutClassName.value,
            )}
          />
        </Spin>
      )

      if (formItemRender) {
        dom
          = (
            <>
              { formItemRender(
                text,
                {
                  mode,
                  ...rest,
                  options: options.value,
                  loading: loading.value,
                },
                dom,
              ) ?? null}
            </>
          )
      }

      if (rest.light) {
        const notEmpty = !!rest.fieldProps?.value && rest.fieldProps.value?.length !== 0
        return (
          <FieldLabel
            label={rest.label}
            disabled={rest.fieldProps?.disabled}
            placeholder={placeholder}
            onClick={() => {
              setOpen(true)
              rest.fieldProps?.onOpenChange?.(true)
            }}
            variant={variant}
            value={notEmpty || open.value ? dom : null}
            style={
              notEmpty
                ? {
                    paddingInlineEnd: 0,
                  }
                : undefined
            }
            allowClear={false}
            downIcon={false}
          />
        )
      }
      return dom
    }
    return null
  }
}, {
  name: 'FieldTreeSelect',
  inheritAttrs: false,
})

export default FieldTreeSelect
