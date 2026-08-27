import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, isRef, nextTick, ref, shallowRef, toValue } from 'vue'
import { useDragSort } from '../src/utils/useDragSort'

vi.hoisted(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

const { useSortableMock } = vi.hoisted(() => ({
  useSortableMock: vi.fn(() => ({
    isDragging: ref(false),
    isDropping: ref(false),
    isDragSource: ref(false),
    isDropTarget: ref(false),
  })),
}))

vi.mock('@dnd-kit/vue/sortable', () => ({
  isSortable: vi.fn(),
  isSortableOperation: vi.fn(),
  useSortable: useSortableMock,
}))

describe('useDragSort', () => {
  it('keeps row identity, index and element refs valid when request data arrives', async () => {
    const dataSource = shallowRef<Record<string, any>[]>([])

    const wrapper = mount(defineComponent(() => {
      const { components } = useDragSort({
        dataSource: computed(() => dataSource.value),
        token: computed(() => ({
          colorBgContainer: '#fff',
          colorFillAlter: '#fafafa',
        }) as any),
        dragSortKey: ref('sort'),
        components: ref(),
        rowKey: ref('key'),
        dragHandle: () => h('span'),
      })

      return () => {
        const Row = (components.body as any)?.row
        return Row
          ? h(Row, { 'data-row-key': 'second' }, () => h('td'))
          : h('div')
      }
    }))

    await nextTick()
    await nextTick()

    expect(useSortableMock).toHaveBeenCalledTimes(1)
    const sortableInput = useSortableMock.mock.calls[0]![0] as any

    expect(toValue(sortableInput.id)).toBe('second')
    expect(toValue(sortableInput.index)).toBe(-1)
    expect(isRef(sortableInput.element)).toBe(true)
    expect(isRef(sortableInput.handle)).toBe(true)

    dataSource.value = [
      { key: 'first' },
      { key: 'second' },
      { key: 'third' },
    ]
    await nextTick()

    expect(useSortableMock).toHaveBeenCalledTimes(1)
    expect(toValue(sortableInput.id)).toBe('second')
    expect(toValue(sortableInput.index)).toBe(1)

    wrapper.unmount()
  })
})
