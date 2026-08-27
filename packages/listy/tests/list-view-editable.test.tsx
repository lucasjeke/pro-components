import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import ProListyItem from '../src/Item'
import { genProListyStyle } from '../src/style'

const SlotStub = defineComponent({
  setup(_props, { slots }) {
    return () => h('div', slots.default?.())
  },
})

describe('ListView editable rows', () => {
  it('marks only the editable item content', () => {
    const editableItem = mount(ProListyItem as any, {
      props: {
        prefixCls: 'ant-pro',
        isEditable: true,
        title: 'Editable row',
      },
      global: {
        stubs: {
          ASkeleton: SlotStub,
        },
      },
    })
    const readonlyItem = mount(ProListyItem as any, {
      props: {
        prefixCls: 'ant-pro',
        isEditable: false,
        title: 'Readonly row',
      },
      global: {
        stubs: {
          ASkeleton: SlotStub,
        },
      },
    })

    expect(editableItem.find('.ant-pro-listy-item-main-editable').exists()).toBe(true)
    expect(readonlyItem.find('.ant-pro-listy-item-main-editable').exists()).toBe(false)
  })

  it('scopes editable styles to the list item containing the editable marker', () => {
    const componentCls = '.ant-pro-listy'
    const antCls = '.ant'
    const styles = genProListyStyle({
      antCls,
      componentCls,
    } as any) as Record<string, any>
    const editableSelector
      = `${antCls}-listy ${antCls}-listy-item:has(${componentCls}-item-main-editable)`

    expect(styles[componentCls][editableSelector]).toBeDefined()
  })
})
