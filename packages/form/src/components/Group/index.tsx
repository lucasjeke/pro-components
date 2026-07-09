import type { ProFormBaseGroupProps, VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { VNode } from 'vue'
import type { ProFormGridConfig } from '../../typing'
import { autoFocusToFirstChild, childrenToArray, isSpecialNode, LabelIconTip, useMountMergeState } from '@antdv-next1/pro-utils'
import { RightOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Space } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, isVNode, toRef } from 'vue'
import { useFieldContextInject } from '../../FieldContext'
import { useGridHelpers } from '../../helpers'
import useStyle from './style'

export type ProFormGroupProps = ProFormBaseGroupProps & ProFormGridConfig

const ProFormGroup = defineComponent<ProFormGroupProps, {}, string, CustomSlotsType<{
  default?: () => VNode[]
}>>(
  (props, { slots }) => {
    const config = useConfig()
    const { groupProps } = useFieldContextInject()
    const mergeGroupProps = computed(() => ({ ...(groupProps || {}), ...props }))
    const prefixCls = computed(() => config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${[prefixCls.value]}-form-group`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const [collapsed, setCollapsed] = useMountMergeState(
      () => mergeGroupProps.value.defaultCollapsed || false,
      {
        value: toRef(() => props.collapsed),
        onChange: collapsed => props.onCollapse?.(collapsed!),
      },
    )
    const { RowWrapper, ColWrapper } = useGridHelpers(props)
    return () => {
      const collapsibleButton = mergeGroupProps.value.collapsible && (
        <RightOutlined
          style={{
            marginInlineEnd: '8px',
          }}
          rotate={!collapsed.value ? 90 : undefined}
        />
      )
      const label = (
        <LabelIconTip
          label={
            collapsibleButton ? (
              <div style={{ cursor: 'pointer' }}>
                {collapsibleButton}
                {mergeGroupProps.value.title}
              </div>
            ) : (
              mergeGroupProps.value.title
            )
          }
          tooltip={mergeGroupProps.value.tooltip}
        />
      )
      const titleDom = mergeGroupProps.value.titleRender
        ? mergeGroupProps.value.titleRender(label, props)
        : label
      const {
        collapsible,
        labelLayout,
        title,
        tooltip,
        align = 'start',
        size = 32,
        titleStyle,
        spaceProps,
        extra,
        autoFocus,
      } = mergeGroupProps.value
      const Wrapper = (dom: VueNode): VueNode => {
        return (
          <Space
            {...spaceProps}
            class={classNames(
              `${baseClassName.value}-container`,
              hashId.value,
              cssVarCls.value,
              spaceProps?.class,
            )}
            size={size}
            align={align}
            orientation={mergeGroupProps.value.orientation}
            style={{
              rowGap: 0,
              ...spaceProps?.style,
            }}
          >
            {dom}
          </Space>
        )
      }
      const hiddenChildrens: VueNode[] = []
      const children: VNode<any, any, { hidden?: boolean }>[] = childrenToArray(slots.default?.(), true)
      const childrenList = children.map((vnode, index) => {
        if (isVNode(vnode) && vnode?.props?.hidden && !isSpecialNode(vnode)) {
          hiddenChildrens.push(vnode)
          return null
        }
        if (isVNode(vnode) && index === 0 && !isSpecialNode(vnode) && autoFocus) {
          return autoFocusToFirstChild([vnode], autoFocus)
        }
        return vnode
      })
      return (
        <ColWrapper>
          <div
            class={classNames(baseClassName.value, hashId.value, cssVarCls.value, {
              [`${baseClassName.value}-twoLine`]: labelLayout === 'twoLine',
            })}
          >
            {hiddenChildrens.length > 0 ? (
              <div
                style={{
                  display: 'none',
                }}
              >
                {hiddenChildrens}
              </div>
            ) : null}
            {(title
              || tooltip
              || extra) && (
              <div
                class={classNames(`${baseClassName.value}-title`, hashId.value, cssVarCls.value)}
                style={titleStyle}
                onClick={() => {
                  setCollapsed(!collapsed.value)
                }}
                onKeydown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setCollapsed(!collapsed.value)
                  }
                }}
              >
                {extra ? (
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {titleDom}
                    <span onClick={e => e.stopPropagation()}>{extra}</span>
                  </div>
                ) : (
                  titleDom
                )}
              </div>
            )}
            {collapsible && collapsed.value ? (
              <div
                style={{
                  display: 'none',
                }}
              >

              </div>
            ) : (
              <RowWrapper wrapper={Wrapper}>
                {childrenList}
              </RowWrapper>
            )}
          </div>
        </ColWrapper>
      )
    }
  },
  {
    name: 'ProFormGroup',
    inheritAttrs: false,
  },
)

export default ProFormGroup
