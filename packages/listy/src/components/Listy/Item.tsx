import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SemanticClassNamesType, SemanticStylesType } from 'antdv-next/dist/_util/hooks/index'
import type { CSSProperties, SetupContext } from 'vue'
import { clsx } from '@v-c/util'
import { Col } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { useMergeSemantic, useToArr, useToProps } from 'antdv-next/dist/_util/hooks/index'
import { toPropsRefs } from 'antdv-next/dist/_util/tools'
import { computed, defineComponent } from 'vue'
import { useListyContext } from './context'
import ItemMeta from './ItemMeta'

export interface ListyItemSemanticClassNames {
  actions?: string
  extra?: string
}

export interface ListyItemSemanticStyles {
  actions?: CSSProperties
  extra?: CSSProperties
}

export interface ListyItemProps {
  prefixCls?: string
  actions?: VueNode[]
  extra?: VueNode
  classes?: ListyItemSemanticClassNames
  styles?: ListyItemSemanticStyles
  colStyle?: CSSProperties
  onMouseenter?: (event: MouseEvent) => void
  onMouseleave?: (event: MouseEvent) => void
}

export type ListyItemClassNamesType = SemanticClassNamesType<ListyItemProps, ListyItemSemanticClassNames>

export type ListyItemStylesType = SemanticStylesType<ListyItemProps, ListyItemSemanticStyles>

const _Item = defineComponent<ListyItemProps>((props, {
  slots,
  attrs,
  expose,
}: SetupContext<
  {},
  CustomSlotsType<{
    default?: () => VueNode
  }>
>) => {
  const { grid, itemLayout } = useListyContext()
  const config = useConfig()
  const prefixCls = computed(() => config.value.getPrefixCls('listy', props.prefixCls))

  const {
    styles,
    classes,
  } = toPropsRefs(props, 'classes', 'styles')

  // =========== Merged Props for Semantic ==========
  const mergedProps = computed(() => {
    return {
      ...props,
    } as ListyItemProps
  })

  const [mergedClassNames, mergedStyles] = useMergeSemantic<
    ListyItemClassNamesType,
    ListyItemStylesType,
    ListyItemProps
  >(
    useToArr(computed(() => (config.value as unknown as { listy: { item: ListyItemProps } }).listy?.item.classes!), classes),
    useToArr(computed(() => (config.value as unknown as { listy: { item: ListyItemProps } }).listy?.item.styles!), styles),
    useToProps(mergedProps),
  )

  expose({})
  return () => {
    const {
      prefixCls: customizePrefixCls,
      actions,
      extra,
      styles,
      classes,
      colStyle,
      ...rest
    } = props

    const actionsContent = actions && actions.length > 0 && (
      <div
        class={clsx(`${prefixCls.value}-item-actions`, mergedClassNames.value.actions)}
        key="actions"
        style={mergedStyles.value.actions}
      >
        {actions.map((action: VueNode, i: number) => (
          <div key={`${prefixCls.value}-item-action-${i}`}>
            {action}
            {i !== actions.length - 1 && <em class={`${prefixCls.value}-item-action-split`} />}
          </div>
        ))}
      </div>
    )
    const itemChildren = (
      <div
        {...rest}
        class={clsx(`${prefixCls.value}-item`,
          // contextClassName?.value,
          attrs.class)}
        style={[
          // mergedStyles.value.root,
          attrs.style,
        ]}
      >
        {itemLayout?.value === 'vertical' && extra ? (<>asd</>) : (
          <>
            {slots.default?.()}
            {actionsContent}
            {extra}
          </>
        )}
      </div>
    )
    if (grid?.value) {
      const { column } = grid.value
      return (
        <Col span={24 / (column || 1)} style={colStyle}>
          {itemChildren}
        </Col>
      )
    }
    return itemChildren
  }
}, {
  name: 'AListyItem',
  inheritAttrs: false,
})

const Item = _Item as typeof _Item & {
  Meta: typeof ItemMeta
}
Item.Meta = ItemMeta

export default Item
