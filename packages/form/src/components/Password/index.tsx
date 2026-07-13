import type { VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { PopoverProps } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { PasswordProps } from 'antdv-next/dist/input/index'
import type { FunctionalComponent } from 'vue'
import type { ProFormFieldItemProps } from '../../typing'
import { FieldPassword } from '@antdv-next1/pro-field'
import { ProConfigProvider } from '@antdv-next1/pro-provider'
import { FormItem, useState } from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { omit } from '@v-c/util'
import { Popover } from 'antdv-next'
import { useFormContext } from 'antdv-next/dist/form/context'
import { getNamePath } from 'antdv-next/dist/form/utils/valueUtil'
import { defineComponent } from 'vue'
import ProField from '../Field'

const valueType = 'text' as const

export type PasswordStatus = 'ok' | 'pass' | 'poor' | undefined

export interface PassWordStrengthProps {
  statusRender?: (value?: string) => VueNode
  popoverProps?: PopoverProps
  strengthText?: VueNode
}

export type ProFormPasswordProps = ProFormFieldItemProps<PasswordProps & PassWordStrengthProps>

const PassWordStrength: FunctionalComponent<
  PassWordStrengthProps & {
    name?: NamePath<string | number | boolean>[]
    open?: boolean
    value?: PasswordProps['value']
    'onUpdate:open': (open: boolean) => void
    onOpenChange?: (open: boolean) => void
  },
  {},
  {
    default?: () => VueNode
  }
> = (props, { slots }) => {
  return (
    <FormItem noStyle>
      <Popover
        {...props.popoverProps}
        getPopupContainer={props.popoverProps?.getPopupContainer
          || ((node) => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement
            }
            return node
          })}
        styles={props.popoverProps?.styles || {
          root: {
            width: unit(240),
          },
        }}
        open={props.popoverProps?.open || props.open}
        onUpdate:open={props.popoverProps?.['onUpdate:open'] || props['onUpdate:open']}
        onOpenChange={props.popoverProps?.onOpenChange || props.onOpenChange}
        placement={props.popoverProps?.placement || 'rightTop'}
        content={
          props.popoverProps?.content || (
            <div
              style={{
                padding: '4px 0',
              }}
            >
              {props.statusRender?.(props.value)}
              {props.strengthText ? (
                <div
                  style={{
                    marginTop: unit(10),
                  }}
                >
                  <span>{props.strengthText}</span>
                </div>
              ) : null}
            </div>
          )
        }
      >
        {slots.default?.()}
      </Popover>
    </FormItem>
  )
}

const ProFormPassword = defineComponent<ProFormPasswordProps, {}, string, CustomSlotsType<{
  default?: () => VueNode
}>>(
  (props, { slots, attrs }) => {
    const [open, setOpen] = useState<boolean>(false)
    const formContext = useFormContext()
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props
      if (fieldProps?.statusRender && rest.name) {
        return (
          <ProConfigProvider
            valueTypeMap={{
              password: {
                render: (text, { placeholder, ...restProps }) => (
                  <FieldPassword
                    {...restProps}
                    placeholder={placeholder as string}
                    text={text}
                  />
                ),
                formItemRender: (text, { placeholder, ...restProps }) => (
                  <FieldPassword
                    {...restProps}
                    placeholder={placeholder as string}
                    text={text}
                  />
                ),
              },
            }}
          >
            <PassWordStrength
              name={getNamePath(rest.name)}
              statusRender={fieldProps?.statusRender}
              popoverProps={fieldProps?.popoverProps}
              strengthText={fieldProps?.strengthText}
              open={open.value}
              value={formContext.value.getFieldValue?.(getNamePath(rest.name))}
              onOpenChange={setOpen}
              onUpdate:open={setOpen}
            >
              <div>
                <ProField
                  {...attrs}
                  {...rest}
                  valueType="password"
                  fieldProps={{
                    ...omit(fieldProps, ['statusRender', 'popoverProps', 'strengthText']),
                    onBlur: (e: FocusEvent) => {
                      fieldProps?.onBlur?.(e)
                      setOpen(false)
                    },
                    onClick: (e: MouseEvent) => {
                      fieldProps?.onClick?.(e)
                      setOpen(true)
                    },
                  }}
                  proFieldProps={proFieldProps}
                  fieldConfig={
                    fieldConfig
                    || ({
                      valueType,
                    } as const)
                  }
                  v-slots={slots}
                />
              </div>
            </PassWordStrength>
          </ProConfigProvider>
        )
      }
      return (
        <ProConfigProvider
          valueTypeMap={{
            password: {
              render: (text, { placeholder, ...restProps }) => <FieldPassword {...restProps} placeholder={placeholder as string} text={text} />,
              formItemRender: (text, { placeholder, ...restProps }) => (
                <FieldPassword {...restProps} placeholder={placeholder as string} text={text} />
              ),
            },
          }}
        >
          <ProField
            {...attrs}
            {...rest}
            valueType="password"
            fieldProps={fieldProps}
            proFieldProps={proFieldProps}
            fieldConfig={
              fieldConfig
              || ({
                valueType,
              } as const)
            }
            v-slots={slots}
          />

        </ProConfigProvider>

      )
    }
  },
  {
    name: 'ProFormPassword',
    inheritAttrs: false,
  },
)

export default ProFormPassword
