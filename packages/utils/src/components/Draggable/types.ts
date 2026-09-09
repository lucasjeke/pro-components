export interface DraggableData {
  node: HTMLElement
  x: number
  y: number
  deltaX: number
  deltaY: number
  lastX: number
  lastY: number
}
export type DraggableEvent
  = | MouseEvent
    | TouchEvent
export type DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => void

export interface Bounds {
  left?: number
  top?: number
  right?: number
  bottom?: number
}
export interface ControlPosition { x: number, y: number }
export interface PositionOffsetControlPosition { x: number | string, y: number | string }

export type EventHandler<T> = (e: T) => void | false

export type MouseTouchEvent = MouseEvent | TouchEvent
