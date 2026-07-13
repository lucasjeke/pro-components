import type { VNode } from 'vue'
import { classNames } from '@v-c/util'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import useStyle from './style'

export interface GlobalFooterProps {
  links?: | boolean
    | {
      key?: string
      title: VNode
      href: string
      blankTarget?: boolean
    }[]
  copyright?: VNode | boolean
  prefixCls?: string
}

const GlobalFooter = defineComponent<GlobalFooterProps>((props, { attrs }) => {
  const config = useConfig()
  const baseClassName = computed(() => config.value.getPrefixCls(props.prefixCls || 'pro-global-footer'))
  const [hashId, cssVarCls] = useStyle(baseClassName)
  return () => {
    const { links, copyright } = props
    if ((links == null || links === false || (Array.isArray(links) && links.length === 0)) && (copyright == null || copyright === false)) {
      return null
    }
    return (
      <div class={classNames(baseClassName.value, hashId?.value, cssVarCls?.value, attrs.class)} style={attrs.style}>
        {links && Array.isArray(links) && links.length > 0 && (
          <div class={classNames(`${baseClassName.value}-list`, hashId?.value, cssVarCls?.value)}>
            {links?.map(link => (
              <a
                class={classNames(`${baseClassName.value}-list-link`, hashId?.value, cssVarCls?.value)}
                key={link.key}
                title={link.key}
                target={link.blankTarget ? '_blank' : '_self'}
                href={link.href}
                rel="noreferrer"
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
        {copyright && <div class={classNames(`${baseClassName.value}-copyright`, hashId?.value, cssVarCls?.value)}>{copyright}</div>}
      </div>
    )
  }
}, {
  name: 'GlobalFooter',
  inheritAttrs: false,
})
export default GlobalFooter
