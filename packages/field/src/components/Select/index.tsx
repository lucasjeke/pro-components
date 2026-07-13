import type { ProSchemaValueEnumType } from '@antdv-next1/pro-provider'
import type {
  Key,
  ProFieldRequestData,
  ProFieldValueEnumType,
  ProSchemaValueEnumObj,
  RequestOptionsType,
  VueNode,
} from '@antdv-next1/pro-utils'
import type { DefaultOptionType } from '@v-c/select'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ScrollConfig } from '@v-c/virtual-list'
import type { SelectProps } from 'antdv-next'
import type { CSSProperties, Ref } from 'vue'
import type { ProFieldFC, ProFieldLightProps } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import {
  nanoid,
  objectToMap,
  proFieldParsingText,
  stringify,
  useDebounceValue,
  useEffect,
  useMemo,
  useMountMergeState,
  useRefFunction,
  useState,
} from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { Spin, useConfig } from 'antdv-next'
import useSWRV from 'swrv'
import { computed, defineComponent, ref, shallowRef } from 'vue'
import Highlight from './Highlight'
import LightSelect from './LightSelect'
import SearchSelect from './SearchSelect'

type SelectOptionType = Partial<RequestOptionsType>[]
export type FieldSelectProps = {
  text?: VueNode
  /** 值的枚举，如果存在枚举，Search 中会生成 select */
  valueEnum?: ProFieldValueEnumType
  /** 防抖动时间 默认10 单位ms */
  debounceTime?: number
  /** 从服务器读取选项 */
  request?: ProFieldRequestData
  /** 重新触发的时机 */
  params?: any

  /** 组件的全局设置 */
  fieldProps?: SelectProps & { style?: CSSProperties }

  variant?: 'outlined' | 'filled' | 'borderless'
  id?: string
  /** 默认搜素条件 */
  defaultKeyWords?: string
} & ProFieldLightProps
/**
 * 递归筛选 item
 */
function filerByItem(
  item: {
    label: string
    value: string
    optionType: string
    children: any[]
    options: any[]
  },
  keyWords?: string,
) {
  if (!keyWords)
    return true
  if (
    item?.label?.toString().toLowerCase().includes(keyWords.toLowerCase())
    || item?.value?.toString().toLowerCase().includes(keyWords.toLowerCase())
  ) {
    return true
  }
  if (item.children || item.options) {
    const findItem = [...(item.children || []), item.options || []].find((mapItem) => {
      return filerByItem(mapItem, keyWords)
    })
    if (findItem)
      return true
  }
  return false
}

/**
 * 把 value 的枚举转化为数组
 *
 * @param valueEnumParams
 */
export function proFieldParsingValueEnumToArray(valueEnumParams: ProFieldValueEnumType): SelectOptionType {
  const enumArray: Partial<
    RequestOptionsType & ProSchemaValueEnumType
  >[] = []
  const valueEnum = objectToMap(valueEnumParams)

  valueEnum.forEach((_, key) => {
    const value = (valueEnum.get(key) || valueEnum.get(`${key}`)) as ProSchemaValueEnumType

    if (!value) {
      return
    }

    if (typeof value === 'object' && value?.text) {
      enumArray.push({
        text: value.text,
        value: key,
        label: value?.text,
        disabled: value.disabled,
      })
      return
    }
    enumArray.push({
      text: value,
      value: key,
    })
  })
  return enumArray
}

export function useFieldFetchData(props:
  Omit<FieldSelectProps, 'fieldProps'> & {
    proFieldKey?: Key
    defaultKeyWords?: string
    fieldProps?: any
    options?: any
    treeData?: any
  }): [Ref<boolean>, Ref<SelectOptionType | undefined>, (keyWord?: string) => void, () => void] {
  const { request, debounceTime, defaultKeyWords, valueEnum, fieldProps, proFieldKey } = props
  const [keyWords, setKeyWords] = useState<string | undefined>(defaultKeyWords)
  /** Key 是用来缓存请求的，如果不在是有问题 */
  const [cacheKey] = useState(() => {
    if (proFieldKey) {
      return proFieldKey.toString()
    }
    if (request) {
      return nanoid()
    }
    return 'no-fetch'
  })
  //
  const proFieldKeyRef = ref(cacheKey.value)

  const getOptionsFormValueEnum = useRefFunction((coverValueEnum: ProFieldValueEnumType) =>
    proFieldParsingValueEnumToArray(objectToMap(coverValueEnum)).map(
      ({ value, text, ...rest }) => ({
        label: text,
        value,
        key: value,
        ...rest,
      }),
    ),
  )

  const defaultOptions = computed(() => {
    if (!fieldProps)
      return undefined

    const data = props.options || props.treeData || fieldProps?.options || fieldProps?.treeData
    if (!data)
      return undefined
    const { children, label, value } = (fieldProps?.fieldNames || {})

    const traverseFieldKey = (_options?: SelectOptionType, type?: 'children' | 'label' | 'value') => {
      if (!_options?.length)
        return
      const length = _options.length
      let i = 0
      while (i < length) {
        const cur = _options[i++]!
        if (cur[children as keyof typeof cur] || cur[label as keyof typeof cur] || cur[value as keyof typeof cur]) {
          cur[type!] = cur[type === 'children' ? children! : type === 'label' ? label! : value!]
          traverseFieldKey(cur[children!], type)
        }
      }
    }
    if (children)
      traverseFieldKey(data, 'children')
    if (label)
      traverseFieldKey(data, 'label')
    if (value)
      traverseFieldKey(data, 'value')
    return data
  })

  const [options, setOptions] = useMountMergeState<SelectOptionType | undefined>(
    () => {
      if (valueEnum) {
        return getOptionsFormValueEnum(valueEnum)
      }
      return []
    },
    {
      value: defaultOptions,
    },
  )

  useEffect(() => {
    // 优先使用 fieldProps?.options
    if (
      !valueEnum
      || fieldProps?.options
      || fieldProps?.treeData
    ) {
      return
    }
    setOptions(getOptionsFormValueEnum(valueEnum))
  }, [() => valueEnum])

  const swrKey = useDebounceValue(
    [proFieldKeyRef.value, stringify(props.params), keyWords.value] as const,
    debounceTime ?? fieldProps?.debounceTime ?? 0,
    [() => props.params, keyWords, proFieldKeyRef],
  )
  const {
    data,
    mutate: setLocaleData,
    isValidating,
  } = useSWRV(
    () => {
      if (!request) {
        return null
      }
      return swrKey.value.join('-')
    },
    () => request?.(
      {
        ...props.params,
        keyWords: keyWords.value,
      },
      props,
    ),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  )
  const resOptions = useMemo(() => {
    const opt = options.value?.map((item) => {
      if (typeof item === 'string') {
        return {
          label: item,
          value: item,
        }
      }
      if (item.children || item.options) {
        const childrenOptions = [...(item.children || []), ...(item.options || [])].filter(
          (mapItem) => {
            return filerByItem(mapItem, keyWords.value)
          },
        )
        return {
          ...item,
          children: childrenOptions,
          options: childrenOptions,
        }
      }
      return item
    })
    // filterOption 为 true 时 filter数据, filterOption 默认为true
    if (
      props.fieldProps?.filterOption === true
      || props.fieldProps?.filterOption === undefined
    ) {
      return opt?.filter((item) => {
        if (!item)
          return false
        if (!keyWords.value)
          return true
        return filerByItem(item as any, keyWords.value)
      })
    }

    return opt
  }, [options, keyWords, () => fieldProps?.filterOption])
  return [isValidating, request ? data : resOptions, (fetchKeyWords?: string) => setKeyWords(fetchKeyWords), async () => {
    setKeyWords(undefined)
    await setLocaleData(() => [], {
      shouldRetryOnError: false,
    })
  }]
}
const FieldSelect = defineComponent<FieldSelectProps & ProFieldFC<Pick<SelectProps, 'fieldNames'>, SelectProps>, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { attrs, expose }) => {
    const { componentSize } = useConfig()
    const selectRef = shallowRef<{
      focus: () => void
      blur: () => void
      scrollTo: (arg: number | ScrollConfig) => void
    } | null>(null)
    const intl = useIntl()
    const keyWordsRef = shallowRef<string>('')
    useEffect(() => {
      if (props.fieldProps?.showSearch && typeof props.fieldProps?.showSearch !== 'boolean') {
        keyWordsRef.value = props.fieldProps?.showSearch.searchValue!
      }
    }, [() => props.fieldProps?.showSearch])

    const [loading, options, fetchData, resetData] = useFieldFetchData(props)
    const optionsValueEnum = useMemo(() => {
      if (props.mode !== 'read')
        return
      const {
        label: labelPropsName = 'label',
        value: valuePropsName = 'value',
        options: optionsPropsName = 'options',
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
          traverseOptions(cur![optionsPropsName])
        }
        return valueEnumObj
      }
      return traverseOptions(options.value)
    }, [() => props.fieldProps?.fieldNames, () => props.mode, options])

    expose({
      focus: () => selectRef.value?.focus(),
      blur: () => selectRef.value?.blur(),
      scrollTo: (arg: number | ScrollConfig) => selectRef.value?.scrollTo(arg),
      fetchData: (keyWord: string) => fetchData(keyWord),
    })
    return () => {
      const {
        mode,
        render,
        formItemRender,
        request,
        params,
        variant,
        id,
        fieldNames,
        defaultKeyWords,
        debounceTime,
        lightLabel,
        labelTrigger,
        light,
        ...rest
      } = props
      if (mode === 'read') {
        const dom = (
          <>
            {proFieldParsingText(
              rest.text! as string,
              objectToMap(rest.valueEnum || optionsValueEnum.value),
            )}
          </>
        )

        if (render) {
          return <>{ render(dom, { mode, ...rest, light }, dom) ?? null}</>
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = light ? (
          <LightSelect
            labelVariant={variant}
            id={id}
            loading={loading.value}
            allowClear
            size={componentSize?.value || 'middle'}
            label={rest.label}
            placeholder={intl.value.getMessage({
              id: 'tableForm.selectPlaceholder',
              defaultMessage: '请选择',
            })}
            searchPlaceholder={intl.value.getMessage({
              id: 'tableForm.inputPlaceholder',
              defaultMessage: '请输入',
            })}
            lightLabel={lightLabel}
            labelTrigger={labelTrigger}
            fetchData={fetchData}
            {...rest.fieldProps}
            options={options.value as DefaultOptionType[]}
          />
        ) : (
          <SearchSelect
            {...attrs}
            key="SearchSelect"
            style={rest.fieldProps?.style || {
              minWidth: unit(100),
              ...(attrs.style as CSSProperties),
            }}
            id={id}
            loading={loading.value}
            ref={selectRef}
            allowClear
            defaultSearchValue={props.defaultKeyWords}
            notFoundContent={loading.value ? <Spin size="small" /> : rest.fieldProps?.notFoundContent}
            fetchData={(keyWord) => {
              keyWordsRef.value = keyWord ?? ''
              fetchData(keyWord)
            }}
            resetData={resetData}
            preserveOriginalLabel
            optionItemRender={(item) => {
              if (typeof item.label === 'string' && keyWordsRef.value) {
                return <Highlight label={item.label} words={[keyWordsRef.value]} />
              }
              return item.label
            }}
            placeholder={intl.value.getMessage({
              id: 'tableForm.selectPlaceholder',
              defaultMessage: '请选择',
            })}
            {...rest.fieldProps}
            options={options.value}
          />
        )
        if (formItemRender) {
          return (
            <>
              { formItemRender(
                rest.text,
                { mode, ...rest, options: options.value, loading: loading.value },
                dom,
              )}
            </>
          )
        }
        return dom
      }
      return null
    }
  },
  {
    name: 'FieldSelect',
    inheritAttrs: false,
    // props: ['class', 'text', 'style', 'variant', 'id', 'formItemRender', 'render', 'request', 'fieldProps', 'mode', 'labelTrigger', 'lightLabel', 'proFieldKey', 'light', 'plain', 'valueEnum', 'label', 'params', 'debounceTime', 'defaultKeyWords'],
  },
)

export default FieldSelect
