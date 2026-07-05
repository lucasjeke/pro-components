import type { ProFieldValueType, SearchTransformKeyFn } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { FormInstance, FormProps } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { SetupContext, VNode } from 'vue'

import type { BaseFormProps, ProFormRef } from './BaseForm'
import type { SubmitterProps } from './Submitter'
import {
  autoFocusToFirstChild,
  conversionMomentValue,
  nanoid,
  omitUndefined,
  runFunction,
  transformKeySubmitValue,
  useEffect,
  useFetchData,
  useMountMergeState,
  useProFormContextProvider,
  useState,
} from '@antdv-next1/pro-utils'
import { classNames, get, set as namePathSet, set } from '@v-c/util'
import { Form, Spin } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, nextTick, reactive, shallowRef, toRef } from 'vue'
import { useFormListContextProvider } from '../components'
import { useFieldContextProvider } from '../FieldContext'
import { useGridContextProvider, useGridHelpers } from '../helpers'
import { useProFormInstanceExpose, useUrlSearchParams } from '../utils'
import { useEditOrReadOnlyContextProvider } from './EditOrReadOnlyContext'
import { useStyle } from './style'
import Submitter from './Submitter'

export function genParams<T extends Record<string, any>, U extends Record<string, any>>(
  syncUrl: BaseFormProps<T, U>['syncToUrl'],
  params: Record<string, any>,
  type: 'get' | 'set',
) {
  if (syncUrl === true) {
    return params
  }
  return runFunction(syncUrl, params, type)
}
/**
 * It takes a name path and converts it to an array.
 * @param {NamePath} name - The name of the form.
 * @returns string[]
 *
 * a-> [a]
 * [a] -> [a]
 */
function covertFormName(name?: NamePath<string | number | boolean>) {
  if (!name)
    return name
  if (Array.isArray(name))
    return name
  return [name]
}
/** 自动的formKey 防止重复 */
let requestFormCacheId = 0
const BaseFormComponents = defineComponent(
  <T extends Record<string, any>, U extends Record<string, any>>(
    props: BaseFormProps<T, U>,
    {
      expose,
      attrs,
      slots,
    }: SetupContext<
      {},
      CustomSlotsType<{
        default?: () => VueNode[]
      }>
    >,
  ) => {
    const config = useConfig()
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-form`)
    const curFormKey = shallowRef<string>(nanoid())
    const modelValue = reactive(props.model || {})
    const formRef = shallowRef<FormInstance & { /** 聚焦方法 */
      focus?: () => void
    } | null>(null)
    const { wrapSSR, hashId } = useStyle(baseClassName)

    /** 保存 transformKeyRef，用于对表单key transform */
    const transformKeyRef = shallowRef<Record<string, SearchTransformKeyFn | undefined>>({})
    const fieldsValueType = shallowRef<
      Record<
        string,
        {
          valueType: ProFieldValueType
          dateFormat: string
        }
      >
    >({})
    const [urlSearch, setUrlSearch] = useUrlSearchParams({}, { disabled: !props.syncToUrl })

    const getPopupContainer = computed(() => {
      if (typeof window === 'undefined')
        return undefined
      // 如果在 drawerForm 和  modalForm 里就渲染dom到父节点里
      // modalForm 可能高度太小不适合
      if (props.formComponentType && ['DrawerForm'].includes(props.formComponentType)) {
        return (e: HTMLElement) => e.parentNode || document.body
      }
      return undefined
    })
    const transformKey = (values: T, paramsOmitNil: boolean, parentKey?: NamePath) => {
      if (!values || typeof values !== 'object') {
        return values
      }
      return transformKeySubmitValue(
        conversionMomentValue(
          values,
          props.dateFormatter || 'string',
          fieldsValueType,
          paramsOmitNil,
          parentKey,
        ),
        transformKeyRef.value,
      )
    }
    const formatValues = {
      /**
       * 获取被 ProForm 格式化后的所有数据
       * @param allData boolean
       * @param omitNilParam boolean
       * @returns T
       *
       * @example  getFieldsFormatValue(true) ->返回所有数据，即使没有被 form 托管的
       */
      getFieldsFormatValue: (allData?: true, omitNilParam?: boolean) => {
        const { omitNil = true } = props
        if (!formRef.value) {
          return {} as T
        }
        const values = formRef.value.getFieldsValue(allData!)
        return transformKey(values as T, omitNilParam !== undefined ? omitNilParam : omitNil)
      },
      /**
       * 获取被 ProForm 格式化后的单个数据
       * @param nameList (string|number)[]
       * @param omitNilParam boolean
       * @returns T
       *
       * @example {a:{b:value}} -> getFieldFormatValue(['a', 'b']) -> value
       */
      /** 获取格式化之后的单个数据 */
      getFieldFormatValue: (
        paramsNameList: NamePath<string | number | boolean> = [],
        omitNilParam?: boolean,
      ) => {
        const { omitNil = true } = props
        if (!formRef.value) {
          return undefined
        }
        const nameList = covertFormName(paramsNameList)
        if (!nameList)
          throw new Error('nameList is require')
        const value = formRef.value.getFieldValue(nameList) as T
        const obj = nameList ? set({} as T, nameList as string[], value) : value
        // transformKey会将keys重新和nameList拼接，所以这里要将nameList的首个元素弹出
        if (Array.isArray(nameList)) {
          const newNameList = [...nameList]
          newNameList.shift()
          const transformed = transformKey(
            obj,
            omitNilParam !== undefined ? omitNilParam : omitNil,
            newNameList,
          )
          const result = get(transformed, nameList as Array<string | number>)
          // 如果结果是对象，返回对象的值
          if (result && typeof result === 'object' && !Array.isArray(result)) {
            const objValue = Object.values(result)[0] as T
            // 如果对象的值是数组，返回数组
            if (Array.isArray(objValue)) {
              return objValue
            }
            return objValue as T
          }
          return result as T
        }
      },
      /**
       * 获取被 ProForm 格式化后的单个数据, 包含他的 name
       * @param nameList (string|number)[]
       * @param omitNilParam boolean
       * @returns T
       *
       * @example  {a:{b:value}} -> getFieldFormatValueObject(['a', 'b']) -> {a:{b:value}}
       */
      /** 获取格式化之后的单个数据 */
      getFieldFormatValueObject: (
        paramsNameList?: NamePath<string | number | boolean>,
        omitNilParam?: boolean,
      ) => {
        const { omitNil = true } = props
        if (!formRef.value) {
          return {} as T
        }
        const nameList = covertFormName(paramsNameList)
        const value = formRef.value?.getFieldValue(nameList!)
        const obj = nameList ? set({}, nameList as (string | number)[], value) : value
        return transformKey(obj, omitNilParam !== undefined ? omitNilParam : omitNil, nameList)
      },
      /**
       * 验字段后返回格式化之后的所有数据
       * @param nameList (string|number)[]
       * @param omitNilParam boolean
       * @returns T
       *
       * @example validateFieldsReturnFormatValue -> {a:{b:value}}
       */
      validateFieldsReturnFormatValue: async (
        nameList?: NamePath<string | number | boolean>[],
        omitNilParam?: boolean,
      ) => {
        const { omitNil = true } = props
        if (!formRef.value) {
          return {} as T
        }
        if (!Array.isArray(nameList) && nameList)
          throw new Error('nameList must be array')

        const values = await formRef.value?.validateFields(nameList)
        const transformedKey = transformKey(
          values as T,
          omitNilParam !== undefined ? omitNilParam : omitNil,
        )
        return transformedKey || ({} as T)
      },
    }

    // 如果为 false，不需要触发设置进去
    const [urlParamsMergeModel, setUrlParamsMergeModel] = useState(() => {
      if (!props.syncToUrl) {
        return {}
      }
      return genParams(props.syncToUrl, urlSearch.value, 'get')
    })
    const getGenParams = () => ({
      ...urlSearch.value,
      ...(props.extraUrlParams || {}),
    })

    useEffect(() => {
      if (props.syncToModel)
        return
      setUrlParamsMergeModel({})
    }, [() => props.syncToModel])

    useEffect(() => {
      if (!props.syncToUrl)
        return
      setUrlSearch(genParams(props.syncToUrl, getGenParams(), 'set'))
    }, [() => props.extraUrlParams, () => props.syncToUrl])

    useEffect(() => {
      requestFormCacheId += 0
    }, [])
    const [loading, setLoading] = useMountMergeState<boolean>(false, {
      onChange: props.onLoadingChange,
      value: toRef(() => props.loading!),
    })
    const [initialData, initialDataLoading] = useFetchData<T, U>({
      request: props.request,
      params: computed(() => props.params),
      proFieldKey: computed(() => props.formKey || requestFormCacheId),
    })
    useEffect(() => {
      if (initialData?.value) {
        Object.keys(initialData.value).forEach((key) => {
          modelValue[key] = initialData.value![key]
        })
      }
    }, [initialData])

    const handleFinish: FormProps['onFinish'] = async () => {
      // 没设置 onFinish 就不执行
      if (!props.onFinish)
        return
      // 防止重复提交
      if (loading.value)
        return
      try {
        setLoading(true)
        const finalValues = (formatValues.getFieldsFormatValue?.() || {}) as T
        const response = props.onFinish(finalValues)
        if (response instanceof Promise) {
          setLoading(true)
        }
        if (response && typeof response === 'object' && typeof response.then === 'function') {
          try {
            await response
          }
          catch (error) {
            // 确保在 Promise 被拒绝时也重置 loading 状态
            setLoading(false)
            throw error
          }
          // 只有在 Promise 成功完成时才重置 loading 状态
          setLoading(false)
        }
        else {
          setLoading(false)
        }
        if (props.syncToUrl) {
          // 把没有的值设置为未定义可以删掉 url 的参数
          const syncToUrlParams = Object.keys(
            formatValues.getFieldsFormatValue?.(true, false) || {},
          ).reduce((pre, next) => {
            return {
              ...pre,
              [next]: finalValues[next] ?? undefined,
            }
          }, props.extraUrlParams || {})
          // fix #3547: 当原先在url中存在的字段被删除时，应该将 params 中的该字段设置为 undefined,以便触发url同步删除
          Object.keys(urlSearch.value).forEach((key) => {
            if (
              syncToUrlParams[key] !== false
              && syncToUrlParams[key] !== 0
              && !syncToUrlParams[key]
            ) {
              syncToUrlParams[key] = undefined
            }
          })
          // /** 在同步到 url 上时对参数进行转化 */
          setUrlSearch(genParams(props.syncToUrl, syncToUrlParams, 'set'))
        }
      }
      catch (error) {
        setLoading(false)
      }
    }

    useFieldContextProvider({
      formRef,
      fieldProps: props.fieldProps,
      proFieldProps: props.proFieldProps,
      formItemProps: props.formItemProps,
      groupProps: props.groupProps,
      formComponentType: props.formComponentType,
      getPopupContainer,
      formKey: curFormKey,
      modelValue,
      setModelValue: (_modelValue) => {
        Object.keys(_modelValue).forEach((key) => {
          modelValue[key] = _modelValue![key]
        })
      },
      setFieldValueType: (name, { valueType = 'text', dateFormat, transform }) => {
        if (!Array.isArray(name))
          return
        // Store transform function in the correct nested structure
        if (transform) {
          transformKeyRef.value = namePathSet(transformKeyRef.value, name, transform)
        }
        fieldsValueType.value = namePathSet(fieldsValueType.value, name, {
          valueType,
          dateFormat,
        })
      },
    })
    useEditOrReadOnlyContextProvider({
      mode: computed(() => (props.readonly ? 'read' : 'edit')),
    })
    useFormListContextProvider({})

    const proFormInstance = useProFormInstanceExpose(
      computed(() => ({ ...formRef.value, ...formatValues }) as ProFormRef<T>),
    )
    // 在 BaseForm 中直接处理 onInit，确保能获取到完整的 fieldsValueType
    // 注意：useEffect 内部已经有一个 nextTick()，且子组件的 useEffect 会先执行
    useEffect(() => {
      const { omitNil = true, onInit } = props
      if (!onInit)
        return
      const executeOnInit = async () => {
        await nextTick() // 等待第一次 tick
        const finalValues = transformKey(formRef.value?.getFieldsValue?.(true) as T, omitNil)
        onInit?.(finalValues, proFormInstance)
      }
      executeOnInit()
    }, [])

    /**
     * 获取布局
     */
    const { RowWrapper } = useGridHelpers({ grid: props.grid, rowProps: props.rowProps })
    const gridProps = computed(() => ({
      grid: props.grid,
      rowProps: props.rowProps,
    }))
    useGridContextProvider(gridProps)
    useProFormContextProvider({
      ...formatValues,
      formRef,
    })
    expose(proFormInstance)
    return () => {
      const {
        formItemProps,
        syncToUrl,
        syncToModel,
        model: propsModel,
        extraUrlParams,
        fieldProps,
        groupProps,
        submitter,
        proFieldProps,
        dateFormatter = 'string',
        onInit,
        request,
        rootClass,
        contentRender,
        formComponentType,
        onReset,
        params,
        grid,
        rowProps,
        colProps,
        isKeyPressSubmit,
        syncToUrlAsImportant,
        autoFocusFirstInput,
        formKey = requestFormCacheId,
        formRef: propsFormRef,
        form,
        readonly,
        onLoadingChange,
        loading: propsLoading,
        onValuesChange,
        omitNil = true,
        onFinish,
        ...propsRest
      } = { ...attrs, ...omitUndefined(props) }
      if (initialDataLoading.value && request) {
        return (
          <div style={{ paddingTop: '50px', paddingBottom: '50px', textAlign: 'center' }}>
            <Spin />
          </div>
        )
      }

      if (syncToUrlAsImportant) {
        Object.keys(urlParamsMergeModel.value).forEach((key) => {
          modelValue[key] = urlParamsMergeModel.value[key]
        })
      }
      else {
        Object.keys(urlParamsMergeModel.value).forEach((key) => {
          if (!modelValue[key]) {
            modelValue[key] = urlParamsMergeModel.value[key]
          }
        })
      }
      const children = slots.default?.()
      const items = autoFocusToFirstChild(
        children! as VNode[],
        typeof autoFocusFirstInput === 'string' ? true : autoFocusFirstInput,
      )
      /** 计算 submitter props 的对象 */
      const submitterProps: SubmitterProps
        = typeof submitter === 'boolean' || !submitter ? {} : submitter
      /** 渲染提交按钮与重置按钮 */
      const submitterNode
        = submitter === false ? null : (
          <Submitter
            key="submitter"
            {...submitterProps}
            onReset={() => {
              const finalValues = transformKey?.(formRef.value?.getFieldsValue() as T, omitNil)
              submitterProps?.onReset?.(finalValues)
              // onReset?.(finalValues)
              if (syncToUrl) {
                // 把没有的值设置为未定义可以删掉 url 的参数
                const params = Object.keys(transformKey?.(formRef.value?.getFieldsValue() as T, false)).reduce(
                  (pre, next) => {
                    return {
                      ...pre,
                      [next]: finalValues[next] || undefined,
                    }
                  },
                  extraUrlParams,
                )
                /** 在同步到 url 上时对参数进行转化 */
                setUrlSearch?.(genParams(syncToUrl, params || {}, 'set'))
              }
            }}
            submitButtonProps={{
              loading: loading.value,
              ...(typeof submitterProps.submitButtonProps === 'boolean'
                ? {}
                : submitterProps.submitButtonProps),
            }}
          />
        )
      let content = grid ? <RowWrapper>{items}</RowWrapper> : (items as VueNode | VueNode[])
      if (contentRender) {
        content = <>{contentRender(content, submitterNode, formRef.value!)}</>
      }
      return wrapSSR(
        <Form
          ref={(instance) => {
            formRef.value = instance as unknown as FormInstance
            formRef.value.focus = () => {
              const firstInput = (
                instance as unknown as FormInstance
              )?.nativeElement?.querySelector('input, textarea, select') as HTMLElement
              firstInput?.focus()
            }
          }}
          {...{
            ...propsRest,
            onKeydown: (event: KeyboardEvent) => {
              if (!isKeyPressSubmit)
                return
              if (event.key === 'Enter') {
                formRef.value?.submit()
              }
            },
          }}
          autoComplete={propsRest.autoComplete || 'off'}
          model={modelValue}
          onValuesChange={(changedValues, values) =>
            onValuesChange?.(
              transformKey(changedValues as T, !!omitNil),
              transformKey(values as T, !!omitNil),
            )}
          rootClass={classNames(baseClassName.value, hashId.value, rootClass)}
          onFinish={handleFinish}
        >
          {content}
        </Form>,
      )
    }
  },
  {
    name: 'BaseFormComponents',
    inheritAttrs: false,
    props: [
      'autoComplete',
      'syncToUrl',
      'extraUrlParams',
      'syncToModel',
      'syncToUrlAsImportant',
      'form',
      'autoFocusFirstInput',
      'classes',
      'clearOnDestroy',
      'colProps',
      'colon',
      'disabled',
      'feedbackIcons',
      'formComponentType',
      'formKey',
      'grid',
      'isKeyPressSubmit',
      'labelAlign',
      'formItemProps',
      'groupProps',
      'labelCol',
      'labelWrap',
      'layout',
      'model',
      'formRef',
      'name',
      'onFieldsChange',
      'onFinish',
      'onFinishFailed',
      'onInit',
      'onReset',
      'onSubmit',
      'onValidate',
      'fieldProps',
      'onValuesChange',
      'params',
      'prefixCls',
      'preserve',
      'proFieldProps',
      'readonly',
      'request',
      'requiredMark',
      'rootClass',
      'rowProps',
      'rules',
      'scrollToFirstError',
      'size',
      'styles',
      'submitter',
      'tooltip',
      'validateMessages',
      'validateOnRuleChange',
      'validateTrigger',
      'variant',
      'wrapperCol',
      'contentRender',
      'dateFormatter',
      'omitNil',
      'onLoadingChange',
      'loading',
    ],
  },
)

export default BaseFormComponents
