import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ColProps } from 'antdv-next'
import type { Gutter } from 'antdv-next/dist/grid/row'
import type { CSSProperties, VNode } from 'vue'
import type { ProCardProps } from './ProCard'
import type { Breakpoint } from './typing'
import {
  childrenToArray,
  isSpecialNode,
  LabelIconTip,
} from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { BorderBeam, Card, Col, Collapse, Row, useBreakpoint } from 'antdv-next'
import { responsiveArray } from 'antdv-next/dist/_util/responsiveObserver'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { cloneVNode, computed, defineComponent, isVNode, shallowRef } from 'vue'
import useStyle from './style'

const breakpointKeyList: Array<keyof ColProps> = [
  'span',
  'flex',
  'offset',
  'order',
  'pull',
  'push',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
]

const InternalProCard = defineComponent<ProCardProps, {}, string, CustomSlotsType<{
  default?: () => VNode[]
  extra?: () => VueNode
  title?: () => VueNode
}>>(
  (props = { defaultCollapsed: false, hoverable: false, ghost: false, headerBordered: false, boxShadow: false, bordered: false, gutter: 0, wrap: false }, { slots, expose, attrs }) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-card`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const screens = useBreakpoint()
    const collapsed = shallowRef<boolean>(props.defaultCollapsed || false)
    // const [collapsed, setCollapsed] = useMergedState<boolean | undefined>(false, {
    //   value: toRef(() => props.collapsed),
    //   defaultValue: props.defaultCollapsed,
    //   onChange: (_collapsed) => {
    //     props?.['onUpdate:collapsed']?.(_collapsed!)
    //     props.onCollapse?.(_collapsed!)
    //   },
    // })

    /**
     * 根据响应式获取 gutter, 参考 antd 实现
     * @param gut
     */
    const getNormalizedGutter = (gut: Gutter | Gutter[]) => {
      const results: [number, number] = [0, 0]
      const normalizedGutter = Array.isArray(gut) ? gut : [gut, 0]
      normalizedGutter.forEach((g, index) => {
        if (typeof g === 'object') {
          for (let i = 0; i < responsiveArray.length; i += 1) {
            const breakpoint: Breakpoint | undefined = responsiveArray[i]
            if (screens.value?.[breakpoint!] && g[breakpoint!] !== undefined) {
              results[index] = g[breakpoint!] as number
              break
            }
          }
        }
        else {
          results[index] = g || 0
        }
      })
      return results
    }

    /**
     * 根据条件返回 style 负责返回空对象
     *
     * @param withStyle 是否符合条件
     * @param appendStyle 如果符合条件要返回的 style.ts 属性
     */
    const getStyle = (withStyle: boolean, appendStyle: CSSProperties) => {
      return withStyle ? appendStyle : {}
    }

    // 判断是否套了卡片，如果套了的话将自身卡片内部内容的 padding 设置为0
    let containProCard = false

    expose({})
    return () => {
      const {
        ghost = false,
        direction,
        boxShadow,
        colSpan,
        split,
        align,
        borderBeam,
        colStyle,
        headerBordered = false,
        collapsible = false,
        collapsibleIconRender,
        // collapsed: controlCollapsed,
        defaultCollapsed = false,
        onChecked,
        checked,
        onCollapse,
        justify,
        colLg,
        colFlex,
        colMd,
        colXl,
        colXxl,
        colSm,
        colPush,
        colPull,
        colOrder,
        colOffset,
        colXs,
        disabled,
        bordered,
        gutter = 0,
        onClick,
        title,
        type,
        tooltip,
        layout,
        wrap,
        // 'onUpdate:collapsed': updateCollapsed,
        ...rest
      } = props
      const hasBorderBeamDom = rest.variant !== 'borderless' && borderBeam && !disabled
      const [horizontalGutter, verticalGutter] = getNormalizedGutter(gutter)
      const { default: children, title: slotTitle, ...restSlots } = slots
      const childrenArray = childrenToArray(children?.())
      const childrenDom = childrenArray.map((element, index) => {
        if (isVNode(element) && !isSpecialNode(element) && element.props && (element.type as { isProCard: boolean }).isProCard) {
          containProCard = true
          if (direction === 'column' || split === 'horizontal') {
            const colPropsClass = Object.entries(element.props).reduce(
              (prev, [key, value]) => {
                const keys = key.split('-')

                // const colSpanStyle: CSSProperties = isPercentOrPxWidth
                //   ? { width: span as string, flexShrink: 0 }
                //   : {}
                // 当 colSpan 为 30% 或 300px 时
                // const isPercentOrPxWidth
                //   = typeof value === 'string' && /\d%|\dpx/i.test(value)
                if (breakpointKeyList.includes(keys[keys.length - 1] as keyof ColProps)) {
                  if (['span', 'flex'].includes(keys[keys.length - 1] as string)) {
                    prev[`${baseClassName.value}-${keys[keys.length - 2]}-${value}`] = true
                  }
                  else {
                    prev[`${baseClassName.value}-${key}-${value}`] = true
                  }
                }
                return prev
              },
              {} as Record<string, any>,
            )
            return (
              <div
                style={{
                  ...getStyle(horizontalGutter! > 0, {
                    paddingInlineEnd: `${horizontalGutter / 2}px`,
                    paddingInlineStart: `${horizontalGutter / 2}px`,
                  }),
                  ...getStyle(verticalGutter! > 0, {
                    paddingBlockStart: `${verticalGutter / 2}px`,
                    paddingBlockEnd: `${verticalGutter / 2}px`,
                  }),
                  ...colStyle,
                }}
                key={index}
                class={classNames([`${baseClassName.value}-col`], colPropsClass, hashId.value, cssVarCls.value, {
                  [`${baseClassName.value}-split-horizontal`]: split === 'horizontal' && index !== childrenArray.length - 1,
                  [`${baseClassName.value}-split-vertical`]: split === 'vertical' && index !== childrenArray.length - 1,
                })}
              >
                {cloneVNode(element, {
                  size: rest.size,
                  type,
                  ...element.props,
                })}
              </div>
            )
          }
          const colProps = breakpointKeyList.reduce((prev, key) => {
            if (element.props?.[`col-${key}`] !== undefined) {
              const value = element.props?.[`col-${key}`]
              prev[key] = !Number.isNaN(Number(value)) ? Number(value) : value
            }
            return prev
          }, {} as ColProps)
          return (
            <Col
              {...(Object.keys(colProps).length ? colProps : wrap ? {} : { flex: 1 })}
              style={{
                ...colStyle,
              }}
              class={classNames({
                [`${baseClassName.value}-split-vertical`]: split === 'vertical' && index !== childrenArray.length - 1,
              }, hashId.value, cssVarCls.value)}
              key={index}
            >
              {cloneVNode(element, {
                size: rest.size,
                type,

                ...element.props,
              })}
            </Col>
          )
        }
        containProCard = false
        return element
      })
      const collapseCardDom = (
        <Collapse
          bordered={rest.variant !== 'borderless'}
          size={rest.size === 'small' ? 'small' : 'large'}
          ghost={ghost}
          {...(collapsibleIconRender ? {
            expandIcon: panelProps => collapsibleIconRender({ collapsed: panelProps.isActive || false }),
          } : {})}
          collapsible={typeof collapsible !== 'boolean' && collapsible !== 'header' ? collapsible : undefined}
          defaultActiveKey={defaultCollapsed ? undefined : ['collapseCard']}
          class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value, {
            [`${baseClassName.value}-headerBordered`]: headerBordered,
            [`${baseClassName.value}-type-inner`]: type === 'inner',
            [`${baseClassName.value}-ghost`]: ghost,
            [`${baseClassName.value}-split`]: split,
            [`${baseClassName.value}-split`]: collapsible,
            [`${baseClassName.value}-disabled`]: disabled,
            [`${baseClassName.value}-box-shadow`]: boxShadow,
            [`${baseClassName.value}-contain-card`]: containProCard,
          })}
          style={attrs.style}
          classes={{
            body: classNames({
              [`${baseClassName.value}-body-direction-column`]: direction === 'column',
              [`${baseClassName.value}-body-layout-center`]: layout === 'center',
            }, hashId.value, cssVarCls.value),
            ...rest.classes,
          }}
          styles={{
            header: ((type !== 'inner' && rest.size !== 'small') ? { paddingBlockEnd: 0 } : {}),
            body: {
              ...(containProCard && split && rest.size !== 'small' ? {
                padding: 0,
              } : ((split !== undefined && containProCard && rest.size !== 'small' && type !== 'inner') || (!headerBordered && (slotTitle?.() || props.title) && rest.size !== 'small' && split !== undefined && type !== 'inner') ? {
                paddingBlockStart: 0,
              } : {
              })),
            },
            ...rest.styles,
          }}
          activeKey={collapsed.value ? undefined : ['collapseCard']}
          items={[
            {
              key: 'collapseCard',
              label: <LabelIconTip label={slotTitle?.() || props.title} tooltip={props.tooltip} />,
              content: (
                containProCard ? direction !== 'column' && split !== 'horizontal' ? (
                  <Row gutter={gutter}>
                    {childrenDom}
                  </Row>
                ) : (
                  <div
                    class={classNames(`${baseClassName.value}-col`, hashId.value, cssVarCls.value, {
                      // [`${baseClassName.value}-direction-column`]: layout === 'center' && direction === 'column',
                    })}
                    style={{
                      ...getStyle(horizontalGutter! > 0, {
                        marginInlineEnd: `-${horizontalGutter / 2}px`,
                        marginInlineStart: `-${horizontalGutter / 2}px`,
                      }),
                      ...getStyle(verticalGutter! > 0, {
                        marginBlockStart: `-${verticalGutter / 2}px`,
                        marginBlockEnd: `-${verticalGutter / 2}px`,
                      }),
                    }}
                  >
                    {childrenDom}
                  </div>
                ) : childrenDom
              ),
              extra: rest.extra,
            },
          ]}
        />
      )
      const cardDom = (
        <Card
          {...attrs}
          {...rest}
          type={containProCard ? undefined : type}
          class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value, {
            [`${baseClassName.value}-ghost`]: ghost,
            [`${baseClassName.value}-split`]: split,
            [`${baseClassName.value}-disabled`]: disabled,
            [`${baseClassName.value}-box-shadow`]: boxShadow,
            [`${baseClassName.value}-contain-card`]: containProCard,
          })}
          {...({ onClick: (e: MouseEvent) => onClick?.(e) })}
          style={attrs.style}
          classes={{
            body: classNames(`${baseClassName.value}-body`, {
              [`${baseClassName.value}-body-direction-column`]: direction === 'column',
              [`${baseClassName.value}-body-layout-center`]: layout === 'center',
            }, hashId.value, cssVarCls.value),
            ...rest.classes,
          }}
          {...(title && !tooltip && !slotTitle ? { title } : {})}
          styles={{
            header: headerBordered || type ? { } : { borderBlockEnd: 'none', ...((type !== 'inner' && split === 'horizontal') || (split === 'vertical') ? { paddingBlockEnd: 0 } : {}) },
            body: {
              ...(containProCard && split && rest.size !== 'small' ? {
                padding: 0,
              } : ((!split && containProCard && rest.size !== 'small' && type !== 'inner') || (!headerBordered && (slotTitle?.() || props.title) && type !== 'inner') ? {
                paddingBlockStart: 0,
              } : {
              })),
              ...(!containProCard && layout === 'center' ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}),
            },
            ...rest.styles,
          }}
          v-slots={{
            ...restSlots,
            ...(slotTitle || tooltip ? { title: () => <LabelIconTip label={slotTitle?.() || props.title} tooltip={props.tooltip} /> } : {}),
          }}
        >
          {containProCard ? direction !== 'column' && split !== 'horizontal' ? (
            <Row gutter={gutter}>
              {childrenDom}
            </Row>
          ) : (
            <div
              class={classNames(`${baseClassName.value}-row`, hashId.value, cssVarCls.value)}
            >
              {childrenDom}
            </div>
          ) : childrenDom }
        </Card>
      )
      return (
        <>
          {typeof collapsible !== 'boolean' ? (hasBorderBeamDom ? (<BorderBeam {...(typeof borderBeam === 'boolean' ? {} : borderBeam)}>{collapseCardDom}</BorderBeam>) : collapseCardDom) : (hasBorderBeamDom ? (
            <BorderBeam {...(typeof borderBeam === 'boolean' ? {} : borderBeam)}>
              {cardDom}
            </BorderBeam>
          ) : cardDom)}
        </>
      )
    }
  },
  {
    name: 'InternalProCard',
    inheritAttrs: false,
  },
)

export default InternalProCard
