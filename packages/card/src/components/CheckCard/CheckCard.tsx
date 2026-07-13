import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { BorderBeamProps, CardMetaProps, CardProps } from 'antdv-next'
import type { VueNode as AntVueNode } from 'antdv-next/dist/_util/type'
import type { App, Plugin, VNode } from 'vue'
import type { ProCardProps } from '../../ProCard'
import {
  isImg,
  isNil,
  isUrl,
  transformVueNodeType,
  useEffect,
  useMountMergeState,
} from '@antdv-next1/pro-utils'
import { classNames, omit } from '@v-c/util'
import { Avatar, CardMeta } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent, reactive, ref, toRef } from 'vue'
import ProCard from '../../ProCard'
import ProCheckCardGroup, { useCheckCardGroupContextInject } from './Group'
import useStyle from './style'

export type ProCheckCardProps = CardMetaProps & Omit<CardProps, 'title'
  | 'onTabChange'
  | 'activeTabKey'
  | 'defaultActiveTabKey'
  | 'headStyle'
  | 'bodyStyle'
  | 'tabBarExtraContent'
  | 'tabList'
  | 'type'
  | 'size'> & {
    /** 边框流光 */
    borderBeam?: BorderBeamProps | boolean
    size?: CardProps['size'] | 'large'
    checked?: boolean
    value?: string | number | boolean
    'onUpdate:value'?: (value: boolean) => void
    disabled?: boolean
    'onUpdate:checked'?: (checked: boolean) => void
    onChange?: (checked: boolean) => void
    defaultChecked?: boolean
    onClick?: (e: MouseEvent) => void
    collapsible?: ProCardProps['collapsible']
  }

type CheckCardProps = Omit<
  CardProps,
  | 'onTabChange'
  | 'activeTabKey'
  | 'defaultActiveTabKey'
  | 'bodyStyle'
  | 'headStyle'
  | 'tabBarExtraContent'
  | 'tabList'
  | 'type'
  | 'size'
> & {
  size?: 'large' | 'default' | 'small'
  checked?: boolean
  disabled?: boolean
  [key: string]: any
}

function getSizeCls(size?: string) {
  if (size === 'large')
    return 'lg'
  if (size === 'small')
    return 'sm'
  return ''
}
const _ProCheckCard = defineComponent<ProCheckCardProps, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
  avatar?: () => VueNode[]
  title?: () => VueNode[]
  extra?: () => VueNode[]
  cover?: () => VueNode[]
  description?: () => VNode[]
}>>((props, { slots, attrs }) => {
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-checkcard`)
  const multiple = ref<boolean | undefined>(false)
  const checkCardGroupProvide = useCheckCardGroupContextInject()
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const checkCardProps = reactive({} as CheckCardProps)
  const [stateChecked, setStateChecked] = useMountMergeState<boolean>(
    props.defaultChecked || false,
    {
      value: toRef(() => props.checked!),
      defaultValue: props.defaultChecked,
      onChange: (checked) => {
        props['onUpdate:checked']?.(checked)
        props.onChange?.(checked)
      },
    },
  )
  useEffect(() => {
    checkCardProps.checked = stateChecked.value
    if (checkCardGroupProvide.value) {
      // 受组控制模式
      checkCardProps.disabled = props.disabled || checkCardGroupProvide.value.disabled
      checkCardProps.loading = props.loading || checkCardGroupProvide.value.loading
      checkCardProps.bordered = props.bordered || checkCardGroupProvide.value.bordered
      multiple.value = checkCardGroupProvide.value.multiple
      const isChecked = checkCardGroupProvide.value.multiple
        ? checkCardGroupProvide.value.value?.includes(props.value)
        : checkCardGroupProvide.value.value === props.value
        // loading时check为false
      checkCardProps.checked = checkCardProps.loading ? false : isChecked
      checkCardProps.size = props.size || checkCardGroupProvide.value.size
    }
  }, [checkCardGroupProvide, stateChecked])

  useEffect(() => {
    checkCardGroupProvide.value?.registerValue?.(props.value)
    return () => checkCardGroupProvide.value?.cancelValue?.(props.value)
  }, [() => props.value])

  const handleClick = (e: MouseEvent) => {
    props?.onClick?.(e)
    const newChecked = !stateChecked.value
    if (
      checkCardGroupProvide.value
      && checkCardGroupProvide.value.value === props.value
      && !checkCardGroupProvide.value.multiple
    ) {
      return
    }
    checkCardGroupProvide.value?.toggleOption?.({ value: props.value! })
    setStateChecked?.(newChecked)
  }

  return () => {
    const {
      title = slots.title,
      avatar = slots.avatar,
      prefixCls,
      onChange,
      value,
      disabled: propsDisabled,
      defaultChecked,
      checked,
      'onUpdate:checked': onUpdateChecked,
      'onUpdate:value': onUpdateValue,
      description = slots.description,
      borderBeam,
      size: propsSize,
      onClick,
      ...rest
    } = props
    Object.keys(rest).forEach((key) => {
      checkCardProps[key] = rest[key as keyof typeof rest]
    })
    const {
      disabled = propsDisabled || false,
      loading: cardLoading,
      bordered = true,
      size,
      checked: propsChecked = checked,
      cover = slots.cover,
      extra = slots.extra,
      ...restCardProps
    } = checkCardProps
    const sizeCls = getSizeCls(size || propsSize)
    const titleDom = transformVueNodeType(title)
    const descriptionDom = transformVueNodeType(description)
    const coverDom = transformVueNodeType(cover)
    const extraDom = transformVueNodeType(extra)
    const avatarDom = (typeof avatar === 'string' && isUrl(avatar) && isImg(avatar)) ? (<Avatar size={48} shape="square" src={avatar as string} />) : transformVueNodeType(avatar)
    const headerDom = isNil(titleDom ?? extraDom) ? null : (
      <>
        { titleDom && (
          <div class={classNames(`${baseClassName.value}-meta-header`, hashId.value, cssVarCls.value)}>
            <div class={classNames(`${baseClassName.value}-meta-title`, `${baseClassName.value}-meta-title-with-ellipsis`, hashId.value, cssVarCls.value)}>
              {titleDom}
            </div>
          </div>
        ) }
        {extraDom && (
          <div class={classNames(`${baseClassName.value}-meta-title-extra`, hashId.value, cssVarCls.value)}>
            {extraDom}
          </div>
        ) }
      </>
    )
    return (
      <ProCard
        {...omit(attrs, ['style', 'class'])}
        style={attrs.style}
        class={classNames(baseClassName.value, attrs.class, hashId.value, cssVarCls.value, {
          [`${baseClassName.value}-checked`]: propsChecked,
          [`${baseClassName.value}-multiple`]: checkCardProps.multiple,
          [`${baseClassName.value}-disabled`]: disabled,
          [`${baseClassName.value}-${sizeCls}`]: sizeCls,
        })}
        borderBeam={!propsChecked && borderBeam ? borderBeam : undefined}
        disabled={disabled}
        {...restCardProps}
        loading={cardLoading}
        onClick={(e) => {
          if (!cardLoading && !disabled) {
            handleClick(e)
          }
        }}
        cover={typeof cover === 'string' ? <img src={cover} alt="checkcard" />
          : coverDom as AntVueNode}
        v-slots={{
          ...slots,
          default: () => (
            <>
              {(headerDom || avatarDom || descriptionDom || cardLoading) && (
                <CardMeta
                  title={headerDom}
                  description={descriptionDom as AntVueNode}
                  class={classNames(`${baseClassName.value}-meta`, hashId.value, cssVarCls.value, {
                    [`${baseClassName.value}-meta-avatar-header`]:
                          avatarDom && headerDom && !descriptionDom,
                    [`${baseClassName.value}-meta-extra-header`]: !isNil(
                      extraDom,
                    ),
                  })}
                  avatar={avatarDom as AntVueNode}
                />
              )}
              {slots.default?.() && (
                <div class={classNames(`${baseClassName.value}-body`, hashId.value, cssVarCls.value)}>
                  {slots.default?.()}
                </div>
              ) }
            </>
          ),
        }}
      />
    )
  }
}, {
  name: 'ProCheckCard',
  inheritAttrs: false,
})

const ProCheckCard = _ProCheckCard as typeof _ProCheckCard & {
  Group?: typeof ProCheckCardGroup
} & Plugin

ProCheckCard.Group = ProCheckCardGroup

ProCheckCard.install = (app: App) => {
  app.component(ProCheckCard.name, ProCheckCard)
  app.component(ProCheckCardGroup.name, ProCheckCardGroup)
}

export default ProCheckCard
