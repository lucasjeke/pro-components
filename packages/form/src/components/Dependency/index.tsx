import type { FormItemProps } from '@antdv-next1/pro-utils'
import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { FormInstance } from 'antdv-next'
import type { NamePath } from 'antdv-next/dist/form/types'
import type { ProFormInstance } from '../../BaseForm'
import {
  FormItem,
  merge,
  useProFormContextInject,
} from '@antdv-next1/pro-utils'
import { get, set } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { useFormListContextInject } from '../List/context'

export type ProFormDependencyProps = Omit<
  FormItemProps,
  'name' | 'noStyle' | 'label'
> & {
  name: NamePath<string | number | boolean>[]
  originDependencies?: NamePath<string | number | boolean>[]
  ignoreFormListField?: boolean
}
const ProFormDependency = defineComponent<ProFormDependencyProps, {}, string, CustomSlotsType<{
  default?: (options: { values: Record<string, any>, form: ProFormInstance }) => VueNode
}>>((props, { slots }) => {
  const context = useProFormContextInject()
  const formListProvide = useFormListContextInject()
  const flattenNames = computed(() =>
    (props.name || []).map((itemName) => {
      const name = [itemName]
      // ignoreFormListField为 true 或 formListField.name === undefined 时
      // 应从全局取值，要将 names 中各项的路径前缀(formListField.listName)忽略
      if (
        !props.ignoreFormListField
        && formListProvide.name?.value !== undefined
        && formListProvide.listName?.value?.length
      ) {
        name.unshift(formListProvide.listName?.value || [])
      }
      return name.flat(1)
    }),
  )
  return () => {
    const { name: nameList, originDependencies = nameList, ignoreFormListField, ...rest } = props
    return (
      <FormItem
        {...rest}
        isRenderProps
        noStyle
        v-slots={{
          default: (form: FormInstance) => {
            let values: Record<string, any> = {}
            for (let i = 0; i < nameList.length; i++) {
              const itemName = flattenNames.value[i]
              const originName = originDependencies[i] || []
              let value = context.getFieldFormatValueObject?.(itemName)
              if (value && Object.keys(value).length) {
                // transform 会生成多余的value，这里需要注入一下
                values = merge({}, values, value)
                if (get(value, itemName as string[])) {
                  values = set(values, [originName as string[]].flat(1), get(value, itemName as string[]))
                }
              }
              else {
                value = form?.getFieldValue?.(itemName)
                if (typeof value !== 'undefined') {
                  values = set(values, [originName as string[]].flat(1), value)
                }
              }
            }
            return slots.default?.({ values, form: {
              ...form,
              ...context,
            } as ProFormInstance<any> })
          },
        }}
      />
    )
  }
}, {
  name: 'ProFormDependency',
  inheritAttrs: false,
})

export default ProFormDependency
