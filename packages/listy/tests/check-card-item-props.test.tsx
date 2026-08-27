import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProCheckCard from '../../card/src/components/CheckCard/CheckCard'

describe('ProListy itemCardProps integration', () => {
  it('maps CheckCard bordered changes to the underlying card variant', async () => {
    const wrapper = mount(ProCheckCard, {
      props: {
        bordered: true,
        title: 'Card title',
      },
    })

    expect(wrapper.find('.ant-card-bordered').exists()).toBe(true)

    await wrapper.setProps({ bordered: false })

    expect(wrapper.find('.ant-card-bordered').exists()).toBe(false)
  })
})
