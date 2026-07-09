import type { MouseEventHandler } from '@v-c/util/dist/EventInterface'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { AvatarProps, BreadcrumbProps, TagProps } from 'antdv-next'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { DirectionType } from 'antdv-next/dist/config-provider/context'
import type { VNode } from 'vue'
import type { BreadcrumbRender } from '../../RenderTypings'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@antdv-next/icons'
import ResizeObserver from '@v-c/resize-observer'
import { classNames } from '@v-c/util'
import { Avatar, Breadcrumb, Space } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, onBeforeUnmount, shallowRef } from 'vue'
import useStyle from './style'

export interface PageHeaderProps {
  prefixCls?: string
  ghost?: boolean
  breadcrumbRender?: BreadcrumbRender
  avatar?: AvatarProps & { class?: string }
  backIcon?: VueNode
  breadcrumb?: BreadcrumbProps
  extra?: VueNode | VNode | VNode[]
  footer?: VueNode
  subTitle?: VueNode
  tags?: VueNode | VNode<TagProps>
  title?: VueNode
  onBack?: MouseEventHandler
}

function useDestroyed() {
  const destroyed = shallowRef(false)
  onBeforeUnmount(() => {
    destroyed.value = true
  })

  return destroyed
}

function renderBreadcrumb(breadcrumb: BreadcrumbProps & { class: string }, prefixCls: string) {
  if (!breadcrumb.items?.length)
    return null
  return <Breadcrumb {...breadcrumb} class={classNames(`${prefixCls}-breadcrumb`, breadcrumb.class)} />
}

function getBackIcon(props: PageHeaderProps, direction: DirectionType = 'ltr') {
  if (props.backIcon !== undefined) {
    return props.backIcon
  }
  return direction === 'rtl' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />
}
function renderBack(prefixCls: string, hashId: string, cssVarCls: string, backIcon?: VueNode, onBack?: MouseEventHandler) {
  if (!backIcon || !onBack) {
    return null
  }
  return (
    <div class={classNames(`${prefixCls}-back`, hashId, cssVarCls)}>
      <div role="button" onClick={e => onBack?.(e)} class={classNames(`${prefixCls}-back-button`, hashId, cssVarCls)} aria-label="back">
        {backIcon}
      </div>
    </div>
  )
}
function renderTitle(prefixCls: string, props: PageHeaderProps, direction: DirectionType = 'ltr', hashId: string, cssVarCls: string) {
  const { title, avatar, subTitle, tags, extra, onBack } = props
  const headingPrefixCls = `${prefixCls}-heading`
  const hasHeading = title || subTitle || tags || extra
  // If there is nothing, return a null
  if (!hasHeading) {
    return null
  }
  const backIcon = getBackIcon(props, direction)
  const backIconDom = renderBack(prefixCls, hashId, cssVarCls, backIcon as VueNode, onBack)
  const hasTitle = backIconDom || avatar || hasHeading
  return (
    <div class={classNames(headingPrefixCls, hashId, cssVarCls)}>
      {hasTitle && (
        <div class={classNames(`${headingPrefixCls}-left`, hashId, cssVarCls)}>
          {backIconDom}
          {avatar && <Avatar {...avatar} class={classNames(`${headingPrefixCls}-avatar`, hashId, cssVarCls, avatar.class)} />}
          {title && (
            <span class={classNames(`${headingPrefixCls}-title`, hashId, cssVarCls)} title={typeof title === 'string' ? title : undefined}>
              {title}
            </span>
          )}
          {subTitle && (
            <span class={classNames(`${headingPrefixCls}-sub-title`, hashId, cssVarCls)} title={typeof subTitle === 'string' ? subTitle : undefined}>
              {subTitle}
            </span>
          )}
          {tags && <span class={classNames(`${headingPrefixCls}-tags `, hashId, cssVarCls)}>{tags}</span>}
        </div>
      )}
      {extra && (
        <span class={classNames(`${headingPrefixCls}-extra`, hashId, cssVarCls)}>
          <Space>{extra}</Space>
        </span>
      )}
    </div>
  )
}
function renderChildren(prefixCls: string, children: VueNode | VueNode[], hashId: string, cssVarCls: string) {
  return <div class={classNames(`${prefixCls}-content`, hashId, cssVarCls)}>{children}</div>
}

function renderFooter(prefixCls: string, footer: VueNode | VueNode[], hashId: string, cssVarCls: string) {
  if (footer) {
    return <div class={classNames(`${prefixCls}-footer`, hashId, cssVarCls)}>{footer}</div>
  }
  return null
}

const PageHeader = defineComponent<PageHeaderProps, {}, string, CustomSlotsType<{
  extra?: () => VueNode
  footer?: () => VueNode
  subTitle?: () => VueNode
  title?: () => VueNode
  tags?: () => VueNode
  backIcon?: () => VueNode
  default?: () => VueNode
  breadcrumbRender?: BreadcrumbRender
}>>((props, { slots, attrs }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-page-header`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const compact = shallowRef(false)
  const isDestroyed = useDestroyed()

  const onResize = ({ width }: { width: number }) => {
    if (!isDestroyed.value) {
      compact.value = width < 768
    }
  }
  const getDefaultBreadcrumbDom = () => {
    const { breadcrumb } = props

    if ((breadcrumb as BreadcrumbProps)?.items) {
      return renderBreadcrumb(breadcrumb as BreadcrumbProps & { class: string }, baseClassName.value)
    }
    return null
  }

  return () => {
    const { breadcrumb, breadcrumbRender = slots.breadcrumbRender, ghost, footer } = props
    const isBreadcrumbComponent = breadcrumb && 'props' in breadcrumb
    const defaultBreadcrumbDom = getDefaultBreadcrumbDom()
    // support breadcrumbRender function
    const breadcrumbRenderDomFromProps = breadcrumbRender?.({ ...props, prefixCls: baseClassName.value }, defaultBreadcrumbDom) ?? defaultBreadcrumbDom
    const breadcrumbDom = isBreadcrumbComponent ? breadcrumb : breadcrumbRenderDomFromProps
    const className = classNames(
      baseClassName.value,
      {
        [`${baseClassName.value}-has-breadcrumb`]: !!breadcrumbDom,
        [`${baseClassName.value}-has-footer`]: !!footer,
        [`${baseClassName.value}-ghost`]: ghost,
        [`${baseClassName.value}-rtl`]: config.value.direction === 'rtl',
        [`${baseClassName.value}-compact`]: compact.value,
      },
      attrs.class,
      hashId?.value,
      cssVarCls?.value,
    )
    const title = renderTitle(
      baseClassName.value,
      {
        ...props,
        title: slots.title?.() || props.title,
        subTitle: slots.subTitle?.() || props.subTitle,
        extra: slots.extra?.() || props.extra,
        tags: slots.tags?.() || props.tags,
        backIcon: slots.backIcon?.() || props.backIcon,
      },
      config.value.direction,
      hashId?.value!,
      cssVarCls?.value!,
    )
    const childDom = slots.default?.() && renderChildren(baseClassName.value, slots.default?.(), hashId?.value!, cssVarCls?.value!)
    const footerDom = renderFooter(baseClassName.value, slots.footer?.() || footer as VueNode, hashId?.value!, cssVarCls?.value!)
    if (!breadcrumbDom && !title && !footerDom && !childDom) {
      return <div class={classNames(`${baseClassName.value}-no-children`, hashId.value, cssVarCls.value)} />
    }
    return (
      <ResizeObserver onResize={onResize}>
        <div class={className} style={attrs.style}>
          {breadcrumbDom}
          {title}
          {childDom}
          {footerDom}
        </div>
      </ResizeObserver>
    )
  }
}, {
  name: 'PageHeader',
  inheritAttrs: false,
})
export default PageHeader
