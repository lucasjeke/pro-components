import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { AvatarProps } from 'antdv-next'
import type { ActionsRender, SlotsRenderType } from '../../RenderTypings'
import type { SiderMenuProps } from '../SiderMenu/SiderMenu'
import { getSlot, useDebounceFn, useState } from '@antdv-next1/pro-utils'
import ResizeObserver from '@v-c/resize-observer'
import { classNames } from '@v-c/util'
import { Avatar } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, isVNode } from 'vue'
import useStyle from './style/rightContentStyle'

export type AvatarPropsType
  = (AvatarProps & {
    title?: VueNode
    render?: (avatarProps: AvatarProps, defaultDom: VueNode, props: SiderMenuProps) => VueNode
  })
  | false

const ActionsContent = defineComponent<{
  prefixCls?: string
  /** 头像的设置 */
  avatarProps?: AvatarPropsType
  /**
   * @name actionsRender Layout的操作功能列表，不同的 layout 会放到不同的位置
   */
  actionsRender?: ActionsRender | false
}, {}, string, CustomSlotsType<
  Pick<SlotsRenderType, 'actionsRender'> & {
    default: () => VueNode
  }
>>((props, { slots }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || `${config.value.getPrefixCls()}-pro-global-header`)
  const [hashId, cssVarCls] = useStyle(prefixCls)
  const [rightSize, setRightSize] = useState<number | string>('auto')
  const avatarDom = computed(() => {
    const { avatarProps } = props
    if (!avatarProps)
      return null
    const { title, render, ...rest } = avatarProps
    const domList = (
      <>
        {rest?.src || rest?.srcSet || rest.icon ? <Avatar {...rest} size={28} key="avatar" /> : null}
        {title && (
          <span
            key="name"
            style={{
              marginInlineStart: '8px',
            }}
          >
            {title}
          </span>
        )}
      </>
    )
    if (render) {
      return render(avatarProps, <span>{domList}</span>, props)
    }
    return <span>{domList}</span>
  })
  /** 减少一下渲染的次数 */
  const setRightSizeDebounceFn = useDebounceFn(async (width: number) => setRightSize(width), 160)

  return () => {
    const actionsRender = getSlot(slots, props, 'actionsRender')

    const contentRender
      = actionsRender || avatarDom.value
        ? (restParams: any) => {
            const doms = actionsRender && actionsRender({ ...restParams })
            if (!doms && !avatarDom.value)
              return null
            if (!Array.isArray(doms)) {
              let hideHover = false
              // 如果配置了 hideHover 就不展示 hover 效果了
              if (isVNode(doms)) {
                hideHover = !!doms?.props?.['aria-hidden']
              }
              return (
                <div class={classNames(`${prefixCls.value}-actions`, hashId?.value, cssVarCls?.value)}>
                  <div
                    class={classNames(`${prefixCls.value}-actions-item`, hashId?.value, cssVarCls?.value, {
                      [`${prefixCls.value}-actions-hover`]: !hideHover,
                    })}
                  >
                    {doms}
                  </div>
                  {avatarDom.value && <div class={classNames(`${prefixCls.value}-actions-avatar`, hashId?.value, cssVarCls?.value)}>{avatarDom.value}</div>}
                </div>
              )
            }
            return (
              <div class={classNames(`${prefixCls.value}-actions`, hashId?.value, cssVarCls?.value)}>
                {doms.filter(Boolean).map((dom, index) => {
                  let hideHover = false
                  // 如果配置了 hideHover 就不展示 hover 效果了
                  if (isVNode(dom)) {
                    hideHover = !!dom?.props?.['aria-hidden']
                  }
                  return (
                    <div
                      key={index}
                      class={classNames(`${prefixCls.value}-actions-item`, hashId?.value, cssVarCls?.value, {
                        [`${prefixCls.value}-actions-hover`]: !hideHover,
                      })}
                    >
                      {dom}
                    </div>
                  )
                })}
                {avatarDom.value && <div class={classNames(`${prefixCls.value}-actions-avatar`, hashId?.value, cssVarCls?.value)}>{avatarDom.value}</div>}
              </div>
            )
          }
        : undefined
    return (
      <div
        class={classNames(`${prefixCls.value}-right-content`, hashId?.value, cssVarCls?.value)}
        style={{
          minWidth: rightSize.value,
          height: '100%',
        }}
      >
        <ResizeObserver
          onResize={async ({ width }: { width: number }) => {
            await setRightSizeDebounceFn.run(width)
          }}
        >
          {contentRender && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              {contentRender({
                ...props,
                // 测试专用
                rightContentSize: rightSize.value,
              })}
            </div>
          )}
        </ResizeObserver>
      </div>
    )
  }
}, {
  name: 'ActionsContent',
  inheritAttrs: false,
})
export default ActionsContent
