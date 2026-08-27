import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import { useProConfig } from '@antdv-next1/pro-provider'
import { classNames } from '@v-c/util'
import { Flex, TypographyText } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'

export const listyItemMetaProps = () => ({})

export interface ProListyItemMetaProps {
  title?: VueNode
  description?: VueNode
  avatar?: VueNode
  prefixCls?: string
}

const ProListyItemMeta = defineComponent<ProListyItemMetaProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props) => {
    const config = useConfig()
    const proConfig = useProConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-listy-item-meta`)
    return () => {
      const { avatar, title, description } = props
      return (
        <Flex gap="small" align="flex-start" class={classNames(`${baseClassName.value}`, proConfig.value.hashId)}>
          {avatar && <div class={classNames(`${baseClassName.value}-avatar`, proConfig.value.hashId)}>{avatar}</div>}
          <Flex vertical flex="auto" class={classNames(`${baseClassName.value}-content`, proConfig.value.hashId)} style="min-width: 0px">
            {title && <TypographyText strong class={classNames(`${baseClassName.value}-title`, proConfig.value.hashId)}>{title}</TypographyText>}
            { description && <TypographyText type="secondary" class={classNames(`${baseClassName.value}-description`, proConfig.value.hashId)}>{description}</TypographyText> }

          </Flex>
        </Flex>
      )
    }
  },
  {
    name: 'ProListyItemMeta',
    inheritAttrs: false,
  },
)

export default ProListyItemMeta
