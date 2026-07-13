import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VueNode } from 'antdv-next/dist/_util/type'
import type { App, Plugin } from 'vue'
import type { BreadcrumbRender, PageHeaderRender } from '../../RenderTypings'
import type { PageContainerProps } from './PageContainerBase'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { getSlot } from '@antdv-next1/pro-utils'
import { defineComponent } from 'vue'
import PageContainerBase from './PageContainerBase'

const _PageContainer = defineComponent<
  PageContainerProps,
  {},
  string,
  CustomSlotsType<{
    default?: VueNode
    footer?: VueNode
    extra?: VueNode
    title?: VueNode
    backIcon?: VueNode
    tags?: VueNode
    content?: VueNode
    subTitle?: VueNode
    extraContent?: VueNode
    tabBarExtraContent?: VueNode
    pageHeaderRender?: PageHeaderRender
    breadcrumbRender?: BreadcrumbRender
  }>
>(
  (props, { slots, attrs }) => {
    return () => {
      const {
        footer = slots.footer,
        tabBarExtraContent = slots.tabBarExtraContent,
        extraContent = slots.extraContent,
        extra = slots.extra,
        tags = slots.tags,
        title = slots.title,
        content = slots.content,
        subTitle = slots.subTitle,
        backIcon = slots.backIcon,
      } = props
      const pageHeaderRender = getSlot(slots, props, 'pageHeaderRender')
      const breadcrumbRender = getSlot(slots, props, 'breadcrumbRender')
      return (
        <ProConfigProvider needDeps>
          <PageContainerBase
            {...attrs}
            {...props}
            pageHeaderRender={pageHeaderRender}
            title={title}
            subTitle={subTitle}
            content={content}
            extraContent={extraContent}
            tabBarExtraContent={tabBarExtraContent}
            extra={extra}
            footer={footer}
            tags={tags}
            backIcon={backIcon}
            breadcrumbRender={breadcrumbRender}
            v-slots={slots}
          />
        </ProConfigProvider>
      )
    }
  },
  {
    name: 'PageContainer',
    inheritAttrs: false,
  },
)

const PageContainer = _PageContainer as typeof _PageContainer & Plugin

PageContainer.install = (app: App) => {
  app.component(PageContainer.name!, PageContainer)
  return app
}

export type { PageContainerProps }
export default PageContainer
