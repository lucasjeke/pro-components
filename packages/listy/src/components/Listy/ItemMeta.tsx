import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'

export interface ListyItemMetaProps {
  prefixCls?: string
  avatar?: VueNode
  description?: VueNode
  title?: VueNode
}

const ItemMeta = defineComponent<ListyItemMetaProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>((props, { expose, attrs }) => {
  const config = useConfig()
  const prefixCls = computed(() => config.value.getPrefixCls('listy', props.prefixCls))
  expose({})
  return () => {
    const {
      prefixCls: customizePrefixCls,
      avatar,
      title,
      description,
      ...others
    } = props
    const content = (
      <div class={`${prefixCls.value}-item-meta-content`}>
        { title && (<h4 class={`${prefixCls.value}-item-meta-title`}>{title}</h4>)}
        {description && <div class={`${prefixCls.value}-item-meta-description`}>{description}</div>}
      </div>
    )
    return (
      <div {...others} class={classNames(`${prefixCls.value}-item-meta`, attrs.class)}>
        {avatar && <div class={`${prefixCls.value}-item-meta-avatar`}>{avatar}</div>}
        {(title || description) && content}
      </div>
    )
  }
}, {
  name: 'ListyItemMeta',
  inheritAttrs: false,
})

export default ItemMeta
