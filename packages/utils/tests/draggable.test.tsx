import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import Draggable from '../src/components/Draggable/Draggable'
import DraggableCore from '../src/components/Draggable/DraggableCore'
import { addUserSelectStyles, scheduleRemoveUserSelectStyles } from '../src/components/Draggable/utils/domFns'

const wrappers: Array<{ unmount: () => void }> = []

function track<T extends { unmount: () => void }>(wrapper: T): T {
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
  document.body.classList.remove('vue-draggable-transparent-selection')
  document.body.innerHTML = ''
})

function createMouseEvent(type: string, clientX: number, clientY: number) {
  return new MouseEvent(type, {
    bubbles: true,
    button: 0,
    clientX,
    clientY,
  })
}

function createTouchEvent(type: string, identifier: number, clientX: number, clientY: number) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const touches = type === 'touchend' || type === 'touchcancel'
    ? []
    : [{ identifier, clientX, clientY }]
  Object.defineProperty(event, 'targetTouches', { value: touches })
  Object.defineProperty(event, 'changedTouches', {
    value: [{ identifier, clientX, clientY }],
  })
  return event
}

describe('Draggable', () => {
  it('uses finite default coordinates while dragging', async () => {
    const dragData: Array<{ x: number, y: number, deltaX: number, deltaY: number }> = []
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <Draggable
        nodeRef={nodeRef}
        onDrag={(_, data) => dragData.push(data)}
      >
        <div ref={nodeRef}>drag target</div>
      </Draggable>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element

    target.dispatchEvent(createMouseEvent('mousedown', 10, 20))
    document.dispatchEvent(createMouseEvent('mousemove', 25, 45))
    await nextTick()

    expect(dragData).toEqual([
      expect.objectContaining({
        x: 15,
        y: 25,
        deltaX: 15,
        deltaY: 25,
      }),
    ])
    expect(target.getAttribute('style')).toContain('translate(15px,25px)')

    document.dispatchEvent(createMouseEvent('mouseup', 25, 45))
  })

  it('applies scale exactly once', async () => {
    const dragData: Array<{ x: number, y: number, deltaX: number, deltaY: number }> = []
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <Draggable
        nodeRef={nodeRef}
        scale={2}
        onDrag={(_, data) => dragData.push(data)}
      >
        <div ref={nodeRef}>drag target</div>
      </Draggable>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element

    target.dispatchEvent(createMouseEvent('mousedown', 0, 0))
    document.dispatchEvent(createMouseEvent('mousemove', 20, 20))
    await nextTick()

    expect(dragData.at(-1)).toEqual(expect.objectContaining({
      x: 10,
      y: 10,
      deltaX: 10,
      deltaY: 10,
    }))
    expect(target.getAttribute('style')).toContain('translate(10px,10px)')
  })

  it('restores controlled coordinates before the next drag', () => {
    const dragData: Array<{ x: number, y: number }> = []
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <Draggable
        nodeRef={nodeRef}
        position={{ x: 5, y: 5 }}
        onDrag={(_, data) => dragData.push(data)}
      >
        <div ref={nodeRef}>drag target</div>
      </Draggable>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element

    target.dispatchEvent(createMouseEvent('mousedown', 0, 0))
    document.dispatchEvent(createMouseEvent('mousemove', 10, 10))
    document.dispatchEvent(createMouseEvent('mouseup', 10, 10))
    target.dispatchEvent(createMouseEvent('mousedown', 100, 100))
    document.dispatchEvent(createMouseEvent('mousemove', 110, 110))

    expect(dragData.map(({ x, y }) => ({ x, y }))).toEqual([
      { x: 15, y: 15 },
      { x: 15, y: 15 },
    ])
  })

  it('applies disabled and numeric bounds', async () => {
    const disabledStart = vi.fn()
    const disabledRef = shallowRef<HTMLElement | null>(null)
    const DisabledHarness = defineComponent(() => () => (
      <DraggableCore disabled nodeRef={disabledRef} onStart={disabledStart}>
        <div ref={disabledRef}>disabled target</div>
      </DraggableCore>
    ))
    const disabledWrapper = track(mount(DisabledHarness, { attachTo: document.body }))
    disabledWrapper.get('div').element.dispatchEvent(createMouseEvent('mousedown', 0, 0))
    expect(disabledStart).not.toHaveBeenCalled()

    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <Draggable nodeRef={nodeRef} bounds={{ left: -10, top: -10, right: 10, bottom: 10 }}>
        <div ref={nodeRef}>bounded target</div>
      </Draggable>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element
    target.dispatchEvent(createMouseEvent('mousedown', 0, 0))
    document.dispatchEvent(createMouseEvent('mousemove', 30, 40))
    await nextTick()

    expect(target.getAttribute('style')).toContain('translate(10px,10px)')
  })

  it('supports the single-child fallback when nodeRef is omitted', () => {
    const onStart = vi.fn()
    const Harness = defineComponent(() => () => (
      <DraggableCore onStart={onStart}>
        <div>drag target</div>
      </DraggableCore>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))

    wrapper.get('div').element.dispatchEvent(createMouseEvent('mousedown', 0, 0))

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('starts each drag with zero deltas, including a click without movement', () => {
    const starts: Array<{ deltaX: number, deltaY: number }> = []
    const stops: Array<{ deltaX: number, deltaY: number }> = []
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <DraggableCore
        nodeRef={nodeRef}
        onStart={(_, data) => starts.push(data)}
        onStop={(_, data) => stops.push(data)}
      >
        <div ref={nodeRef}>drag target</div>
      </DraggableCore>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element

    target.dispatchEvent(createMouseEvent('mousedown', 10, 10))
    document.dispatchEvent(createMouseEvent('mousemove', 20, 20))
    document.dispatchEvent(createMouseEvent('mouseup', 20, 20))

    target.dispatchEvent(createMouseEvent('mousedown', 100, 100))
    document.dispatchEvent(createMouseEvent('mouseup', 100, 100))

    expect(starts).toEqual([
      expect.objectContaining({ deltaX: 0, deltaY: 0 }),
      expect.objectContaining({ deltaX: 0, deltaY: 0 }),
    ])
    expect(stops.at(-1)).toEqual(expect.objectContaining({ deltaX: 0, deltaY: 0 }))
  })

  it('does not change the transform for a click without movement', () => {
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <Draggable nodeRef={nodeRef} defaultPosition={{ x: 8, y: 12 }}>
        <div ref={nodeRef}>drag target</div>
      </Draggable>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element
    const transformBeforeClick = target.style.transform

    target.dispatchEvent(createMouseEvent('mousedown', 100, 100))
    document.dispatchEvent(createMouseEvent('mouseup', 100, 100))

    expect(target.style.transform).toBe(transformBeforeClick)
  })

  it('runs a complete touch lifecycle once and resets for the next touch', () => {
    const onStart = vi.fn()
    const onDrag = vi.fn()
    const onStop = vi.fn()
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <DraggableCore nodeRef={nodeRef} onStart={onStart} onDrag={onDrag} onStop={onStop}>
        <div ref={nodeRef}>drag target</div>
      </DraggableCore>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element
    target.dispatchEvent(createTouchEvent('touchstart', 1, 10, 20))
    document.dispatchEvent(createTouchEvent('touchmove', 1, 20, 30))
    document.dispatchEvent(createTouchEvent('touchend', 1, 20, 30))
    target.dispatchEvent(createTouchEvent('touchstart', 2, 50, 60))

    expect(onStart).toHaveBeenCalledTimes(2)
    expect(onDrag).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledTimes(1)
    expect(onStart.mock.calls[1]?.[1]).toEqual(expect.objectContaining({ deltaX: 0, deltaY: 0 }))
  })

  it('stops and cleans up an active drag when touch is cancelled', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    const onDrag = vi.fn()
    const onStop = vi.fn()
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <DraggableCore nodeRef={nodeRef} onDrag={onDrag} onStop={onStop}>
        <div ref={nodeRef}>drag target</div>
      </DraggableCore>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))
    const target = wrapper.get('div').element

    target.dispatchEvent(createTouchEvent('touchstart', 1, 10, 20))
    document.dispatchEvent(createTouchEvent('touchmove', 1, 20, 30))
    const touchCancel = new Event('touchcancel', { bubbles: true, cancelable: true })
    Object.defineProperty(touchCancel, 'targetTouches', { value: [] })
    Object.defineProperty(touchCancel, 'changedTouches', { value: [] })
    document.dispatchEvent(touchCancel)
    document.dispatchEvent(createTouchEvent('touchmove', 1, 30, 40))

    expect(onDrag).toHaveBeenCalledTimes(1)
    expect(onStop).toHaveBeenCalledTimes(1)
    expect(document.body.classList.contains('vue-draggable-transparent-selection')).toBe(false)
  })

  it('keeps user-select protection until every active drag releases it', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })

    addUserSelectStyles(document)
    addUserSelectStyles(document)
    scheduleRemoveUserSelectStyles(document)

    expect(document.body.classList.contains('vue-draggable-transparent-selection')).toBe(true)

    scheduleRemoveUserSelectStyles(document)

    expect(document.body.classList.contains('vue-draggable-transparent-selection')).toBe(false)
  })

  it('removes document listeners and user-select state when unmounted mid-drag', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    const onDrag = vi.fn()
    const nodeRef = shallowRef<HTMLElement | null>(null)
    const Harness = defineComponent(() => () => (
      <DraggableCore nodeRef={nodeRef} onDrag={onDrag}>
        <div ref={nodeRef}>drag target</div>
      </DraggableCore>
    ))
    const wrapper = track(mount(Harness, { attachTo: document.body }))

    wrapper.get('div').element.dispatchEvent(createMouseEvent('mousedown', 0, 0))
    expect(document.body.classList.contains('vue-draggable-transparent-selection')).toBe(true)

    wrapper.unmount()
    document.dispatchEvent(createMouseEvent('mousemove', 10, 10))

    expect(onDrag).not.toHaveBeenCalled()
    expect(document.body.classList.contains('vue-draggable-transparent-selection')).toBe(false)
  })
})
