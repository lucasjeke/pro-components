import type { ComponentInternalInstance, ComponentPublicInstance, Ref } from 'vue'
import type { Bounds, ControlPosition, DraggableData, MouseTouchEvent } from '../types'
import findDOMNode from '@v-c/util/dist/Dom/findDOMNode'
import { getTouch, innerHeight, innerWidth, offsetXYFromParent, outerHeight, outerWidth } from './domFns'
import { int, isNum } from './shims'

export function getBoundPosition(draggable: ComponentInternalInstance | null, x: number, y: number): [number, number] {
  if (!draggable?.props.bounds)
    return [x, y]
  let { bounds } = draggable.props as { bounds: Bounds }
  bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds)
  const node = findDOMNode((draggable as unknown as { ctx: ComponentPublicInstance }).ctx) as HTMLElement
  if (typeof bounds === 'string') {
    const { ownerDocument } = node
    const ownerWindow = ownerDocument.defaultView
    if (!ownerWindow) {
      throw new Error('Cannot resolve the owner window of the draggable node.')
    }
    let boundNode
    if (bounds === 'parent') {
      boundNode = node.parentNode
    }
    else {
      const rootNode = (node.getRootNode() as unknown) as Element
      boundNode = rootNode.querySelector(bounds)
    }
    if (!(boundNode instanceof ownerWindow.HTMLElement)) {
      throw new TypeError(`Bounds selector "${bounds}" could not find an element.`)
    }
    const boundNodeEl: HTMLElement = boundNode
    const nodeStyle = ownerWindow.getComputedStyle(node)
    const boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl)
    bounds = {
      left: -node.offsetLeft + int(boundNodeStyle.paddingLeft) + int(nodeStyle.marginLeft),
      top: -node.offsetTop + int(boundNodeStyle.paddingTop) + int(nodeStyle.marginTop),
      right: innerWidth(boundNodeEl) - outerWidth(node) - node.offsetLeft
        + int(boundNodeStyle.paddingRight) - int(nodeStyle.marginRight),
      bottom: innerHeight(boundNodeEl) - outerHeight(node) - node.offsetTop
        + int(boundNodeStyle.paddingBottom) - int(nodeStyle.marginBottom),
    }
  }
  if (isNum(bounds.right))
    x = Math.min(x, bounds.right)
  if (isNum(bounds.bottom))
    y = Math.min(y, bounds.bottom)
  if (isNum(bounds.left))
    x = Math.max(x, bounds.left)
  if (isNum(bounds.top))
    y = Math.max(y, bounds.top)
  return [x, y]
}

export function snapToGrid(grid: [number, number], pendingX: number, pendingY: number): [number, number] {
  const x = Math.round(pendingX / grid[0]) * grid[0]
  const y = Math.round(pendingY / grid[1]) * grid[1]
  return [x, y]
}

export function canDragX(axis: 'both' | 'x' | 'y' | 'none'): boolean {
  return axis === 'both' || axis === 'x'
}

export function canDragY(axis: 'both' | 'x' | 'y' | 'none'): boolean {
  return axis === 'both' || axis === 'y'
}

export function getControlPosition(
  e: MouseTouchEvent,
  touchIdentifier: number | null | undefined,
  draggableCore: ComponentInternalInstance | null,
  scale = 1,
): ControlPosition | null {
  const touchObj = typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null
  if (typeof touchIdentifier === 'number' && !touchObj)
    return null
  const node = findDOMNode((draggableCore as unknown as { ctx: ComponentPublicInstance })!.ctx)
  const offsetParent = draggableCore?.props.offsetParent || (node as HTMLElement)!.offsetParent || node!.ownerDocument.body
  const eventPosition = touchObj || ('clientX' in e ? e : null)
  if (!eventPosition)
    return null
  return offsetXYFromParent(eventPosition, offsetParent as HTMLElement, scale)
}
export function createCoreData(draggable: ComponentInternalInstance | null, x: number, y: number): DraggableData {
  const isStart = !isNum(draggable?.exposed?.lastX.value!)
  const node = findDOMNode((draggable as unknown as { ctx: ComponentPublicInstance }).ctx) as HTMLElement
  if (isStart) {
    return {
      node,
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x,
      y,
    }
  }
  else {
    return {
      node,
      deltaX: x - draggable?.exposed?.lastX.value,
      deltaY: y - draggable?.exposed?.lastY.value,
      lastX: draggable?.exposed?.lastX.value,
      lastY: draggable?.exposed?.lastY.value,
      x,
      y,
    }
  }
}

export function createDraggableData(draggable: ComponentInternalInstance | null, coreData: DraggableData): DraggableData {
  const currentX = (draggable?.exposed as { x: Ref<number> })?.x.value ?? 0
  const currentY = (draggable?.exposed as { y: Ref<number> })?.y.value ?? 0
  return {
    node: coreData.node,
    x: currentX + coreData.deltaX,
    y: currentY + coreData.deltaY,
    deltaX: coreData.deltaX,
    deltaY: coreData.deltaY,
    lastX: currentX,
    lastY: currentY,
  }
}

function cloneBounds(bounds: Bounds): Bounds {
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
  }
}
