import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { ShallowRef } from 'vue'
import type { AppListRender, SlotsRenderType } from '../../RenderTypings'
import type { AppItemProps, AppListProps } from './typing'
import { getSlot, useState } from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { Popover } from 'antdv-next'
import { computed, defineComponent, shallowRef } from 'vue'
import { AppsLogo } from './AppsLogo'
import DefaultContent, { defaultRenderLogo } from './DefaultContent'
import SimpleContent from './SimpleContent'
import useStyle from './style'

export interface AppsLogoComponentsProps {
  prefixCls?: string
  /** 相关品牌的列表 */
  appList?: AppListProps
  appListRender?: AppListRender | false
  /** 相关品牌的列表项 点击事件，当事件存在时，appList 内配置的 url 不在自动跳转 */
  onItemClick?: (item: AppItemProps, popoverRef: ShallowRef<HTMLSpanElement | null>) => void
}

const AppsLogoComponents = defineComponent<AppsLogoComponentsProps, {}, string, CustomSlotsType<
  Pick<SlotsRenderType, 'appListRender'> & {
    default?: () => VueNode[]
  }
>>((props, { slots }) => {
  const elRef = shallowRef<HTMLDivElement | null>(null)
  const popoverRef = shallowRef<HTMLSpanElement | null>(null)
  const baseClassName = computed(() => `${props.prefixCls}-layout-apps`)
  const [hashId] = useStyle(baseClassName)
  const [open, setOpen] = useState(false)
  const cloneItemClick = (app: AppItemProps) => props.onItemClick?.(app, popoverRef)
  const defaultDomContent = computed(() => {
    const { appList = [], onItemClick } = props
    const isSimple = appList.some(app => !app?.desc)
    if (isSimple) {
      return (
        <SimpleContent
          hashId={hashId?.value}
          appList={appList}
          itemClick={onItemClick ? cloneItemClick : undefined}
          baseClassName={`${baseClassName.value}-simple`}
        />
      )
    }
    return (
      <DefaultContent
        hashId={hashId?.value}
        appList={appList}
        itemClick={onItemClick ? cloneItemClick : undefined}
        baseClassName={`${baseClassName.value}-default`}
      />
    )
  })
  const popoverContent = computed(() => {
    const { appList = [] } = props
    const appListRender = getSlot(slots, props, 'appListRender')
    return appListRender ? appListRender({ props: appList, dom: defaultDomContent.value }) : defaultDomContent.value
  })
  return () => {
    const { appList = [] } = props
    if (!appList.length)
      return null
    return (
      <div ref={elRef} class={classNames(baseClassName.value, hashId?.value)} onClick={e => e.stopPropagation()}>
        <Popover
          placement="bottomRight"
          trigger={['click']}
          open={open.value}
          classes={{
            root: classNames(`${baseClassName.value}-popover`, hashId?.value),
          }}
          onOpenChange={(visible: boolean) => setOpen(visible)}
          content={popoverContent.value as AntVueNode}
          getPopupContainer={() => elRef.value || document.body}
        >
          <div ref={popoverRef} onClick={e => e.stopPropagation()} class={classNames(`${baseClassName.value}-wrapper`)}>
            <span
              class={classNames(`${baseClassName.value}-icon`, hashId?.value, {
                [`${baseClassName.value}-icon-active`]: open.value,
              })}
            >
              <AppsLogo />
            </span>
          </div>
        </Popover>
      </div>
    )
  }
}, {
  name: 'AppsLogoComponents',
  inheritAttrs: false,
})

export { defaultRenderLogo }

export default AppsLogoComponents
