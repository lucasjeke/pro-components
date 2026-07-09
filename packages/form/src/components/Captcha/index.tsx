import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { ButtonProps, FormInstance, InputProps, InputRef } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { ProFormFieldItemProps } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { useEffect, useState } from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { Button, Form, Input } from 'antdv-next'
import { computed, defineComponent, shallowRef } from 'vue'
import { createField } from '../../BaseForm/createField'

export interface CaptFieldRef {
  /** 原生 DOM 元素引用 */
  nativeElement: HTMLDivElement
  /** 聚焦方法 */
  focus: () => void
  /** 开始计时 */
  startTiming: () => void
  /** 结束计时 */
  endTiming: () => void
}

export type ProFormCaptchaProps = ProFormFieldItemProps<InputProps> & {
  /** @name countDown 倒计时的秒数 */
  countDown?: number
  /** 手机号的 name */
  phoneName?: NamePath<string | number | boolean>

  /** @name onGetCaptcha 获取验证码的方法 */
  onGetCaptcha?: (mobile: string) => Promise<void>

  /** @name onTiming 计时回调 */
  onTiming?: (count: number) => void

  /** @name captchaTextRender 渲染按钮的文字 */
  captchaTextRender?: (timing: boolean, count: number) => VueNode

  /** @name captchaProps 获取按钮验证码的props */
  captchaProps?: ButtonProps
  onChange?: (...args: any[]) => void
}

export const BaseProFormCaptcha = defineComponent<ProFormCaptchaProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { attrs, expose }) => {
    const intl = useIntl()
    const form = (
      Form as unknown as { useFormInstance: () => FormInstance }
    ).useFormInstance()
    const [count, setCount] = useState<number>(props.countDown || 60)
    const [timing, setTiming] = useState(false)
    const [loading, setLoading] = useState<boolean>()
    const containerRef = shallowRef<HTMLDivElement | null>(null)
    const inputRef = shallowRef<InputRef | null>(null)
    const onGetCaptcha = async (mobile?: string) => {
      try {
        setLoading(true)
        await props.onGetCaptcha?.(mobile!)
        setLoading(false)
        setTiming(true)
      }
      catch (error) {
        setTiming(false)
        setLoading(false)
        console.log(error)
      }
    }

    useEffect(() => {
      let interval: number = 0
      const { countDown } = props
      if (timing.value) {
        interval = window.setInterval(() => {
          if (count.value <= 1) {
            setTiming(false)
            clearInterval(interval)
            setCount(countDown || 60)
          }
          setCount(count.value - 1)
        }, 1000)
      }
      return () => clearInterval(interval)
    }, [timing, count])

    useEffect(() => {
      if (props.onTiming) {
        props.onTiming(count.value)
      }
    }, [count, () => props.onTiming])

    expose({
      nativeElement: computed(() => containerRef.value),
      focus: () => inputRef.value?.focus(),
      startTiming: () => setTiming(true),
      endTiming: () => setTiming(false),
    })
    return () => {
      const defaultCaptchaTextRender = (paramsTiming: boolean, paramsCount: number) => {
        if (paramsTiming) {
          return `${paramsCount} ${intl.value.getMessage({ id: 'form.captcha.resendAfter', defaultMessage: '秒后重新获取' })}`
        }
        return intl.value.getMessage({ id: 'form.captcha.getCaptcha', defaultMessage: '获取验证码' })
      }
      const {
        phoneName,
        fieldProps,
        proFieldProps,
        captchaTextRender = defaultCaptchaTextRender,
        captchaProps,
        ...restProps
      } = props
      return (
        <div
          ref={containerRef}
          style={{
            ...fieldProps?.style,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Input
            ref={inputRef}
            {...attrs}
            {...fieldProps}
            placeholder={fieldProps?.placeholder || restProps.placeholder as string}
            style={{
              flex: 1,
              transition: 'width .3s',
              marginRight: unit(8),
              ...fieldProps?.style,
            }}
          />
          <Button
            {...captchaProps}
            style={{
              display: 'block',
            }}
            disabled={timing.value}
            loading={loading.value}
            onClick={async () => {
              try {
                if (phoneName) {
                  await form?.validateFields([phoneName].flat(1) as string[])
                  const mobile = form?.getFieldValue(
                    [phoneName].flat(1) as string[],
                  )
                  await onGetCaptcha(mobile)
                }
                else {
                  await onGetCaptcha()
                }
              }
              catch (error) {
                console.log('error', error)
              }
            }}
          >
            {captchaTextRender(timing.value, count.value)}
          </Button>
        </div>
      )
    }
  },
  {
    name: 'BaseProFormCaptcha',
    inheritAttrs: false,
  },
)

const ProFormCaptcha = createField<ProFormCaptchaProps>(BaseProFormCaptcha)
ProFormCaptcha.inheritAttrs = false
ProFormCaptcha.displayName = 'ProFormCaptcha'
export default ProFormCaptcha
