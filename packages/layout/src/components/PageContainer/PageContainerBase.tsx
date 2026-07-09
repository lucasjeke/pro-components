import type { GenerateStyle } from '@antdv-next1/pro-provider'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { AffixProps, AvatarProps, BreadcrumbProps, SpinProps, TabsProps, WatermarkProps } from 'antdv-next'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { VNode } from 'vue'
import type { BreadcrumbRender, PageHeaderRender } from '../../RenderTypings'
import type { FooterToolbarProps } from '../FooterToolbar'
import type { PageHeaderProps } from '../PageHeader'
import type { PageContainerToken } from './style'
import type { stylishToken } from './style/stylish'
import { useProConfig } from '@antdv-next1/pro-provider'
import { useEffect } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { Affix, Tabs, Watermark } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, isVNode } from 'vue'
import { useRouteContext } from '../../context/RouteContext'
import FooterToolbar from '../FooterToolbar'
import GridContent from '../GridContent'
import PageHeader from '../PageHeader'
import PageLoading from '../PageLoading'
import useStyle from './style'
import { useStylish } from './style/stylish'

function genLoading(spinProps: boolean | SpinProps | null) {
  if (typeof spinProps === 'object') {
    return spinProps
  }
  return { spinning: spinProps }
}

/**
 * Render Footer tabList In order to be compatible with the old version of the PageHeader basically
 * all the functions are implemented.
 */
function renderFooter({
  tabList,
  tabActiveKey,
  onTabChange,
  hashId,
  cssVarCls,
  tabBarExtraContent,
  tabProps,
  prefixedClassName,
}: Omit<
  PageContainerProps & {
    prefixedClassName: string
    hashId: string
    cssVarCls: string
  },
  'title'
>) {
  if (Array.isArray(tabList) || tabBarExtraContent) {
    return (
      <Tabs
        {...tabProps}
        class={classNames(`${prefixedClassName}-tabs`, hashId, cssVarCls)}
        activeKey={tabActiveKey}
        tabBarExtraContent={tabBarExtraContent}
        onChange={(key) => {
          if (onTabChange) {
            onTabChange(key)
          }
        }}
        styles={tabProps?.styles || (!tabList?.filter(item => item.content).length
          ? {
              header: {
                marginBlockEnd: 0,
              },
            }
          : {})}
        items={tabList?.map((item, index) => ({
          ...item,
          key: item.key?.toString() || index?.toString(),
        }))}
      />
    )
  }
  return null
}
function renderPageHeader(content: VueNode, extraContent: VueNode, prefixedClassName: string, hashId: string, cssVarCls: string) {
  if (!content && !extraContent) {
    return null
  }
  return (
    <div class={classNames(`${prefixedClassName}-detail`, hashId, cssVarCls)}>
      <div class={classNames(`${prefixedClassName}-main `, hashId, cssVarCls)}>
        <div class={classNames(`${prefixedClassName}-row`, hashId, cssVarCls)}>
          {content && <div class={classNames(`${prefixedClassName}-content`, hashId, cssVarCls)}>{content}</div>}
          {extraContent && <div class={classNames(`${prefixedClassName}-extraContent`, hashId, cssVarCls)}>{extraContent}</div>}
        </div>
      </div>
    </div>
  )
}

export type PageContainerProps = {
  avatar?: AvatarProps
  /**
   * @name tabList tabs 的列表
   */
  tabList?: TabsProps['items']
  /**
   * @name  tabActiveKey 当前选中 tab 的 key
   */
  tabActiveKey?: TabsProps['activeKey']
  /**
   * @name  tab 修改时触发
   */
  onTabChange?: TabsProps['onChange']
  /**
   * @name tab 上右边额外的区域
   */
  tabBarExtraContent?: VueNode | { left?: VueNode, right?: VueNode }
  /** @name tabProps tabs 的其他配置 */
  tabProps?: TabsProps
  /** @name fixedHeader 固定 PageHeader 到页面顶部 */
  fixedHeader?: boolean
  title?: VueNode
  breadcrumb?: BreadcrumbProps
  /**
   * 自定义 breadcrumb,
   * @name breadcrumbRender 返回false不展示
   */
  breadcrumbRender?: PageHeaderProps['breadcrumbRender'] | false
  content?: VueNode
  footer?: VueNode | VNode | VNode[]
  extraContent?: VueNode
  /**
   * 与 Ant Design 完全相同
   *
   * @name PageHeader 的配置
   */
  header?: PageHeaderProps & { children?: VueNode }
  /**
   * @name pageHeaderRender 自定义 pageHeader
   */
  pageHeaderRender?: PageHeaderRender | false
  /**
   * 与 Ant Design Vue 完全相同
   * @name affixProps 固钉的配置
   */
  affixProps?: AffixProps
  /**
   * 只加载内容区域
   *
   * @name loading 是否加载
   */
  loading?: SpinProps | VueNode | (() => VueNode)
  /**
   * @name waterMarkProps 水印的配置
   */
  waterMarkProps?: WatermarkProps
  stylish?: GenerateStyle<PageContainerToken>
  footerStylish?: GenerateStyle<PageContainerToken>
  footerToolBarProps?: FooterToolbarProps
} & Omit<PageHeaderProps, 'title' | 'footer' | 'breadcrumb' | 'breadcrumbRender'>

const PageContainerBase = defineComponent<PageContainerProps, {}, string, CustomSlotsType<{
  default?: VueNode
  footer?: VueNode
  extra?: VueNode
  title?: VueNode
  tags?: VueNode
  backIcon?: VueNode
  content?: VueNode
  subTitle?: VueNode
  extraContent?: VueNode
  tabBarExtraContent?: VueNode
  pageHeaderRender?: PageHeaderRender
  breadcrumbRender?: BreadcrumbRender
}>>((props, { slots, attrs }) => {
  const routeContext = useRouteContext()
  const proProvide = useProConfig()
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-page-container`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  /** 告诉 props 是否存在 footerBar */
  useEffect(() => {
    if (!routeContext.value || !routeContext.value?.setHasPageContainer) {
      return () => {}
    }
    routeContext.value?.setHasPageContainer?.((routeContext.value.hasPageContainer || 0) + 1)
    return () => {
      routeContext.value?.setHasPageContainer?.((routeContext.value.hasPageContainer || 0) - 1)
    }
  }, [])

  useStylish(
    computed(() => `${baseClassName.value}.${baseClassName.value}-stylish`),
    {
      stylish: computed(() => props.stylish as GenerateStyle<stylishToken>),
    },
  )
  const memoBreadcrumbRender = computed(() => {
    const { header, breadcrumbRender = slots.breadcrumbRender } = props
    if (breadcrumbRender === false)
      return false
    return breadcrumbRender || header?.breadcrumbRender
  })

  const loadingDom = computed(() => {
    const { loading = false } = props
    // 当loading时一个合法的VNode时，说明用户使用了自定义loading,直接返回改自定义loading
    if (isVNode(loading)) {
      return loading
    }
    // 当传递过来的是布尔值，并且为false时，说明不需要显示loading,返回null
    if (typeof loading === 'boolean' && !loading) {
      return null
    }
    // 如非上述两种情况，那么要么用户传了一个true,要么用户传了loading配置，使用genLoading生成loading配置后返回PageLoading
    const spinProps = genLoading(loading as SpinProps | boolean)
    // 如果传的是loading配置，但spinning传的是false，也不需要显示loading
    return spinProps?.spinning ? <PageLoading {...spinProps} /> : null
  })

  const pageHeaderDom = computed(() => {
    const {
      loading,
      footer,
      affixProps,
      pageHeaderRender,
      fixedHeader,
      breadcrumbRender = memoBreadcrumbRender.value,
      footerToolBarProps,
      ...restProps
    } = props
    if (pageHeaderRender === false)
      return null
    if (pageHeaderRender) {
      return pageHeaderRender({
        ...restProps,
        title: routeContext.value.title,
        breadcrumb: routeContext.value.breadcrumb,
      })
    }

    let pageHeaderTitle = restProps.title

    if (!restProps.title && restProps.title !== false) {
      pageHeaderTitle = routeContext.value.title
    }
    const pageHeaderProps: PageHeaderProps = {
      ...routeContext.value,
      ...restProps,
      breadcrumb: routeContext.value.breadcrumb || restProps.breadcrumb,
      title: pageHeaderTitle,
      footer: renderFooter({
        ...restProps,
        hashId: hashId?.value!,
        cssVarCls: cssVarCls?.value!,
        breadcrumbRender,
        prefixedClassName: baseClassName.value,
      }),
      ...restProps.header,
    }
    const { breadcrumb } = pageHeaderProps as {
      breadcrumb: BreadcrumbProps
    }

    const noHasBreadCrumb = (!breadcrumb || (!breadcrumb?.itemRender && !breadcrumb?.items?.length)) && !breadcrumbRender
    if (
      ['title', 'subTitle', 'extra', 'tags', 'footer', 'avatar', 'backIcon'].every(item => !pageHeaderProps[item as 'backIcon'])
      && noHasBreadCrumb
      && !restProps.content
      && !restProps.extraContent
    ) {
      return null
    }
    const children = restProps.header?.children || renderPageHeader(restProps.content as VueNode, restProps.extraContent as VueNode, baseClassName.value, hashId?.value!, cssVarCls?.value!)
    return (
      <PageHeader
        {...pageHeaderProps}
        class={classNames(`${baseClassName.value}-wrap-page-header`, {
          [`${baseClassName.value}-wrap-page-header-wide`]: routeContext.value.contentWidth === 'Fixed' && routeContext.value.layout === 'top',
        })}
        breadcrumb={
          breadcrumbRender === false
            ? undefined
            : {
                ...pageHeaderProps.breadcrumb,
                ...routeContext.value.breadcrumbProps,
              }
        }
        breadcrumbRender={!breadcrumbRender ? undefined : breadcrumbRender}
        v-slots={children ? { default: () => children } : {}}
      />
    )
  })

  const contentDom = computed(() => {
    return slots.default?.()
      ? (
          <div
            class={classNames(`${baseClassName.value}-children-content`, hashId?.value, cssVarCls?.value, {
              [`${baseClassName.value}-children-content-no-header`]: !pageHeaderDom.value,
            })}
          >
            {slots.default?.()}
          </div>
        )
      : null
  })
  const renderContentDom = computed(() => {
    const { waterMarkProps } = props
    // 只要loadingDom非空我们就渲染loadingDom,否则渲染内容
    const dom = loadingDom.value || contentDom.value
    return waterMarkProps || routeContext.value.waterMarkProps
      ? (
          <Watermark
            {...{
              ...routeContext.value.waterMarkProps,
              ...props.waterMarkProps,
            }}
          >
            {dom}
          </Watermark>
        )
      : (
          dom
        )
  })
  return () => {
    const { loading, footer, affixProps, fixedHeader, breadcrumbRender, footerToolBarProps, ...restProps } = props

    const containerClassName = classNames(baseClassName.value, hashId?.value, cssVarCls?.value, attrs.class, {
      [`${baseClassName.value}-with-footer`]: footer,
      [`${baseClassName.value}-with-affix`]: fixedHeader && pageHeaderDom.value,
      [`${baseClassName.value}-stylish`]: !!restProps.stylish,
    })
    return (
      <>
        <div class={containerClassName}>
          {fixedHeader && pageHeaderDom.value ? (
            // 在 hasHeader 且 fixedHeader 的情况下，才需要设置高度
            <Affix
              {...affixProps}
              offsetTop={routeContext.value.hasHeader && routeContext.value.fixedHeader ? proProvide.value.token.layout?.header?.heightLayoutHeader : 1}
              class={classNames(`${baseClassName.value}-affix`, hashId?.value, cssVarCls?.value)}
            >
              <div class={classNames(`${baseClassName.value}-wrap`, hashId?.value, cssVarCls?.value)}>{pageHeaderDom.value}</div>
            </Affix>
          ) : (
            <div class={classNames(`${baseClassName.value}-wrap`, hashId?.value, cssVarCls?.value)}>{pageHeaderDom.value}</div>
          )}
          {renderContentDom.value && <GridContent>{renderContentDom.value}</GridContent>}
        </div>
        {footer && (
          <FooterToolbar {...footerToolBarProps} stylish={restProps.footerStylish} prefixCls={prefixCls.value}>
            {footer}
          </FooterToolbar>
        )}
      </>
    )
  }
}, {
  name: 'PageContainerBase',
  inheritAttrs: false,
})

export default PageContainerBase
