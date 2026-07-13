import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ColProps, FormItemProps, FormProps, RowProps } from 'antdv-next'
import type { CSSProperties, SetupContext, VNode } from 'vue'
import type { CommonFormProps, ProFormRef } from '../../BaseForm'
import type { OptionRender } from '../../RenderTypings'
import type { ActionsProps } from './Actions'
import {
  isBrowser,
  transformBooleanProps,
  useMemo,
  useMountMergeState,
} from '@antdv-next1/pro-utils'
import ResizeObserver from '@v-c/resize-observer'
import { classNames } from '@v-c/util'
import { theme } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { BaseForm } from '../../BaseForm'
import { useProFormInstanceExpose } from '../../utils'
import ProQueryFilterContent from './QueryFilterContent'
import useStyle from './style'

export type BaseProQueryFilterProps = Omit<ActionsProps, 'submitter' | 'setCollapsed' | 'isForm'> & {
  defaultCollapsed?: boolean
  /**
   * @name layout 的布局设置
   * @type 'horizontal' | 'inline' | 'vertical';
   */
  layout?: FormProps['layout']
  /**
   * @name defaultColsNumber 默认一行显示几个表单项
   */
  defaultColsNumber?: number
  /**
   * @name defaultFormItemsNumber 默认展示几个表单项
   */
  defaultFormItemsNumber?: number
  /**
   * @name labelWidth 文字标签的宽度
   *
   * @example 文字标签宽 80 ，一般用于只有两个字
   * labelWidth={80}
   * @example 文字标签宽 140 ，一般用于有四个字
   * labelWidth={140}
   * @example 自动计算，会导致不整齐
   * labelWidth="auto"
   */
  labelWidth?: number | 'auto'
  /**
   * @name split 每一行之前要不要有分割线
   * @description 只有在 `layout` 为 `vertical` 时生效
   */
  split?: boolean
  /**
   * @name span 配置列数，一般而言是 8 的倍数
   *
   * @example 配置一行4个
   * span={6}
   *
   * @example 配置一行3个
   * span={8}
   *
   * @example 根据屏幕宽度配置
   * span={xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6}
   */
  span?: SpanConfig

  /**
   * @name searchText 查询按钮的文本
   */
  searchText?: string
  /**
   * @name resetText 重置按钮的文本
   */
  resetText?: string
  /**
   * @name searchGutter 查询表单栅格间隔
   *
   * @example searchGutter={24}
   */
  searchGutter?: RowProps['gutter']
  // form?: ProFormInstance;
  /**
   * @param searchConfig 基础的配置
   * @param props 更加详细的配置 {
   *     type?: 'form' | 'list' | 'table' | 'cardList' | undefined;
   *     form: FormInstance;
   *     submit: () => void;
   *     collapse: boolean;
   *     setCollapse: (collapse: boolean) => void;
   *     showCollapseButton: boolean; }
   * @name optionRender  底部操作栏的 render
   *
   *
   * @example 增加一个清空按钮
   * optionRender={(searchConfig, props, dom) =>[ <a key="clear">清空</a>,...dom]}
   *
   * @example 增自定义提交
   *
   * optionRender={(searchConfig) => [<a key="submit" onClick={()=> searchConfig?.form?.submit()}>提交</a>]}
   */
  optionRender?: OptionRender
  /**
   * @name ignoreRules 忽略 Form.Item rule规则配置
   */
  ignoreRules?: boolean
  /**
   * @name showHiddenNum 是否显示 collapse 隐藏个数
   */
  showHiddenNum?: boolean

  // submitterColSpanProps 是一个可选属性，类型为一个对象。
  // 该对象使用 Omit 泛型去除了 ColProps 中的 'span' 属性，并新增了一个 'span' 属性，类型为 number 类型。
  // 也就是说，submitterColSpanProps 对象除了 'span' 属性外，还可以包含 ColProps 中的其他所有属性。
  submitterColSpanProps?: Omit<ColProps, 'span'> & {
    span?: number
    class?: string
    style?: CSSProperties
  }
  containerStyle?: CSSProperties
}

export type ProQueryFilterProps<
  T = Record<string, any>,
  U = Record<string, any>,
> = Omit<FormProps, 'onFinish' | 'onReset'>
  & CommonFormProps<T, U>
  & BaseProQueryFilterProps & {
    onReset?: (values?: T) => void
  }

const defaultWidth = isBrowser() ? document?.body?.clientWidth : 1024

interface BreakpointsConfig {
  /** 配置表单列变化的容器宽度断点 */
  breakpoints: {
    vertical: (string | number)[][]
    default: (string | number)[][]
  }
  configSpanBreakpoints: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }
}

/** 从 antd 设计 token 获取断点配置，与 Grid 响应式布局保持一致 */
function getBreakpointsConfig(token: {
  screenSMMin?: number
  screenMDMin?: number
  screenLGMin?: number
  screenXLMin?: number
  screenXXLMin?: number
}): BreakpointsConfig {
  const defaultToken = theme.getDesignToken()
  const t = { ...defaultToken, ...token }
  const bp = {
    xs: t.screenSMMin ?? 576,
    sm: t.screenMDMin ?? 768,
    md: t.screenLGMin ?? 992,
    lg: t.screenXLMin ?? 1200,
    xl: t.screenXXLMin ?? 1600,
    xxl: Infinity,
  } as const

  return {
    configSpanBreakpoints: bp,
    breakpoints: {
      vertical: [
        [bp.xs, 1, 'vertical'],
        [bp.md, 2, 'vertical'],
        [bp.xl, 3, 'vertical'],
        [Infinity, 4, 'vertical'],
      ],
      default: [
        [bp.xs, 1, 'vertical'],
        [bp.sm, 2, 'vertical'],
        [bp.xl, 3, 'horizontal'],
        [Infinity, 4, 'horizontal'],
      ],
    },
  }
}

export type SpanConfig
  = | number
    | {
      xs?: number
      sm?: number
      md?: number
      lg?: number
      xl?: number
      xxl?: number
    }
/**
 * 合并用户和默认的配置
 *
 * @param layout
 * @param width
 * @param span
 */
function getSpanConfig(layout: FormProps['layout'], width: number, span: SpanConfig | undefined, breakpointsConfig: BreakpointsConfig): { span: number, layout: FormProps['layout'] } {
  if (span && typeof span === 'number') {
    return {
      span,
      layout,
    }
  }
  const { breakpoints, configSpanBreakpoints } = breakpointsConfig
  const spanConfig: (string | number)[][] = span
    ? ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(key => [
        configSpanBreakpoints[key as 'xs'],
        24 / (span as { xs: number, sm: number, md: number, lg: number, xl: number, xxl: number })?.[key as 'sm'],
        'horizontal',
      ])
    : breakpoints[(layout as 'default') || 'default']

  const breakPoint = (spanConfig || breakpoints.default).find(
    item => width < (item[0] as number) + 16, // 16 = 2 * (ant-row -8px margin)
  )
  if (!breakPoint) {
    return {
      span: 8,
      layout: 'horizontal',
    }
  }
  return {
    span: 24 / (breakPoint[1] as number),
    layout: breakPoint?.[2] as 'horizontal',
  }
}

const ProQueryFilter = defineComponent(
  <T extends Record<string, any>, U extends Record<string, any>>(props: ProQueryFilterProps<T, U>, { slots, attrs, expose }: SetupContext<{}, CustomSlotsType<{
    default?: () => VueNode
  }>>) => {
    const formRef = shallowRef<ProFormRef<T>>()
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-query-filter`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const { token } = theme.useToken()
    const [width, setWidth] = useMountMergeState(
      () => (typeof (attrs.style as CSSProperties)?.width === 'number' ? (attrs.style as CSSProperties)?.width : defaultWidth) as number,
    )

    const breakpointsConfig = computed(
      () => getBreakpointsConfig(token.value),
    )
    const spanSize = useMemo(() => getSpanConfig(props.layout, width.value + 16, props.span, breakpointsConfig.value), [() => props.layout, width, () => props.span, breakpointsConfig],
    )
    const showLength = computed(() => {
      if (props.defaultFormItemsNumber !== undefined) {
        return props.defaultFormItemsNumber
      }
      if (props.defaultColsNumber !== undefined) {
      // 折叠为一行，需要处理多行的情况请使用 defaultFormItemsNumber
        const oneRowControlsNumber = 24 / spanSize.value.span - 1
        return props.defaultColsNumber > oneRowControlsNumber
          ? oneRowControlsNumber
          : props.defaultColsNumber
      }
      return Math.max(1, 24 / spanSize.value.span - 1)
    })

    /** 计算最大宽度防止溢出换行 */
    const formItemFixStyle = computed(() => {
      const { labelWidth = '80' } = props
      if (labelWidth && spanSize.value.layout !== 'vertical' && labelWidth !== 'auto') {
        return {
          labelCol: {
            flex: `0 0 ${labelWidth}px`,
          },
          wrapperCol: {
            style: {
              maxWidth: `calc(100% - ${labelWidth}px)`,
            },
          },
          style: {
            flexWrap: 'nowrap',
          },
        }
      }
      return undefined
    })

    expose(useProFormInstanceExpose(formRef))
    return () => {
      const transformedProps = transformBooleanProps(['isKeyPressSubmit', 'autoFocusFirstInput', 'disabled', 'scrollToFirstError', 'collapsed', 'defaultCollapsed', 'ignoreRules', 'clearOnDestroy', 'loading', 'grid', 'omitNil', 'preserve', 'syncToUrl', 'showHiddenNum', 'syncToModel', 'split', 'syncToUrlAsImportant', 'submitter', 'readonly'], props)
      const {
        collapsed: controlCollapsed,
        layout,
        defaultCollapsed = true,
        defaultColsNumber,
        defaultFormItemsNumber,
        span,
        searchGutter = 24,
        searchText,
        resetText,
        optionRender,
        collapseRender,
        onReset,
        onCollapse,
        labelWidth,
        split,
        preserve = true,
        ignoreRules,
        showHiddenNum = false,
        submitterColSpanProps,
        ...rest
      } = { ...props, ...transformedProps }
      return (
        <ResizeObserver
          key="resize-observer"
          onResize={(offset) => {
            if (width.value !== offset.width && offset.width > 17) {
              setWidth(offset.width)
            }
          }}
        >
          <div
            class={classNames(`${baseClassName.value}-container`, hashId.value, cssVarCls.value)}
            style={props.containerStyle}
          >
            <BaseForm
              {...attrs}
              {...rest}
              {...transformedProps}
              ref={formRef}
              class={classNames(baseClassName.value, hashId.value, cssVarCls.value, attrs.class)}
              preserve={typeof preserve === 'string' ? true : preserve}
              name={props.name || 'query-filter-form'}
              isKeyPressSubmit={(typeof rest.isKeyPressSubmit === 'string' ? true : rest.isKeyPressSubmit) || true}
              layout={spanSize.value.layout}
              onReset={onReset}
              fieldProps={{
                style: {
                  width: '100%',
                },
              }}
              formItemProps={formItemFixStyle.value as FormItemProps}
              groupProps={{
                titleStyle: {
                  display: 'inline-block',
                  marginInlineEnd: '16px',
                },
              }}
              contentRender={(items, submitter, form) => {
                return (
                  <ProQueryFilterContent
                    spanSize={spanSize.value}
                    collapsed={controlCollapsed}
                    form={form}
                    submitterColSpanProps={submitterColSpanProps}
                    collapseRender={collapseRender}
                    defaultCollapsed={defaultCollapsed}
                    onCollapse={onCollapse}
                    optionRender={optionRender}
                    submitter={submitter}
                    items={items as VNode[]}
                    split={split}
                    baseClassName={baseClassName.value}
                    resetText={resetText}
                    searchText={searchText}
                    searchGutter={searchGutter}
                    preserve={preserve}
                    ignoreRules={ignoreRules}
                    showLength={showLength.value}
                    showHiddenNum={showHiddenNum}
                  />
                )
              }}
              v-slots={slots}
            />
          </div>
        </ResizeObserver>
      )
    }
  },
  {
    name: 'ProQueryFilter',
    inheritAttrs: false,
    props: ['autoComplete', 'autoFocusFirstInput', 'autocomplete', 'classes', 'clearOnDestroy', 'colProps', 'collapseRender', 'collapsed', 'colon', 'containerStyle', 'dateFormatter', 'defaultCollapsed', 'defaultColsNumber', 'defaultFormItemsNumber', 'disabled', 'extraUrlParams', 'feedbackIcons', 'formKey', 'formRef', 'grid', 'hiddenNum', 'ignoreRules', 'isKeyPressSubmit', 'labelAlign', 'labelCol', 'labelWidth', 'labelWrap', 'layout', 'loading', 'model', 'name', 'omitNil', 'onCollapse', 'onFieldsChange', 'onFinish', 'onFinishFailed', 'onInit', 'onLoadingChange', 'onReset', 'onSubmit', 'onValidate', 'onValuesChange', 'optionRender', 'params', 'prefixCls', 'preserve', 'readonly', 'request', 'requiredMark', 'resetText', 'rootClass', 'rowProps', 'rules', 'scrollToFirstError', 'searchGutter', 'searchText', 'showHiddenNum', 'size', 'span', 'split', 'styles', 'submitter', 'submitterColSpanProps', 'syncToModel', 'syncToUrl', 'syncToUrlAsImportant', 'tooltip', 'validateMessages', 'validateOnRuleChange', 'validateTrigger', 'variant', 'wrapperCol'],
  },
)

export default ProQueryFilter
