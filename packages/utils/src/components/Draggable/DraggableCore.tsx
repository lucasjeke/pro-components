import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { ShallowRef, VNode } from 'vue'
import type { DraggableEventHandler, MouseTouchEvent } from './types'
import findDOMNode from '@v-c/util/dist/Dom/findDOMNode'
import { cloneVNode, defineComponent, getCurrentInstance, onMounted, onUnmounted, shallowRef } from 'vue'
import { useState } from '../../hooks'
import { addEvent, addUserSelectStyles, getTouchIdentifier, matchesSelectorAndParentsTo, removeEvent, scheduleRemoveUserSelectStyles } from './utils/domFns'
import { createCoreData, getControlPosition, snapToGrid } from './utils/positionFns'

const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
}

export interface DraggableCoreDefaultProps {
  allowAnyClick?: boolean
  allowMobileScroll?: boolean
  disabled?: boolean
  enableUserSelectHack?: boolean
  scale?: number
}

export type DraggableCoreProps = DraggableCoreDefaultProps & {
  cancel?: string
  offsetParent?: HTMLElement
  grid?: [number, number]
  nodeRef?: ShallowRef<HTMLElement | null> | null
  handle?: string
}

export interface DraggableCoreEmits {
  drag: DraggableEventHandler
  mousedown: (e: MouseEvent) => void
  start: DraggableEventHandler
  stop: DraggableEventHandler
  [key: string]: (...args: any[]) => void
}

const DraggableCore = defineComponent<DraggableCoreProps, DraggableCoreEmits, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { slots, expose, emit }) => {
  const touchIdentifier = shallowRef<number | null | undefined>(null)
  const dragEventFor = shallowRef(eventsFor.mouse)
  const [lastX, setLastX] = useState(Number.NaN)
  const [lastY, setLastY] = useState(Number.NaN)
  const [dragging, setDragging] = useState(false)
  const proxy = getCurrentInstance()
  const mountedNode = shallowRef<HTMLElement | null>(null)
  const activeDocument = shallowRef<Document | null>(null)

  const getNode = () => {
    if (props.nodeRef?.value)
      return props.nodeRef.value
    if (!proxy?.proxy)
      return null
    return findDOMNode(proxy.proxy) as HTMLElement | null
  }

  const removeDragEvents = () => {
    const ownerDocument = activeDocument.value
    if (!ownerDocument)
      return

    removeEvent(ownerDocument, eventsFor.mouse.move, handleDrag)
    removeEvent(ownerDocument, eventsFor.touch.move, handleDrag)
    removeEvent(ownerDocument, eventsFor.mouse.stop, handleDragStop)
    removeEvent(ownerDocument, eventsFor.touch.stop, handleDragStop)
    if (props.enableUserSelectHack !== false)
      scheduleRemoveUserSelectStyles(ownerDocument)
    activeDocument.value = null
  }

  function handleDrag(e: MouseTouchEvent) {
    const position = getControlPosition(e, touchIdentifier.value, proxy, props.scale ?? 1)
    if (position == null)
      return
    let { x = 0, y = 0 } = position
    if (Array.isArray(props.grid)) {
      let deltaX = x - lastX.value
      let deltaY = y - lastY.value;
      [deltaX, deltaY] = snapToGrid(props.grid, deltaX, deltaY)
      if (!deltaX && !deltaY)
        return // skip useless drag
      x = lastX.value + deltaX
      y = lastY.value + deltaY
    }
    const coreEvent = createCoreData(proxy, x, y)
    emit('drag', e, coreEvent)
    setLastX(x)
    setLastY(y)
  }
  function handleDragStop(e: MouseTouchEvent) {
    if (!dragging.value)
      return
    const position = getControlPosition(e, touchIdentifier.value, proxy, props.scale ?? 1)
    if (position == null)
      return
    let { x = 0, y = 0 } = position
    if (Array.isArray(props.grid)) {
      let deltaX = x - lastX.value || 0
      let deltaY = y - lastY.value || 0;
      [deltaX, deltaY] = snapToGrid(props.grid, deltaX, deltaY)
      x = lastX.value + deltaX
      y = lastY.value + deltaY
    }
    const coreEvent = createCoreData(proxy, x, y)
    emit('stop', e, coreEvent)
    setDragging(false)
    setLastX(Number.NaN)
    setLastY(Number.NaN)
    touchIdentifier.value = null
    removeDragEvents()
  }

  const handleDragStart: EventHandler<MouseTouchEvent> = (e) => {
    if (e instanceof MouseEvent)
      emit('mousedown', e)
    if (!props.allowAnyClick && e instanceof MouseEvent && (e.button !== 0 || e.ctrlKey))
      return false
    const node = getNode()
    if (!node)
      return false
    const { ownerDocument } = node
    if (props.disabled
      || (!(e.target instanceof (ownerDocument.defaultView as Window & typeof globalThis).Node))
      || (props.handle && !matchesSelectorAndParentsTo(e.target as Node, props.handle, node))
      || (props.cancel && matchesSelectorAndParentsTo(e.target as Node, props.cancel, node))) {
      return false
    }
    if (e.type === 'touchstart' && !props.allowMobileScroll)
      e.preventDefault()

    touchIdentifier.value = getTouchIdentifier(e)
    const position = getControlPosition(e, touchIdentifier.value, proxy, props.scale ?? 1)
    if (position == null)
      return false
    const { x, y } = position
    const coreEvent = createCoreData(proxy, x!, y!)
    emit('start', e, coreEvent)
    if (props.enableUserSelectHack !== false)
      addUserSelectStyles(ownerDocument)
    activeDocument.value = ownerDocument
    setDragging(true)
    setLastX(x!)
    setLastY(y!)
    addEvent(ownerDocument, dragEventFor.value.move, handleDrag)
    addEvent(ownerDocument, dragEventFor.value.stop, handleDragStop)
  }

  const handleTouchStart: EventHandler<MouseTouchEvent> = (e) => {
    dragEventFor.value = eventsFor.touch
    return handleDragStart(e)
  }
  onMounted(() => {
    mountedNode.value = getNode()
    if (mountedNode.value)
      addEvent(mountedNode.value, eventsFor.touch.start, handleTouchStart, { passive: false })
  })
  onUnmounted(() => {
    if (mountedNode.value)
      removeEvent(mountedNode.value, eventsFor.touch.start, handleTouchStart, { passive: false })
    removeDragEvents()
  })

  expose({
    lastX,
    lastY,
  })
  return () => {
    const [children] = slots.default?.()!
    return cloneVNode(children as VNode, {
      onMousedown: (e: MouseTouchEvent) => {
        dragEventFor.value = eventsFor.mouse
        return handleDragStart(e)
      },
    })
  }
}, {
  name: 'DraggableCore',
  inheritAttrs: false,
  props: [
    'allowAnyClick',
    'allowMobileScroll',
    'cancel',
    'disabled',
    'enableUserSelectHack',
    'grid',
    'handle',
    'nodeRef',
    'offsetParent',
    'scale',
  ],
  emits: ['drag', 'mousedown', 'start', 'stop'],
})

export default DraggableCore
