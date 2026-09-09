import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { App, CSSProperties, Plugin, VNode } from 'vue'
import type { DraggableCoreDefaultProps, DraggableCoreProps } from './DraggableCore'
import type { Bounds, ControlPosition, DraggableEventHandler, PositionOffsetControlPosition } from './types'
import { classNames } from '@v-c/util'
import { cloneVNode, defineComponent, getCurrentInstance, onMounted, onUnmounted, watch } from 'vue'
import { useState } from '../../hooks'
import DraggableCore from './DraggableCore'
import { createCSSTransform, createSVGTransform } from './utils/domFns'
import { canDragX, canDragY, createDraggableData, getBoundPosition } from './utils/positionFns'

export interface DraggableState {
  dragging: boolean
  dragged: boolean
  x: number
  y: number
  slackX: number
  slackY: number
  isElementSVG: boolean
  prevPropsPosition: ControlPosition | null
}

export type DraggableDefaultProps = DraggableCoreDefaultProps & {
  axis?: 'both' | 'x' | 'y' | 'none'
  bounds?: Bounds | string | false
  defaultClass?: string
  defaultClassDragging?: string
  defaultClassDragged?: string
  defaultPosition?: ControlPosition
  scale?: number
}

export type DraggableProps = DraggableCoreProps & DraggableDefaultProps & {
  positionOffset?: PositionOffsetControlPosition
  position?: ControlPosition
}

export interface DraggableEmits {
  drag: DraggableEventHandler
  mousedown: (e: MouseEvent) => void
  start: DraggableEventHandler
  stop: DraggableEventHandler
  [key: string]: (...args: any[]) => void
}

const _Draggable = defineComponent<DraggableProps, DraggableEmits, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { slots, expose, emit }) => {
  const [dragging, setDragging] = useState(false)
  const [dragged, setDragged] = useState(false)
  const [isElementSVG, setIsElementSVG] = useState(false)
  const ctx = getCurrentInstance()
  const [slackX, setSlackX] = useState(0)
  const [slackY, setSlackY] = useState(0)
  const [x, setX] = useState(() => {
    return props.position?.x ?? props.defaultPosition?.x ?? 0
  })
  const [y, setY] = useState(() => {
    return props.position?.y ?? props.defaultPosition?.y ?? 0
  })
  watch(
    () => props.position,
    (position) => {
      if (position) {
        setX(position.x)
        setY(position.y)
      }
    },
    { deep: true },
  )
  onMounted(() => {
    // Check to see if the element passed is an instanceof SVGElement
    if (typeof window.SVGElement !== 'undefined' && props.nodeRef?.value instanceof window.SVGElement) {
      setIsElementSVG(true)
    }
  })
  onUnmounted(() => {
    if (dragging.value) {
      setDragging(false)
    }
  })
  expose({
    x,
    y,
  })
  return () => {
    const [children] = slots.default?.()!
    const { axis = 'both', bounds = false, defaultClass = 'vue-draggable', defaultClassDragging = 'vue-draggable-dragging', defaultClassDragged = 'vue-draggable-dragged', defaultPosition = { x: 0, y: 0 }, scale = 1, position, positionOffset, ...draggableCoreProps } = props
    let style = {}
    let svgTransform = null
    const controlled = Boolean(position)
    const draggable = !controlled || dragging.value
    const validPosition = position || defaultPosition
    const transformOpts = {
      x: canDragX(axis) && draggable
        ? x.value
        : validPosition.x,
      y: canDragY(axis) && draggable
        ? y.value
        : validPosition.y,
    }
    if (isElementSVG.value) {
      svgTransform = createSVGTransform(transformOpts, positionOffset!)
    }
    else {
      style = createCSSTransform(transformOpts, positionOffset!)
    }
    return (
      <DraggableCore
        {...draggableCoreProps}
        scale={scale}
        onStart={(e, coreData) => {
          emit('start', e, createDraggableData(ctx, coreData))
          setDragging(true)
          setDragged(true)
        }}
        onDrag={(e, coreData) => {
          if (!dragging.value)
            return false
          const uiData = createDraggableData(ctx, coreData)
          const newState = {
            x: uiData.x,
            y: uiData.y,
            slackX: 0,
            slackY: 0,
          }
          if (props.bounds) {
            const { x: prevX, y: prevY } = newState
            newState.x += slackX.value
            newState.y += slackY.value

            const [newStateX, newStateY] = getBoundPosition(ctx, newState.x, newState.y)
            newState.x = newStateX
            newState.y = newStateY
            newState.slackX = slackX.value + (prevX - newState.x)
            newState.slackY = slackY.value + (prevY - newState.y)

            uiData.x = newState.x
            uiData.y = newState.y
            uiData.deltaX = newState.x - x.value!
            uiData.deltaY = newState.y - y.value!
          }
          emit('drag', e, uiData)
          setX(newState.x)
          setY(newState.y)
          setSlackX(newState.slackX)
          setSlackY(newState.slackY)
        }}
        onStop={(e, coreData) => {
          if (!dragging.value)
            return false
          emit('stop', e, createDraggableData(ctx, coreData))
          const newState: Partial<DraggableState> = {
            dragging: false,
            slackX: 0,
            slackY: 0,
          }
          const controlled = Boolean(props.position)
          if (controlled) {
            const { x, y } = props.position!
            newState.x = x
            newState.y = y
          }
          setDragging(newState.dragging!)
          setSlackX(newState.slackX!)
          setSlackY(newState.slackY!)
          if (controlled) {
            setX(newState.x!)
            setY(newState.y!)
          }
        }}
        onMousedown={e => emit('mousedown', e)}
      >
        {cloneVNode(children as VNode, {
          class: classNames(
            (children as VNode<unknown, unknown, { class: string }>).props?.class,
            defaultClass,
            {
              [defaultClassDragging]: dragging.value,
              [defaultClassDragged]: dragged.value,
            },
          ),
          style: {
            ...(children as VNode<unknown, unknown, { style: CSSProperties }>).props?.style,
            ...style,
          },
          transform: svgTransform,
        })}
      </DraggableCore>
    )
  }
}, {
  name: 'Draggable',
  inheritAttrs: false,
  props: [
    'allowAnyClick',
    'allowMobileScroll',
    'axis',
    'bounds',
    'cancel',
    'defaultClass',
    'defaultClassDragged',
    'defaultClassDragging',
    'defaultPosition',
    'disabled',
    'enableUserSelectHack',
    'grid',
    'handle',
    'nodeRef',
    'offsetParent',
    'position',
    'positionOffset',
    'scale',
  ],
  emits: ['drag', 'mousedown', 'start', 'stop'],
})

const Draggable = _Draggable as typeof _Draggable & Plugin

Draggable.install = (app: App) => {
  app.component(Draggable.name, Draggable)
}

export default Draggable
