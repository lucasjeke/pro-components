import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ColProps } from 'antdv-next'
import type { Gutter } from 'antdv-next/dist/grid/row'
import type { CSSProperties, VNode } from 'vue'
import type { ProCardEmits, ProCardProps, ProCardSlots } from './ProCard'
import type { Breakpoint } from './typing'
import {
  childrenToArray,
  isSpecialNode,
  LabelIconTip,
} from '@antdv-next1/pro-utils'
import { classNames } from '@v-c/util'
import { BorderBeam, Card, Col, Collapse, Row, Tabs, useBreakpoint } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { responsiveArray } from 'antdv-next/dist/_util/responsiveObserver'
import { cloneVNode, computed, defineComponent, isVNode, shallowRef } from 'vue'
import CardLoading from './components/Loading'
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

const InternalProCard = defineComponent<ProCardProps, ProCardEmits, string, CustomSlotsType<ProCardSlots>>(
  (props, { slots, expose, attrs, emit }) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-card`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const screens = useBreakpoint()
    const innerCollapsed = shallowRef<boolean>(props.defaultCollapsed || false)
    const mergedCollapsed = computed(() => props.collapsed ?? innerCollapsed.value)

    const updateCollapsed = (value: boolean) => {
      if (props.collapsed === undefined)
        innerCollapsed.value = value
      emit('collapse', value)
      emit('update:collapsed', value)
    }
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
        defaultCollapsed = false,
        checked,
        collapsed: _collapsed,
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
        gutter = 0,
        subTitle,
        title,
        type,
        tooltip,
        layout,
        loading,
        wrap,
        ...rest
      } = props
      const isCollapsible = collapsible !== false
      const isLoading = loading === true || isVNode(loading)
      const hasBorderBeamDom = rest.variant !== 'borderless' && borderBeam && !disabled
      const useTabsContentLayout = !!rest.tabList?.length
      const [horizontalGutter, verticalGutter] = getNormalizedGutter(gutter)
      const hasGutter = horizontalGutter !== 0 || verticalGutter !== 0
      const {
        actions: slotActions,
        cover: slotCover,
        default: children,
        subTitle: slotSubTitle,
        title: slotTitle,
        ...restSlots
      } = slots
      const titleNode = slotTitle?.() ?? title
      const subTitleNode = slotSubTitle?.() ?? subTitle
      const childrenArray = childrenToArray(children?.() as VNode[])
      let containProCard = false

      const getElementProp = (element: VNode, camelName: string, kebabName: string) =>
        element.props?.[camelName] ?? element.props?.[kebabName]

      const resolveColSpan = (value: ProCardProps['colSpan']) => {
        if (!value || typeof value !== 'object')
          return value

        for (let i = 0; i < responsiveArray.length; i += 1) {
          const breakpoint = responsiveArray[i]
          if (screens.value?.[breakpoint!] && value[breakpoint!] !== undefined)
            return value[breakpoint!]
        }
        return undefined
      }

      const normalizeColValue = (value: any) =>
        typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value

      const childrenDom = childrenArray.map((element, index) => {
        if (isVNode(element) && !isSpecialNode(element) && (element.type as { isProCard?: boolean })?.isProCard) {
          containProCard = true
          const colSpanValue = resolveColSpan(getElementProp(element, 'colSpan', 'col-span'))
          const colProps = breakpointKeyList.reduce((prev, key) => {
            if (key === 'span') {
              if (typeof colSpanValue === 'number' || (typeof colSpanValue === 'string' && /^\d+$/.test(colSpanValue)))
                prev.span = Number(colSpanValue)
              return prev
            }

            const camelName = `col${key.charAt(0).toUpperCase()}${key.slice(1)}`
            const value = getElementProp(element, camelName, `col-${key}`)
            if (value !== undefined)
              prev[key] = normalizeColValue(value)
            return prev
          }, {} as ColProps)
          const fixedWidthStyle = typeof colSpanValue === 'string' && /^\d+(?:\.\d+)?(?:px|%)$/i.test(colSpanValue)
            ? { width: colSpanValue, flexShrink: 0 }
            : {}
          const useManualGutter = direction === 'column' || split === 'horizontal'
          const childColStyle = getElementProp(element, 'colStyle', 'col-style') || {}
          const hasColConfig = Object.keys(colProps).length > 0 || Object.keys(fixedWidthStyle).length > 0
          const useEqualWidth = !hasColConfig && !wrap && direction !== 'column' && split !== 'horizontal'
          const useFullWidth = !hasColConfig && !useEqualWidth

          return (
            <Col
              {...(hasColConfig ? colProps : useEqualWidth ? { flex: '1 1 0' } : {})}
              style={{
                ...getStyle(useManualGutter && horizontalGutter! > 0, {
                  paddingInlineEnd: `${horizontalGutter / 2}px`,
                  paddingInlineStart: `${horizontalGutter / 2}px`,
                }),
                ...getStyle(useManualGutter && verticalGutter! > 0, {
                  paddingBlockStart: `${verticalGutter / 2}px`,
                  paddingBlockEnd: `${verticalGutter / 2}px`,
                }),
                ...getStyle(useEqualWidth, { width: 0, minWidth: 0 }),
                ...getStyle(useFullWidth, { width: '100%' }),
                ...fixedWidthStyle,
                ...childColStyle,
              }}
              class={classNames(`${baseClassName.value}-col`, {
                [`${baseClassName.value}-split-horizontal`]: split === 'horizontal' && index !== childrenArray.length - 1,
                [`${baseClassName.value}-split-vertical`]: split === 'vertical' && index !== childrenArray.length - 1,
              }, hashId.value, cssVarCls.value)}
              key={index}
            >
              {cloneVNode(element, {
                size: rest.size,
                type,
                layout,

                ...element.props,
              })}
            </Col>
          )
        }
        return element
      })
      const resolvedClasses = typeof rest.classes === 'function'
        ? rest.classes({ props } as any)
        : (rest.classes || {})
      const resolvedStyles = typeof rest.styles === 'function'
        ? rest.styles({ props } as any)
        : (rest.styles || {})
      const internalBodyClass = classNames(`${baseClassName.value}-body`, {
        [`${baseClassName.value}-body-direction-column`]: direction === 'column',
        [`${baseClassName.value}-body-layout-center`]: layout === 'center' && !containProCard,
      }, hashId.value, cssVarCls.value)
      const mergedClasses = {
        ...resolvedClasses,
        body: classNames(internalBodyClass, resolvedClasses.body),
      }
      const bodyStyle = {
        ...(useTabsContentLayout ? { padding: 0 } : {}),
        ...(containProCard && !isLoading && split && rest.size !== 'small'
          ? { padding: 0 }
          : ((!split && containProCard && !isLoading && !hasGutter && rest.size !== 'small' && type !== 'inner')
            || (!headerBordered && titleNode && type !== 'inner')
              ? { paddingBlockStart: 0 }
              : {})),
        ...(!containProCard && layout === 'center'
          ? { display: 'flex', justifyContent: 'center', alignItems: 'center' }
          : {}),
        ...resolvedStyles.body,
      }
      const headerStyle = {
        ...(headerBordered || type === 'inner'
          ? {}
          : {
              borderBlockEnd: 'none',
              ...((type !== 'inner' && split === 'horizontal') || split === 'vertical'
                ? { paddingBlockEnd: 0 }
                : {}),
            }),
        ...resolvedStyles.header,
      }
      const mergedStyles = {
        ...resolvedStyles,
        header: headerStyle,
        body: bodyStyle,
      }
      const handleCardClick = (event: MouseEvent) => {
        if (disabled)
          return
        emit('checked', event)
        emit('click', event)
      }
      const loadingContentDom = loading === true
        ? <CardLoading prefixCls={baseClassName.value} />
        : loading
      const defaultContentDom = containProCard ? direction !== 'column' && split !== 'horizontal' ? (
        <Row gutter={gutter} align={align} justify={justify} wrap={wrap}>
          {childrenDom.filter(Boolean)}
        </Row>
      ) : (
        <div
          class={classNames(`${baseClassName.value}-row`, hashId.value, cssVarCls.value)}
        >
          {childrenDom}
        </div>
      ) : childrenDom.filter(Boolean)
      const cardContentDom = isLoading
        ? loadingContentDom
        : defaultContentDom
      const collapseContentDom = isLoading ? loadingContentDom : (
        containProCard ? direction !== 'column' && split !== 'horizontal' ? (
          <Row gutter={gutter} align={align} justify={justify} wrap={wrap}>
            {childrenDom}
          </Row>
        ) : (
          <div
            class={classNames(`${baseClassName.value}-col`, hashId.value, cssVarCls.value)}
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
      )
      const hasNestedCard = containProCard && !isLoading
      const extraNode = slots.extra?.() ?? rest.extra
      const coverNode = slotCover?.() ?? rest.cover
      const actionNodes = childrenToArray(slotActions?.() as VNode[] ?? rest.actions).filter(Boolean)
      const antCardPrefixCls = config.value.getPrefixCls('card')
      const coverDom = coverNode ? (
        <div class={classNames(`${antCardPrefixCls}-cover`, resolvedClasses.cover)} style={resolvedStyles.cover}>
          {coverNode}
        </div>
      ) : null
      const actionsDom = actionNodes.length ? (
        <ul class={classNames(`${antCardPrefixCls}-actions`, resolvedClasses.actions)} style={resolvedStyles.actions}>
          {actionNodes.map((action, index) => (
            <li key={index} style={{ width: `${100 / actionNodes.length}%` }}>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      ) : null

      const collapseCardDom = (
        <Collapse
          {...attrs}
          {...{ id: rest.id }}
          bordered={rest.bordered ?? (rest.variant !== 'borderless')}
          size={rest.size === 'small' ? 'small' : 'large'}
          ghost={ghost}
          {...(collapsibleIconRender ? {
            expandIcon: panelProps => collapsibleIconRender({ collapsed: !panelProps.isActive }),
          } : {})}
          collapsible={disabled ? 'disabled' : (collapsible === 'icon' ? 'icon' : undefined)}
          class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value, {
            [`${baseClassName.value}-headerBordered`]: headerBordered,
            [`${baseClassName.value}-type-inner`]: type === 'inner',
            [`${baseClassName.value}-ghost`]: ghost,
            [`${baseClassName.value}-split`]: split === 'vertical' || split === 'horizontal',
            [`${baseClassName.value}-checked`]: checked,
            [`${baseClassName.value}-disabled`]: disabled,
            [`${baseClassName.value}-box-shadow`]: boxShadow,
            [`${baseClassName.value}-contain-card`]: hasNestedCard,
            [`${baseClassName.value}-loading`]: isLoading,
          })}
          {...{ onClick: handleCardClick }}
          style={attrs.style}
          classes={mergedClasses}
          styles={{
            ...mergedStyles,
            header: {
              ...resolvedStyles.header,
            },
            body: {
              ...(containProCard && split && rest.size !== 'small' ? {
                padding: 0,
              } : ((split !== undefined && containProCard && rest.size !== 'small' && type !== 'inner') || (!headerBordered && titleNode && rest.size !== 'small' && split !== undefined && type !== 'inner') ? {
                paddingBlockStart: 0,
              } : {
              })),
              ...(!containProCard && layout === 'center' ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : {}),
              ...resolvedStyles.body,
            },
          }}
          activeKey={mergedCollapsed.value ? [] : ['collapseCard']}
          onChange={(activeKeys) => {
            const keys = Array.isArray(activeKeys) ? activeKeys : [activeKeys]
            updateCollapsed(!keys.includes('collapseCard'))
          }}
          items={[
            {
              key: 'collapseCard',
              label: <LabelIconTip label={titleNode} subTitle={subTitleNode} tooltip={tooltip} />,
              content: (
                <>
                  {coverDom}
                  {collapseContentDom}
                  {actionsDom}
                </>
              ),
              extra: extraNode,
            },
          ]}
        />
      )
      const tabsContentDom = useTabsContentLayout ? (
        <Tabs
          size={rest.size === 'small' ? 'small' : 'large'}
          {...rest.tabProps}
          activeKey={rest.activeTabKey}
          defaultActiveKey={rest.defaultActiveTabKey}
          tabBarExtraContent={rest.tabBarExtraContent ?? slots.tabBarExtraContent?.()}
          items={rest.tabList?.map(({ tab, ...item }) => ({
            ...item,
            label: tab ?? item.label,
          }))}
          class={classNames(`${baseClassName.value}-tabs`, hashId.value, cssVarCls.value)}
          onUpdate:activeKey={(key) => {
            emit('tabChange', key)
            emit('update:activeTabKey', key)
          }}
          v-slots={{
            contentRender: (args: {
              item: Record<string, any>
              index: number
            }) => (
              <div class={classNames(`${baseClassName.value}-tabs-content`, hashId.value, cssVarCls.value)}>
                {isLoading ? cardContentDom : (slots.tabContentRender?.(args) ?? args.item?.content ?? cardContentDom)}
              </div>
            ),
            labelRender: slots.tabLabelRender,
          }}
        />
      ) : null
      const cardDom = (
        <Card
          {...attrs}
          {...rest}
          tabList={useTabsContentLayout ? undefined : rest.tabList}
          type={hasNestedCard ? undefined : type}
          class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value, {
            [`${baseClassName.value}-ghost`]: ghost,
            [`${baseClassName.value}-split`]: split,
            [`${baseClassName.value}-checked`]: checked,
            [`${baseClassName.value}-disabled`]: disabled,
            [`${baseClassName.value}-box-shadow`]: boxShadow,
            [`${baseClassName.value}-contain-card`]: hasNestedCard,
            [`${baseClassName.value}-tabs-layout`]: useTabsContentLayout,
            [`${baseClassName.value}-loading`]: isLoading,
          })}
          {...{ onClick: handleCardClick }}
          style={attrs.style}
          classes={mergedClasses}
          {...(titleNode && !tooltip && !subTitleNode && !slotTitle ? { title: titleNode as VNode } : {})}
          styles={mergedStyles}
          v-slots={{
            ...restSlots,
            ...(slotActions ? { actions: slotActions } : {}),
            ...(slotCover ? { cover: slotCover } : {}),
            ...(slotTitle || tooltip || subTitleNode ? { title: () => <LabelIconTip label={titleNode} subTitle={subTitleNode} tooltip={tooltip} /> } : {}),
          }}
        >
          {tabsContentDom || cardContentDom}
        </Card>
      )
      return (
        <>
          {isCollapsible ? (hasBorderBeamDom ? (<BorderBeam {...(typeof borderBeam === 'boolean' ? {} : borderBeam)}>{collapseCardDom}</BorderBeam>) : collapseCardDom) : (hasBorderBeamDom ? (
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
