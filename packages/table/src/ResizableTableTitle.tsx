import type { CSSProperties, SlotsType } from 'vue'
import { classNames } from '@v-c/util'
import { computed, defineComponent, onBeforeUnmount, shallowRef } from 'vue'

export interface ResizableTableTitleProps {
  resizable?: boolean
  width?: number | string
}

export interface ResizableTableTitleEmits {
  resize: (event: MouseEvent, info: { size: { width: number } }) => void
  [key: string]: (...args: any[]) => void
}

export interface ResizableTableTitleSlots {
  default?: () => any
}

function getWidthNumber(width: number | string | undefined, element?: HTMLElement | null) {
  if (typeof width === 'number')
    return width
  if (typeof width === 'string') {
    const parsedWidth = Number.parseFloat(width)
    if (Number.isFinite(parsedWidth))
      return parsedWidth
  }
  return element?.offsetWidth ?? 0
}

const ResizableTableTitle = defineComponent<
  ResizableTableTitleProps,
  ResizableTableTitleEmits,
  string,
  SlotsType<ResizableTableTitleSlots>
>((props, { attrs, slots, emit }) => {
  const cellRef = shallowRef<HTMLTableCellElement>()
  let startX = 0
  let startWidth = 0
  let previousUserSelect = ''
  let resizeFrame: number | undefined
  let latestResize: { event: MouseEvent, width: number } | undefined

  const resizeable = computed(() => !!props.resizable)

  function clearDocumentEvents() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.userSelect = previousUserSelect
    if (resizeFrame !== undefined) {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = undefined
    }
    latestResize = undefined
  }

  function flushResize() {
    resizeFrame = undefined
    if (!latestResize)
      return
    const { event, width } = latestResize
    latestResize = undefined
    emit('resize', event, { size: { width } })
  }

  function scheduleResize(event: MouseEvent, width: number) {
    latestResize = { event, width }
    if (resizeFrame !== undefined)
      return
    resizeFrame = requestAnimationFrame(flushResize)
  }

  function onMouseMove(event: MouseEvent) {
    const nextWidth = Math.max(startWidth + event.clientX - startX, 40)
    scheduleResize(event, nextWidth)
  }

  function onMouseUp() {
    if (resizeFrame !== undefined) {
      cancelAnimationFrame(resizeFrame)
      flushResize()
    }
    clearDocumentEvents()
  }

  function onMouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    startX = event.clientX
    startWidth = getWidthNumber(props.width, cellRef.value)
    previousUserSelect = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  onBeforeUnmount(clearDocumentEvents)

  return () => {
    const {
      class: className,
      className: legacyClassName,
      style,
      ...restAttrs
    } = attrs as {
      class?: string
      className?: string
      style?: CSSProperties
    } & Record<string, any>
    const widthStyle = props.width == null ? undefined : {
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    }

    return (
      <th
        {...restAttrs}
        ref={cellRef}
        class={classNames(className, legacyClassName, {
          'ant-table-cell-resizable': resizeable.value,
        })}
        style={{
          ...style,
          ...widthStyle,
          position: resizeable.value ? 'relative' : style?.position,
        }}
      >
        {slots.default?.()}
        {resizeable.value && (
          <span
            class="ant-table-cell-resizable-handle"
            onMousedown={onMouseDown}
          />
        )}
      </th>
    )
  }
}, {
  name: 'ResizableTableTitle',
  inheritAttrs: false,
  props: ['resizable', 'width'],
  emits: ['resize'],
})

export default ResizableTableTitle
