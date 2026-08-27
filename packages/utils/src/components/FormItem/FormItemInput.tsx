import type { VueNode } from '@v-c/util'
import type { FormItemInputProps } from 'antdv-next/dist/form/FormItemInput'
import type { ColPropsWithClass } from 'antdv-next/dist/form/FormItemLabel'
import type { VNode } from 'vue'
import { clsx, get, omit, set } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { Col } from 'antdv-next'
import { responsiveArrayReversed } from 'antdv-next/dist/_util/responsiveObserver'
import { getSlotPropsFnRun } from 'antdv-next/dist/_util/tools'
import { FormItemPrefixContextProvider, useFormContext, useFormContextProvider } from 'antdv-next/dist/form/context'
import ErrorList from 'antdv-next/dist/form/ErrorList'
import FallbackCmp from 'antdv-next/dist/form/style/fallbackCmp'
import { computed, defineComponent, nextTick, shallowRef, watch } from 'vue'

const GRID_MAX = 24

export interface FormItemInputMiscProps {
  prefixCls: string
  errors: any[]
  warnings: any[]
  marginBottom?: number | null
  onErrorVisibleChanged?: (visible: boolean) => void
}

const FormItemInput = defineComponent<
  FormItemInputProps & FormItemInputMiscProps & {
    _internalItemRender?: {
      mark: string
      render: (
        props: FormItemInputProps & FormItemInputMiscProps,
        domList: {
          input: VNode
          errorList: VNode | null
          extra: VNode | null
        },
      ) => VueNode
    }
  }
>(
  (props, { slots }) => {
    const baseClassName = computed(() => `${props.prefixCls}-item`)
    const formContext = useFormContext()
    const contextClassNames = computed(() => formContext.value?.classes ?? {})
    const contextStyles = computed(() => formContext.value?.styles ?? {})

    const extraRef = shallowRef<HTMLDivElement>()
    const extraHeight = shallowRef(0)

    watch(
      () => props.extra,
      async () => {
        await nextTick()
        if (props.extra && extraRef.value) {
          extraHeight.value = extraRef.value.clientHeight
        }
        else {
          extraHeight.value = 0
        }
      },
      {
        immediate: true,
      },
    )

    const subFormContext = computed(() => omit(formContext.value ?? {}, ['labelCol', 'wrapperCol']))
    useFormContextProvider(subFormContext)

    return () => {
      const {
        wrapperCol,
        labelCol,
        marginBottom,
        warnings,
        errors,
        prefixCls,
        _internalItemRender: formItemRender,
        status,
        fieldId,
        onErrorVisibleChanged,
      } = props
      const label = getSlotPropsFnRun({}, props, 'label')
      const extra = getSlotPropsFnRun({}, props, 'extra')
      const help = getSlotPropsFnRun({}, props, 'help')
      const children = filterEmpty(slots?.default?.() ?? [])
      const mergedWrapperColFn = () => {
        let mergedWrapper: ColPropsWithClass = { ...(wrapperCol || formContext.value?.wrapperCol || {}) } as ColPropsWithClass
        if (label === null && !labelCol && !wrapperCol && formContext.value?.labelCol) {
          const list = [undefined, ...responsiveArrayReversed] as const
          list.forEach((size) => {
            const _size = size ? [size] : []
            const formLabel = get(formContext?.value?.labelCol, _size)
            const formLabelObj = typeof formLabel === 'object' ? formLabel : {}

            const wrapper = get(mergedWrapper, _size)
            const wrapperObj = typeof wrapper === 'object' ? wrapper : {}
            if ('span' in formLabelObj && !('offset' in wrapperObj) && formLabelObj.span < GRID_MAX) {
              mergedWrapper = set(mergedWrapper, [..._size, 'offset'], formLabelObj.span)
            }
          })
        }
        return mergedWrapper
      }
      const mergedWrapperCol = mergedWrapperColFn()

      const className = clsx(`${baseClassName.value}-control`, mergedWrapperCol?.class)
      // Pass to sub FormItem should not with col info
      const inputDom = (
        <div class={`${baseClassName.value}-control-input`}>
          <div
            class={clsx(
              `${baseClassName.value}-control-input-content`,
              contextClassNames.value?.content,
            )}
            style={contextStyles.value?.content}
          >
            {children}
          </div>
        </div>
      )
      const errorListDom = (
        marginBottom || errors.length || warnings.length
          ? (
              <FormItemPrefixContextProvider
                prefixCls={prefixCls}
                status={status}
              >
                <ErrorList
                  fieldId={fieldId}
                  errors={errors}
                  warnings={warnings}
                  help={help}
                  helpStatus={status}
                  class={`${baseClassName.value}-explain-connected`}
                  onVisibleChanged={onErrorVisibleChanged}
                />
              </FormItemPrefixContextProvider>
            )
          : null)

      const extraProps: { id?: string } = {}

      if (fieldId) {
        extraProps.id = `${fieldId}_extra`
      }

      // If extra = 0, && will goes wrong
      // 0&&error -> 0

      const extraDom = extra
        ? (
            <div {...extraProps} class={`${baseClassName.value}-extra`} ref={extraRef}>
              {extra}
            </div>
          )
        : null
      const additionalDom = errorListDom || extraDom
        ? (
            <div
              class={`${baseClassName.value}-additional`}
              style={marginBottom ? { minHeight: `${marginBottom + extraHeight.value}px` } : {}}
            >
              {errorListDom}
              {extraDom}
            </div>
          )
        : null
      const dom
        = formItemRender && formItemRender.mark === 'pro_table_render' && formItemRender.render ? (
          formItemRender.render(props, { input: inputDom, errorList: errorListDom, extra: extraDom })
        ) : (
          <>
            {inputDom}
            {additionalDom}
          </>
        )
      return (
        <>
          <Col {...mergedWrapperCol} class={className}>
            {dom}
          </Col>
          <FallbackCmp prefixCls={prefixCls} />
        </>
      )
    }
  },
  {
    name: 'FormItemInput',
    inheritAttrs: false,
  },
)

export default FormItemInput
